'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/components/AppProvider';
import Nav, { Logo } from '@/components/Nav';
import OpportunityCard from '@/components/OpportunityCard';
import DetailSheet, { Sheet } from '@/components/DetailSheet';
import FilterPanel, { DEFAULT_FILTERS, activeFilterCount, SearchBar, SidebarFilters } from '@/components/FilterPanel';
import Icon from '@/components/Icon';
import { OPPORTUNITIES, deadlineLabel } from '@/lib/opportunities';
import { rankFeed, applyFilters, analyseCV, searchesWide } from '@/lib/matching';
import { progressLists } from '@/lib/progress';
import { interestById } from '@/lib/constants';

/** Ask the server for AI explanations of the top matches (cached per profile). */
function useAIExplanations(profile, ids, gaps) {
  const [ai, setAi] = useState({ mode: 'loading', explanations: {} });
  const key = profile ? 'cva:ai:' + JSON.stringify([profile.interests, profile.skills, profile.city, profile.age, profile.year, profile.schoolId, gaps, ids]) : null;

  useEffect(() => {
    if (!key || !ids.length) return;
    try {
      const cached = sessionStorage.getItem(key);
      if (cached) return setAi(JSON.parse(cached));
    } catch {}
    let cancelled = false;
    fetch('/api/recommend', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ profile, ids, gaps }) })
      .then((r) => r.json())
      .then((d) => { if (cancelled) return; setAi(d); try { sessionStorage.setItem(key, JSON.stringify(d)); } catch {} })
      .catch(() => !cancelled && setAi({ mode: 'rules', explanations: {} }));
    return () => { cancelled = true; };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  return ai;
}

export default function Feed() {
  const router = useRouter();
  const { profile, ready, tracks, custom, toggleSave, setStatus, notify } = useApp();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState('foryou'); // 'foryou' | 'deadline'
  const [open, setOpen] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [idx, setIdx] = useState(0);
  const scroller = useRef(null);

  useEffect(() => { if (ready && !profile) router.replace('/onboarding'); }, [ready, profile, router]);

  const { done, active } = useMemo(() => progressLists(tracks, custom), [tracks, custom]);
  const gaps = useMemo(() => (profile ? analyseCV(profile, done, active).gaps : []), [profile, done, active]);
  // `base` is the normal feed (own canton). When the student searches or picks
  // a canton, `ranked` also includes local clubs from every other canton.
  const base = useMemo(() => (profile ? rankFeed(OPPORTUNITIES, profile, gaps) : []), [profile, gaps]);
  const wide = searchesWide(filters);
  const ranked = useMemo(() => (wide && profile ? rankFeed(OPPORTUNITIES, profile, gaps, { anyCanton: true }) : base), [wide, base, profile, gaps]);
  const items = useMemo(() => {
    const list = applyFilters(ranked, filters, profile?.canton);
    if (sort === 'deadline') return [...list].sort((a, b) => (a.o.deadlineDays ?? 999) - (b.o.deadlineDays ?? 999));
    return list;
  }, [ranked, filters, sort]);

  const topIds = useMemo(() => base.filter((x) => x.m.eligible).slice(0, 12).map((x) => x.o.id), [base]);
  const ai = useAIExplanations(profile, topIds, gaps);

  // Reset to top when the feed changes
  useEffect(() => { scroller.current?.scrollTo({ top: 0 }); idxRef.current = 0; setIdx(0); }, [filters, sort]);

  // Smooth scrolling: read the position once per animation frame (not on
  // every scroll event) and only re-render when the current reel changes.
  const frame = useRef(0);
  const idxRef = useRef(0);
  const onScroll = () => {
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const el = scroller.current;
      if (!el) return;
      const i = Math.round(el.scrollTop / el.clientHeight);
      if (i !== idxRef.current) { idxRef.current = i; setIdx(i); }
    });
  };
  const go = useCallback((d) => {
    const el = scroller.current;
    if (!el) return;
    const target = Math.max(0, Math.min(items.length, idxRef.current + d));
    idxRef.current = target; setIdx(target);
    el.scrollTo({ top: target * el.clientHeight, behavior: 'smooth' });
  }, [items.length]);

  // Mouse wheel / trackpad on desktop: one gesture = exactly one reel (like
  // TikTok on the web) instead of skidding past several cards.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    let lockUntil = 0, acc = 0, quiet;
    const onWheel = (e) => {
      if (e.ctrlKey || !window.matchMedia('(pointer: fine)').matches) return;
      e.preventDefault();
      clearTimeout(quiet); quiet = setTimeout(() => { acc = 0; }, 180);
      if (Date.now() < lockUntil) return;
      acc += e.deltaY;
      if (Math.abs(acc) < 24) return;
      go(acc > 0 ? 1 : -1);
      acc = 0; lockUntil = Date.now() + 550;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => { el.removeEventListener('wheel', onWheel); clearTimeout(quiet); };
  }, [go, ready, profile]);

  // Keyboard: ↑/↓ or j/k to move, s to save
  useEffect(() => {
    const k = (e) => {
      if (open || showFilters || /INPUT|TEXTAREA/.test(document.activeElement?.tagName)) return;
      if (e.key === 'ArrowDown' || e.key === 'j') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowUp' || e.key === 'k') { e.preventDefault(); go(-1); }
      if (e.key === 's' && items[idx]) toggleSave(items[idx].o.id);
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [go, idx, items, open, showFilters, toggleSave]);

  const apply = (o) => {
    const t = tracks[o.id] || {};
    if (o.url || t.status) return setOpen(o);
    setStatus(o.id, 'applied');
  };

  if (!ready || !profile) return <div className="min-h-dvh bg-paper" />;

  const fc = activeFilterCount(filters);
  const closingSoon = base.filter((x) => x.m.eligible && x.o.deadlineDays != null && x.o.deadlineDays >= 0 && x.o.deadlineDays <= 10).slice(0, 4);

  return (
    <div className="min-h-dvh bg-paper">
      <Nav />

      {/* Mobile top bar: For you / Closing soon + filters */}
      <header className="fixed inset-x-0 top-0 z-30 bg-gradient-to-b from-paper via-paper/95 to-paper/0 pb-2 lg:hidden">
        <div className="flex h-[52px] items-center gap-2 pl-4 pr-[62px]">
          <Logo className="!text-lg" />
          <button onClick={() => setShowFilters(true)} aria-label="Search and filters" className="relative ml-auto flex h-9 items-center gap-1.5 rounded-full bg-soft px-3 text-[13px] font-semibold">
            <Icon name="sliders" size={16} /> Filters
            {fc > 0 && <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-signal px-1 text-[10px] font-bold text-white">{fc}</span>}
          </button>
        </div>
        <SortTabs sort={sort} setSort={setSort} className="px-4" />
      </header>

      <div className="lg:pt-16">
        <div className="mx-auto flex max-w-[1400px] justify-center gap-8 lg:px-6">
          {/* Desktop: filters always visible on the left (Eventbrite / Dribbble pattern) */}
          <aside aria-label="Filters" className="no-scrollbar sticky top-16 hidden h-[calc(100dvh-64px)] w-[280px] shrink-0 overflow-y-auto py-6 lg:block">
            <div className="label">{profile.name ? `Hi ${profile.name}` : 'Your feed'} · {profile.city}</div>
            <h1 className="mt-1 font-display text-4xl">Discover</h1>
            <SortTabs sort={sort} setSort={setSort} className="mt-4 border-b border-line" />
            <div className="mt-4"><SearchBar f={filters} setF={setFilters} homeCanton={profile.canton} /></div>
            <div className="mt-3 text-xs text-ink-muted">{items.length} result{items.length === 1 ? '' : 's'}{wide ? ' · all cantons' : ''}</div>
            <div className="mt-5"><SidebarFilters f={filters} setF={setFilters} items={ranked} homeCanton={profile.canton} /></div>
          </aside>

          {/* THE FEED — vertical, snap-scrolling (TikTok) on every screen size */}
          <section ref={scroller} onScroll={onScroll} aria-label="Opportunity feed"
            className="no-scrollbar h-dvh w-full max-w-[480px] snap-y snap-mandatory overflow-y-scroll overscroll-contain [-webkit-overflow-scrolling:touch] lg:h-[calc(100dvh-64px)]">
            {items.map(({ o, m }, i) => (
              <div key={o.id} className="flex h-dvh snap-start snap-always px-2.5 pb-[78px] pt-[98px] lg:h-[calc(100dvh-64px)] lg:px-0 lg:py-5">
                {/* Only reels near the screen are fully drawn — keeps scrolling smooth with hundreds of listings. */}
                {Math.abs(i - idx) > 3 ? <div className="h-full w-full rounded-[28px] bg-soft" /> : (
                <div className="h-full w-full [transform:translateZ(0)]">
                  <OpportunityCard o={o} m={m} ai={ai.explanations?.[o.id]} aiMode={ai.mode} track={tracks[o.id]} notify={notify}
                    active={i === idx} onTag={(patch, label) => { setFilters({ ...DEFAULT_FILTERS, ...patch }); notify(`Showing ${label}`); }}
                    onOpen={() => setOpen(o)} onSave={() => toggleSave(o.id)} onApply={() => apply(o)} />
                </div>
                )}
              </div>
            ))}
            <div className="flex h-dvh snap-start items-center justify-center px-6 pb-[78px] pt-[98px] text-center lg:h-[calc(100dvh-64px)] lg:py-6">
              <Empty items={items} fc={fc} clear={() => setFilters(DEFAULT_FILTERS)} />
            </div>
          </section>

          {/* Right column: deadlines */}
          <aside className="no-scrollbar sticky top-16 hidden h-[calc(100dvh-64px)] w-[300px] shrink-0 overflow-y-auto py-6 xl:block">
            {closingSoon.length > 0 && (
              <div>
                <div className="label mb-2">Don’t miss</div>
                {closingSoon.map(({ o }) => (
                  <button key={o.id} onClick={() => setOpen(o)} className="flex w-full items-center justify-between gap-3 border-t border-line py-3 text-left text-sm hover:text-signal">
                    <span className="truncate font-medium">{o.title}</span>
                    <span className="shrink-0 font-mono text-xs text-signal">{deadlineLabel(o)}</span>
                  </button>
                ))}
              </div>
            )}
            <p className="mt-8 text-xs text-ink-muted">Tip: ↑ ↓ to scroll · S to save · double-click a card to bookmark.</p>
          </aside>
        </div>
      </div>

      {/* Desktop up/down buttons */}
      <div className="fixed bottom-6 right-6 z-30 hidden flex-col gap-2 lg:flex">
        <button onClick={() => go(-1)} aria-label="Previous" className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-card shadow-sm hover:border-signal hover:text-signal"><Icon name="arrow" className="-rotate-90" /></button>
        <button onClick={() => go(1)} aria-label="Next" className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-card shadow-sm hover:border-signal hover:text-signal"><Icon name="arrow" className="rotate-90" /></button>
      </div>

      {open && <DetailSheet o={open} ai={ai.explanations?.[open.id]} onClose={() => setOpen(null)} />}
      {showFilters && (
        <Sheet onClose={() => setShowFilters(false)}>
          <div className="p-6">
            <div className="mb-5 font-display text-3xl">Search & filters</div>
            <div className="mb-4"><SearchBar f={filters} setF={setFilters} homeCanton={profile.canton}  /></div>
            <FilterPanel f={filters} setF={setFilters} />
            <button className="btn-primary mt-6 h-12 w-full" onClick={() => setShowFilters(false)}>Show {applyFilters(ranked, filters, profile.canton).length} opportunities</button>
          </div>
        </Sheet>
      )}
    </div>
  );
}

function Empty({ items, fc, clear }) {
  return (
    <div>
      <div className="font-display text-4xl">{items.length ? 'You’re all caught up.' : 'Nothing here yet.'}</div>
      <p className="mx-auto mt-3 max-w-xs text-ink-soft">
        {items.length ? 'Widen your filters or add more interests to see more.' : 'No opportunities match these filters. Try removing a few.'}
      </p>
      <div className="mt-6 flex justify-center gap-2">
        {fc > 0 && <button className="btn-primary" onClick={clear}>Clear filters</button>}
        <Link href="/settings" className="btn-ghost">Edit interests</Link>
      </div>
    </div>
  );
}

// The two ways to sort the feed.
function SortTabs({ sort, setSort, className = '' }) {
  return (
    <nav aria-label="Sort feed" className={`flex gap-5 ${className}`}>
      {[['foryou', 'For you'], ['deadline', 'Closing soon']].map(([id, label]) => (
        <button key={id} onClick={() => setSort(id)} className={`tab ${sort === id ? 'tab-on' : ''}`} aria-pressed={sort === id}>{label}</button>
      ))}
    </nav>
  );
}
