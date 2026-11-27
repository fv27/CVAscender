// POST /api/auth/signup  { email, password, website?, turnstileToken? }
import { accountsMode, signUp } from '@/lib/server/accounts';
import { readJson, sameOrigin, clientIp, limitOrFail, checkHuman, json, fail } from '@/lib/server/security';
import { credentialsSchema, firstError } from '@/lib/schemas';

export async function POST(req) {
  if (!sameOrigin(req)) return fail(403, 'Forbidden.');
  const ip = clientIp(req);
  const limited = await limitOrFail(`signup:${ip}`, 5, 3600); // 5 sign-ups per IP per hour
  if (limited) return limited;

  const { body, error } = await readJson(req, 4_000);
  if (error) return error;
  if (!(await checkHuman(body, ip))) return fail(400, 'Please complete the human check.');
  const parsed = credentialsSchema.safeParse(body);
  if (!parsed.success) return fail(400, firstError(parsed));

  if (!(await accountsMode())) return fail(503, 'Accounts are not enabled.');
  // Same answer whether or not the email already exists (no account enumeration).
  const r = await signUp(parsed.data.email, parsed.data.password);
  if (r.error) return fail(400, r.error);
  return json({ ok: true, needsConfirmation: r.needsConfirmation });
}
