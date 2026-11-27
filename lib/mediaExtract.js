// ---------------------------------------------------------------------------
// Pure helpers that read a club or organiser website's HTML and pick out:
//   • its share photo (og:image / twitter:image)
//   • its logo (an <img> with "logo" in it, or the apple-touch-icon)
//   • links to youth / junior / team pages
//   • the best team-style photos on a page
// Used by scripts/find-club-media.mjs (run once on your computer) and by the
// /api/og and /api/logo routes. No network code in here.
// ---------------------------------------------------------------------------

const abs = (u, base) => {
  try {
    const x = new URL(String(u).replace(/&amp;/g, '&').trim(), base);
    if (x.protocol === 'http:') x.protocol = 'https:';
    return x.protocol === 'https:' ? x.href : null;
  } catch { return null; }
};
const attr = (tag, name) => new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, 'i').exec(tag)?.[1] ?? null;
const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/** og:image / twitter:image (not SVG). */
export function metaImage(html, base) {
  const metas = html.match(/<meta\b[^>]*>/gi) || [];
  for (const key of ['og:image:secure_url', 'og:image', 'twitter:image', 'twitter:image:src']) {
    for (const m of metas) {
      if ((attr(m, 'property') || attr(m, 'name') || '').toLowerCase() !== key) continue;
      const u = abs(attr(m, 'content'), base);
      if (u && !/\.svg(\?|$)/i.test(u)) return u;
    }
  }
  return null;
}

export const pageTitle = (html) => (/<title[^>]*>([^<]*)<\/title>/i.exec(html)?.[1] || '').replace(/\s+/g, ' ').trim();

const BAD_IMG = /sponsor|partner|werbung|publicit|banner-ad|advert|icon-|\/icons?\/|favicon|avatar|flag|emoji|placeholder|spacer|pixel|tracking|loader|whatsapp|facebook|instagram|twitter|youtube|tiktok|linkedin|app-?store|google-?play/i;
const TEAM_WORDS = /team|equipe|mannschaft|junior|jugend|nachwuchs|jeunes|squadra|giovan|kader|groupe|gruppe|photo|foto|u\d{1,2}\b|ecole|schule|academ|training|entrainement|match|spiel|saison|season/i;

function imgSrc(tag, base) {
  // Lazy-loading sites often keep the real image in data-src / srcset.
  const srcset = attr(tag, 'data-srcset') || attr(tag, 'srcset');
  if (srcset) {
    const best = srcset.split(',').map((p) => p.trim().split(/\s+/)).map(([u, w]) => ({ u, w: parseInt(w) || 0 })).sort((a, b) => b.w - a.w)[0];
    const u = best && abs(best.u, base);
    if (u) return u;
  }
  return abs(attr(tag, 'data-src') || attr(tag, 'data-lazy-src') || attr(tag, 'src'), base);
}

/** The club logo: an <img> mentioning "logo" (not a sponsor), else the apple-touch-icon. Non-SVG first. */
export function findLogo(html, base) {
  const found = [];
  for (const tag of html.match(/<img\b[^>]*>/gi) || []) {
    const hay = `${attr(tag, 'src')} ${attr(tag, 'alt')} ${attr(tag, 'class')} ${attr(tag, 'id')}`;
    if (!/logo|wappen|embleme|emblem|crest|stemma/i.test(hay) || /sponsor|partner|footer-logo-partner/i.test(hay)) continue;
    const u = imgSrc(tag, base);
    if (u) found.push(u);
    if (found.length >= 3) break;
  }
  for (const tag of html.match(/<link\b[^>]*>/gi) || []) {
    const rel = (attr(tag, 'rel') || '').toLowerCase();
    if (rel.includes('apple-touch-icon') || (rel.includes('icon') && /(\d{3})x/.test(attr(tag, 'sizes') || ''))) {
      const u = abs(attr(tag, 'href'), base);
      if (u) found.push(u);
    }
  }
  return found.find((u) => !/\.svg(\?|$)/i.test(u)) || found[0] || null;
}

const YOUTH_LINK = /junior|jeunes|jeunesse|ecole[- ]?de[- ]?foot|mouvement[- ]?junior|nachwuchs|jugend|junioren|giovanil|settore[- ]?giovanile|academ|equipes|teams|mannschaften|squadre|kids|u1[0-9]|u2[0-1]/i;

/** Same-site links that look like youth / junior / teams pages (max 5). */
export function youthLinks(html, base) {
  let host;
  try { host = new URL(base).hostname.replace(/^www\./, ''); } catch { return []; }
  const out = [];
  for (const m of html.matchAll(/<a\b([^>]*)>([\s\S]{0,200}?)<\/a>/gi)) {
    const href = attr(m[1], 'href');
    const text = m[2].replace(/<[^>]+>/g, ' ');
    if (!href || /^(mailto|tel|javascript):|#$/.test(href)) continue;
    if (!YOUTH_LINK.test(norm(href)) && !YOUTH_LINK.test(norm(text))) continue;
    const u = abs(href, base);
    if (!u) continue;
    try { if (new URL(u).hostname.replace(/^www\./, '') !== host) continue; } catch { continue; }
    if (!out.includes(u)) out.push(u);
    if (out.length >= 5) break;
  }
  return out;
}

/** Content photos ranked by how "team-photo-like" they are. */
export function contentPhotos(html, base) {
  const scored = [];
  for (const tag of html.match(/<img\b[^>]*>/gi) || []) {
    const u = imgSrc(tag, base);
    if (!u || /\.(svg|gif)(\?|$)/i.test(u)) continue;
    const hay = `${u} ${attr(tag, 'alt')} ${attr(tag, 'class')} ${attr(tag, 'title')}`;
    if (BAD_IMG.test(hay) || /logo|wappen/i.test(hay)) continue;
    const w = parseInt(attr(tag, 'width')) || 0;
    const h = parseInt(attr(tag, 'height')) || 0;
    if ((w && w < 240) || (h && h < 160)) continue;
    let score = 0;
    if (TEAM_WORDS.test(norm(hay))) score += 3;
    if (/\.(jpe?g|webp)(\?|$)/i.test(u)) score += 1;
    if (w >= 600) score += 1;
    scored.push({ u, score });
  }
  return scored.sort((a, b) => b.score - a.score).map((x) => x.u).filter((u, i, a) => a.indexOf(u) === i);
}

// ---- Is this website really the club's? -----------------------------------
const GENERIC = new Set(['fc', 'sc', 'hc', 'ehc', 'ev', 'ec', 'cs', 'us', 'as', 'ac', 'fcs', 'sv', 'bsc', 'uhc', 'bbc', 'vbc', 'tsv', 'stv', 'tv', 'lc', 'club', 'clubs',
  'de', 'du', 'la', 'le', 'les', 'des', 'der', 'die', 'das', 'and', 'the', 'et', 'und', 'di', 'del', 'sport', 'sports', 'football', 'fussball', 'calcio', 'hockey',
  'basket', 'basketball', 'volley', 'volleyball', 'unihockey', 'handball', 'baseball', 'netball', 'rugby', 'team', 'juniors', 'junior', 'youth', 'academy',
  'academie', 'association', 'verein', 'region', 'regional', 'olympic', 'lions', 'tigers', 'united', 'city', 'american']);

/** Distinctive words of a club name, plus its acronym (e.g. "US Terre Sainte (USTS)" → terre, sainte, usts). */
export function clubTokens(name) {
  const inside = [...String(name).matchAll(/\(([^)]*)\)/g)].map((m) => norm(m[1]));
  const outside = norm(String(name).replace(/\([^)]*\)/g, ' ')).split(/[^a-z0-9]+/).filter(Boolean);
  const tokens = new Set(outside.filter((w) => w.length >= 3 && !GENERIC.has(w)));
  const acronym = outside.map((w) => w[0]).join('');
  if (acronym.length >= 3) tokens.add(acronym);
  for (const w of inside.join(' ').split(/[^a-z0-9]+/)) if (w.length >= 3 && !GENERIC.has(w)) tokens.add(w);
  return [...tokens];
}

const SPORTY = /\b(fc|sc|hc|ehc|ev|bsc|uhc|vbc|bbc|club|clubs|sport|sports|football|fussball|calcio|hockey|eishockey|basket|basketball|volley|volleyball|handball|unihockey|floorball|athletisme|leichtathletik|rugby|baseball|softball|netball|natation|schwimmclub|nuoto|juniors?|junioren|verein|academie|academy|stade|stadion)\b|hockey|basket|volley|handball|fussball/;

/** True when the host name or page title clearly belongs to this club (never just a town or tourism site). */
export function siteMatches(name, url, title = '', town = '') {
  let host = '';
  try { host = new URL(url).hostname.replace(/^www\./, ''); } catch { return false; }
  const tokens = clubTokens(name);
  const hostFlat = host.replace(/[^a-z0-9]/g, '');
  const t = norm(title);
  const townFlat = norm(town).replace(/[^a-z0-9]/g, '');
  const hits = tokens.filter((k) => hostFlat.includes(k) || t.includes(k));
  if (!hits.length) return false;
  const distinctive = hits.filter((k) => k !== townFlat && !(townFlat && townFlat.includes(k) && k.length < 5));
  const sporty = SPORTY.test(t) || SPORTY.test(host.replace(/[.-]/g, ' '));
  // A distinctive word (club name, acronym) is enough with a sporty page; two distinctive words are enough on their own.
  if (distinctive.length >= 2) return true;
  if (distinctive.length === 1) return sporty || hostFlat.includes(distinctive[0]) && distinctive[0].length >= 4;
  // Only the town matched (e.g. "FC Basel"): the page must clearly be a sports club.
  return sporty && /\b(fc|sc|hc|ehc|ev|bsc|club)\b/.test(t + ' ' + host.replace(/[.-]/g, ' '));
}

/** Search-result hosts that are never a club's own website. */
export const NOT_OFFICIAL = /wikipedia|wikidata|transfermarkt|facebook|instagram|twitter|x\.com|tiktok|youtube|linkedin|flashscore|sofascore|soccerway|fupa|football\.ch|clubcorner|matchcenter|swissunihockey\.ch|volleyball\.ch|sihf\.ch|handball\.ch|swiss\.basketball|eurobasket|the-sports\.org|globalsportsarchive|tripadvisor|google\.|bing\.|duckduckgo|local\.ch|search\.ch|moneyhouse|zefix|easymonitoring|blick\.ch|20min|nzz\.ch|tagesanzeiger|letemps|24heures|tdg\.ch|rts\.ch|srf\.ch|watson|wiki/i;
