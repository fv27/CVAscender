'use client';
// Navigation.
//  • Desktop: a fixed top header (Zillow / Turo pattern on Mobbin): logo, the main
//    tabs (Discover · Explore · Map · My path · Profile), search, settings.
//  • Phones: the floating capsule tab bar at the bottom (Shopify / Tripadvisor).
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Icon from './Icon';
import { useApp } from './AppProvider';

const ITEMS = [
  { href: '/feed', label: 'Discover', icon: 'home' },
  { href: '/explore', label: 'Explore', icon: 'search' },
  { href: '/saved', label: 'My path', icon: 'bookmark' },
  { href: '/profile', label: 'Profile', icon: 'user' },
];

export function Logo({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-display text-2xl leading-none ${className}`}>
      <span className="flex h-[1.15em] w-[1.15em] items-center justify-center rounded-[.3em] bg-lapis text-white">
        <svg viewBox="0 0 64 64" className="h-full w-full" fill="none" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"><path d="M18 34l14-14 14 14" stroke="#fff" /><path d="M18 48l14-14 14 14" stroke="#FF7518" /></svg>
      </span>
      <span><span className="text-signal">CV</span><span className="text-lapis">Ascender</span></span>
    </span>
  );
}

export default function Nav() {
  const path = usePathname();
  const router = useRouter();
  const { tracks, user, hasSupabase } = useApp();
  const [q, setQ] = useState('');
  const savedCount = Object.values(tracks).filter((t) => (t.saved && !t.status) || t.status === 'applied').length;
  const search = (e) => {
    e.preventDefault();
    const term = q.trim().slice(0, 80);
    router.push(`/explore${term ? `?q=${encodeURIComponent(term)}` : ''}`);
  };

  return (
    <>
      {/* Desktop top header */}
      <header className="no-print fixed inset-x-0 top-0 z-40 hidden h-16 border-b border-line bg-paper/90 backdrop-blur-xl lg:block">
        <div className="mx-auto flex h-full max-w-[1400px] items-center gap-6 pl-6 pr-20">
          <Link href="/feed" aria-label="CVAscender home"><Logo className="!text-xl" /></Link>
          <nav aria-label="Main" className="flex h-full items-center gap-1">
            {ITEMS.map((it) => {
              const on = path.startsWith(it.href);
              return (
                <Link key={it.href} href={it.href} aria-current={on ? 'page' : undefined}
                  className={`relative flex h-full items-center gap-2 px-3 text-[14.5px] font-medium transition ${on ? 'text-ink' : 'text-ink-muted hover:text-ink'}`}>
                  <Icon name={it.icon} size={17} />
                  {it.label}
                  {it.href === '/saved' && savedCount > 0 && (
                    <span className="rounded-full bg-signal-soft px-1.5 py-px text-[11px] font-semibold text-signal">{savedCount}</span>
                  )}
                  {on && <span className="absolute inset-x-3 bottom-0 h-[2.5px] rounded-full bg-signal" />}
                </Link>
              );
            })}
          </nav>
          <form onSubmit={search} className="ml-auto flex h-10 w-full max-w-[320px] items-center gap-2 rounded-full border border-line bg-card px-4 text-ink focus-within:border-lapis">
            <Icon name="search" size={16} className="shrink-0 text-ink-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} maxLength={80} aria-label="Search opportunities"
              placeholder="Search programmes, clubs, towns…" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-ink-muted" />
          </form>
          {hasSupabase && !user && <Link href="/login" className="shrink-0 text-sm font-semibold text-ink-soft hover:text-ink">Sign in</Link>}
          <Link href="/settings" aria-label="Settings" title="Settings"
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-card transition hover:border-lapis/40 ${path.startsWith('/settings') ? 'text-lapis' : 'text-ink-soft'}`}>
            <Icon name="gear" size={18} />
          </Link>
        </div>
      </header>

      {/* Phones: floating capsule tab bar */}
      <nav aria-label="Main" className="no-print fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(10px,env(safe-area-inset-bottom))] lg:hidden">
        <div className="flex items-center gap-1 rounded-full border border-line bg-card/90 p-1.5 shadow-[0_8px_30px_rgba(16,24,40,.12)] backdrop-blur-xl">
          {ITEMS.map((it) => {
            const on = path.startsWith(it.href);
            return (
              <Link key={it.href} href={it.href} aria-label={it.label} aria-current={on ? 'page' : undefined}
                className={`relative flex h-11 items-center justify-center gap-1.5 rounded-full transition-all duration-300 ${on ? 'bg-lapis px-4 text-white' : 'w-11 text-ink-muted hover:bg-soft hover:text-ink'}`}>
                <Icon name={it.icon} size={20} fill={on && it.icon !== 'search' ? 'currentColor' : 'none'} />
                {on && <span className="text-[13px] font-semibold">{it.label.split(' ')[0]}</span>}
                {it.href === '/saved' && savedCount > 0 && !on && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-signal" />}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
