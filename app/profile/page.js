'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/components/AppProvider';
import Nav from '@/components/Nav';
import Icon from '@/components/Icon';
import DetailSheet, { Sheet } from '@/components/DetailSheet';
import { cantonName, countryName, schoolYearsFor, SCHOOLS, SKILLS, TYPES, CV_SECTIONS, interestById } from '@/lib/constants';
import { OPPORTUNITIES } from '@/lib/opportunities';
import { rankFeed } from '@/lib/matching';
import { progressLists } from '@/lib/progress';

export default function Profile() {
  const router = useRouter();
  const app = useApp();
  const { profile, ready, tracks, custom, user, hasSupabase } = app;
  const [gap, setGap] = useState(null);
  const [loadingGap, setLoadingGap] = useState(false);
  const [adding, setAdding] = useState(false);
  const [open, setOpen] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => { if (ready && !profile) router.replace('/onboarding'); }, [ready, profile, router]);
  const { done, active, skillCounts } = useMemo(() => progressLists(tracks, custom), [tracks, custom]);

  const runGap = async () => {
    setLoadingGap(true);
    try {
      const r = await fetch('/api/cv-gap', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ profile, done, active }) });
      setGap(await r.json());
    } catch { setGap(null); }
    setLoadingGap(false);
  };
  // Re-run automatically whenever completed/applied activities change
  const sig = JSON.stringify([done.map((d) => d.id), active.map((a) => a.id), profile?.interests]);
  useEffect(() => { if (profile) runGap(); }, [sig]); // eslint-disable-line react-hooks/exhaustive-deps

  const ranked = useMemo(() => (profile ? rankFeed(OPPORTUNITIES, profile, gap?.gaps || []) : []), [profile, gap]);
  const suggestFor = (dim) => ranked.filter((x) => x.m.eligible && TYPES[x.o.type]?.dim === dim && !tracks[x.o.id]?.status).slice(0, 2);

  if (!ready || !profile) return <div className="min-h-dvh bg-paper" />;

  const school = SCHOOLS.find((s) => s.id === profile.schoolId)?.name || profile.schoolName;
  const country = profile.canton && cantonName(profile.canton).toLowerCase() !== (profile.city || '').trim().toLowerCase() ? `${cantonName(profile.canton)}, ${countryName(profile.country)}` : countryName(profile.country);
  const yearLabel = schoolYearsFor(profile.country).find((y) => y.value === Number(profile.year))?.label;
  const cvBySection = CV_SECTIONS.map((sec) => ({ sec, items: done.filter((d) => TYPES[d.type]?.cv === sec) })).filter((s) => s.items.length);
  const allSkills = Object.entries(skillCounts).sort((a, b) => b[1] - a[1]);

  const cvText = () => [
    profile.name || 'Student', [profile.city, country].filter(Boolean).join(', '), school ? `${school} · ${yearLabel}` : yearLabel, '',
    ...cvBySection.flatMap(({ sec, items }) => [sec.toUpperCase(), ...items.map((i) => `• ${i.title} — ${i.org}${i.reflection ? `\n  ${i.reflection}` : ''}`), '']),
    allSkills.length ? `SKILLS: ${allSkills.map(([s]) => s).join(', ')}` : '',
    profile.interests?.length ? `INTERESTS: ${profile.interests.map((i) => interestById(i)?.label).join(', ')}` : '',
  ].join('\n');

  const copyCV = async () => {
    try { await navigator.clipboard.writeText(cvText()); app.notify('CV copied to clipboard'); } catch { app.notify('Copy not allowed here'); }
  };

  return (
    <div className="min-h-dvh bg-paper pb-28 lg:pb-12">
      <Nav />
      <main className="mx-auto max-w-5xl px-5 pt-8 lg:px-8 lg:pt-28">
        {/* Contra-style profile header: avatar, name, one-liner, stats strip */}
        <div className="no-print rounded-[28px] border border-line bg-card p-6 shadow-card sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-ink text-2xl font-bold text-paper sm:h-20 sm:w-20 sm:text-3xl">
                {(profile.name || '?').trim().charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="font-display text-4xl leading-none sm:text-5xl">{profile.name || 'Your profile'}</h1>
                <p className="mt-2 text-ink-soft">{[profile.city, country].join(', ')} · Age {profile.age} · {yearLabel}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/settings" className="btn-ghost">Edit</Link>
              {hasSupabase && !user && <Link href="/login" className="btn-signal">Create account</Link>}
            </div>
          </div>
          <div className="mt-6 grid grid-cols-4 overflow-hidden rounded-2xl border border-line">
            {[[Object.values(tracks).filter((t) => t.saved).length, 'Saved'], [active.length, 'Applied'], [done.length, 'Done'], [allSkills.length, 'Skills']].map(([n, l], i) => (
              <div key={l} className={`px-3 py-3 text-center ${i ? 'border-l border-line' : ''}`}>
                <div className="text-2xl font-extrabold leading-none">{n}</div>
                <div className="label mt-1.5 !text-[10px]">{l}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {profile.skills.map((sk) => <span key={sk} className="inline-flex items-center gap-1 rounded-full bg-signal-soft px-3 py-1 text-sm font-semibold text-ink"><Icon name="spark" size={12} className="text-signal" /> {sk}</span>)}
          </div>
          <div className="mt-4 text-sm">
            {hasSupabase ? (
              user ? <span className="inline-flex items-center gap-2 text-ok"><Icon name="check" size={14} /> Synced to {user.email} · <button onClick={app.signOut} className="underline">Sign out</button></span>
                : <span className="text-warn">Saved on this device only — create an account to keep it.</span>
            ) : <span className="text-ink-muted">Accounts are off on this server: your data is saved in this browser.</span>}
          </div>
        </div>

        <div className="no-print mt-10 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
          {/* CV gap analysis */}
          <section className="rounded-[28px] border-b-4 border-signal bg-lapis-deep p-6 text-white sm:p-7">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-signal"><Icon name="spark" size={13} strokeWidth={2.2} /> CV gap analysis {gap?.mode === 'ai' && '· AI'}</div>
              <button onClick={runGap} className="text-xs font-semibold text-white/60 hover:text-white">{loadingGap ? 'Analysing…' : 'Refresh'}</button>
            </div>
            {gap ? (
              <>
                <div className="mt-4 flex items-end gap-4">
                  <div className="font-display text-7xl leading-none">{gap.coverage}<span className="text-3xl">%</span></div>
                  <div className="pb-2 text-sm text-white/60">of key CV areas covered</div>
                </div>
                <p className="mt-4 text-[15px] leading-relaxed text-white/85">{gap.summary}</p>
                <div className="mt-5 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                  {gap.dims.map((d) => (
                    <div key={d.id} className={`rounded-xl px-3 py-2 text-xs ${d.status === 'strong' ? 'bg-emerald-400/20 text-emerald-200' : d.status === 'building' ? 'bg-amber-300/15 text-amber-200' : 'bg-white/5 text-white/50'}`}>
                      <div className="font-semibold">{d.label}</div>
                      <div className="opacity-80">{d.status === 'strong' ? `${d.completed} done` : d.status === 'building' ? 'In progress' : 'Gap'}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-4">
                  {gap.gaps.slice(0, 3).map((g) => {
                    const d = gap.dims.find((x) => x.id === g);
                    const sugg = suggestFor(g);
                    return (
                      <div key={g} className="border-t border-white/10 pt-4">
                        <div className="font-display text-2xl">{d.label}</div>
                        <p className="mt-1 text-sm leading-relaxed text-white/75">{gap.advice[g]}</p>
                        {sugg.length > 0 && (
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {sugg.map(({ o }) => (
                              <button key={o.id} onClick={() => setOpen(o)} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/20">
                                {o.title} <Icon name="arrow" size={12} />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : <div className="mt-6 h-40 animate-pulse rounded-2xl bg-white/5" />}
          </section>

          {/* Skills tracker */}
          <section className="rounded-[28px] border border-line bg-card p-6 sm:p-7">
            <div className="label">Skills you’re building</div>
            <div className="mt-4 space-y-3.5">
              {profile.skills.map((s) => {
                const n = skillCounts[s] || 0;
                return (
                  <div key={s}>
                    <div className="flex justify-between text-sm"><span className="font-medium">{s}</span><span className="text-ink-muted">{n ? `${n} ${n === 1 ? 'activity' : 'activities'}` : 'Not yet'}</span></div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-soft">
                      <div className="h-full rounded-full bg-signal transition-all duration-700" style={{ width: `${Math.min(100, n * 34)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            {allSkills.filter(([s]) => !profile.skills.includes(s)).length > 0 && (
              <>
                <div className="eyebrow mt-6">Also gained</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {allSkills.filter(([s]) => !profile.skills.includes(s)).map(([s, n]) => <span key={s} className="rounded-full bg-soft px-3 py-1 text-sm">{s} · {n}</span>)}
                </div>
              </>
            )}
            {done.length === 0 && (
              <div className="mt-6 rounded-2xl border-2 border-dashed border-line p-5 text-center">
                <div className="font-semibold">Add your first activity</div>
                <p className="mt-1 text-sm text-ink-muted">Mark something as completed, or add a club or job you already do.</p>
                <button onClick={() => setAdding(true)} className="btn-ghost mt-3"><Icon name="plus" size={16} /> Add activity</button>
              </div>
            )}
          </section>
        </div>

        {/* CV */}
        <section className="mt-10">
          <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="eyebrow">Auto-built from your completed activities</div>
              <h2 className="font-display text-4xl">Your CV</h2>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setAdding(true)} className="btn-ghost"><Icon name="plus" size={16} /> Add activity</button>
              <button onClick={copyCV} className="btn-ghost"><Icon name="copy" size={16} /> Copy</button>
              <button onClick={() => window.print()} className="btn-primary"><Icon name="print" size={16} /> Print / PDF</button>
            </div>
          </div>

          <article className={`print-area rounded-[28px] bg-card p-7 sm:p-12 ${done.length ? 'border border-line shadow-card' : 'border-2 border-dashed border-line'}`}>
            <header className="border-b border-line pb-6">
              <h3 className="font-display text-5xl leading-none">{profile.name || 'Your name'}</h3>
              <p className="mt-2 text-ink-soft">{[profile.city, country].join(', ')}{school ? ` · ${school}` : ''} · {yearLabel}</p>
            </header>
            {cvBySection.length === 0 ? (
              <p className="py-10 text-center text-ink-muted">Mark opportunities as completed, or add your own activities, and your CV will build itself here.</p>
            ) : cvBySection.map(({ sec, items }) => (
              <div key={sec} className="grid gap-2 border-b border-line py-6 last:border-0 sm:grid-cols-[180px_1fr]">
                <div className="eyebrow pt-1">{sec}</div>
                <div className="space-y-4">
                  {items.map((i) => (
                    <div key={i.id} className="group">
                      <div className="flex items-baseline justify-between gap-3">
                        <div className="font-semibold">{i.title} <span className="font-normal text-ink-muted">— {i.org}</span></div>
                        <div className="flex shrink-0 items-center gap-2 text-sm text-ink-muted">
                          {i.completedAt && new Date(i.completedAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                          {i.custom && <button onClick={() => app.removeCustom(i.id)} className="no-print opacity-0 transition group-hover:opacity-100" aria-label="Remove"><Icon name="trash" size={14} /></button>}
                        </div>
                      </div>
                      {i.reflection && <p className="mt-0.5 text-[15px] text-ink-soft">{i.reflection}</p>}
                      {i.example && <p className="no-print mt-0.5 text-xs text-warn">From an example listing — replace with real activities before sharing.</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {allSkills.length > 0 && (
              <div className="grid gap-2 border-t border-line pt-6 sm:grid-cols-[180px_1fr]">
                <div className="eyebrow pt-1">Skills</div>
                <p>{allSkills.map(([s]) => s).join(' · ')}</p>
              </div>
            )}
          </article>
        </section>

        <div className="no-print mt-12 border-t border-line pt-6 text-sm">
          {confirmReset ? (
            <span className="flex flex-wrap items-center gap-3">Delete your profile and all tracking on this device?
              <button className="font-semibold text-red-600" onClick={() => { app.resetAll(); router.push('/'); }}>Yes, delete</button>
              <button className="text-ink-muted" onClick={() => setConfirmReset(false)}>Cancel</button>
            </span>
          ) : <button className="text-ink-muted hover:text-red-600" onClick={() => setConfirmReset(true)}>Reset all my data</button>}
        </div>
      </main>

      {adding && <AddActivity onClose={() => setAdding(false)} onAdd={(a) => { app.addCustom(a); setAdding(false); app.notify('Added to your CV'); }} />}
      {open && <DetailSheet o={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

function AddActivity({ onClose, onAdd }) {
  const [a, setA] = useState({ title: '', org: '', type: 'Club', reflection: '', skillsGained: [] });
  const toggle = (s) => setA((x) => ({ ...x, skillsGained: x.skillsGained.includes(s) ? x.skillsGained.filter((y) => y !== s) : [...x.skillsGained, s] }));
  return (
    <Sheet onClose={onClose}>
      <form className="p-6 sm:p-7" onSubmit={(e) => { e.preventDefault(); if (a.title && a.org) onAdd(a); }}>
        <div className="font-display text-4xl">Add an activity</div>
        <p className="mt-1 text-sm text-ink-soft">Something you did that isn’t on CVAscender — it counts too.</p>
        <input className="field mt-5" maxLength={100} placeholder="What did you do? e.g. Captain, U16 basketball" value={a.title} onChange={(e) => setA({ ...a, title: e.target.value })} required />
        <input className="field mt-2.5" maxLength={100} placeholder="Organisation or school" value={a.org} onChange={(e) => setA({ ...a, org: e.target.value })} required />
        <select className="field mt-2.5" value={a.type} onChange={(e) => setA({ ...a, type: e.target.value })}>
          {Object.keys(TYPES).map((t) => <option key={t}>{t}</option>)}
        </select>
        <div className="mt-4 text-sm font-semibold">Skills gained</div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {SKILLS.map((s) => <button type="button" key={s} onClick={() => toggle(s)} className={`chip !px-3 !py-1.5 text-[13px] ${a.skillsGained.includes(s) ? 'chip-on' : ''}`}>{s}</button>)}
        </div>
        <textarea className="field mt-4 text-sm" rows={2} maxLength={300} placeholder="One line for your CV (optional)" value={a.reflection} onChange={(e) => setA({ ...a, reflection: e.target.value })} />
        <button className="btn-primary mt-5 w-full" type="submit">Add to CV</button>
      </form>
    </Sheet>
  );
}
