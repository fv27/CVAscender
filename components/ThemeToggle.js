'use client';
// Light / dark mode switch. The choice is saved in localStorage; the first
// visit follows the device setting (see the inline script in app/layout.js).
import { useEffect, useState } from 'react';

const Sun = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>);
const Moon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>);

export function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => { setDark(document.documentElement.classList.contains('dark')); }, []);
  const toggle = () => {
    const next = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    try { localStorage.setItem('cva:theme', next ? 'dark' : 'light'); } catch {}
    setDark(next);
  };
  return { dark, toggle };
}

export default function ThemeToggle() {
  const { dark, toggle } = useTheme();
  const label = dark ? 'Switch to light mode' : 'Switch to dark mode';
  return (
    <button onClick={toggle} aria-label={label} title={label}
      className="no-print fixed right-3 top-3 z-[55] flex h-10 w-10 items-center justify-center rounded-full border border-line bg-card/90 text-ink-soft shadow-sm backdrop-blur transition hover:border-lapis/40 hover:text-ink sm:right-5 sm:top-5">
      {dark ? <Sun /> : <Moon />}
    </button>
  );
}
