'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/components/AppProvider';
import Nav from '@/components/Nav';
import Icon from '@/components/Icon';
import { CURSOR_FX_KEY, CURSOR_FX_EVENT } from '@/components/HeatCursor';
import { cantonName, countryName, schoolYearsFor, interestById } from '@/lib/constants';

export default function Settings() {
  const router = useRouter();
  const { profile, ready, user, hasSupabase, accountsMode, signOut, deleteAccount, resetAll, notify } = useApp();
  const [confirm, setConfirm] = useState(null); // 'reset' | 'delete' | null
  const [busy, setBusy] = useState(false);
  const [fx, setFx] = useState(true); // heat-reactive cursor on/off
  useEffect(() => { setFx(localStorage.getItem(CURSOR_FX_KEY) !== 'off'); }, []);
  const toggleFx = () => {
    const on = !fx;
    setFx(on);
    localStorage.setItem(CURSOR_FX_KEY, on ? 'on' : 'off');
    window.dispatchEvent(new Event(CURSOR_FX_EVENT));
  };

  useEffect(() => { if (ready && !profile) router.replace('/onboarding'); }, [ready, profile, router]);
  if (!ready || !profile) return <div className="min-h-dvh bg-paper" />;

  const year = schoolYearsFor(profile.country).find((y) => y.value === Number(profile.year))?.label;
  const rows = [
    ['Where you live', `${profile.city}, ${cantonName(profile.canton)}, ${countryName(profile.country)}`, 0],
    ['About you', [profile.name, `age ${profile.age}`, year].filter(Boolean).join(' · '), 1],
    ['Interests', profile.interests.map((i) => interestById(i)?.label || i).join(', '), 2],
    ['Skills to build', profile.skills.join(', '), 3],
  ];

  const doDelete = async () => {
    setBusy(true);
    const r = await deleteAccount();
    setBusy(false);
    if (!r.ok) return notify(r.data.error || 'Could not delete the account');
    router.replace('/');
  };

  return (
    <div className="min-h-dvh bg-paper pb-28 lg:pb-12">
      <Nav />
      <main className="mx-auto max-w-3xl px-5 pt-8 lg:px-8 lg:pt-28">
        <div className="eyebrow">Settings</div>
        <h1 className="mt-1 font-display text-6xl leading-none">Settings</h1>
        <p className="mt-3 text-ink-soft">Change the answers you gave when you started, and manage your account.</p>

        {/* Account */}
        <section className="mt-8 rounded-[28px] border-b-4 border-signal bg-lapis-deep p-6 text-white">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-signal">Account</div>
          {!hasSupabase ? (
            <p className="mt-3 text-sm text-white/80">Accounts are switched off on this server, so your data is saved in this browser only.</p>
          ) : user ? (
            <>
              <div className="mt-2 font-display text-3xl">{user.email}</div>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-white/75"><Icon name="check" size={14} /> Signed in — changes are saved to your account automatically.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <button onClick={async () => { await signOut(); router.push('/'); }} className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-lapis-deep hover:bg-signal hover:text-white">Sign out</button>
                {accountsMode === 'local' && (confirm === 'delete' ? (
                  <button onClick={doDelete} disabled={busy} className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white">{busy ? 'Deleting…' : 'Yes, delete my account and data'}</button>
                ) : (
                  <button onClick={() => setConfirm('delete')} className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white/80 hover:border-white">Delete account</button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="mt-2 font-display text-3xl">Not signed in</div>
              <p className="mt-1 text-sm text-white/75">Your progress is only on this device. Create an account to keep it safe and sign in anywhere.</p>
              <Link href="/login" className="mt-5 inline-flex rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110">Create account or sign in</Link>
            </>
          )}
        </section>

        {/* Onboarding answers */}
        <section className="mt-6 rounded-[28px] border border-line bg-card">
          <div className="flex items-center justify-between px-6 pb-2 pt-5">
            <h2 className="font-display text-3xl">Your answers</h2>
            <Link href="/onboarding?edit=1" className="text-sm font-semibold text-signal">Edit all</Link>
          </div>
          {rows.map(([label, value, step]) => (
            <Link key={label} href={`/onboarding?edit=1&step=${step}`}
              className="group flex items-center justify-between gap-4 border-t border-line px-6 py-4 hover:bg-signal-soft">
              <span className="min-w-0">
                <span className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">{label}</span>
                <span className="mt-0.5 block truncate text-[15px]">{value || '—'}</span>
              </span>
              <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-lapis group-hover:text-signal">Edit <Icon name="arrow" size={14} /></span>
            </Link>
          ))}
        </section>

        {/* Effects */}
        <section className="mt-6 flex items-center justify-between gap-4 rounded-[28px] border border-line bg-card p-6">
          <span>
            <h2 className="font-display text-3xl">Heat cursor</h2>
            <span className="mt-1 block text-sm text-ink-soft">Stripes light up around your mouse as you move it. Computers with a mouse only; off automatically if your device asks for reduced motion.</span>
          </span>
          <button role="switch" aria-checked={fx} aria-label="Heat cursor" onClick={toggleFx}
            className={`relative h-8 w-14 shrink-0 rounded-full transition ${fx ? 'bg-signal' : 'bg-line'}`}>
            <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${fx ? 'left-7' : 'left-1'}`} />
          </button>
        </section>

        {/* Device data */}
        <section className="mt-6 rounded-[28px] border border-line bg-card p-6">
          <h2 className="font-display text-3xl">Data on this device</h2>
          <p className="mt-2 text-sm text-ink-soft">
            {user ? 'Signing out removes your data from this browser; it stays in your account.' : 'Your profile and progress are stored in this browser.'}
          </p>
          {confirm === 'reset' ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => { resetAll(); router.replace('/onboarding'); }} className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white">Yes, start again from scratch</button>
              <button onClick={() => setConfirm(null)} className="btn-ghost">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setConfirm('reset')} className="btn-ghost mt-4">Reset everything and start again</button>
          )}
        </section>
        {/* Contact */}
        <section className="mt-6 rounded-[28px] border border-line bg-card p-6">
          <h2 className="font-display text-3xl">Contact</h2>
          <p className="mt-2 text-sm text-ink-soft">Questions, a mistake in a listing, or an opportunity we’re missing? Write to us.</p>
          <a href="mailto:cvascender@gmail.com" className="btn-ghost mt-4">cvascender@gmail.com</a>
          <p className="mt-4 text-sm text-ink-muted"><Link href="/privacy" className="font-semibold text-lapis">Privacy</Link></p>
        </section>
      </main>
    </div>
  );
}
