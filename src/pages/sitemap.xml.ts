import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { isProduction, indexableStaticPaths } from '../data/env';

// Tylko adresy przeznaczone do indeksowania; w podglądzie sitemapa jest pusta.
export const GET: APIRoute = async ({ site }) => {
  const specs = isProduction ? (await getCollection('specjalizacje')).filter((s) => !s.data.draft) : [];
  const paths = isProduction ? [...indexableStaticPaths, ...specs.map((s) => `/${s.id}/`)] : [];
  const urls = paths.map((p) => `  <url><loc>${new URL(p, site)}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
