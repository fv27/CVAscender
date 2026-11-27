'use client';
// Explore — one big search bar in the middle, and recommendations underneath
// that keep loading as you scroll (no tabs, chips or type labels).
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/components/AppProvider';
import Nav from '@/components/Nav';
import Visual from '@/components/Visual';
import Icon from '@/components/Icon';
import DetailSheet from '@/components/DetailSheet';
import { OPPORTUNITIES, deadlineDate, locationLabel } from '@/lib/opportunities';
import { rankFeed, matchesQuery, TYPE_GROUPS, typeGroup } from '@/lib/matching';
import { HEADLINES, fillHeadline } from '@/lib/headlines';

const PAGE = 12;
const SUGGESTIONS = ['Research', 'Essay competitions', 'Hackathon', 'Football', 'Summer at university', 'Volunteering', 'Robotics', 'Startup'];
const GROUP_ICON = { research: '🔬', essay: '✍️', olympiad: '🏅', competition: '🏆', university: '🎓', camp: '⛺', club: '⚽', civic: '🤝', work: '💼', money: '💰' };
const RECENT_KEY = 'cva-recent-searches';
const readRecent = () => { try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]').slice(0, 6); } catch { return []; } };
const writeRecent = (r) => { try { localStorage.setItem(RECENT_KEY, JSON.stringify(r)); } catch {} };
const SUGGEST_QUERY = { 'Essay competitions': 'essay', 'Summer at university': 'university', Startup: 'startup' };

export default function Explore() {
  const router = useRouter();
  const { profile, ready, tracks, toggleSave } = useApp();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(null);
  const [shown, setShown] = useState(PAGE);
  const [kind, setKind] = useState('');
  const [recent, setRecent] = useState([]);
  useEffect(() => { setRecent(readRecent()); }, []);
  // Remember a search once the person stops typing for a moment.
  useEffect(() => {
    const t = q.trim();
    if (t.length < 3) return;
    const id = setTimeout(() => setRecent((r) => { const n = [t, ...r.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, 6); writeRecent(n); return n; }), 1200);
    return () => clearTimeout(id);
  }, [q]);
  const clearRecent = () => { setRecent([]); writeRecent([]); };
  const sentinel = useRef(null);
  // A different headline on every visit (picked after load so server and browser agree).
  const [headline, setHeadline] = useState(HEADLINES[0]);
  useEffect(() => { setHeadline(HEADLINES[Math.floor(Math.random() * HEADLINES.length)]); }, []);

  useEffect(() => { if (ready && !profile) router.replace('/onboarding'); }, [ready, profile, router]);
  useEffect(() => { const s = new URLSearchParams(window.location.search).get('q'); if (s) setQ(s.slice(0, 80)); }, []);

  const query = q.trim();
  const searching = !!(query || kind);
  const ranked = useMemo(() => (profile ? rankFeed(OPPORTUNITIES, profile, [], { anyCanton: searching }) : []), [profile, searching]);
  const groupCounts = useMemo(() => { const c = {}; for (const o of OPPORTUNITIES) { const g = typeGroup(o); c[g] = (c[g] || 0) + 1; } return c; }, []);
  // Recommendations: things you're eligible for, best match first. Searching
  // looks through everything (all cantons, incl. not-yet-eligible).
  const list = useMemo(
    () => (searching ? ranked.filter(({ o }) => (!kind || typeGroup(o) === kind) && (!query || matchesQuery(o, query))) : ranked.filter((x) => x.m.eligible)),
    [ranked, query, kind, searching],
  );

  useEffect(() => { setShown(PAGE); }, [query, kind]);

  // Load more as you scroll down.
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) setShown((n) => Math.min(n + PAGE, list.length)); }, { rootMargin: '600px' });
    io.observe(el);
    return () => io.disconnect();
  }, [list.length]);

  if (!ready || !profile) return <div className="min-h-dvh bg-paper" />;

  return (
    <div className="min-h-dvh bg-paper pb-28 lg:pb-12">
      <Nav />
      <main className="lg:pt-16">
        {/* Big search in the middle */}
        <section className={`mx-auto max-w-2xl px-5 text-center transition-all duration-500 ${searching ? 'pb-6 pt-8' : 'pb-10 pt-[14vh] lg:pt-[18vh]'}`}>
          {!searching && (
            <h1 className="font-display text-[2.6rem] leading-[1.05] sm:text-6xl">
              {fillHeadline(headline, profile.name).split('*').map((part, i) => (i % 2 ? <span key={i} className="text-signal">{part}</span> : part))}
            </h1>
          )}
          <label className={`mx-auto flex items-center gap-3 rounded-full border-2 border-line bg-card px-5 shadow-[0_10px_40px_rgba(16,24,40,.08)] transition focus-within:border-signal ${searching ? 'h-14' : 'mt-7 h-16'}`}>
            <Icon name="search" size={22} className="shrink-0 text-ink-muted" />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} maxLength={80} autoFocus={false}
              placeholder="Search programmes, clubs, towns…" aria-label="Search everything"
              className="w-full min-w-0 bg-transparent text-[17px] outline-none placeholder:text-ink-muted" />
            {q && <button onClick={() => setQ('')} aria-label="Clear search" className="text-ink-muted hover:text-ink"><Icon name="x" size={18} /></button>}
          </label>
          {!searching && recent.length > 0 && (
            <div className="mt-5 text-left">
              <div className="flex items-center justify-between px-1">
                <span className="label">Recent searches</span>
                <button onClick={clearRecent} className="text-xs font-semibold text-ink-muted hover:text-ink">Clear</button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {recent.map((r) => (
                  <button key={r} onClick={() => setQ(r)} className="flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-sm text-ink-soft hover:border-ink/30">
                    <Icon name="clock" size={13} /> {r}
                  </button>
                ))}
              </div>
            </div>
          )}
          {!searching && (
            <div className="mt-6 text-left">
              <div className="label px-1">Browse by type</div>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {TYPE_GROUPS.filter((g) => groupCounts[g.id]).map((g) => (
                  <button key={g.id} onClick={() => setKind(g.id)}
                    className="flex items-center gap-2.5 rounded-2xl border border-line bg-card p-3 text-left transition hover:-translate-y-0.5 hover:border-signal hover:shadow-card">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-soft text-lg">{GROUP_ICON[g.id] || '✨'}</span>
                    <span className="min-w-0"><span className="line-clamp-2 text-sm font-semibold leading-tight">{g.label}</span><span className="text-xs text-ink-muted">{groupCounts[g.id]}</span></span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {!searching && (
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => setQ(SUGGEST_QUERY[s] || s.toLowerCase())}
                  className="rounded-full bg-soft px-3.5 py-1.5 text-sm font-medium text-ink-soft transition hover:bg-signal-soft hover:text-ink">{s}</button>
              ))}
            </div>
          )}
          {!searching && (
            <div className="mt-12 flex flex-col items-center gap-1 text-xs font-medium text-ink-muted">
              Recommended for you
              <span className="animate-bounce"><Icon name="arrow" size={16} className="rotate-90" /></span>
            </div>
          )}
        </section>

        {/* Recommendations / results */}
        <section aria-label={searching ? 'Search results' : 'Recommendations'} className="mx-auto max-w-5xl px-4 lg:px-8">
          {searching && (
            <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
              {kind && <button onClick={() => setKind('')} className="flex items-center gap-1 rounded-full bg-ink px-3 py-1 font-semibold text-paper">{GROUP_ICON[kind]} {TYPE_GROUPS.find((g) => g.id === kind)?.label} <Icon name="x" size={13} /></button>}
              <span>{list.length} result{list.length === 1 ? '' : 's'}{query ? ` for “${query}”` : ''}</span>
            </div>
          )}
          {searching && list.length === 0 && (
            <div className="py-16 text-center">
              <div className="font-display text-3xl">No matches</div>
              <p className="mt-2 text-ink-soft">Try another word or a town name.</p>
            </div>
          )}
          <div className="columns-2 gap-3 sm:gap-4 lg:columns-3">
            {list.slice(0, shown).map(({ o, m }, i) => (
              <Tile key={o.id} o={o} m={m} tall={i % 3 === 0} saved={!!tracks[o.id]?.saved} onOpen={() => setOpen(o)} onSave={() => toggleSave(o.id)} />
            ))}
          </div>
          <div ref={sentinel} className="h-10" />
          {shown < list.length && <div className="py-6 text-center text-sm text-ink-muted">Loading more…</div>}
          {shown >= list.length && list.length > 0 && <div className="py-8 text-center text-sm text-ink-muted">That’s everything for now.</div>}
        </section>
      </main>
      {open && <DetailSheet o={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

/** Picture tile: just the image, title and where/when — no type labels. */
function Tile({ o, m, tall, saved, onOpen, onSave }) {
  const d = deadlineDate(o);
  return (
    <div className={`group relative mb-3 break-inside-avoid overflow-hidden rounded-[22px] bg-soft animate-rise sm:mb-4 ${tall ? 'aspect-[3/4.4]' : 'aspect-[4/5]'}`}>
      <button onClick={onOpen} className="absolute inset-0 text-left" aria-label={o.title}>
        <div className="absolute inset-0 transition duration-700 group-hover:scale-105"><Visual o={o} className="h-full w-full" caption={false} /></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-3.5 text-white sm:p-4">
          {m && !m.eligible && <div className="mb-1.5 inline-block rounded-full bg-red-500/90 px-2 py-0.5 text-[10px] font-semibold">Not eligible yet{m.warnings[0] ? ` · ${m.warnings[0]}` : ''}</div>}
          <div className="line-clamp-3 text-[15px] font-bold leading-snug sm:text-[17px]">{o.title}</div>
          <div className="mt-1 truncate text-[12px] text-white/80">
            {locationLabel(o)}{d && o.deadlineDays >= 0 ? ` · by ${d.getDate()} ${d.toLocaleString('en', { month: 'short' })}` : ''}
          </div>
        </div>
      </button>
      <button onClick={onSave} aria-label={saved ? 'Saved' : 'Save'} aria-pressed={saved}
        className={`absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition active:scale-90 ${saved ? 'bg-white text-signal' : 'bg-black/30 text-white hover:bg-black/50'}`}>
        <Icon name="bookmark" size={16} fill={saved ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
}
