// POST /api/recommend
// Body: { profile, ids: [opportunityId, ...] }
// Returns: { mode: 'ai' | 'rules', explanations: { [id]: string } }
//
// The ranking is done by lib/matching.js (fast, transparent). The AI's job is
// to explain each top match in a personal, specific sentence.
import { OPPORTUNITIES } from '@/lib/opportunities';
import { matchOpportunity, ruleExplanation } from '@/lib/matching';
import { askJSON, cleanProfile } from '@/lib/ai';
import { aiAllowed } from '@/lib/server/ai-access';
import { readJson, sameOrigin, clientIp, limitOrFail, json, fail } from '@/lib/server/security';
import { recommendSchema, firstError } from '@/lib/schemas';

export async function POST(req) {
  if (!sameOrigin(req)) return fail(403, 'Forbidden.');
  const limited = await limitOrFail(`recommend:${clientIp(req)}`, 20, 60);
  if (limited) return limited;
  const { body: raw, error } = await readJson(req, 8_000);
  if (error) return error;
  const parsed = recommendSchema.safeParse(raw);
  if (!parsed.success) return fail(400, firstError(parsed));
  const body = parsed.data;

  const profile = cleanProfile(body.profile);
  const gaps = body.gaps;
  const opps = body.ids.map((id) => OPPORTUNITIES.find((o) => o.id === id)).filter(Boolean);

  const matches = opps.map((o) => ({ o, m: matchOpportunity(o, profile, gaps) }));
  const rules = Object.fromEntries(matches.map(({ o, m }) => [o.id, ruleExplanation(m)]));

  const system = `You are the matching assistant of CVAscender, a platform that helps high-school students in Switzerland discover opportunities.
For each opportunity, write ONE warm, specific sentence (max 28 words) telling the student why it fits THEM — connect it to their interests, the skills they want, their location or CV gaps.
Address the student as "you". Never invent facts about the opportunity beyond what is given. If they are not eligible, say so kindly and suggest it for later.
Reply ONLY with JSON: {"explanations": {"<id>": "<sentence>"}}`;

  const user = JSON.stringify({
    student: profile,
    cvGaps: gaps,
    opportunities: matches.map(({ o, m }) => ({
      id: o.id, title: o.title, type: o.type, categories: o.categories, skills: o.skills,
      where: o.format === 'online' ? 'online' : (o.city || 'across Switzerland'), timing: o.timing, scope: o.scope, eligibility: o.eligibility,
      ruleSignals: { eligible: m.eligible, reasons: m.reasons, warnings: m.warnings },
    })),
  });

  const ai = (await aiAllowed(req)) ? await askJSON(system, user) : null;
  if (ai?.explanations && typeof ai.explanations === 'object') {
    const explanations = {};
    for (const id of Object.keys(rules)) {
      const s = ai.explanations[id];
      explanations[id] = typeof s === 'string' && s.length < 400 ? s : rules[id];
    }
    return json({ mode: 'ai', explanations });
  }
  return json({ mode: 'rules', explanations: rules });
}
