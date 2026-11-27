'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/components/AppProvider';
import { Logo } from '@/components/Nav';
import Icon from '@/components/Icon';
import { profileSchema, firstError } from '@/lib/schemas';
import { COUNTRIES, countryInfo, regionsFor, schoolYearsFor, INTERESTS, SKILLS } from '@/lib/constants';
import { UK_TOWNS_BY_REGION } from '@/lib/uk';
import { TOWNS_BY_CANTON } from '@/lib/batch10';

const HAND_HINTS = { GE: ['Geneva', 'Carouge', 'Vernier'], VD: ['Lausanne', 'Nyon', 'Morges', 'Yverdon'], ZH: ['Zurich', 'Winterthur'], BE: ['Bern', 'Biel/Bienne', 'Thun'], BS: ['Basel'], BL: ['Liestal'], TI: ['Lugano', 'Bellinzona'], LU: ['Lucerne'], SG: ['St. Gallen'], FR: ['Fribourg'], NE: ['Neuchâtel'], VS: ['Sion'] };
// Town suggestions: the hand-picked ones first, then towns with local listings (lib/batch10.js).
const CITY_HINTS = {
  ...Object.fromEntries(Object.keys(TOWNS_BY_CANTON).map((c) => [c, [...new Set([...(HAND_HINTS[c] || []), ...TOWNS_BY_CANTON[c]])].slice(0, 8)])),
  ...Object.fromEntries(Object.entries(UK_TOWNS_BY_REGION).map(([r, t]) => [r, t.slice(0, 8)])),
};
// Recommendations depend only on where you live — not on your school — so most
// school clubs (often behind school logins) aren't needed.
const STEPS = ['Canton', 'You', 'Interests', 'Skills'];

export default function Onboarding() {
  const router = useRouter();
  const { profile, ready, saveProfile, notify } = useApp();
  const [step, setStep] = useState(0);
  // /onboarding?edit=1&step=3 — opened from Settings to change earlier answers.
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (!sp.get('edit')) return;
    setEdit(true);
    const s = Number(sp.get('step'));
    if (Number.isInteger(s) && s >= 0 && s < STEPS.length) setStep(s);
  }, []);
  const [p, setP] = useState({ name: '', country: 'CH', canton: '', city: '', schoolId: '', schoolName: '', age: '', year: '', interests: [], skills: [] });

  useEffect(() => { if (ready && profile) setP((x) => ({ ...x, ...profile })); }, [ready, profile]);

  const set = (k, v) => setP((x) => ({ ...x, [k]: v }));
  const toggle = (k, v) => setP((x) => ({ ...x, [k]: x[k].includes(v) ? x[k].filter((y) => y !== v) : [...x[k], v] }));
  const valid = [
    p.canton && p.city.trim().length > 1,
    Number(p.age) >= 10 && Number(p.age) <= 25 && p.year,
    p.interests.length > 0,
    p.skills.length > 0,
  ][step];

  const allValid = p.canton && p.city.trim().length > 1 && Number(p.age) >= 10 && Number(p.age) <= 25 && p.year && p.interests.length > 0 && p.skills.length > 0;

  const [error, setError] = useState('');
  const save = () => {
    const r = profileSchema.safeParse({ ...p, schoolId: '', schoolName: '', createdAt: profile?.createdAt || Date.now() });
    if (!r.success) return setError(firstError(r));
    saveProfile(r.data);
    if (edit) { notify('Settings saved'); router.push('/settings'); } else router.push('/feed');
  };
  const next = () => {
    setError('');
    if (step < STEPS.length - 1) return setStep(step + 1);
    save();
  };

  return (
    <main className="grain flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-2xl items-center justify-between px-6 py-6">
        <Logo />
        {edit
          ? <Link href="/settings" className="mr-12 text-sm font-semibold text-ink-muted hover:text-signal sm:mr-14 lg:mr-0">Cancel</Link>
          : <span className="mr-12 font-mono text-xs text-ink-muted sm:mr-14 lg:mr-0">{step + 1} / {STEPS.length}</span>}
      </header>

      <div className="mx-auto w-full max-w-2xl px-6">
        <div className="flex gap-1.5">
          {STEPS.map((s, i) => <div key={s} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= step ? 'bg-signal' : 'bg-line'}`} />)}
        </div>
        {edit && (
          <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Jump to a section">
            {STEPS.map((s, i) => (
              <button key={s} onClick={() => setStep(i)} className={`chip !px-3 !py-1 text-[12px] ${i === step ? 'chip-on' : ''}`}>{s}</button>
            ))}
          </div>
        )}
      </div>

      <section key={step} className="mx-auto w-full max-w-2xl flex-1 animate-rise px-6 pb-32 pt-10">
        {step === 0 && (
          <>
            <H title="Where do you live?" sub={`CVAscender recommends opportunities in ${COUNTRIES.map((c) => c.name).join(' and ')}. Your ${countryInfo(p.country).regionLabel.toLowerCase()} unlocks local programmes.`} />
            {COUNTRIES.length > 1 && <Label>Country</Label>}
            <div className={`flex flex-wrap gap-2 ${COUNTRIES.length > 1 ? '' : 'hidden'}`}>
              {COUNTRIES.map((c) => (
                <button key={c.code} onClick={() => setP((x) => ({ ...x, country: c.code, canton: '', city: '', year: '' }))} className={`chip ${p.country === c.code ? 'chip-on' : ''}`}>
                  {c.code === 'CH' ? '🇨🇭' : '🇬🇧'} {c.name}
                </button>
              ))}
            </div>
            <Label>{countryInfo(p.country).regionLabel}</Label>
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5">
              {regionsFor(p.country).map((c) => (
                <button key={c.code} onClick={() => set('canton', c.code)}
                  className={`rounded-xl border px-2 py-2 text-left text-[13px] transition ${p.canton === c.code ? 'border-lapis bg-lapis text-white' : 'border-line bg-card text-ink-soft hover:border-lapis/40'}`}>
                  <span className="block font-mono text-[11px] opacity-70">{c.code.replace('UK-', '')}</span>
                  <span className="block truncate font-medium">{c.name}</span>
                </button>
              ))}
            </div>
            <Label>City or town</Label>
            <input className="field" value={p.city} maxLength={60} onChange={(e) => set('city', e.target.value)} placeholder={`e.g. ${countryInfo(p.country).example}`} />
            {CITY_HINTS[p.canton] && (
              <div className="mt-3 flex flex-wrap gap-3">
                {CITY_HINTS[p.canton].map((c) => <button key={c} onClick={() => set('city', c)} className="text-sm text-ink-muted underline-offset-4 hover:text-lapis hover:underline">{c}</button>)}
              </div>
            )}
          </>
        )}

        {step === 1 && (
          <>
            <H title="A little about you" sub="Used to check eligibility — many programmes have age or year limits." />
            <Label>First name <span className="text-ink-muted">(optional)</span></Label>
            <input className="field" maxLength={40} value={p.name} onChange={(e) => set('name', e.target.value)} placeholder="So we can say hi" />
            <Label>Age</Label>
            <input className="field max-w-[140px]" type="number" inputMode="numeric" min={10} max={25} value={p.age} onChange={(e) => set('age', e.target.value)} placeholder="16" />
            <Label>School year</Label>
            <div className="flex flex-wrap gap-2">
              {schoolYearsFor(p.country).map((y) => <button key={y.value} onClick={() => set('year', y.value)} className={`chip ${Number(p.year) === y.value ? 'chip-on' : ''}`}>{y.label}</button>)}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <H title="What are you into?" sub="Pick as many as you like. This shapes your feed the most." />
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {INTERESTS.map((i) => {
                const on = p.interests.includes(i.id);
                return (
                  <button key={i.id} onClick={() => toggle('interests', i.id)} aria-pressed={on}
                    className={`relative h-24 overflow-hidden rounded-2xl border p-4 text-left font-medium transition active:scale-[.98] ${on ? 'border-transparent text-white' : 'border-line bg-card hover:border-lapis/40'}`}
                    style={on ? { background: i.hue } : {}}>
                    <span className="absolute -right-4 -top-4 h-16 w-16 rounded-full" style={{ background: on ? 'rgba(255,255,255,.18)' : i.hue + '22' }} />
                    <span className="absolute bottom-3 left-4">{i.label}</span>
                    {on && <Icon name="check" className="absolute right-3 top-3" />}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <H title="Which skills do you want to build?" sub="We’ll favour opportunities that develop these — and track them as you complete things." />
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((s) => {
                const on = p.skills.includes(s);
                return <button key={s} onClick={() => toggle('skills', s)} aria-pressed={on} className={`chip ${on ? 'chip-on' : ''}`}>{on && <Icon name="check" size={14} />}{s}</button>;
              })}
            </div>
          </>
        )}
      </section>

      <footer className="fixed inset-x-0 bottom-0 border-t border-line bg-paper/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-6 py-4">
          {step > 0 && <button className="btn-ghost h-[52px] w-[52px] !px-0" aria-label="Back" onClick={() => setStep(step - 1)}><Icon name="back" /></button>}
          {error && <span role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</span>}
          {edit ? (
            <>
              {step < STEPS.length - 1 && <button className="btn-ghost ml-auto h-12 px-5" disabled={!valid} onClick={next}>Next</button>}
              <button className={`btn-primary h-12 px-7 ${step === STEPS.length - 1 ? 'ml-auto' : ''}`} disabled={!allValid} onClick={save}>
                Save changes <Icon name="check" size={16} />
              </button>
            </>
          ) : (
            <button className="btn h-[52px] flex-1 bg-lapis text-base text-white hover:brightness-110" disabled={!valid} onClick={next}>
              {step === STEPS.length - 1 ? 'Show my feed' : 'Continue'}
              {step === 2 && p.interests.length > 0 && ` (${p.interests.length})`}
              {step === 3 && p.skills.length > 0 && ` (${p.skills.length})`}
            </button>
          )}
        </div>
      </footer>
    </main>
  );
}

const H = ({ title, sub }) => (
  <div className="mb-8">
    <h1 className="font-display text-5xl leading-[1] tracking-[-.01em] sm:text-6xl">{title}</h1>
    <p className="mt-3 max-w-lg text-ink-soft">{sub}</p>
  </div>
);
const Label = ({ children }) => <div className="mb-2.5 mt-7 text-sm font-semibold">{children}</div>;
