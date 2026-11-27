// ---------------------------------------------------------------------------
// The matching engine.
//
// Pure functions, no network: the same code runs in the browser (instant
// feed ranking) and on the server (to give the AI model good context).
// The AI layer (app/api/*) then rewrites the "why" into natural language,
// but the ranking itself is transparent and explainable — important when
// students are deciding how to spend their time.
// ---------------------------------------------------------------------------

import { TYPES, DIMENSIONS, interestById, cantonName, countryName, countryInfo } from './constants';
import { sportOf, sportLabel } from './sports';

const DIM_INTERESTS = {
  activities: ['technology', 'arts', 'sports'],
  leadership: ['leadership', 'business'],
  work: ['business', 'technology', 'science', 'health'],
  community: ['volunteering', 'environment', 'health'],
  competitions: ['technology', 'science', 'academic'],
  academic: ['academic', 'science', 'health'],
  teamwork: ['sports', 'arts'],
  international: ['academic', 'leadership', 'arts'],
};

const label = (id) => interestById(id)?.label || id;
const listify = (arr) => (arr.length <= 1 ? arr.join('') : `${arr.slice(0, -1).join(', ')} and ${arr.at(-1)}`);

// ---- "What kind of thing is it?" — used by the Type filter -----------------
export const TYPE_GROUPS = [
  { id: 'research', label: 'Research programmes' },
  { id: 'essay', label: 'Essays & writing' },
  { id: 'olympiad', label: 'Olympiads' },
  { id: 'competition', label: 'Competitions & hackathons' },
  { id: 'university', label: 'University & summer' },
  { id: 'camp', label: 'Camps & courses' },
  { id: 'club', label: 'Clubs & teams' },
  { id: 'civic', label: 'Volunteering & civic' },
  { id: 'work', label: 'Jobs & apprenticeships' },
  { id: 'money', label: 'Money & banking' },
];
const TRAVEL_GROUPS = new Set(['research', 'university', 'olympiad']);

export function typeGroup(o) {
  if (o.group) return o.group; // set by hand on a few listings (e.g. financial-literacy courses → money)
  if (o.type === 'Youth bank account') return 'money';
  if (o.type === 'Internship') return 'work';
  const t = `${o.title} ${o.org}`.toLowerCase();
  if (/essay|writing|writers|poet|concord review/.test(t)) return 'essay';
  if (o.type === 'Mentoring programme' || o.type === 'Research week' || /research/.test(t)) return 'research';
  if (/olympiad|olympiade/.test(t)) return 'olympiad';
  if (['Academic competition', 'Hackathon', 'School competition'].includes(o.type)) return 'competition';
  if (['University programme', 'International programme'].includes(o.type) || (o.type === 'Summer programme' && /univers|eth|epfl|unige|uzh|oxford|harvard|yale|promys|science program|mathcamp|ross/i.test(t))) return 'university';
  if (['Summer programme', 'Online course', 'Outreach programme'].includes(o.type)) return 'camp';
  if (['Volunteering', 'Civic programme'].includes(o.type)) return 'civic';
  return 'club';
}

const townKey = (s) => String(s || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
export const sameTown = (o, p) => !!(o.city && p.city) && [o.city, ...(o.aliases || [])].some((c) => townKey(c) === townKey(p.city));

/** Is this opportunity relevant to show at all (not the same as eligible)? */
export function isVisible(o, p, anyCanton = false) {
  // Country: students see their own country's listings plus worldwide ones
  // (online / abroad, which have no country).
  if (o.country && o.country !== (p.country || 'CH')) return false;
  if (o.scope === 'internal') return !!p.schoolId && o.schoolId === p.schoolId;
  // The feed is location-based: local listings (clubs, councils, camps…) only
  // show to students in the same canton — unless the student is searching or
  // has picked another canton. University and research programmes are the
  // exception: students travel for those (e.g. a Vaud student to UNIGE Athéna).
  if (!anyCanton && o.scope === 'local' && o.canton && p.canton !== o.canton) return TRAVEL_GROUPS.has(typeGroup(o));
  // "Find X in <town>" cards (lib/batch10.js) only show for the student's own
  // town in the feed; searching or picking a canton shows them all.
  if (!anyCanton && o.finder === 'town') return sameTown(o, p);
  return true;
}

/** Score one opportunity for one student profile. */
export function matchOpportunity(o, p, gaps = []) {
  const reasons = [];
  const warnings = [];
  let score = 12;
  let eligible = true;

  // --- Eligibility: age & school year --------------------------------------
  const age = Number(p.age) || null;
  if (age) {
    if (o.minAge && age < o.minAge) { eligible = false; warnings.push(`Open from age ${o.minAge}`); }
    if (o.maxAge && age > o.maxAge) { eligible = false; warnings.push(`Up to age ${o.maxAge}`); }
  }
  const yr = Number(p.year) || null;
  if (yr) {
    if (o.minYear && yr < o.minYear) { eligible = false; warnings.push(`From year ${o.minYear}`); }
    if (o.maxYear && yr > o.maxYear) { eligible = false; warnings.push(`Up to year ${o.maxYear}`); }
  }

  // --- Eligibility: canton-restricted programmes -----------------------------
  if (o.cantons?.length && p.canton && !o.cantons.includes(p.canton)) {
    eligible = false;
    warnings.push(`Only for students in ${o.cantons.map(cantonName).join(', ')}`);
  }

  // --- Interests ------------------------------------------------------------
  const interestHits = o.categories.filter((c) => p.interests?.includes(c));
  score += Math.min(interestHits.length, 2) * 20;
  if (interestHits.length) reasons.push(`Matches your interest in ${listify(interestHits.map(label))}`);

  // --- Skills you want to develop --------------------------------------------
  const skillHits = o.skills.filter((s) => p.skills?.includes(s));
  score += Math.min(skillHits.length, 2) * 12.5;
  if (skillHits.length) reasons.push(`Builds ${listify(skillHits.slice(0, 2))}, which you want to develop`);

  // --- Location ---------------------------------------------------------------
  const sameCity = sameTown(o, p);
  const sameCanton = o.canton && p.canton && o.canton === p.canton;
  if (o.scope === 'internal') { score += 15; reasons.push('Happening at your school'); }
  else if (sameCity) { score += 15; reasons.push(`In ${o.city}, near you`); }
  else if (sameCanton) { score += 12; reasons.push(`In your ${countryInfo(p.country).regionLabel.toLowerCase()} (${cantonName(o.canton)})`); }
  else if (o.format === 'online') { score += 10; reasons.push(o.scope === 'global' ? 'Online — join from anywhere' : `Online — join from anywhere in ${countryName(p.country)}`); }
  // Swiss opportunities first: programmes abroad / worldwide platforms rank lower.
  if (o.scope === 'global') score -= 12;
  // Bank accounts are useful to know about but aren't activities — keep them low in the feed.
  if (o.type === 'Youth bank account') score -= 20;
  // Prefer listings whose details we've checked against the official source.
  if (!o.verified) score -= 6;
  // Generic "find a group near you" cards rank below specific listings.
  if (o.finder) score -= 4;
  else if (!o.city) { score += 8; reasons.push(`Open to students across ${countryName(p.country)}`); }
  else { score += 3; }
  if (o.format !== 'online' && o.city && !sameCity && !sameCanton && o.scope === 'local') warnings.push(`Takes place in ${o.city}`);
  if (o.scope === 'global' && o.format !== 'online') warnings.push(`Abroad (${o.city}) — check travel, visa and costs`);
  if (!o.verified) warnings.push('Details not checked yet — confirm on the official website');

  // --- Urgency ------------------------------------------------------------------
  if (o.deadlineDays != null && o.deadlineDays <= 7) { score += 5; reasons.push('Deadline is coming up soon'); }

  // --- CV gaps ----------------------------------------------------------------
  const dim = TYPES[o.type]?.dim;
  if (dim && gaps.includes(dim)) {
    score += 8;
    reasons.push(`Fills a gap in your CV: ${DIMENSIONS.find((d) => d.id === dim)?.label}`);
  }

  if (!eligible) score *= 0.5;
  score = Math.max(5, Math.min(99, Math.round(score)));

  return { id: o.id, score, eligible, reasons, warnings, interestHits, skillHits };
}

/** One-sentence explanation from the rules (used until/unless AI responds). */
export function ruleExplanation(m) {
  if (!m.reasons.length) return 'A wider pick to help you explore something new.';
  return m.reasons.slice(0, 2).join('. ') + '.';
}

/**
 * Rank the whole feed. Keeps a little variety so the same category never
 * appears three times in a row — like a social feed, not a sorted table.
 */
export function rankFeed(opps, profile, gaps = [], { anyCanton = false } = {}) {
  const scored = opps
    .filter((o) => isVisible(o, profile, anyCanton))
    .map((o) => ({ o, m: matchOpportunity(o, profile, gaps) }))
    .sort((a, b) => b.m.score - a.m.score);

  const out = [];
  const pool = [...scored];
  while (pool.length) {
    const last = out.slice(-2).map((x) => x.o.categories[0]);
    let i = pool.findIndex((x) => !(last.length === 2 && last.every((c) => c === x.o.categories[0])));
    if (i === -1) i = 0;
    out.push(pool.splice(i, 1)[0]);
  }
  return out;
}

const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const haystacks = new WeakMap();
function haystack(o) {
  let h = haystacks.get(o);
  if (!h) {
    const sp = sportOf(o);
    h = norm([o.title, o.org, o.city, ...(o.aliases || []), o.canton, o.canton && cantonName(o.canton), o.type, sp && sportLabel(sp),
      ...(o.categories || []).map(label), o.description].join(' '));
    haystacks.set(o, h);
  }
  return h;
}

/** Does a listing match a free-text search? Every word must appear somewhere. */
export function matchesQuery(o, q) {
  const words = norm(q).split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const h = haystack(o);
  return words.every((w) => h.includes(w));
}

/** True when the student is looking beyond their own canton (search or canton picker). */
export const searchesWide = (f) => !!(f.q?.trim() || f.canton);

export function applyFilters(items, f, homeCanton = '') {
  // Which canton "Local" means: the one picked in the canton menu, else home.
  const localCanton = f.canton && f.canton !== 'all' ? f.canton : homeCanton;
  return items.filter(({ o, m }) => {
    if (f.q?.trim() && !matchesQuery(o, f.q)) return false;
    // A chosen canton: only listings that take place in that canton.
    if (f.canton && f.canton !== 'all' && o.canton !== f.canton) return false;
    if (f.sports?.length && !f.sports.includes(sportOf(o))) return false;
    if (f.kind && f.kind !== 'all' && typeGroup(o) !== f.kind) return false;
    if (f.categories.length && !o.categories.some((c) => f.categories.includes(c))) return false;
    if (f.scopes.length) {
      const ok = f.scopes.some((s) => (s === 'local'
        ? o.scope === 'local' && (!o.canton || !localCanton || f.canton === 'all' || o.canton === localCanton)
        : o.scope === s));
      if (!ok) return false;
    }
    if (f.format === 'online' && o.format !== 'online') return false;
    if (f.format === 'in-person' && o.format === 'online') return false;
    // Searching shows everything that matches — including things you can't do
    // yet (the card says why) — so a programme you look up is never "missing".
    if (!f.showIneligible && !m.eligible && !f.q?.trim()) return false;
    return true;
  });
}

/**
 * CV gap analysis (rule-based). `done` = completed opportunities and
 * custom activities; `active` = applied. Returns every dimension with a
 * status, plus the ordered list of gaps.
 */
export function analyseCV(profile, done, active) {
  const count = (list, dim) => list.filter((x) => TYPES[x.type]?.dim === dim).length;
  const dims = DIMENSIONS.map((d) => {
    const completed = count(done, d.id);
    const inProgress = count(active, d.id);
    const relevance = (DIM_INTERESTS[d.id] || []).filter((i) => profile.interests?.includes(i)).length;
    return { ...d, completed, inProgress, relevance, status: completed ? 'strong' : inProgress ? 'building' : 'gap' };
  });
  const gaps = dims
    .filter((d) => d.status === 'gap')
    .sort((a, b) => b.relevance - a.relevance)
    .map((d) => d.id);
  const coverage = Math.round((dims.filter((d) => d.status !== 'gap').length / dims.length) * 100);
  return { dims, gaps, coverage };
}
