// Lets plain Node import the app's lib/ files (they use extensionless and "@/..." imports
// that normally only Next.js understands). Used by export-ios-data.mjs.
const root = new URL('../', import.meta.url);
export async function resolve(spec, ctx, next) {
  if (spec === 'server-only') return { url: 'data:text/javascript,', shortCircuit: true };
  if ((spec.startsWith('.') || spec.startsWith('@/')) && !/\.(m?js|json)$/.test(spec)) {
    const s = spec.startsWith('@/') ? new URL(spec.slice(2), root).href : spec;
    try { return await next(s + '.js', ctx); } catch { return next(s + '/index.js', ctx); }
  }
  return next(spec, ctx);
}
export async function load(url, ctx, next) {
  if (url.startsWith(root.href) && url.endsWith('.json')) {
    const { readFileSync } = await import('node:fs');
    return { format: 'module', source: 'export default ' + readFileSync(new URL(url), 'utf8'), shortCircuit: true };
  }
  if (url.startsWith(root.href) && url.endsWith('.js') && !url.includes('/node_modules/')) {
    return { ...(await next(url, { ...ctx, format: 'module' })), format: 'module' };
  }
  return next(url, ctx);
}
