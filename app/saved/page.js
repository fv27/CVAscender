'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/components/AppProvider';
import Nav from '@/components/Nav';
import Visual from '@/components/Visual';
import Icon from '@/components/Icon';
import DetailSheet, { DateBlock } from '@/components/DetailSheet';
import { TrustBadge } from '@/components/OpportunityCard';
import { deadlineLabel } from '@/lib/opportunities';
import { progressLists } from '@/lib/progress';

const TABS = [
  { id: 'saved', label: 'Saved', empty: 'Bookmark opportunities from your feed and they’ll wait for you here.' },
  { id: 'applied', label: 'Applied', empty: 'When you apply to something, mark it as applied to keep track.' },
  { id: 'completed', label: 'Completed', empty: 'Finished something? Mark it completed and it goes straight onto your CV.' },
];

export default function MyPath() {
  const router = useRouter();
  const { profile, ready, tracks, custom, setStatus, toggleSave } = useApp();
  const [tab, setTab] = useState('saved');
  const [open, setOpen] = useState(null);
  useEffect(() => { if (ready && !profile) router.replace('/onboarding'); }, [ready, profile, router]);

  const { entries } = useMemo(() => progressLists(tracks, custom), [tracks, custom]);
  const lists = {
    saved: entries.filter((e) => e.saved && !e.status).sort((a, b) => (a.o.deadlineDays ?? 999) - (b.o.deadlineDays ?? 999)),
    applied: entries.filter((e) => e.status === 'applied').sort((a, b) => (b.appliedAt || 0) - (a.appliedAt || 0)),
    completed: entries.filter((e) => e.status === 'completed').sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0)),
  };
  const list = lists[tab];

  if (!ready || !profile) return <div className="min-h-dvh bg-paper" />;

  return (
    <div className="min-h-dvh bg-paper pb-28 lg:pb-10">
      <Nav />
      <main className="mx-auto max-w-3xl px-5 pt-8 lg:px-8 lg:pt-28 xl:max-w-5xl">
        <div className="eyebrow">Tracker</div>
        <h1 className="mt-1 font-display text-6xl leading-none">My path</h1>

        <PathOverview lists={lists} onOpen={setOpen} />

        <div className="mt-8 grid grid-cols-3 gap-2">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`rounded-2xl border p-4 text-left transition ${tab === t.id ? 'border-lapis bg-lapis text-white' : 'border-line bg-card hover:border-ink/30'}`}>
              <div className="font-display text-4xl leading-none">{lists[t.id].length}</div>
              <div className="mt-1 text-sm font-medium opacity-80">{t.label}</div>
            </button>
          ))}
        </div>

        <div key={tab} className="mt-6 animate-rise space-y-3">
          {list.length === 0 && (
            <div className="rounded-[24px] border border-dashed border-line p-10 text-center">
              <p className="mx-auto max-w-sm text-ink-soft">{TABS.find((t) => t.id === tab).empty}</p>
              <Link href="/feed" className="btn-primary mt-5">Back to the feed</Link>
            </div>
          )}
          {list.map((e) => (
            <div key={e.o.id} className="flex items-center gap-4 rounded-[22px] border border-line bg-card p-3 pr-4 transition hover:shadow-card">
              <button onClick={() => setOpen(e.o)} className="relative shrink-0">
                <Visual o={e.o} className="h-20 w-20 rounded-2xl" caption={false} />
                {tab !== 'completed' && e.o.deadlineDays != null && e.o.deadlineDays >= 0 && (
                  <span className={`absolute inset-x-1 bottom-1 rounded-full px-1 py-0.5 text-center text-[10px] font-bold shadow ${e.o.deadlineDays <= 7 ? 'bg-signal text-white' : 'bg-white/95 text-[#101828]'}`}>
                    {e.o.deadlineDays === 0 ? 'Today' : `${e.o.deadlineDays} day${e.o.deadlineDays === 1 ? '' : 's'} left`}
                  </span>
                )}
              </button>
              <button onClick={() => setOpen(e.o)} className="min-w-0 flex-1 text-left">
                <div className="label truncate">{e.o.type}</div>
                <div className="truncate text-lg font-bold leading-tight">{e.o.title}</div>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
                  <span className="truncate">{e.o.org}</span>
                  {tab !== 'completed' && <span className={e.o.deadlineDays != null && e.o.deadlineDays <= 7 ? 'font-semibold text-signal' : ''}>· {deadlineLabel(e.o)}</span>}
                  {tab === 'completed' && e.completedAt && <span>· {new Date(e.completedAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</span>}
                </div>
                {tab === 'completed' && e.reflection && <p className="mt-1 line-clamp-1 text-sm italic text-ink-soft">“{e.reflection}”</p>}
              </button>
              <div className="hidden sm:block"><TrustBadge o={e.o} /></div>
              {tab === 'saved' && (
                <div className="flex shrink-0 gap-1.5">
                  <button className="btn-ghost !px-3 !py-2" onClick={() => setStatus(e.o.id, 'applied')}>Applied</button>
                  <button aria-label="Remove" className="btn-ghost !px-3 !py-2" onClick={() => toggleSave(e.o.id)}><Icon name="x" size={16} /></button>
                </div>
              )}
              {tab === 'applied' && <button className="btn-primary shrink-0 !px-4 !py-2" onClick={() => setOpen(e.o)}>Completed?</button>}
            </div>
          ))}
        </div>

        {tab === 'completed' && (
          <Link href="/profile" className="mt-6 flex items-center justify-between rounded-[22px] bg-signal p-5 text-white">
            <span><span className="block font-display text-2xl">See your CV & skills</span><span className="text-sm opacity-85">Built automatically from what you complete</span></span>
            <Icon name="arrow" />
          </Link>
        )}
      </main>
      {open && <DetailSheet o={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

/** Codecademy / Brilliant-style progress + upcoming deadlines (calendar blocks). */
function PathOverview({ lists, onOpen }) {
  const total = lists.saved.length + lists.applied.length + lists.completed.length;
  const steps = [['Saved', lists.saved.length], ['Applied', lists.applied.length], ['Done', lists.completed.length]];
  const upcoming = [...lists.saved, ...lists.applied]
    .filter((e) => e.o.deadlineDays != null && e.o.deadlineDays >= 0)
    .sort((a, b) => a.o.deadlineDays - b.o.deadlineDays).slice(0, 3);
  const goal = lists.applied.length + lists.completed.length > 0;
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.1fr]">
      <section className="min-w-0 rounded-[24px] border border-line bg-card p-5">
        <div className="label">Your progress</div>
        <div className="mt-3 flex items-end gap-2">
          <span className="text-5xl font-extrabold leading-none">{lists.completed.length}</span>
          <span className="pb-1 text-sm text-ink-muted">done of {total || 0} on your path</span>
        </div>
        <div className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-soft">
          {total > 0 && <>
            <div className="bg-lapis" style={{ width: `${(lists.completed.length / total) * 100}%` }} />
            <div className="bg-signal" style={{ width: `${(lists.applied.length / total) * 100}%` }} />
          </>}
        </div>
        <div className="mt-3 flex gap-4 text-xs text-ink-muted">
          {steps.map(([l, n], i) => <span key={l} className="flex items-center gap-1.5"><span className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-line' : i === 1 ? 'bg-signal' : 'bg-lapis'}`} />{l} {n}</span>)}
        </div>
        <div className={`mt-4 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium ${goal ? 'badge-ok' : 'bg-signal-soft text-ink'}`}>
          <Icon name={goal ? 'check' : 'spark'} size={16} className={goal ? '' : 'text-signal'} />
          {goal ? 'Goal reached: you’ve applied to something. Keep going!' : 'Goal: apply to one thing this week.'}
        </div>
      </section>
      <section className="min-w-0 rounded-[24px] border border-line bg-card p-5">
        <div className="label">Next deadlines</div>
        {upcoming.length === 0 ? (
          <div className="mt-3 rounded-2xl border-2 border-dashed border-line p-5 text-center text-sm text-ink-muted">
            Save opportunities with a deadline and they’ll show up here.
          </div>
        ) : (
          <ul className="mt-3 space-y-2">
            {upcoming.map((e) => (
              <li key={e.o.id}>
                <button onClick={() => onOpen(e.o)} className="flex w-full items-center gap-3 rounded-2xl p-1.5 text-left hover:bg-soft">
                  <DateBlock o={e.o} className="!h-12 !w-12" />
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{e.o.title}</span>
                    <span className={`text-xs ${e.o.deadlineDays <= 7 ? 'font-semibold text-signal' : 'text-ink-muted'}`}>{deadlineLabel(e.o)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
