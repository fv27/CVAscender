import './globals.css';
import AppProvider from '@/components/AppProvider';
import ThemeToggle from '@/components/ThemeToggle';
import HeatCursor from '@/components/HeatCursor';

export const metadata = {
  metadataBase: new URL('https://cvascender.com'),
  title: 'CVAscender — discover opportunities',
  openGraph: {
    siteName: 'CVAscender',
    title: 'CVAscender — discover opportunities',
    description: 'Olympiads, university programmes, competitions, clubs and volunteering in Switzerland, matched to you.',
    images: [{ url: '/cvascender-logo.png' }],
    type: 'website',
  },
  appleWebApp: { capable: true, title: 'CVAscender', statusBarStyle: 'default' },
  description: 'Discover real opportunities in Switzerland — olympiads, university programmes, competitions and more — matched to you.',
};

export const viewport = { width: 'device-width', initialScale: 1, themeColor: [{ media: '(prefers-color-scheme: light)', color: '#FFFFFF' }, { media: '(prefers-color-scheme: dark)', color: '#090E1A' }] };

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Apply the saved theme before the page paints (no flash). */}
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('cva:theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}` }} />
        {/* Fonts load from Google at runtime (no build-time download needed). */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap"
        />
      </head>
      <body>
        <AppProvider>{children}<ThemeToggle /></AppProvider>
        <HeatCursor />
      </body>
    </html>
  );
}
