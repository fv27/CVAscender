import 'server-only';
// ---------------------------------------------------------------------------
// Server-only configuration. `import 'server-only'` makes the build FAIL if any
// browser component ever imports this file, so keys can't leak by accident.
// None of these variables start with NEXT_PUBLIC_, so Next.js never puts them
// in the JavaScript sent to browsers.
// ---------------------------------------------------------------------------

function jwtRole(key) {
  try { return JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString()).role; } catch { return null; }
}

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;

// Only the PUBLIC (anon / publishable) key is allowed. A service_role or
// secret key bypasses Row Level Security, so we refuse to start with one.
if (anonKey && (jwtRole(anonKey) === 'service_role' || anonKey.startsWith('sb_secret_'))) {
  throw new Error('SUPABASE_ANON_KEY is a service_role/secret key. Use the anon (public) key — the secret key bypasses Row Level Security.');
}

export const supabaseConfig = url && anonKey ? { url, anonKey } : null;
export const isProd = process.env.NODE_ENV === 'production';

// 32-byte key for AES-256-GCM, given as 64 hex chars or base64.
const rawKey = process.env.DATA_ENCRYPTION_KEY || '';
export const encryptionKey = rawKey
  ? (/^[0-9a-f]{64}$/i.test(rawKey) ? Buffer.from(rawKey, 'hex') : Buffer.from(rawKey, 'base64'))
  : null;
if (encryptionKey && encryptionKey.length !== 32) throw new Error('DATA_ENCRYPTION_KEY must be 32 bytes (64 hex characters).');
if (supabaseConfig && !encryptionKey && isProd) {
  console.warn('[security] DATA_ENCRYPTION_KEY is not set — student data will be stored unencrypted at the application level.');
}

export const turnstileSecret = process.env.TURNSTILE_SECRET_KEY || null;
export const upstash = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? { url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN } : null;
