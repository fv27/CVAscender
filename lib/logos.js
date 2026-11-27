// ---------------------------------------------------------------------------
// Organiser logos: the icon of the listing's own official website, from public
// icon services (loaded by the student's browser, no API key). Several sources
// are tried in order; tiny or missing icons are skipped. Listings without an
// official `url` (or with only a search link) get no logo.
// ---------------------------------------------------------------------------
import { clubMedia, officialSite } from './clubMedia';

const SKIP = /duckduckgo\.|google\.|bing\.|maps\./;

export function hostOf(o) {
  const site = officialSite(o);
  if (!site) return null;
  try {
    const host = new URL(site).hostname;
    return SKIP.test(host) ? null : host;
  } catch { return null; }
}

/** Logo URLs to try, best first. Empty when there's no logo. */
export function logoCandidates(o) {
  if (o.logo === false) return [];
  if (o.logo) return [o.logo];
  const host = hostOf(o);
  if (!host) return [];
  const real = clubMedia(o.id)?.logo;
  return [
    // The club's own logo (found by `npm run club-media`), then the site's logo
    // read live by /api/logo, then public icon services.
    ...(real ? [real] : []),
    `/api/logo/${encodeURIComponent(o.id)}`,
    // Google's icon service (no default image → a 404 when a site has no icon)
    `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent('https://' + host)}&size=128`,
    `https://icons.duckduckgo.com/ip3/${host}.ico`,
  ];
}
