'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Visual from './Visual';
import Icon from './Icon';
import { MatchRing, TrustBadge, scopeLabel } from './OpportunityCard';
import { useApp } from './AppProvider';
import { deadlineDate, deadlineLabel, locationLabel } from '@/lib/opportunities';
import { matchOpportunity, ruleExplanation, analyseCV } from '@/lib/matching';
import { progressLists } from '@/lib/progress';
import { downloadDeadlineIcs } from '@/lib/ics';

export function Sheet({ onClose, children, wide = false }) {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 animate-fade bg-[#060a14]/55 backdrop-blur-[2px]" onClick={onClose} />
      <div className={`relative max-h-[92dvh] w-full animate-sheet overflow-y-auto rounded-t-[28px] bg-card shadow-lift sm:rounded-[28px] ${wide ? 'sm:max-w-2xl' : 'sm:max-w-xl'}`}>
        <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#101828] shadow">
          <Icon name="x" size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}

function CompleteForm({ o, onDone }) {
  const [skills, setSkills] = useState(o.skills);
  const [note, setNote] = useState('');
  const toggle = (s) => setSkills((x) => (x.includes(s) ? x.filter((y) => y !== s) : [...x, s]));
  return (
    <div className="rounded-2xl border border-line p-4">
      <div className="font-semibold">Nice work! What did you gain?</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {o.skills.map((s) => (
          <button key={s} onClick={() => toggle(s)} className={`chip ${skills.includes(s) ? 'chip-on' : ''}`}>{s}</button>
        ))}
      </div>
      <textarea maxLength={300} value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="field mt-3 text-sm"
        placeholder="One line for your CV, e.g. “Led a team of 4 to build a recycling app; placed 2nd of 18 teams.”" />
      <button className="btn-primary mt-3 w-full" onClick={() => onDone({ skillsGained: skills, reflection: note.trim() })}>Add to my CV</button>
    </div>
  );
}

/** Calendar block (Circle / Care.com detail pages). */
export function DateBlock({ o, className = '' }) {
  const d = deadlineDate(o);
  if (!d) return (
    <span className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-soft text-ink-muted ${className}`}>
      <Icon name="clock" size={20} />
    </span>
  );
  return (
    <span className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-signal-soft ${className}`}>
      <span className="text-xl font-extrabold leading-none text-ink">{d.getDate()}</span>
      <span className="label !text-[10px] !text-signal">{d.toLocaleString('en', { month: 'short' })}</span>
    </span>
  );
}

/** Key facts box: deadline, place, ages, cost, commitment, trust. */
export function FactsCard({ o, m }) {
  const facts = [
    ['pin', 'Where', locationLabel(o)],
    ['user', 'Ages', o.minAge && o.maxAge ? `${o.minAge}–${o.maxAge}` : 'See eligibility'],
    ['spark', 'Commitment', o.commitment],
    ['wallet', 'Cost', o.cost],
  ];
  return (
    <div className="rounded-[22px] border border-line bg-card p-5">
      <div className="flex items-center gap-3">
        <DateBlock o={o} />
        <div className="min-w-0">
          <div className="label">{o.deadlineDays != null ? 'Deadline' : 'When'}</div>
          <div className="text-[15px] font-semibold leading-snug">{deadlineDate(o) ? deadlineDate(o).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }) : (o.timing || 'See official site')}</div>
        </div>
      </div>
      <dl className="mt-4 space-y-3 border-t border-line pt-4 text-sm">
        {facts.map(([icon, k, v]) => (
          <div key={k} className="flex items-start gap-3">
            <Icon name={icon} size={17} className="mt-0.5 shrink-0 text-ink-muted" />
            <div className="min-w-0"><dt className="label">{k}</dt><dd className="mt-0.5 font-medium">{v || '—'}</dd></div>
          </div>
        ))}
      </dl>
      <div className={`mt-4 flex items-start gap-2 rounded-xl px-3 py-2.5 text-[13px] font-medium ${m.eligible ? 'badge-ok' : 'badge-warn'}`}>
        <Icon name={m.eligible ? 'check' : 'alert'} size={16} className="mt-px shrink-0" />
        {m.eligible ? 'You look eligible' : m.warnings[0]}
      </div>
    </div>
  );
}

/** Save / mark applied / completed + the main "open official page" action. */
function Actions({ o, t, toggleSave, setStatus, completing, setCompleting }) {
  if (completing) return <CompleteForm o={o} onDone={(extra) => { setStatus(o.id, 'completed', extra); setCompleting(false); }} />;
  return (
    <div className="space-y-2.5">
      {o.url && <a href={o.url} target="_blank" rel="noreferrer" className="btn-signal h-12 w-full">Open official page <Icon name="arrow" size={16} /></a>}
      {!o.url && o.searchUrl && <a href={o.searchUrl} target="_blank" rel="noreferrer" className="btn-ghost h-12 w-full">Search for the club’s website <Icon name="arrow" size={16} /></a>}
      {deadlineDate(o) && o.deadlineDays >= 0 && (
        <button className="btn-ghost h-11 w-full" onClick={() => downloadDeadlineIcs(o, deadlineDate(o))}>
          <Icon name="calendar" size={16} /> Add deadline to my calendar
        </button>
      )}
      <div className="grid grid-cols-3 gap-2">
        <button className={`btn-ghost px-2 ${t.saved ? '!border-lapis !bg-lapis !text-white' : ''}`} onClick={() => toggleSave(o.id)}>
          <Icon name="bookmark" size={16} fill={t.saved ? 'currentColor' : 'none'} /> {t.saved ? 'Saved' : 'Save'}
        </button>
        <button className={`btn-ghost px-2 ${t.status === 'applied' ? '!border-lapis !bg-lapis !text-white' : ''}`} onClick={() => setStatus(o.id, t.status === 'applied' ? null : 'applied')}>
          {t.status === 'applied' ? 'Applied ✓' : 'Applied'}
        </button>
        <button className={`btn-ghost px-2 ${t.status === 'completed' ? '!border-lapis !bg-lapis !text-white' : ''}`} onClick={() => (t.status === 'completed' ? setStatus(o.id, 'applied') : setCompleting(true))}>
          {t.status === 'completed' ? 'Done ✓' : 'Completed'}
        </button>
      </div>
    </div>
  );
}

/**
 * The full detail content. layout:
 *  - 'sheet' : phone bottom sheet (stacked)
 *  - 'panel' : desktop right-hand panel in the feed (stacked, scrolls)
 *  - 'page'  : /o/[id] — two columns with a sticky facts card + sticky bar on phones
 */
export function DetailBody({ o, ai, layout = 'sheet' }) {
  const { profile, tracks, custom, toggleSave, setStatus } = useApp();
  const [completing, setCompleting] = useState(false);
  useEffect(() => setCompleting(false), [o.id]);
  const t = tracks[o.id] || {};
  const { done, active } = progressLists(tracks, custom);
  const gaps = profile ? analyseCV(profile, done, active).gaps : [];
  const m = matchOpportunity(o, profile || {}, gaps);
  const acts = { o, t, toggleSave, setStatus, completing, setCompleting };

  const main = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <span className="tag">{o.type}</span>
        <span className="label">{scopeLabel(o.scope)}</span>
        <TrustBadge o={o} />
      </div>
      <h1 className={`mt-3 font-display leading-[1.02] ${layout === 'page' ? 'text-4xl sm:text-5xl' : 'text-[2rem]'}`}>{o.title}</h1>
      <div className="mt-2 text-[15px] text-ink-muted">{o.org}</div>
      <p className="mt-5 text-[15.5px] leading-relaxed text-ink-soft">{o.details || o.description}</p>
      {o.details && o.details !== o.description && <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{o.description}</p>}

      <section className="mt-7">
        <h3 className="label">Who can take part</h3>
        <p className="mt-1.5 text-[15px] leading-relaxed">{o.eligibility}</p>
      </section>

      <section className="mt-7">
        <h3 className="label">Skills you’ll build</h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {o.skills.map((s) => (
            <span key={s} className={`rounded-full px-3 py-1 text-sm font-medium ${profile?.skills?.includes(s) ? 'bg-lapis text-white' : 'bg-soft text-ink-soft'}`}>{s}</span>
          ))}
        </div>
      </section>

      <section className="mt-7 rounded-[22px] bg-lapis-deep p-5 text-white">
        <div className="flex items-center justify-between">
          <h3 className="label !text-signal">Why this fits you</h3>
          <MatchRing score={m.score} size={44} />
        </div>
        <p className="mt-2 text-[15px] leading-relaxed">{ai || ruleExplanation(m)}</p>
        {m.reasons.length > 0 && (
          <ul className="mt-3 space-y-1 border-t border-white/15 pt-3 text-[13px] opacity-80">
            {m.reasons.map((r) => <li key={r} className="flex gap-2"><Icon name="check" size={14} className="mt-0.5 shrink-0 text-signal" />{r}</li>)}
          </ul>
        )}
      </section>

      <p className="mt-5 text-xs leading-relaxed text-ink-muted">
        {o.verified ? `Source checked: ${o.source}. Dates and rules change every year — confirm on the official page before applying.`
          : 'Not checked yet: a real organisation, but we haven’t confirmed the ages, dates or costs. Check the official website before you apply.'}
      </p>
    </>
  );

  if (layout === 'page') {
    return (
      <>
        <div className="overflow-hidden rounded-[28px]"><Visual o={o} className="h-48 sm:h-72" /></div>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
          <div className="min-w-0">{main}</div>
          <aside className="space-y-4 lg:sticky lg:top-8 lg:self-start">
            <FactsCard o={o} m={m} />
            <div className="hidden lg:block"><Actions {...acts} /></div>
          </aside>
        </div>
        {/* Meetup-style sticky action bar on phones */}
        <div className="fixed inset-x-3 bottom-[84px] z-30 flex items-center gap-2 rounded-full border border-line bg-card/95 p-1.5 pl-5 shadow-lift backdrop-blur lg:hidden">
          <div className="min-w-0 flex-1">
            <div className="label truncate">{deadlineLabel(o)}</div>
            <div className="truncate text-sm font-bold">{o.title}</div>
          </div>
          <button onClick={() => toggleSave(o.id)} aria-label={t.saved ? 'Remove from saved' : 'Save'} aria-pressed={!!t.saved}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${t.saved ? 'border-lapis bg-lapis text-white' : 'border-line'}`}>
            <Icon name="bookmark" size={17} fill={t.saved ? 'currentColor' : 'none'} />
          </button>
          {(o.url || o.searchUrl) && <a href={o.url || o.searchUrl} target="_blank" rel="noreferrer" className="btn-signal h-11 shrink-0 px-5">Apply</a>}
        </div>
        <div className="mt-8 lg:hidden"><Actions {...acts} /></div>
      </>
    );
  }

  return (
    <>
      <div className="relative h-40"><Visual o={o} className="h-full w-full" /></div>
      <div className="p-6 sm:p-7">
        {main}
        <div className="mt-6"><FactsCard o={o} m={m} /></div>
        <div className="mt-4"><Actions {...acts} /></div>
        <Link href={`/o/${o.id}`} className="mt-4 flex items-center justify-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-ink">Open full page <Icon name="arrow" size={14} /></Link>
      </div>
      {/* Always-visible action bar at the bottom of the sheet */}
      {(o.url || o.searchUrl) && (
        <div className="sticky bottom-0 z-10 flex items-center gap-2 border-t border-line bg-card/95 px-4 py-3 backdrop-blur sm:px-6">
          <div className="min-w-0 flex-1">
            <div className="label truncate">{deadlineLabel(o)}</div>
            <div className="truncate text-sm font-semibold">{o.cost || o.org}</div>
          </div>
          <button onClick={() => toggleSave(o.id)} aria-label={t.saved ? 'Remove from saved' : 'Save'} aria-pressed={!!t.saved}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${t.saved ? 'border-lapis bg-lapis text-white' : 'border-line'}`}>
            <Icon name="bookmark" size={17} fill={t.saved ? 'currentColor' : 'none'} />
          </button>
          <a href={o.url || o.searchUrl} target="_blank" rel="noreferrer" className="btn-signal h-11 shrink-0 px-6">Apply <Icon name="arrow" size={15} /></a>
        </div>
      )}
    </>
  );
}

export default function DetailSheet({ o, ai, onClose }) {
  return <Sheet onClose={onClose}><DetailBody o={o} ai={ai} layout="sheet" /></Sheet>;
}
