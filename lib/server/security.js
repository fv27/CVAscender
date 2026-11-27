import 'server-only';
// Shared request guards used by every API route.
import { upstash, turnstileSecret } from './env';

// ---------- Responses: minimal, never cached, no internals leaked ----------
export function json(data, status = 200, headers = {}) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store', ...headers } });
}
export const fail = (status, message, headers) => json({ error: message }, status, headers);

// ---------- Client IP (behind Vercel's proxy) ----------
export function clientIp(req) {
  return (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown';
}

// ---------- CSRF / origin check ----------
// Browsers always send Origin on POST/PUT/DELETE. We only accept our own site,
// so another website can't make a logged-in student's browser call our API.
export function sameOrigin(req) {
  const origin = req.headers.get('origin');
  if (!origin) return false;
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
  try { return new URL(origin).host === host; } catch { return false; }
}

// ---------- Body parsing: JSON only, size-capped ----------
// This also blocks file uploads: multipart/form-data is rejected outright.
export async function readJson(req, maxBytes = 16_000) {
  const type = req.headers.get('content-type') || '';
  if (!type.startsWith('application/json')) return { error: fail(415, 'Only JSON is accepted.') };
  const len = Number(req.headers.get('content-length') || 0);
  if (len > maxBytes) return { error: fail(413, 'Request too large.') };
  const text = await req.text();
  if (text.length > maxBytes) return { error: fail(413, 'Request too large.') };
  try { return { body: JSON.parse(text) }; } catch { return { error: fail(400, 'Invalid JSON.') }; }
}

// ---------- Rate limiting (fixed window) ----------
// Uses Upstash Redis when configured (works across all Vercel instances);
// otherwise an in-memory map (fine for local dev / a single server).
const memory = new Map();
export async function rateLimit(key, limit, windowSec) {
  if (upstash) {
    try {
      const res = await fetch(`${upstash.url}/pipeline`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${upstash.token}`, 'content-type': 'application/json' },
        body: JSON.stringify([['INCR', `rl:${key}`], ['EXPIRE', `rl:${key}`, String(windowSec), 'NX']]),
        cache: 'no-store',
      });
      const [[, count]] = (await res.json()).map((r) => [null, r.result]);
      return { ok: count <= limit, retryAfter: windowSec };
    } catch { /* fall through to memory if Redis is unreachable */ }
  }
  const now = Date.now();
  const e = memory.get(key);
  if (!e || e.reset < now) { memory.set(key, { count: 1, reset: now + windowSec * 1000 }); return { ok: true }; }
  e.count += 1;
  if (memory.size > 10_000) for (const [k, v] of memory) if (v.reset < now) memory.delete(k);
  return { ok: e.count <= limit, retryAfter: Math.ceil((e.reset - now) / 1000) };
}

export async function limitOrFail(key, limit, windowSec) {
  const r = await rateLimit(key, limit, windowSec);
  return r.ok ? null : fail(429, 'Too many requests. Please wait a moment and try again.', { 'Retry-After': String(r.retryAfter || windowSec) });
}

// ---------- Bot protection ----------
// 1) Honeypot: a hidden form field humans never fill in.
// 2) Cloudflare Turnstile (optional): verified server-side when keys are set.
export async function checkHuman(body, ip) {
  if (body?.website) return false; // honeypot filled → bot
  if (!turnstileSecret) return true;
  if (typeof body?.turnstileToken !== 'string' || body.turnstileToken.length > 2048) return false;
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret: turnstileSecret, response: body.turnstileToken, remoteip: ip }),
    });
    return (await res.json()).success === true;
  } catch { return false; }
}
