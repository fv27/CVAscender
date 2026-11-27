// POST /api/cv-gap
// Body: { profile, done: [{title,type,skillsGained}], active: [{title,type}] }
// Returns: { mode, coverage, dims, gaps, summary, advice: { [dimId]: string } }
import { analyseCV } from '@/lib/matching';
import { DIMENSIONS } from '@/lib/constants';
import { askJSON, cleanProfile } from '@/lib/ai';
import { aiAllowed } from '@/lib/server/ai-access';
import { readJson, sameOrigin, clientIp, limitOrFail, json, fail } from '@/lib/server/security';
import { cvGapSchema, firstError } from '@/lib/schemas';

const RULE_ADVICE = {
  leadership: 'Look for a role where people rely on you — a club officer, class rep or team captain.',
  work: 'A short internship or work-experience week shows you can operate in a real workplace.',
  community: 'Regular volunteering, even a few hours a month, shows commitment beyond yourself.',
  competitions: 'A hackathon or academic competition gives you a concrete result to point to.',
  academic: 'A university programme, summer school or online course shows you learn beyond the syllabus.',
  teamwork: 'Joining a team for a full season shows reliability and collaboration.',
  international: 'A language exchange in another Swiss region shows you can work across languages and cultures.',
};

export async function POST(req) {
  if (!sameOrigin(req)) return fail(403, 'Forbidden.');
  const limited = await limitOrFail(`cvgap:${clientIp(req)}`, 20, 60);
  if (limited) return limited;
  const { body: raw, error } = await readJson(req, 24_000);
  if (error) return error;
  const parsed = cvGapSchema.safeParse(raw);
  if (!parsed.success) return fail(400, firstError(parsed));
  const { done, active } = parsed.data;
  const profile = cleanProfile(parsed.data.profile);

  const analysis = analyseCV(profile, done, active);
  const { gaps, coverage } = analysis;
  // Trim the response to what the page displays.
  const dims = analysis.dims.map(({ id, label, status, completed }) => ({ id, label, status, completed }));
  const ruleSummary = done.length
    ? `Your CV covers ${dims.filter((d) => d.status !== 'gap').length} of ${dims.length} areas. The biggest opportunity to grow is ${DIMENSIONS.find((d) => d.id === gaps[0])?.label?.toLowerCase() || 'depth in what you already do'}.`
    : 'Your CV is a blank page — which means every opportunity you complete makes a visible difference. Start with one that matches your interests.';
  const base = { coverage, dims, gaps, summary: ruleSummary, advice: Object.fromEntries(gaps.map((g) => [g, RULE_ADVICE[g]])) };

  const system = `You are a supportive careers adviser for high-school students in Switzerland on CVAscender.
Given the student's profile, what they have completed, and which CV areas are missing, write:
- "summary": 2 sentences, encouraging and specific, about the shape of their CV today.
- "advice": for EACH gap id given, one practical sentence (max 30 words) on the kind of opportunity to look for, tailored to their interests.
Do not invent achievements. Reply ONLY with JSON: {"summary": "...", "advice": {"<gapId>": "..."}}`;
  const user = JSON.stringify({ student: profile, completed: done, inProgress: active, gaps: gaps.map((g) => ({ id: g, label: DIMENSIONS.find((d) => d.id === g)?.label })) });

  const ai = (await aiAllowed(req)) ? await askJSON(system, user) : null;
  if (ai?.summary) {
    const advice = { ...base.advice };
    for (const g of gaps) if (typeof ai.advice?.[g] === 'string') advice[g] = ai.advice[g];
    return json({ ...base, mode: 'ai', summary: String(ai.summary).slice(0, 600), advice });
  }
  return json({ ...base, mode: 'rules' });
}
