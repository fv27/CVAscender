const v = (name) => `rgb(var(${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Colours come from CSS variables (app/globals.css) so light and dark
      // mode swap automatically. Lapis blue + pumpkin orange are the accents.
      colors: {
        paper: v('--paper'),
        soft: v('--soft'),
        card: v('--card'),
        ink: { DEFAULT: v('--ink'), soft: v('--ink-soft'), muted: v('--ink-muted') },
        line: v('--line'),
        lapis: { DEFAULT: v('--lapis'), deep: v('--lapis-deep'), soft: v('--lapis-soft') },
        signal: { DEFAULT: v('--pumpkin'), soft: v('--pumpkin-soft') },
      },
      fontFamily: {
        // Bold, tight sans for headings (TikTok / X / Mindtrip-style onboarding & feeds).
        display: ['Geist', 'system-ui', 'sans-serif'],
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
        // Editorial serif for reel titles.
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      borderRadius: { xl2: '1.25rem', xl3: '1.75rem' },
      boxShadow: {
        card: '0 1px 0 rgba(16,24,40,.04), 0 12px 40px -12px rgba(16,24,40,.16)',
        lift: '0 24px 60px -20px rgba(16,24,40,.35)',
      },
      keyframes: {
        rise: { '0%': { opacity: 0, transform: 'translateY(14px)' }, '100%': { opacity: 1, transform: 'none' } },
        pop: { '0%': { transform: 'scale(.4)', opacity: 0 }, '40%': { transform: 'scale(1.15)', opacity: 1 }, '100%': { transform: 'scale(1)', opacity: 0 } },
        sheet: { '0%': { transform: 'translateY(100%)' }, '100%': { transform: 'none' } },
        fade: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
      },
      animation: {
        rise: 'rise .5s cubic-bezier(.2,.7,.2,1) both',
        pop: 'pop .8s ease-out both',
        sheet: 'sheet .38s cubic-bezier(.2,.8,.2,1) both',
        fade: 'fade .25s ease-out both',
      },
    },
  },
  plugins: [],
};
