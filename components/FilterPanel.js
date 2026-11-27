'use client';
import { memo } from 'react';
import { INTERESTS, SCOPES, regionsFor, countryInfo } from '@/lib/constants';
import { useApp } from './AppProvider';
import { SPORT_LIST, sportOf } from '@/lib/sports';
import Icon from '@/components/Icon';
import { TYPE_GROUPS, applyFilters, typeGroup } from '@/lib/matching';

export const DEFAULT_FILTERS = { q: '', canton: '', kind: 'all', categories: [], sports: [], scopes: [], format: 'all', showIneligible: false };

export const activeFilterCount = (f) =>
  (f.q?.trim() ? 1 : 0) + (f.canton ? 1 : 0) + (f.kind !== 'all') + f.categories.length + (f.sports?.length || 0)
  + f.scopes.length + (f.format !== 'all') + (f.showIneligible ? 1 : 0);

/** Search box + canton picker. Searching looks at clubs in every canton. */
export function SearchBar({ f, setF, homeCanton, autoFocus = false }) {
  const { profile } = useApp();
  const country = profile?.country || 'CH';
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 rounded-full border-2 border-line bg-card px-4 py-2.5 focus-within:border-signal">
        <Icon name="search" size={17} className="shrink-0 text-ink-muted" />
        <input type="search" value={f.q} autoFocus={autoFocus} maxLength={80}
          onChange={(e) => setF({ ...f, q: e.target.value })}
          placeholder="Search e.g. football Geneva, robotics…" aria-label="Search opportunities"
          className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-ink-muted" />
        {f.q && <button onClick={() => setF({ ...f, q: '' })} aria-label="Clear search" className="text-ink-muted hover:text-signal"><Icon name="x" size={15} /></button>}
      </label>
      <select value={f.canton} onChange={(e) => setF({ ...f, canton: e.target.value })} aria-label="Canton"
        className="w-full rounded-full border border-line bg-card px-4 py-2 text-sm">
        <option value="">{homeCanton ? `Near me (${homeCanton.replace('UK-', '')}) + nationwide` : 'Near me + nationwide'}</option>
        <option value="all">All of {country === 'GB' ? 'the UK' : 'Switzerland'} — every {countryInfo(country).regionLabel.toLowerCase()}</option>
        {regionsFor(country).map((c) => <option key={c.code} value={c.code}>Only in {c.name}</option>)}
      </select>
    </div>
  );
}

const FILTER_CATS = INTERESTS.filter((i) => ['technology', 'science', 'sports', 'volunteering', 'business', 'arts', 'leadership', 'academic'].includes(i.id));

export default function FilterPanel({ f, setF }) {
  const toggle = (k, v) => {
    const cur = f[k] || [];
    const next = { ...f, [k]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] };
    // Un-picking "Sports" hides the Sport list, so clear any sports chosen there too.
    if (k === 'categories' && v === 'sports' && cur.includes('sports')) next.sports = [];
    setF(next);
  };

  return (
    <div className="space-y-6">
      <Group title="Type">
        <div className="flex flex-wrap gap-1.5">
          {TYPE_GROUPS.map((t) => (
            <button key={t.id} onClick={() => setF({ ...f, kind: f.kind === t.id ? 'all' : t.id })} className={`chip !px-3 !py-1.5 text-[13px] ${f.kind === t.id ? 'chip-on' : ''}`}>{t.label}</button>
          ))}
        </div>
      </Group>
      <Group title="Category">
        <div className="flex flex-wrap gap-1.5">
          {FILTER_CATS.map((c) => {
            const on = f.categories.includes(c.id);
            return (
              <button key={c.id} onClick={() => toggle('categories', c.id)} className={`chip !px-3 !py-1.5 text-[13px] ${on ? 'chip-on' : ''}`}>
                <span className="h-2 w-2 rounded-full" style={{ background: on ? '#fff' : c.hue }} />{c.label}
              </button>
            );
          })}
        </div>
      </Group>
      {f.categories.includes('sports') && (
        <Group title="Sport">
          <div className="flex flex-wrap gap-1.5">
            {SPORT_LIST.map((sp) => (
              <button key={sp.id} onClick={() => toggle('sports', sp.id)} className={`chip !px-3 !py-1.5 text-[13px] ${f.sports?.includes(sp.id) ? 'chip-on' : ''}`}>{sp.label}</button>
            ))}
          </div>
        </Group>
      )}
      <Group title="Reach">
        <div className="flex flex-wrap gap-1.5">
          {SCOPES.filter((s) => s.id !== 'internal').map((s) => (
            <button key={s.id} onClick={() => toggle('scopes', s.id)} className={`chip !px-3 !py-1.5 text-[13px] ${f.scopes.includes(s.id) ? 'chip-on' : ''}`}>{s.label}</button>
          ))}
        </div>
      </Group>
      <Group title="Format">
        <Seg value={f.format} onChange={(v) => setF({ ...f, format: v })} options={[['all', 'Any'], ['online', 'Online'], ['in-person', 'In person']]} />
      </Group>
      <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-line bg-card p-3.5 text-sm">
        <span><span className="font-medium">Include ones I’m not eligible for yet</span><span className="block text-ink-muted">Good for planning ahead</span></span>
        <input type="checkbox" className="h-5 w-5 accent-[#15140F]" checked={f.showIneligible} onChange={(e) => setF({ ...f, showIneligible: e.target.checked })} />
      </label>
      {activeFilterCount(f) > 0 && (
        <button onClick={() => setF(DEFAULT_FILTERS)} className="text-sm font-semibold text-signal">Clear all filters</button>
      )}
    </div>
  );
}

const Group = ({ title, children }) => (<div><div className="eyebrow mb-2.5">{title}</div>{children}</div>);

function Seg({ value, onChange, options }) {
  return (
    <div className="flex rounded-full border border-line bg-card p-1">
      {options.map(([v, l]) => (
        <button key={v} onClick={() => onChange(v)} className={`flex-1 rounded-full py-2 text-sm font-medium transition ${value === v ? 'bg-lapis text-white' : 'text-ink-soft'}`}>{l}</button>
      ))}
    </div>
  );
}

/** Care.com-style removable tokens for every active filter, plus "Clear all". */
export function ActiveFilters({ f, setF, className = '' }) {
  const toks = [];
  if (f.q?.trim()) toks.push([`“${f.q.trim()}”`, { q: '' }]);
  if (f.canton) toks.push([f.canton === 'all' ? 'All cantons' : `Only ${f.canton}`, { canton: '' }]);
  if (f.kind !== 'all') toks.push([f.kind, { kind: 'all' }]);
  for (const c of f.categories) toks.push([INTERESTS.find((i) => i.id === c)?.label || c, { categories: f.categories.filter((x) => x !== c) }]);
  for (const sp of f.sports || []) toks.push([SPORT_LIST.find((x) => x.id === sp)?.label || sp, { sports: f.sports.filter((x) => x !== sp) }]);
  for (const sc of f.scopes) toks.push([SCOPES.find((x) => x.id === sc)?.label || sc, { scopes: f.scopes.filter((x) => x !== sc) }]);
  if (f.format !== 'all') toks.push([f.format, { format: 'all' }]);
  if (f.showIneligible) toks.push(['Incl. not eligible yet', { showIneligible: false }]);
  if (!toks.length) return null;
  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {toks.map(([label, patch]) => (
        <button key={label} onClick={() => setF({ ...f, ...patch })}
          className="inline-flex items-center gap-1 rounded-full bg-soft px-2.5 py-1 text-xs font-semibold text-ink hover:bg-signal-soft">
          {label} <Icon name="x" size={12} strokeWidth={2.4} />
        </button>
      ))}
      <button onClick={() => setF(DEFAULT_FILTERS)} className="ml-1 text-xs font-semibold text-ink-muted underline underline-offset-2 hover:text-ink">Clear all</button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Desktop filter sidebar (Eventbrite / Dribbble / Amplitude pattern on Mobbin):
// a list of checkable rows, each with how many results it would give.
// `items` = the ranked list BEFORE filtering; counts are "faceted": each group
// is counted with every other filter applied, so the numbers are always honest.
// ---------------------------------------------------------------------------
// memo: the feed re-renders on every reel change; the counts only need redoing when filters/items change.
export const SidebarFilters = memo(function SidebarFilters({ f, setF, items, homeCanton = '' }) {
  const count = (patch, test) => applyFilters(items, { ...f, ...patch }, homeCanton).filter(({ o }) => test(o)).length;
  const toggle = (k, v) => {
    const cur = f[k] || [];
    const next = { ...f, [k]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] };
    if (k === 'categories' && v === 'sports' && cur.includes('sports')) next.sports = [];
    setF(next);
  };
  const fc = activeFilterCount(f);

  return (
    <div className="space-y-6 text-sm">
      <div className="flex items-center justify-between">
        <div className="font-display text-xl">Filters</div>
        {fc > 0 && <button onClick={() => setF(DEFAULT_FILTERS)} className="text-xs font-semibold text-signal hover:underline">Clear all ({fc})</button>}
      </div>

      <SideGroup title="Type">
        <Row label="Everything" on={f.kind === 'all'} radio onClick={() => setF({ ...f, kind: 'all' })} n={count({ kind: 'all' }, () => true)} />
        {TYPE_GROUPS.map((t) => {
          const n = count({ kind: 'all' }, (o) => typeGroup(o) === t.id);
          return n > 0 || f.kind === t.id
            ? <Row key={t.id} label={t.label} on={f.kind === t.id} radio onClick={() => setF({ ...f, kind: f.kind === t.id ? 'all' : t.id })} n={n} />
            : null;
        })}
      </SideGroup>

      <SideGroup title="Category">
        {FILTER_CATS.map((c) => (
          <Row key={c.id} label={c.label} dot={c.hue} on={f.categories.includes(c.id)} onClick={() => toggle('categories', c.id)}
            n={count({ categories: [] }, (o) => o.categories.includes(c.id))} />
        ))}
      </SideGroup>

      {f.categories.includes('sports') && (
        <SideGroup title="Sport">
          {SPORT_LIST.map((sp) => {
            const n = count({ sports: [] }, (o) => sportOf(o) === sp.id);
            return n > 0 || f.sports?.includes(sp.id)
              ? <Row key={sp.id} label={sp.label} on={!!f.sports?.includes(sp.id)} onClick={() => toggle('sports', sp.id)} n={n} />
              : null;
          })}
        </SideGroup>
      )}

      <SideGroup title="Reach">
        {SCOPES.filter((s) => s.id !== 'internal').map((s) => (
          <Row key={s.id} label={s.label} on={f.scopes.includes(s.id)} onClick={() => toggle('scopes', s.id)}
            n={count({ scopes: [] }, (o) => o.scope === s.id)} />
        ))}
      </SideGroup>

      <SideGroup title="Format">
        {[['all', 'Any'], ['online', 'Online'], ['in-person', 'In person']].map(([v, l]) => (
          <Row key={v} label={l} radio on={f.format === v} onClick={() => setF({ ...f, format: v })}
            n={count({ format: 'all' }, (o) => v === 'all' || (v === 'online' ? o.format === 'online' : o.format !== 'online'))} />
        ))}
      </SideGroup>

      <label className="flex cursor-pointer items-start gap-3 border-t border-line pt-5">
        <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[#26619C]" checked={f.showIneligible} onChange={(e) => setF({ ...f, showIneligible: e.target.checked })} />
        <span><span className="font-medium">Include ones I’m not eligible for yet</span><span className="block text-xs text-ink-muted">Good for planning ahead</span></span>
      </label>
    </div>
  );
});

const SideGroup = ({ title, children }) => (
  <div className="border-t border-line pt-5">
    <div className="mb-2 font-semibold text-ink">{title}</div>
    <div className="space-y-0.5">{children}</div>
  </div>
);

function Row({ label, on, onClick, n, dot, radio = false }) {
  return (
    <button onClick={onClick} aria-pressed={on}
      className={`group flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition hover:bg-soft ${n === 0 && !on ? 'opacity-50' : ''}`}>
      <span className={`flex h-4 w-4 shrink-0 items-center justify-center border transition ${radio ? 'rounded-full' : 'rounded-[5px]'} ${on ? 'border-lapis bg-lapis text-white' : 'border-ink-muted/40 bg-card'}`}>
        {on && (radio ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : <Icon name="check" size={11} strokeWidth={3} />)}
      </span>
      {dot && <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: dot }} />}
      <span className={`min-w-0 flex-1 truncate ${on ? 'font-semibold text-ink' : 'text-ink-soft group-hover:text-ink'}`}>{label}</span>
      <span className="shrink-0 font-mono text-[11px] text-ink-muted">{n}</span>
    </button>
  );
}
