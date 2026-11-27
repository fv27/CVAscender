import 'server-only';
// Fetches the start of an official website's HTML for /api/og and /api/logo.
// Only called with URLs stored in our own data (never user input). Redirects are
// followed by hand so each hop can be checked: public http(s) hosts only.
const PRIVATE = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|0\.|.*\.local$|.*\.internal$)/i;
const okUrl = (u) => {
  try {
    const x = new URL(u);
    return /^https?:$/.test(x.protocol) && (!x.port || ['80', '443'].includes(x.port)) && !PRIVATE.test(x.hostname)
      && !/^\d+\.\d+\.\d+\.\d+$/.test(x.hostname) && !x.hostname.includes(':');
  } catch { return false; }
};

/** Returns { url, html } with up to `cap` bytes; stops after </head> when headOnly. */
export async function readHead(url, cap = 400_000, headOnly = true) {
  let current = url;
  for (let hop = 0; hop < 4; hop++) {
    if (!okUrl(current)) return null;
    const res = await fetch(current, {
      redirect: 'manual', cache: 'no-store', signal: AbortSignal.timeout(5000),
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; CVAscender link preview)', accept: 'text/html' },
    });
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) { current = new URL(res.headers.get('location'), current).href; continue; }
    if (!res.ok || !/html/i.test(res.headers.get('content-type') || '')) return null;
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let html = '', bytes = 0;
    while (bytes < cap) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.length; html += dec.decode(value, { stream: true });
      if (headOnly && /<\/head>/i.test(html)) break;
    }
    reader.cancel().catch(() => {});
    return { url: current, html };
  }
  return null;
}
