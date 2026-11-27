// POST /api/auth/logout
import { accountsMode, signOut } from '@/lib/server/accounts';
import { sameOrigin, json, fail } from '@/lib/server/security';

export async function POST(req) {
  if (!sameOrigin(req)) return fail(403, 'Forbidden.');
  if (await accountsMode()) await signOut();
  return json({ ok: true });
}
