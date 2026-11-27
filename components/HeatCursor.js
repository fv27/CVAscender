'use client';
// ---------------------------------------------------------------------------
// Heat-reactive cursor: a hidden field of short stripes (like the grid on the
// landing page) that "heats up" where the mouse moves. Hot stripes grow,
// turn from lapis to pumpkin and lean in the direction you move, then cool
// down and fade. Inspired by cursor-reactive fields on Replit's and KODE
// Immersive's websites (Mobbin references).
//
// * Drawn on one <canvas> on top of the page with pointer-events: none, so
//   it never blocks clicks.
// * Only runs on devices with a real mouse (not phones/tablets), and is off
//   when the system asks for reduced motion.
// * Students can switch it off in Settings (localStorage 'cva:cursorfx').
// * Stops animating as soon as everything has cooled down (no idle CPU use).
// ---------------------------------------------------------------------------
import { useEffect, useRef } from 'react';

const GAP = 10;        // distance between stripes (px)
const RADIUS = 26;     // how far the heat spreads around the cursor (px) — raise for a bigger glow
const COOL = 0.9;      // heat kept per frame (lower = cools faster)
export const CURSOR_FX_KEY = 'cva:cursorfx';
export const CURSOR_FX_EVENT = 'cva:cursorfx';

const rgbVar = (name) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '0 0 0').split(/\s+/).map(Number);

export default function HeatCursor() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const calm = matchMedia('(prefers-reduced-motion: reduce)');
    const ctx = canvas.getContext('2d');

    let cols = 0, rows = 0, heat, angle, dpr = 1, raf = 0, running = false;
    let last = null; // last pointer position
    let cold = rgbVar('--lapis'), hot = rgbVar('--pumpkin');

    const enabled = () => fine.matches && !calm.matches && localStorage.getItem(CURSOR_FX_KEY) !== 'off';

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px';
      cols = Math.ceil(innerWidth / GAP) + 1; rows = Math.ceil(innerHeight / GAP) + 1;
      heat = new Float32Array(cols * rows);
      angle = new Float32Array(cols * rows).fill(-Math.PI / 4); // resting stripes lean 45°, like hatching
    };

    const frame = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ctx.lineCap = 'round';
      let alive = false;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const h = heat[i];
          if (h < 0.015) { heat[i] = 0; continue; }
          alive = true;
          heat[i] = h * COOL;
          const t = Math.min(h, 1);
          const col = cold.map((v, k) => Math.round(v + (hot[k] - v) * t));
          const len = 2 + 4 * t;
          const a = angle[i];
          const x = c * GAP, y = r * GAP;
          const dx = Math.cos(a) * len / 2, dy = Math.sin(a) * len / 2;
          ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${0.15 + 0.7 * t})`;
          ctx.lineWidth = 1 + 0.6 * t;
          ctx.beginPath(); ctx.moveTo(x - dx, y - dy); ctx.lineTo(x + dx, y + dy); ctx.stroke();
        }
      }
      if (alive) raf = requestAnimationFrame(frame);
      else { running = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
    };
    const kick = () => { if (!running) { running = true; raf = requestAnimationFrame(frame); } };

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      if (!enabled()) return;
      const x = e.clientX, y = e.clientY;
      const vx = last ? x - last.x : 0, vy = last ? y - last.y : 0;
      last = { x, y };
      const speed = Math.hypot(vx, vy);
      const dir = speed > 0.5 ? Math.atan2(vy, vx) : null;
      const boost = Math.min(1, 0.25 + speed / 30); // faster movement = more heat
      const c0 = Math.max(0, Math.floor((x - RADIUS) / GAP)), c1 = Math.min(cols - 1, Math.ceil((x + RADIUS) / GAP));
      const r0 = Math.max(0, Math.floor((y - RADIUS) / GAP)), r1 = Math.min(rows - 1, Math.ceil((y + RADIUS) / GAP));
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const d = Math.hypot(c * GAP - x, r * GAP - y);
          if (d > RADIUS) continue;
          const f = (1 - d / RADIUS) ** 2;
          const i = r * cols + c;
          heat[i] = Math.min(1.4, heat[i] + f * boost * 0.55);
          // Hot stripes swing towards the direction of movement.
          if (dir !== null) {
            let diff = dir - angle[i];
            diff = Math.atan2(Math.sin(diff), Math.cos(diff));
            angle[i] += diff * f * 0.5;
          }
        }
      }
      kick();
    };
    const onLeave = () => { last = null; };
    const onTheme = () => { cold = rgbVar('--lapis'); hot = rgbVar('--pumpkin'); };
    const onToggle = () => { if (!enabled()) { heat?.fill(0); ctx.clearRect(0, 0, canvas.width, canvas.height); } };

    resize();
    addEventListener('resize', resize);
    addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    addEventListener(CURSOR_FX_EVENT, onToggle);
    // Re-read the colours when light/dark mode changes (class on <html>).
    const mo = new MutationObserver(onTheme);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
      removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      removeEventListener(CURSOR_FX_EVENT, onToggle);
      mo.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] no-print" />;
}
