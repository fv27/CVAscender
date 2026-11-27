// Lets students "Add to Home Screen": the app then opens full-screen with
// its own icon, like a native app — no app store needed.
export default function manifest() {
  return {
    name: 'CVAscender',
    short_name: 'CVAscender',
    description: 'Discover real opportunities in Switzerland, matched to you.',
    start_url: '/feed',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#26619C',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    ],
  };
}
