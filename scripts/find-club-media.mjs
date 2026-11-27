// ---------------------------------------------------------------------------
// Finds the REAL LOGO of every Swiss club listing (logos only — no photos,
// so we never copy clubs' copyrighted pictures).
//
//   npm run club-media                 # all clubs that don't have media yet
//   npm run club-media -- --only usts  # one club (id or name contains "usts")
//   npm run club-media -- --refresh    # redo every club
//   npm run club-media -- --limit 20   # try 20 clubs (good first test)
//
// For each club it:
//   1. uses the club's official website (from the listing, from lib/clubMedia.json,
//      or found with a web search),
//   2. checks the website really belongs to that club (name/acronym in the
//      address or page title; otherwise it is skipped, never guessed),
//   3. picks the club logo from its website,
// and saves everything in lib/clubMedia.json. Open that file afterwards and
// delete anything that looks wrong — the app only shows what is in it.
//
// Run it on your own computer (it needs normal internet). It is polite: a
// couple of requests at a time, with pauses, and it identifies itself.
// ---------------------------------------------------------------------------
import { register } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
register('./node-resolve-hook.mjs', import.meta.url);

const { OPPORTUNITIES } = await import('../lib/opportunities.js');
const { findLogo, pageTitle, siteMatches, NOT_OFFICIAL } = await import('../lib/mediaExtract.js');

const FILE = new URL('../lib/clubMedia.json', import.meta.url);
const media = JSON.parse(readFileSync(FILE, 'utf8'));
const args = process.argv.slice(2);
const arg = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const ONLY = arg('--only')?.toLowerCase();
const LIMIT = Number(arg('--limit')) || Infinity;
const REFRESH = args.includes('--refresh');
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15 CVAscender-club-media/1.0';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const today = new Date().toISOString().slice(0, 10);

// ---- Safe fetching: public https/http sites only, manual redirects, size cap ----
const PRIVATE = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|0\.|\[?::1\]?$|.*\.local$|.*\.internal$)/i;
function publicUrl(u) {
  try {
    const x = new URL(u);
    if (!/^https?:$/.test(x.protocol) || x.port && !['80', '443'].includes(x.port)) return null;
    if (PRIVATE.test(x.hostname) || /^\d+\.\d+\.\d+\.\d+$/.test(x.hostname) || x.hostname.includes(':')) return null;
    return x;
  } catch { return null; }
}
async function getHtml(url) {
  let current = url;
  for (let hop = 0; hop < 5; hop++) {
    if (!publicUrl(current)) return null;
    const res = await fetch(current, { redirect: 'manual', headers: { 'user-agent': UA, accept: 'text/html', 'accept-language': 'fr-CH,de-CH;q=0.9,en;q=0.8' }, signal: AbortSignal.timeout(10000) }).catch(() => null);
    if (!res) return null;
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) { current = new URL(res.headers.get('location'), current).href; continue; }
    if (!res.ok || !/html/i.test(res.headers.get('content-type') || '')) return null;
    const buf = await res.arrayBuffer().catch(() => null);
    if (!buf) return null;
    return { url: current, html: new TextDecoder().decode(buf.slice(0, 1_500_000)) };
  }
  return null;
}

// ---- Finding the official website with a web search ----
async function searchSites(query) {
  const out = [];
  const ddg = await getHtml('https://html.duckduckgo.com/html/?q=' + encodeURIComponent(query));
  if (ddg) for (const m of ddg.html.matchAll(/uddg=([^&"']+)/g)) out.push(decodeURIComponent(m[1]));
  if (!out.length) {
    const bing = await getHtml('https://www.bing.com/search?setlang=fr&q=' + encodeURIComponent(query));
    if (bing) for (const m of bing.html.matchAll(/<h2[^>]*>\s*<a[^>]+href="(https?:\/\/[^"]+)"/g)) out.push(m[1]);
  }
  const seen = new Set();
  return out.filter((u) => {
    const x = publicUrl(u);
    if (!x || NOT_OFFICIAL.test(x.hostname)) return false;
    const home = `${x.protocol}//${x.hostname}/`;
    if (seen.has(home)) return false;
    seen.add(home);
    return true;
  }).map((u) => { const x = new URL(u); return `${x.protocol}//${x.hostname}/`; }).slice(0, 5);
}

async function findSite(o, entry) {
  const tried = [];
  const candidates = [entry?.site, o.url].filter(Boolean);
  for (const c of candidates) {
    const page = await getHtml(c);
    tried.push(c);
    if (!page) continue;
    const trusted = entry?.site === c && entry?.source === 'provided by the owner';
    if (trusted || siteMatches(o.org, page.url, pageTitle(page.html), o.city || '')) return { page, how: trusted ? 'provided by the owner' : 'listing/known website' };
  }
  await sleep(1500); // be polite to the search engine
  for (const c of await searchSites(`${o.org} ${o.city || ''} site officiel`)) {
    if (tried.includes(c)) continue;
    const page = await getHtml(c);
    if (page && siteMatches(o.org, page.url, pageTitle(page.html), o.city || '')) return { page, how: 'web search, name matched' };
    await sleep(400);
  }
  return null;
}

async function mediaFor(o) {
  const entry = media[o.id];
  const found = await findSite(o, entry);
  if (!found) return { ...(entry || {}), site: entry?.source === 'provided by the owner' ? entry.site : null, reason: 'no matching official website found', checked: today };
  const { page } = found;
  // Logos only: we don't copy clubs' photos (copyright). The logo identifies the club.
  return { site: page.url, title: pageTitle(page.html).slice(0, 120), how: found.how, logo: findLogo(page.html, page.url), checked: today,
    ...(entry?.source ? { source: entry.source } : {}) };
}

// ---- Run ----
const clubs = OPPORTUNITIES.filter((o) => o.country === 'CH' && !o.finder && (o.type === 'Sports club' || o.sport))
  .filter((o) => !ONLY || o.id.toLowerCase().includes(ONLY) || o.org.toLowerCase().includes(ONLY))
  .filter((o) => REFRESH || ONLY || !media[o.id]?.checked)
  .slice(0, LIMIT);

console.log(`Looking for the real logos of ${clubs.length} clubs…\n`);
let done = 0, withLogo = 0, noSite = 0;
const save = () => writeFileSync(FILE, JSON.stringify(Object.fromEntries(Object.entries(media).sort(([a], [b]) => a.localeCompare(b))), null, 2) + '\n');

const queue = [...clubs];
async function worker() {
  while (queue.length) {
    const o = queue.shift();
    let r;
    try { r = await mediaFor(o); } catch (e) { r = { reason: String(e).slice(0, 120), checked: today }; }
    media[o.id] = r;
    done++;
    if (r.logo) withLogo++;
    if (!r.site) noSite++;
    console.log(`${String(done).padStart(4)}/${clubs.length}  ${r.site ? (r.logo ? '🛡️ ' : '–  ') : '❌ '} ${o.org}  ${r.site || r.reason}`);
    if (done % 10 === 0) save();
    await sleep(800);
  }
}
await Promise.all([worker(), worker()]);
save();
console.log(`\nDone. ${withLogo} logos, ${noSite} clubs without a confirmed website.`);
console.log('Now open lib/clubMedia.json, delete anything that looks wrong, then run `npm run ios:data` for the iPhone app.');
