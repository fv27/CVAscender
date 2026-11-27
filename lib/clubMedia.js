// Real club logos found by `npm run club-media` (lib/clubMedia.json).
// Logos only — club photos are not used (copyright).
// Only entries the script checked (or that the owner provided) are used.
import data from './clubMedia.json';

export function clubMedia(id) {
  const m = data[id];
  if (!m?.site) return null;
  return m.checked || m.source === 'provided by the owner' ? m : null;
}

/** The listing's official website: its own url, or the club site found by the script. */
export const officialSite = (o) => o.url || clubMedia(o.id)?.site || null;

/** Named clubs never get photos (stock or real) — their logo is the image. */
// (Generic "find a club in <town>" cards aren't one specific club, so they keep illustrative photos.)
export const isClub = (o) => !o.finder && (o.type === 'Sports club' || /club|team/i.test(o.type) && (o.categories || []).includes('sports'));
