// /robots.txt: lets search engines read the public pages, not the API.
const SITE = 'https://cvascender.com';

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/settings', '/login'] }],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
