// GET /api/logo/<listing id>
// Redirects to the organiser's own logo: the one found by `npm run club-media`,
// else the logo image / apple-touch-icon read from its official website.
// Same safety rules as /api/og (stored official URLs only, timeouts, caps, cache, rate limit).
import { getOpportunity } from '@/lib/opportunities';
import { clubMedia, officialSite } from '@/lib/clubMedia';
import { findLogo } from '@/lib/mediaExtract';
import { clientIp, limitOrFail } from '@/lib/server/security';
import { readHead } from '@/lib/server/fetchPage';

const CACHE = new Map();
const DAY = 864e5;

export async function GET(req, { params }) {
  const { id } = await params;
  const o = typeof id === 'string' && id.length < 120 ? getOpportunity(id) : null;
  if (!o || o.logo === false) return new Response(null, { status: 404 });
  const known = clubMedia(o.id)?.logo;
  if (known) return new Response(null, { status: 302, headers: { location: known, 'cache-control': 'public, max-age=86400' } });
  const site = officialSite(o);
  if (!site) return new Response(null, { status: 404 });

  let hit = CACHE.get(o.id);
  if (!hit || Date.now() - hit.t > DAY) {
    const limited = await limitOrFail(`logo:${clientIp(req)}`, 600, 60);
    if (limited) return limited;
    let img = null;
    try { const page = await readHead(site, 250_000, false); img = page && findLogo(page.html, page.url); } catch {}
    hit = { img, t: Date.now() };
    CACHE.set(o.id, hit);
  }
  if (!hit.img) return new Response(null, { status: 404, headers: { 'cache-control': 'public, max-age=3600' } });
  return new Response(null, { status: 302, headers: { location: hit.img, 'cache-control': 'public, max-age=86400' } });
}
