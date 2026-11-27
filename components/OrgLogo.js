'use client';
import { useState } from 'react';
import { logoCandidates } from '@/lib/logos';

const initials = (org = '') => org.split(/\s+/).filter((w) => /^[\p{L}\d]/u.test(w)).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '•';

/** Organiser's logo in a white tile (same as the iPhone app). Tries each source;
 *  if none work, shows the organiser's initials. `size` in px, or 'fluid' to fill the parent. */
export default function OrgLogo({ o, size = 44, className = '', onClick }) {
  const list = logoCandidates(o);
  const [i, setI] = useState(0);
  const src = list[i];
  const next = () => setI((x) => x + 1);
  const Tag = onClick ? 'button' : 'span';
  const fluid = size === 'fluid';
  return (
    <Tag onClick={onClick} aria-label={onClick ? `About ${o.org}` : undefined}
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5 transition active:scale-90 ${fluid ? 'h-full w-full [container-type:size]' : ''} ${className}`}
      style={fluid ? undefined : { width: size, height: size }} title={o.org}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={src} src={src} alt={`${o.org} logo`} referrerPolicy="no-referrer" loading="lazy"
          onError={next}
          onLoad={(e) => { if (e.currentTarget.naturalWidth < 24) next(); }}
          style={fluid ? { width: '68%', height: '68%' } : { width: size * 0.68, height: size * 0.68 }} className="object-contain" />
      ) : (
        <span aria-hidden="true" className="font-bold tracking-tight text-[#26619C]" style={{ fontSize: fluid ? '34cqh' : size * 0.34 }}>{initials(o.org)}</span>
      )}
    </Tag>
  );
}
