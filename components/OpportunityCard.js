'use client';
import { useRef, useState } from 'react';
import Visual from './Visual';
import OrgLogo from './OrgLogo';
import Icon from './Icon';
import { interestById, SCOPES } from '@/lib/constants';
import { deadlineLabel, locationLabel } from '@/lib/opportunities';
import { ruleExplanation } from '@/lib/matching';
import { sportOf, sportLabel } from '@/lib/sports';

export function MatchRing({ score, size = 52, dark = false }) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }} title={`${score}% match`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill={dark ? '#101828' : 'rgba(255,255,255,.95)'} stroke={dark ? '#344054' : '#E2E7F0'} strokeWidth="3" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#FF7518" strokeWidth="3" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} style={{ transition: 'stroke-dashoffset .8s ease' }} />
      </svg>
      <div className={`absolute inset-0 flex flex-col items-center justify-center leading-none ${dark ? 'text-white' : 'text-[#101828]'}`}>
        <span className="text-[15px] font-semibold">{score}</span>
        <span className="text-[8px] font-medium uppercase tracking-wider opacity-60">match</span>
      </div>
    </div>
  );
}

export function TrustBadge({ o, className = '', solid = false }) {
  if (solid) {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold backdrop-blur ${o.verified ? 'text-emerald-800' : 'text-amber-800'} ${className}`}>
        {o.verified ? <><Icon name="shield" size={12} /> Real · source checked</> : 'Not checked yet'}
      </span>
    );
  }
  return o.verified ? (
    <span className={`inline-flex items-center gap-1 rounded-full badge-ok px-2.5 py-1 text-[11px] font-semibold ${className}`}>
      <Icon name="shield" size={12} /> Real · source checked
    </span>
  ) : (
    <span className={`inline-flex items-center gap-1 rounded-full badge-warn px-2.5 py-1 text-[11px] font-semibold ${className}`}>
      {o.example ? "Example listing" : "Not checked yet"}
    </span>
  );
}

export const scopeLabel = (s) => SCOPES.find((x) => x.id === s)?.label;

/**
 * TikTok-style reel: the picture fills the card, only the essentials sit on
 * top (tags, title, short description), and the actions run down the right.
 * Tap the picture for every detail.
 */
export default function OpportunityCard({ o, m, track = {}, onOpen, onSave, onApply, notify, onTag, active = false }) {
  const [burst, setBurst] = useState(0);
  const sp = sportOf(o);
  const tags = o.categories.map((c) => interestById(c)).filter(Boolean);

  // Single tap opens details; double tap saves (like TikTok's double-tap like).
  const tapTimer = useRef(null);
  const tap = () => {
    if (tapTimer.current) {
      clearTimeout(tapTimer.current); tapTimer.current = null;
      if (!track.saved) onSave();
      setBurst(Date.now());
      return;
    }
    tapTimer.current = setTimeout(() => { tapTimer.current = null; onOpen(); }, 260);
  };
  const share = async () => {
    const url = `${location.origin}/o/${o.id}`;
    try {
      if (navigator.share) await navigator.share({ title: o.title, url });
      else { await navigator.clipboard.writeText(url); notify?.('Link copied'); }
    } catch {}
  };

  return (
    <article className="relative h-full w-full overflow-hidden rounded-[28px] bg-ink shadow-card">
      <button onClick={tap} aria-label={`Open details: ${o.title}`} className="absolute inset-0 block cursor-pointer text-left">
        <Visual o={o} className="h-full w-full" active={active} credit />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />
      </button>

      {burst > 0 && (
        <div key={burst} className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <Icon name="bookmark" size={96} fill="#fff" className="animate-pop text-white drop-shadow-xl" />
        </div>
      )}

      {/* Right action rail */}
      <div className="absolute bottom-6 right-3 flex flex-col items-center gap-4 text-white">
        <OrgLogo o={o} size={46} onClick={onOpen} />
        <MatchRing score={m.score} size={48} />
        <RailButton label={track.saved ? 'Saved' : 'Save'} onClick={onSave} active={track.saved} pressed={!!track.saved}>
          <Icon name="bookmark" size={22} fill={track.saved ? 'currentColor' : 'none'} />
        </RailButton>
        <RailButton label="Share" onClick={share}><Icon name="share" size={21} /></RailButton>
        <button onClick={onApply} className="flex flex-col items-center gap-1 text-[11px] font-semibold">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-signal shadow-lg transition active:scale-90">
            <Icon name={track.status ? 'check' : 'arrow'} size={22} />
          </span>
          {track.status === 'applied' ? 'Applied' : track.status === 'completed' ? 'Done' : 'Apply'}
        </button>
      </div>

      {/* Bottom-left: tags, title, short description */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-[72px] p-5 text-white">
        <div className="pointer-events-auto flex flex-wrap gap-1.5">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#101828]">{scopeLabel(o.scope)}</span>
          {tags.map((t) => (
            <Tag key={t.id} onClick={onTag && (() => onTag({ categories: [t.id] }, t.label))}>
              <span className="h-2 w-2 rounded-full" style={{ background: t.hue }} />{t.label}
            </Tag>
          ))}
          {sp && sp !== 'other' && <Tag onClick={onTag && (() => onTag({ categories: ['sports'], sports: [sp] }, sportLabel(sp)))}>{sportLabel(sp)}</Tag>}
          {!o.verified && <span className="rounded-full bg-amber-300/90 px-2.5 py-1 text-[11px] font-semibold text-amber-950">Not checked yet</span>}
          {!m.eligible && <span className="rounded-full bg-red-500/90 px-2.5 py-1 text-[11px] font-semibold text-white" title={m.warnings.join(' · ')}>Not eligible yet{m.warnings[0] ? ` · ${m.warnings[0]}` : ''}</span>}
        </div>
        <h2 className="mt-3 font-display text-[1.7rem] leading-[1.08] line-clamp-3 sm:text-[1.9rem]">{o.title}</h2>
        <p className="mt-2 text-[14.5px] leading-snug text-white/85 line-clamp-2">{o.description}</p>
      </div>
    </article>
  );
}

/** Every category that applies (Sports, Business…), plus the sport if there is one. */
export function CategoryTags({ o, className = '', bare = false, onTag }) {
  const sp = sportOf(o);
  const tags = o.categories.map((c) => interestById(c)).filter(Boolean);
  const Wrap = bare ? 'span' : 'div';
  return (
    <Wrap className={bare ? 'contents' : `flex flex-wrap gap-1.5 ${className}`} aria-label="Tags">
      {tags.map((t) => (
        <Tag key={t.id} onClick={onTag && (() => onTag({ categories: [t.id] }, t.label))}>
          <span className="h-2 w-2 rounded-full" style={{ background: t.hue }} />{t.label}
        </Tag>
      ))}
      {sp && sp !== 'other' && (
        <Tag onClick={onTag && (() => onTag({ categories: ['sports'], sports: [sp] }, sportLabel(sp)))}>{sportLabel(sp)}</Tag>
      )}
    </Wrap>
  );
}

// A tag is a button when tapping it can filter the feed.
function Tag({ onClick, children }) {
  const cls = 'inline-flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur';
  return onClick
    ? <button onClick={onClick} title="Show more like this" className={`${cls} transition hover:bg-black/60 active:scale-95`}>{children}</button>
    : <span className={cls}>{children}</span>;
}

function RailButton({ label, onClick, children, active = false, pressed }) {
  return (
    <button onClick={onClick} aria-label={label} aria-pressed={pressed} className="flex flex-col items-center gap-1 text-[11px] font-semibold">
      <span className={`flex h-12 w-12 items-center justify-center rounded-full backdrop-blur transition active:scale-90 ${active ? 'bg-lapis' : 'bg-white/15'}`}>
        {children}
      </span>
      {label}
    </button>
  );
}
