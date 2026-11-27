'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/components/AppProvider';
import { Logo } from '@/components/Nav';
import Visual from '@/components/Visual';
import Icon from '@/components/Icon';
import { OPPORTUNITIES } from '@/lib/opportunities';

const REAL = OPPORTUNITIES.filter((o) => o.verified).length;

const PREVIEW = ['olymp-informatics', 'epfl-pre-university-weeks', 'earth-prize'].map((id) => OPPORTUNITIES.find((o) => o.id === id)).filter(Boolean);
const CATS = [['technology', 'Tech & coding'], ['science', 'Science'], ['business', 'Business'], ['sports', 'Sports'], ['arts', 'Arts & culture'], ['volunteering', 'Volunteering'], ['leadership', 'Leadership'], ['academic', 'University']]
  .map(([id, label]) => [id, label, OPPORTUNITIES.filter((o) => o.categories.includes(id)).length]);

export default function Landing() {
  const router = useRouter();
  const { profile, ready, user, hasSupabase } = useApp();
  const cta = ready && profile ? { href: '/feed', label: 'Continue to your feed' } : { href: '/onboarding', label: 'Build my feed' };

  const [q, setQ] = useState('');
  const search = (e) => {
    e.preventDefault();
    const term = q.trim().slice(0, 80);
    router.push(ready && profile ? `/explore${term ? `?q=${encodeURIComponent(term)}` : ''}` : '/onboarding');
  };

  return (
    <main className="min-h-dvh overflow-hidden">
      {/* Hero: dark lapis band with a big bold headline and search (Shopify Academy / Skillshare pattern) */}
      <section className="relative overflow-hidden bg-paper text-ink">
        {/* Swiss-poster grid + one orange disc instead of blurry gradient blobs */}
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[.05]" style={{ backgroundImage: 'linear-gradient(rgb(var(--lapis)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--lapis)) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        <div aria-hidden className="pointer-events-none absolute -right-24 top-24 hidden h-[340px] w-[340px] rounded-full bg-signal sm:block" />
                <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <Logo className="!text-xl sm:!text-2xl" />
          <div className="mr-12 flex items-center gap-5 text-sm font-semibold sm:mr-14">
            {hasSupabase && !user && <Link href="/login" className="hidden text-ink-soft hover:text-ink sm:inline">Sign in</Link>}
            <Link href={cta.href} className="rounded-full bg-lapis px-4 py-2 text-white hover:brightness-110">{ready && profile ? 'Open app' : 'Get started'}</Link>
          </div>
        </header>

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-28 pt-6 lg:grid-cols-[1.15fr_.85fr] lg:pb-36 lg:pt-14">
          <div className="min-w-0 animate-rise">
            <div className="font-mono text-[11px] font-medium uppercase tracking-[.16em] text-ink-muted">For high-school students · All 26 cantons</div>
            <h1 className="mt-6 font-display text-[3.2rem] leading-[.95] sm:text-7xl lg:text-[5.4rem]">
              Find what’s <span className="text-signal">next</span> for you.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
              Olympiads, hackathons, university taster weeks, clubs, camps and volunteering from every canton, in one feed matched to you.
            </p>
            <form onSubmit={search} className="mt-8 flex max-w-xl items-center gap-2 rounded-full border border-line bg-card p-1.5 pl-5 text-ink shadow-card">
              <Icon name="search" size={18} className="shrink-0 text-ink-muted" />
              <input value={q} onChange={(e) => setQ(e.target.value)} maxLength={80} aria-label="Search opportunities"
                placeholder="Try “robotics”, “football Geneva”, “summer”…" className="min-w-0 flex-1 bg-transparent py-2 text-[15px] outline-none placeholder:text-ink-muted" />
              <button className="btn-signal h-11 shrink-0 px-5">{ready && profile ? 'Search' : 'Start'}</button>
            </form>
            <p className="mt-4 text-sm text-ink-muted">{OPPORTUNITIES.length}+ listings · {REAL} checked against official sources · free</p>
          </div>

          {/* Stacked card preview */}
          <div className="relative mx-auto hidden h-[420px] w-full max-w-[340px] sm:block">
            {PREVIEW.map((o, i) => (
              <div key={o.id} className="absolute inset-x-0 top-0"
                style={{ transform: `translate(${(i - 1) * 34}px, ${i * 30}px) rotate(${(i - 1) * 6}deg)`, zIndex: i === 2 ? 3 : i === 0 ? 1 : 2 }}>
                <div className="overflow-hidden rounded-[26px] bg-card text-ink shadow-lift transition duration-500 hover:-translate-y-2"
                  style={{ animation: `rise .7s ${0.15 + i * 0.12}s both cubic-bezier(.2,.7,.2,1)` }}>
                  <Visual o={o} className="h-36" />
                  <div className="p-5">
                    <div className="text-xs font-semibold text-ink-muted">{o.type}</div>
                    <div className="mt-1 text-xl font-bold leading-tight tracking-tight">{o.title}</div>
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-soft px-3 py-1.5 text-xs font-medium">
                      <Icon name="shield" size={12} className="text-lapis" /> Real · source checked
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured panel overlapping the hero (Shopify Academy "Featured Programs") */}
      <section className="relative z-10 mx-auto -mt-8 max-w-6xl px-6">
        <div className="rounded-[28px] border border-line bg-card p-6 shadow-card sm:p-8">
          <div className="label">Categories</div>
          <h2 className="mt-1 font-display text-3xl">Browse by what you love</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CATS.map(([id, label, n]) => (
              <Link key={id} href={ready && profile ? '/explore' : '/onboarding'}
                className="group flex items-center justify-between rounded-2xl bg-soft px-4 py-4 transition hover:bg-signal-soft">
                <span>
                  <span className="block font-semibold">{label}</span>
                  <span className="text-xs text-ink-muted">{n} listings</span>
                </span>
                <Icon name="arrow" size={16} className="text-ink-muted transition group-hover:translate-x-0.5 group-hover:text-signal" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-3">
          {[
            ['01', 'Tell us about you', 'Your canton and town, age, interests and the skills you want to build. Takes a minute.'],
            ['02', 'Scroll your feed', 'A personalised stream of programmes, competitions and clubs near where you live, each with the reason it fits you.'],
            ['03', 'Build your path', 'Save, track applications, mark things completed — and get a CV plus an AI gap analysis.'],
          ].map(([n, t, d]) => (
            <div key={n}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-signal-soft font-bold text-signal">{n.replace(/^0/, '')}</div>
              <div className="mt-3 font-display text-2xl">{t}</div>
              <p className="mt-2 leading-relaxed text-ink-soft">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-10 text-sm text-ink-muted">
        CVAscender — built for the STEM2Connect hackathon. Listings marked “Real · source checked” were verified against official pages (Nov 2026); always confirm dates there. Listings marked “Not checked yet” are real organisations whose details we haven’t confirmed.{' '}
        <Link href="/privacy" className="font-semibold text-lapis">Privacy</Link>{' · '}
        <a href="mailto:cvascender@gmail.com" className="font-semibold text-lapis">cvascender@gmail.com</a>
      </footer>
    </main>
  );
}
