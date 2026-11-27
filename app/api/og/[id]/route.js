// GET /api/og/<listing id>
// Redirects to the listing's REAL photo:
//   the share image (og:image / twitter:image) of its official website.
// 404 when there isn't one (cards then show the club logo or coloured art).
//
// Security: only official websites already stored for that listing are ever
// fetched (no user-supplied URLs → no SSRF), with a 5 s timeout, a 400 KB read
// cap, an in-memory cache and per-IP rate limiting.
import { getOpportunity } from '@/lib/opportunities';
import { isClub, officialSite } from '@/lib/clubMedia';
import { metaImage } from '@/lib/mediaExtract';
import { clientIp, limitOrFail } from '@/lib/server/security';
import { readHead } from '@/lib/server/fetchPage';

const CACHE = new Map(); // id -> { img: string|null, t: number }
const DAY = 864e5;

export async function GET(req, { params }) {
  const { id } = await params;
  const o = typeof id === 'string' && id.length < 120 ? getOpportunity(id) : null;
  if (!o || o.image === false) return new Response(null, { status: 404 });
  if (isClub(o)) return new Response(null, { status: 404 }); // clubs: logo only, no photos
  const site = officialSite(o);
  if (!site) return new Response(null, { status: 404 });

  let hit = CACHE.get(o.id);
  if (!hit || Date.now() - hit.t > DAY) {
    const limited = await limitOrFail(`og:${clientIp(req)}`, 600, 60);
    if (limited) return limited;
    let img = null;
    try { const page = await readHead(site); img = page && metaImage(page.html, page.url); } catch {}
    hit = { img, t: Date.now() };
    CACHE.set(o.id, hit);
  }
  if (!hit.img) return new Response(null, { status: 404, headers: { 'cache-control': 'public, max-age=3600' } });
  return new Response(null, { status: 302, headers: { location: hit.img, 'cache-control': 'public, max-age=86400' } });
}
