// POST /api/auth/login  { email, password, website?, turnstileToken? }
import { accountsMode, signIn } from '@/lib/server/accounts';
import { readJson, sameOrigin, clientIp, limitOrFail, checkHuman, json, fail } from '@/lib/server/security';
import { credentialsSchema } from '@/lib/schemas';

export async function POST(req) {
  if (!sameOrigin(req)) return fail(403, 'Forbidden.');
  const ip = clientIp(req);
  // Two limits: per IP (stops one attacker) and per email (stops a distributed
  // attack on one account). Supabase Auth adds its own limits on top.
  const byIp = await limitOrFail(`login-ip:${ip}`, 10, 900);
  if (byIp) return byIp;

  const { body, error } = await readJson(req, 4_000);
  if (error) return error;
  if (!(await checkHuman(body, ip))) return fail(400, 'Please complete the human check.');
  const parsed = credentialsSchema.safeParse(body);
  if (!parsed.success) return fail(400, 'Wrong email or password.');

  const byEmail = await limitOrFail(`login-email:${parsed.data.email}`, 5, 900);
  if (byEmail) return byEmail;

  if (!(await accountsMode())) return fail(503, 'Accounts are not enabled.');
  const user = await signIn(parsed.data.email, parsed.data.password);
  if (!user) return fail(401, 'Wrong email or password.'); // generic on purpose
  return json({ user: { email: user.email } });
}
