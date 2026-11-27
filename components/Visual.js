'use client';
// Poster for each opportunity: generative art coloured by the main category,
// with the organiser's logo big in the middle (same look as the iPhone app).
// Photos are switched off (USE_PHOTOS) — set it to true to bring them back.
import { useState } from 'react';
import { interestById } from '@/lib/constants';
import { imageFor } from '@/lib/images';
import { hostOf } from '@/lib/logos';
import { isClub } from '@/lib/clubMedia';
import OrgLogo from './OrgLogo';

function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return Math.abs(h);
}

const USE_PHOTOS = false;

export function photoSources(o) {
  const list = [];
  if (!USE_PHOTOS) return list;
  const host = hostOf(o);
  const credit = host ? `Photo: ${host.replace(/^www\./, '')}` : 'Photo: club website';
  // Named clubs: no photos at all — their logo is the image (no copying club photos).
  if (isClub(o)) return list;
  if (host && o.image !== false) list.push({ src: `/api/og/${encodeURIComponent(o.id)}`, credit, real: true });
  const stock = imageFor(o);
  if (stock) list.push({ src: stock, credit: 'Illustrative photo', real: false });
  return list;
}

export default function Visual({ o, className = '', caption = true, photo = true, credit = false, active = false, serif = false }) {
  const h = hash(o.id);
  const hue = interestById(o.categories[0])?.hue || '#15140F';
  const hue2 = interestById(o.categories[1])?.hue || hue;
  const variant = h % 4;
  const rot = (h % 7) * 15;

  const sources = photo ? photoSources(o) : [];
  const [i, setI] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const cur = sources[i];
  const next = () => { setLoaded(false); setI((x) => x + 1); };

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: hue }}>
      <div className="absolute inset-0" style={{ background: `radial-gradient(120% 90% at ${20 + (h % 60)}% 0%, ${hue2}cc 0%, transparent 60%)` }} />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke="#fff" strokeOpacity=".22" strokeWidth="1.5" transform={`rotate(${rot} 300 120)`}>
          {variant === 0 && [40, 80, 120, 160, 200, 240].map((r) => <circle key={r} cx="300" cy="90" r={r} />)}
          {variant === 1 && Array.from({ length: 14 }, (_, k) => <line key={k} x1={-100 + k * 40} y1="-50" x2={100 + k * 40} y2="350" />)}
          {variant === 2 && Array.from({ length: 8 }, (_, k) => <rect key={k} x={260 - k * 22} y={60 - k * 12} width={60 + k * 44} height={60 + k * 44} rx="18" />)}
          {variant === 3 && Array.from({ length: 6 }, (_, k) => <path key={k} d={`M -20 ${260 - k * 34} Q 200 ${120 - k * 34} 420 ${240 - k * 34}`} />)}
        </g>
        <circle cx={60 + (h % 260)} cy={60 + (h % 140)} r={26 + (h % 30)} fill="#fff" fillOpacity=".14" />
      </svg>

      {/* No photo at all? The organiser's logo becomes the main image. */}
      {!cur && caption && (
        <div className={`absolute inset-0 flex items-center justify-center ${serif ? 'pb-6' : 'pb-24'}`}><OrgLogo o={o} size={isClub(o) ? (serif ? 128 : 168) : (serif ? 96 : 120)} className="!rounded-[28px]" /></div>
      )}
      {/* Small tiles and thumbnails: the logo, sized to the tile */}
      {!cur && !caption && (
        <div className="absolute inset-0 flex items-center justify-center pb-[18%]">
          <div className={`aspect-square ${isClub(o) ? 'w-[48%]' : 'w-[40%]'} max-w-[150px]`}><OrgLogo o={o} size="fluid" className="!rounded-[22%]" /></div>
        </div>
      )}
      {caption && !cur && (
        <div className={`absolute -bottom-5 left-4 right-0 select-none whitespace-nowrap text-[5.5rem] leading-none text-white/20 font-display`}>
          {o.type}
        </div>
      )}

      {cur && (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={cur.src} src={cur.src} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" draggable={false}
          onError={next}
          onLoad={(e) => { if (e.currentTarget.naturalWidth < 200) next(); else setLoaded(true); }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${active ? 'kenburns' : ''}`} />
      )}
      {cur && loaded && credit && (
        <span className={`absolute max-w-[60%] truncate ${serif ? 'bottom-3 left-3' : 'right-3 top-4'} rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white/85 backdrop-blur`}
          title={cur.real ? 'Image from the organiser’s website' : 'Stock photo from Unsplash — not a photo of this programme'}>
          {cur.credit}
        </span>
      )}
    </div>
  );
}
