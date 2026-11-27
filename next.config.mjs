// Security headers for every response. (Explained in SECURITY.md.)
import { networkInterfaces } from 'node:os';
const isDev = process.env.NODE_ENV !== 'production';

// This computer's own Wi-Fi/LAN addresses, so `npm run dev:phone` works from
// a phone on the same network (dev only — production ignores this).
const lanAddresses = Object.values(networkInterfaces()).flat()
  .filter((n) => n && n.family === 'IPv4' && !n.internal).map((n) => n.address);

const csp = [
  "default-src 'self'",
  // Next.js needs inline scripts for hydration (and eval in dev only).
  `script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  // Images: organisers' own preview photos (any https host, via /api/og),
  // Unsplash topic photos and website icons. Images can't run code.
  "img-src 'self' data: blob: https:",
  "connect-src 'self'" + (isDev ? ' ws: wss:' : ''),
  'frame-src https://challenges.cloudflare.com',
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false, // don't advertise the framework
  devIndicators: false,   // hide the dev badge (it covers the mobile tab bar)
  // Lets you open the dev server from your phone on the same Wi-Fi
  // (npm run dev:phone). Only affects `next dev`, never production.
  allowedDevOrigins: [...lanAddresses, '*.local'],
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};
export default nextConfig;
