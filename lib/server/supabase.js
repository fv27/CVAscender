import 'server-only';
// Server-side Supabase client. The browser never talks to Supabase directly:
// every read/write goes through our API routes, which check the session first.
// The session lives in cookies that are httpOnly (JavaScript can't read them,
// so an XSS bug can't steal them), Secure (HTTPS only) and SameSite=Lax.
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseConfig, isProd } from './env';

const COOKIE_OPTIONS = { httpOnly: true, secure: isProd, sameSite: 'lax', path: '/' };

export async function getSupabase() {
  if (!supabaseConfig) return null;
  const store = await cookies();
  return createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
    cookieOptions: COOKIE_OPTIONS,
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        for (const { name, value, options } of list) store.set(name, value, { ...options, ...COOKIE_OPTIONS });
      },
    },
  });
}

/** Returns the verified user (checked with Supabase Auth, not just decoded). */
export async function getUser() {
  const supabase = await getSupabase();
  if (!supabase) return { supabase: null, user: null };
  const { data } = await supabase.auth.getUser();
  return { supabase, user: data?.user ?? null };
}
