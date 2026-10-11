import { site } from './site';

// Centralna kontrola publikacji.
// Domyślnie każdy build to PODGLĄD: wszystkie strony mają noindex, robots.txt blokuje roboty,
// sitemapa jest pusta, a przełącznik języków pokazuje miejsce na przyszłe wersje.
// Produkcja wymaga jawnego `SITE_ENV=production` (npm run build:prod).
export const isProduction = process.env.SITE_ENV === 'production';

export const isPlaceholder = (v: unknown): v is string => typeof v === 'string' && /^\[.*\]$/.test(v.trim());

// Niezatwierdzone strony stałe: nie trafiają do indeksu ani sitemapy nawet na produkcji.
// Podstrony specjalizacji sterują tym przez `draft` w swoim pliku .md.
export const noindexPaths = new Set(['/kancelaria/', '/polityka-prywatnosci/']);
export const indexableStaticPaths = ['/', '/kontakt/'];

// Przełącznik języków znika z produkcji, dopóki nie ma tłumaczeń.
export const showLanguageSwitcher = !isProduction;

// Bezpiecznik: build produkcyjny nie powstanie, dopóki w site.ts są placeholdery albo dane demonstracyjne.
if (isProduction) {
  if (site.demo) throw new Error('Build produkcyjny zablokowany — site.ts zawiera dane demonstracyjne (demo: true).');
  const missing = Object.entries(site)
    .filter(([, v]) => isPlaceholder(v))
    .map(([k]) => k);
  if (missing.length) {
    throw new Error(`Build produkcyjny zablokowany — uzupełnij src/data/site.ts: ${missing.join(', ')}`);
  }
}
