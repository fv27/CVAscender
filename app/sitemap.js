// /sitemap.xml: every public page, so Google can find each listing.
// Submit https://cvascender.com/sitemap.xml in Google Search Console.
import { OPPORTUNITIES } from '@/lib/opportunities';

const SITE = 'https://cvascender.com';

export default function sitemap() {
  const now = new Date();
  const pages = [
    { url: `${SITE}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE}/explore`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
  ];
  const listings = OPPORTUNITIES
    .filter((o) => o.scope !== 'internal')
    .map((o) => ({ url: `${SITE}/o/${encodeURIComponent(o.id)}`, changeFrequency: 'monthly', priority: o.verified ? 0.6 : 0.4 }));
  return [...pages, ...listings].map((p) => ({ lastModified: now, ...p }));
}
