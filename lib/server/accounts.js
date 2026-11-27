import 'server-only';
// ---------------------------------------------------------------------------
// One accounts interface, two back ends:
//
//  • Supabase (when SUPABASE_URL + SUPABASE_ANON_KEY are set) — use this when
//    the app is deployed (Vercel), because Vercel has no permanent disk.
//  • Local accounts (the default otherwise) — accounts and student data are
//    kept in the .data/ folder of the project on the computer running
//    `npm run dev` / `npm start`. Good for the hackathon demo and testing.
//
// Local accounts follow the same security rules as Supabase ones:
//  - passwords are hashed with scrypt + a random salt (never stored in clear);
//  - sessions are random 256-bit tokens in an httpOnly, SameSite=Lax cookie
//    (Secure in production); only a SHA-256 of the token is stored;
//  - student data is encrypted with AES-256-GCM (DATA_ENCRYPTION_KEY, or a
//    random key generated once into .data/secret.key);
//  - every lookup uses the user id from the verified session, never from the
//    request body, so one student can't read another's record.
// ---------------------------------------------------------------------------
import { randomBytes, scrypt as scryptCb, timingSafeEqual, createHash, randomUUID } from 'node:crypto';
import { promises as fs, mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import { cookies } from 'next/headers';
import { getSupabase } from './supabase';
import { seal, open } from './crypto';
import { encryptionKey, isProd } from './env';

const scrypt = promisify(scryptCb);

const localEnabled = !process.env.VERCEL && process.env.LOCAL_ACCOUNTS !== 'off';
const DIR = path.join(process.cwd(), '.data');
const FILE = path.join(DIR, 'accounts.json');
const COOKIE = 'cva_session';
const SESSION_DAYS = 30;
const COOKIE_OPTIONS = { httpOnly: true, secure: isProd, sameSite: 'lax', path: '/', maxAge: SESSION_DAYS * 86400 };

// ---------- the local store --------------------------------------------------

let cachedKey = null;
function localKey() {
  if (encryptionKey) return encryptionKey;
  if (cachedKey) return cachedKey;
  mkdirSync(DIR, { recursive: true, mode: 0o700 });
  const f = path.join(DIR, 'secret.key');
  if (!existsSync(f)) writeFileSync(f, randomBytes(32).toString('hex'), { mode: 0o600, flag: 'wx' });
  cachedKey = Buffer.from(readFileSync(f, 'utf8').trim(), 'hex');
  return cachedKey;
}

async function readStore() {
  try {
    const s = JSON.parse(await fs.readFile(FILE, 'utf8'));
    return { users: s.users || {}, sessions: s.sessions || {} };
  } catch {
    return { users: {}, sessions: {} };
  }
}

// All writes go through one queue so two requests can't overwrite each other.
let queue = Promise.resolve();
function updateStore(fn) {
  const run = queue.then(async () => {
    const s = await readStore();
    const result = await fn(s);
    const now = Date.now();
    for (const [k, v] of Object.entries(s.sessions)) if (v.exp < now) delete s.sessions[k];
    await fs.mkdir(DIR, { recursive: true, mode: 0o700 });
    const tmp = `${FILE}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(s), { mode: 0o600 });
    await fs.rename(tmp, FILE); // atomic replace: never a half-written file
    return result;
  });
  queue = run.catch(() => {});
  return run;
}

const sha = (t) => createHash('sha256').update(t).digest('hex');
const emailKey = (e) => e.trim().toLowerCase();

async function hashPassword(pw, salt = randomBytes(16)) {
  const hash = await scrypt(pw.normalize('NFKC'), salt, 64);
  return { salt: salt.toString('hex'), hash: hash.toString('hex') };
}
async function checkPassword(pw, user) {
  const { hash } = await hashPassword(pw, Buffer.from(user.salt, 'hex'));
  return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(user.hash, 'hex'));
}
const DUMMY = { salt: '00'.repeat(16), hash: '00'.repeat(64) };

async function localSessionUser() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token || !/^[A-Za-z0-9_-]{30,100}$/.test(token)) return null;
  const s = await readStore();
  const sess = s.sessions[sha(token)];
  if (!sess || sess.exp < Date.now()) return null;
  const u = s.users[sess.userId];
  return u ? { id: sess.userId, email: u.email } : null;
}

// ---------- the public interface --------------------------------------------

/** 'supabase' | 'local' | null */
export async function accountsMode() {
  if (await getSupabase()) return 'supabase';
  return localEnabled ? 'local' : null;
}

/** The verified signed-in user ({ id, email }) or null. */
export async function currentUser() {
  const supabase = await getSupabase();
  if (supabase) {
    const { data } = await supabase.auth.getUser();
    return data?.user ? { id: data.user.id, email: data.user.email } : null;
  }
  return localEnabled ? localSessionUser() : null;
}

/** Create an account. Same answer whether or not the email exists. */
export async function signUp(email, password) {
  const supabase = await getSupabase();
  if (supabase) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error && !/registered|exists/i.test(error.message)) {
      return { error: /password/i.test(error.message) ? error.message : 'Could not create the account.' };
    }
    return { ok: true, needsConfirmation: !data?.session };
  }
  const { salt, hash } = await hashPassword(password);
  await updateStore((s) => {
    const key = emailKey(email);
    if (Object.values(s.users).some((u) => emailKey(u.email) === key)) return; // already exists: say nothing
    s.users[randomUUID()] = { email: key, salt, hash, data: null, createdAt: Date.now() };
  });
  return { ok: true, needsConfirmation: false };
}

/** Check the password and start a session. Returns { email } or null. */
export async function signIn(email, password) {
  const supabase = await getSupabase();
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return error || !data?.user ? null : { email: data.user.email };
  }
  const s = await readStore();
  const key = emailKey(email);
  const entry = Object.entries(s.users).find(([, u]) => emailKey(u.email) === key);
  const ok = await checkPassword(password, entry ? entry[1] : DUMMY); // same work either way
  if (!entry || !ok) return null;
  const token = randomBytes(32).toString('base64url');
  await updateStore((st) => { st.sessions[sha(token)] = { userId: entry[0], exp: Date.now() + SESSION_DAYS * 86400_000 }; });
  (await cookies()).set(COOKIE, token, COOKIE_OPTIONS);
  return { email: entry[1].email };
}

export async function signOut() {
  const supabase = await getSupabase();
  if (supabase) return void (await supabase.auth.signOut());
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token) await updateStore((s) => { delete s.sessions[sha(token)]; });
  store.set(COOKIE, '', { ...COOKIE_OPTIONS, maxAge: 0 });
}

/** The user's saved data (decrypted) or null. */
export async function loadData(user) {
  const supabase = await getSupabase();
  if (supabase) {
    const { data, error } = await supabase.from('student_data').select('data').eq('user_id', user.id).maybeSingle();
    if (error) throw new Error('load failed');
    return data ? open(data.data) : null;
  }
  const s = await readStore();
  const sealed = s.users[user.id]?.data;
  return sealed ? open(sealed, localKey()) : null;
}

/** Replace the user's data (already validated by the caller). */
export async function saveData(user, value) {
  const supabase = await getSupabase();
  if (supabase) {
    const { error } = await supabase.from('student_data').upsert({ user_id: user.id, data: seal(value) }, { onConflict: 'user_id' });
    if (error) throw new Error('save failed');
    return;
  }
  const sealed = seal(value, localKey());
  await updateStore((s) => { if (s.users[user.id]) s.users[user.id].data = sealed; });
}

/** Delete the account and everything stored for it (local accounts only). */
export async function deleteAccount(user) {
  if (await getSupabase()) return false; // needs the Supabase dashboard / a server-side admin key
  const store = await cookies();
  await updateStore((s) => {
    delete s.users[user.id];
    for (const [k, v] of Object.entries(s.sessions)) if (v.userId === user.id) delete s.sessions[k];
  });
  store.set(COOKIE, '', { ...COOKIE_OPTIONS, maxAge: 0 });
  return true;
}
