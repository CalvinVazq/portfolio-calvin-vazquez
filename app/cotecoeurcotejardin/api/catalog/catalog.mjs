import { official, parseCatalog, parseProduct } from './official.mjs';
import snapshots from './snapshots.json' with { type: 'json' };

const allowed = /^\/shop(?:\/page\/[1-9]\d{0,3}|\/category\/[\p{L}\d-]+(?:\/page\/[1-9]\d{0,3})?|\/[\p{L}\d-]+-\d+)?$/u;
const options = new Set(['search', 'order', 'attrib', 'attribute_value', 'tags', 'min_price', 'max_price']);
const sortOrders = new Set(['name asc', 'list_price asc', 'list_price desc', 'create_date desc', 'publish_date desc', 'website_sequence asc']);
const cache = new Map();
const inflight = new Map();

function checkedPath(input) {
  const url = new URL(input, 'http://preview.local');
  const pathname = decodeURIComponent(url.pathname).replace(/\/$/, '');
  if (url.origin !== 'http://preview.local' || !allowed.test(pathname)) return null;
  for (const [key, value] of url.searchParams) {
    if (!options.has(key) || value.length > 150) return null;
    if (key === 'order' && !sortOrders.has(value)) return null;
    if ((key === 'min_price' || key === 'max_price') && !/^\d{1,8}(?:\.\d{1,2})?$/.test(value)) return null;
    if (['attrib', 'attribute_value', 'tags'].includes(key) && !/^\d+(?:[-,]\d+)*$/.test(value)) return null;
  }
  if (url.searchParams.size > 24) return null;
  url.searchParams.sort();
  return url.pathname.replace(/\/$/, '') + url.search;
}

async function query(path) {
  const saved = cache.get(path);
  if (saved?.expires > Date.now()) return saved.data;
  if (inflight.has(path)) return inflight.get(path);
  if (inflight.size >= 4) throw new Error('Requêtes simultanées');
  const request = (async () => {
    const response = await fetch(official + path, { signal: AbortSignal.timeout(8000), redirect: 'error', cache: 'no-store' });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Catalogue indisponible');
    const html = await response.text();
    const pathname = decodeURIComponent(path.split('?')[0]);
    const data = /^\/shop\/[^/]+-\d+$/u.test(pathname) ? parseProduct(html, pathname) : parseCatalog(html);
    if (cache.size >= 150) cache.delete(cache.keys().next().value);
    cache.set(path, { data, expires: Date.now() + 180_000 });
    return data;
  })();
  inflight.set(path, request);
  try { return await request; } finally { inflight.delete(path); }
}

export async function catalogResponse(input) {
  const reply = (body, status) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
  let path;
  try { path = checkedPath(input || ''); } catch { path = null; }
  if (!path) {
    return reply({ error: 'Adresse de la boutique invalide' }, 400);
  }
  try {
    const data = await query(path);
    return reply(data ? { data } : { error: 'Article introuvable' }, data ? 200 : 404);
  } catch {
    const backup = cache.get(path)?.data ?? snapshots[path];
    return reply(backup
      ? { data: backup, snapshot: true }
      : { error: 'Le catalogue est temporairement indisponible.' }, backup ? 200 : 503);
  }
}
