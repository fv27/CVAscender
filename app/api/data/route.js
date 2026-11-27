// GET /api/data  → the signed-in student's own data
// PUT /api/data  → replace it (validated, encrypted)
//
// Record access is locked three ways:
//  1. We only ever look up the user id from the verified session cookie —
//     the client never sends a user id.
//  2. With Supabase, Row Level Security only allows auth.uid() = user_id.
//  3. The body is validated with a strict schema (unknown fields rejected).
import { accountsMode, currentUser, loadData, saveData } from '@/lib/server/accounts';
import { readJson, sameOrigin, limitOrFail, json, fail } from '@/lib/server/security';
import { studentDataSchema, firstError } from '@/lib/schemas';

export async function GET() {
  if (!(await accountsMode())) return fail(503, 'Accounts are not enabled.');
  const user = await currentUser();
  if (!user) return fail(401, 'Not signed in.');
  try {
    return json({ data: await loadData(user) });
  } catch {
    return fail(500, 'Could not load your data.');
  }
}

export async function PUT(req) {
  if (!sameOrigin(req)) return fail(403, 'Forbidden.');
  if (!(await accountsMode())) return fail(503, 'Accounts are not enabled.');
  const user = await currentUser();
  if (!user) return fail(401, 'Not signed in.');
  const limited = await limitOrFail(`data:${user.id}`, 60, 60);
  if (limited) return limited;

  const { body, error } = await readJson(req, 64_000);
  if (error) return error;
  const parsed = studentDataSchema.safeParse(body);
  if (!parsed.success) return fail(400, firstError(parsed));

  try {
    await saveData(user, parsed.data);
  } catch {
    return fail(500, 'Could not save your data.');
  }
  return json({ ok: true });
}
