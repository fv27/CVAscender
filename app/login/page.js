'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { useApp } from '@/components/AppProvider';
import { Logo } from '@/components/Nav';

// Cloudflare Turnstile site key is PUBLIC by design (the secret stays on the server).
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function Login() {
  const router = useRouter();
  const { hasSupabase, accountsMode, user, profile, signIn, signUp, signOut } = useApp();
  const [mode, setMode] = useState('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [website, setWebsite] = useState(''); // honeypot — stays empty for humans
  const [token, setToken] = useState('');
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const widget = useRef(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    window.onTurnstileOk = setToken;
  }, []);

  const resetTurnstile = () => { try { window.turnstile?.reset(widget.current); } catch {} setToken(''); };

  const submit = async (e) => {
    e.preventDefault();
    if (TURNSTILE_SITE_KEY && !token) return setMsg({ bad: true, text: 'Please complete the human check.' });
    setBusy(true); setMsg(null);
    const creds = { email, password, website, ...(token ? { turnstileToken: token } : {}) };
    const r = mode === 'signup' ? await signUp(creds) : await signIn(creds);
    setBusy(false);
    resetTurnstile();
    if (!r.ok) return setMsg({ bad: true, text: r.data.error || 'Something went wrong.' });
    if (mode === 'signup') {
      // No email confirmation needed and no single-use bot check: sign straight in.
      if (!r.data.needsConfirmation && !TURNSTILE_SITE_KEY) {
        setBusy(true);
        const s = await signIn({ email, password, website });
        setBusy(false);
        if (s.ok) return router.push(s.profile || profile ? '/feed' : '/onboarding');
        setMode('signin');
        return setMsg({ bad: true, text: s.data.error || 'Could not sign in.' });
      }
      setPassword('');
      setMode('signin');
      return setMsg({ text: r.data.needsConfirmation ? 'Check your inbox to confirm your email, then sign in.' : 'Account ready — sign in now.' });
    }
    router.push(r.profile || profile ? '/feed' : '/onboarding');
  };

  return (
    <main className="grain flex min-h-dvh flex-col items-center justify-center px-6 py-12">
      {TURNSTILE_SITE_KEY && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />}
      <Link href="/" className="mb-10"><Logo /></Link>
      <div className="w-full max-w-sm animate-rise rounded-[28px] border border-line bg-card p-7 shadow-card">
        {!hasSupabase ? (
          <>
            <h1 className="font-display text-4xl">Demo mode</h1>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Accounts aren’t switched on yet, so your profile and progress are saved in this browser only. To enable real accounts,
              add your Supabase keys to <code className="rounded bg-soft px-1">keys.env</code> (see the README).
            </p>
            <Link href={profile ? '/feed' : '/onboarding'} className="btn-primary mt-6 w-full">Continue without an account</Link>
          </>
        ) : user ? (
          <>
            <h1 className="font-display text-4xl">You’re signed in</h1>
            <p className="mt-2 text-sm text-ink-soft">{user.email}</p>
            <Link href="/feed" className="btn-primary mt-6 w-full">Go to my feed</Link>
            <button onClick={signOut} className="btn-ghost mt-2 w-full">Sign out</button>
          </>
        ) : (
          <form onSubmit={submit} noValidate={false}>
            <h1 className="font-display text-4xl">{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h1>
            <p className="mt-2 text-sm text-ink-soft">
              {accountsMode === 'local'
                ? 'Your profile, saved opportunities and CV are kept in your account, so they’re there whenever you sign in again.'
                : 'Keep your saved opportunities and CV across devices.'}
            </p>
            <input className="field mt-6" type="email" autoComplete="email" placeholder="Email" maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input className="field mt-2.5" type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              placeholder="Password (min. 10 characters)" minLength={10} maxLength={72} value={password} onChange={(e) => setPassword(e.target.value)} required />
            {/* Honeypot: hidden from people and screen readers, bots fill it in. */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
              <label>Website <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} name="website" /></label>
            </div>
            {TURNSTILE_SITE_KEY && <div ref={widget} className="cf-turnstile mt-4" data-sitekey={TURNSTILE_SITE_KEY} data-callback="onTurnstileOk" />}
            {msg && <p role="alert" className={`mt-3 text-sm ${msg.bad ? 'text-red-600 dark:text-red-400' : 'text-ok'}`}>{msg.text}</p>}
            <button className="btn-primary mt-5 w-full" disabled={busy}>{busy ? 'One moment…' : mode === 'signup' ? 'Create account' : 'Sign in'}</button>
            <button type="button" onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setMsg(null); }} className="mt-4 w-full text-center text-sm text-ink-muted hover:text-ink">
              {mode === 'signup' ? 'Already have an account? Sign in' : 'New here? Create an account'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
