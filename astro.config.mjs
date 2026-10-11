// @ts-check
import { defineConfig } from 'astro/config';

// Adresy: /spadki/, /kancelaria/ — katalog z index.html, działa na każdym hostingu statycznym
// bez reguł przepisywania. Wariant z .html nie jest serwowany, więc nie powstają duplikaty.
// TODO: docelowa domena — od niej zależą canonical, sitemap i Open Graph.
// Sitemapa i robots.txt są generowane w src/pages (sterowane przez SITE_ENV, zob. src/data/env.ts).
export default defineConfig({
  site: 'https://www.kancelariagacon.pl',
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
