// Page title, description and link preview for each listing (Google and
// WhatsApp / Instagram previews). The page itself stays a client component.
import { getOpportunity, locationLabel } from '@/lib/opportunities';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const o = getOpportunity(String(id));
  if (!o) return { title: 'Not found · CVAscender', robots: { index: false } };
  const title = o.org && !o.title.includes(o.org) ? `${o.title} · ${o.org} | CVAscender` : `${o.title} | CVAscender`;
  const description = `${o.type} · ${locationLabel(o)}. ${String(o.description || '').slice(0, 150)}`.trim();
  return {
    title,
    description,
    alternates: { canonical: `/o/${encodeURIComponent(o.id)}` },
    openGraph: { title, description, url: `/o/${encodeURIComponent(o.id)}`, siteName: 'CVAscender', type: 'article' },
  };
}

export default function ListingLayout({ children }) {
  return children;
}
