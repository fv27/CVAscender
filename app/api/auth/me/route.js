// GET    /api/auth/me → { enabled, mode, user: { email } | null }  (nothing else)
// DELETE /api/auth/me → delete the signed-in account and its data (local accounts)
import { accountsMode, currentUser, deleteAccount } from '@/lib/server/accounts';
import { sameOrigin, limitOrFail, json, fail } from '@/lib/server/security';

export async function GET() {
  const mode = await accountsMode();
  const user = mode ? await currentUser() : null;
  return json({ enabled: !!mode, mode, user: user ? { email: user.email } : null });
}

export async function DELETE(req) {
  if (!sameOrigin(req)) return fail(403, 'Forbidden.');
  const user = await currentUser();
  if (!user) return fail(401, 'Not signed in.');
  const limited = await limitOrFail(`delete:${user.id}`, 3, 3600);
  if (limited) return limited;
  if (!(await deleteAccount(user))) return fail(400, 'Ask the app owner to delete this account in Supabase.');
  return json({ ok: true });
}
