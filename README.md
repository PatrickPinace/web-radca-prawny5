# Kancelaria Gacoń — strona (Astro)

Statyczna strona w Astro 5. Projekt wizualny to wersja D.2 z kanwy: białe tło, Półtawski Nowy + Archivo, monochrom.

> **Wersja demonstracyjna.** Dane kontaktowe (`src/data/site.ts`, `demo: true`), teksty podstron i zdjęcie (`src/assets/portret-demo.jpg`) są fikcyjne i służą tylko do pokazania konceptu. Build produkcyjny jest przy `demo: true` zablokowany. Zrzuty podstron: folder [`zrzuty/`](zrzuty).

## Uruchomienie

Potrzebny Node.js 20 lub 22.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # PODGLĄD: noindex wszędzie, robots.txt blokuje roboty, pusta sitemapa
npm run build:prod # PRODUKCJA (SITE_ENV=production) — patrz „Podgląd a produkcja”
npm run preview   # podgląd zbudowanej wersji
```

`dist/` to zwykłe pliki HTML i CSS (każda strona jako `katalog/index.html`, adresy `/spadki/`). Wystarczy dowolny hosting statyczny: zwykły serwer z nginx/Apache, Netlify, Cloudflare Pages albo Vercel.

## Struktura

```
src/
  data/site.ts                 ← telefon, adres, e-mail, NIP, nr wpisu — JEDNO miejsce
  styles/global.css            ← kolory, kroje, siatka, typografia tekstu ciągłego
  data/env.ts                  ← podgląd/produkcja, lista stron noindex, bezpiecznik przed publikacją
  layouts/Base.astro           ← <head>, SEO, JSON-LD, nagłówek, sekcja kontaktu
  components/Header.astro      ← menu (desktop + „Menu” na telefonie, bez JS)
  components/Contact.astro     ← czarna sekcja kontaktu + stopka
  content.config.ts            ← schemat podstron specjalizacji
  content/specjalizacje/*.md   ← treść podstron (plik = adres: spadki.md → /spadki)
  pages/
    index.astro                ← strona główna (układ ręczny, nie z klocków)
    [slug].astro               ← szablon podstrony specjalizacji
    kancelaria.astro, kontakt.astro, polityka-prywatnosci.astro, 404.astro
    robots.txt.ts, sitemap.xml.ts  ← generowane zależnie od SITE_ENV
```

Wspólne są tylko zasady (kolory, krój, odstępy, nagłówek, kontakt). Układy sekcji zostają lokalnie w stronach, żeby strona główna nie składała się z uniwersalnych klocków.

## Dodanie albo edycja specjalizacji

1. Skopiuj `src/content/specjalizacje/spadki.md` pod nową nazwą, np. `prawo-budowlane.md`.
2. Uzupełnij nagłówek pliku (frontmatter): `title`, `order`, `short`, `lead`, `seoTitle`, `seoDescription`, `services`, `faq`.
3. Pod nagłówkiem napisz treść w Markdown. Śródtytuły robisz przez `##`.
4. Lista na stronie głównej, „Inne sprawy”, sitemap i ścieżka nawigacji aktualizują się same.

`draft: true` oznacza, że treść nie została jeszcze zatwierdzona przez radcę. Podstrona się buduje, ale ma `noindex`, a pytania nie trafiają do danych strukturalnych FAQ. Po akceptacji zmień na `false`.

Odpowiedź w FAQ zaczynająca się od `[` jest traktowana jako placeholder i nie trafia do JSON-LD.

## Podgląd a produkcja

- **Podgląd (domyślny build, `npm run build`)**: każda strona ma `noindex`, `robots.txt` to `Disallow: /`, sitemapa jest pusta, przełącznik języków pokazuje miejsce na przyszłe wersje (PL/EN/SK bez linków). Hasło na podglądzie ustawia się na hostingu (np. Cloudflare Access, Netlify Password, `.htpasswd`) — samo `noindex` nie czyni podglądu prywatnym.
- **Produkcja (`npm run build:prod`)**: build zatrzyma się z błędem, dopóki w `src/data/site.ts` zostają wartości w `[NAWIASACH]`. Do indeksu i sitemapy trafiają tylko `/`, `/kontakt/` oraz specjalizacje z `draft: false`. `/kancelaria/` i `/polityka-prywatnosci/` są wyłączone listą `noindexPaths` w `src/data/env.ts` — usuń je z listy po zatwierdzeniu treści. Przełącznik języków jest ukryty.
- Dane strukturalne (JSON-LD) pomijają pola, które są jeszcze placeholderem.

## Przed publikacją

- [ ] Uzupełnić `src/data/site.ts` (wszystko w `[NAWIASACH]`).
- [ ] Treści wszystkich podstron napisane albo zatwierdzone przez radcę, potem `draft: false`.
- [ ] Zdecydować o grupie docelowej (osoby prywatne czy firmy) i dopasować zakres spraw.
- [ ] Sesja zdjęciowa. Zdjęcie wstawić przez `<Image>` z `astro:assets` w `index.astro` w miejsce placeholdera.
- [ ] Polityka prywatności: treść od kancelarii. Strona nie ma cookies ani analityki, a fonty są lokalne (bez Google Fonts).
- [ ] Domena w `astro.config.mjs` (`site`) — z niej powstają canonical, sitemapa i robots.txt.
- [ ] Migracja starej strony (w tym bloga WordPress pod `/blog/` i adresów `kancelaria_prawna_mielec_blog_*.html`): decyzja po analizie Search Console i linków zewnętrznych. Nie przekierowywać masowo na stronę główną; artykuły bez odpowiednika → 404/410 albo przeniesienie pod nowe adresy.
- [ ] Przekierowanie `/sitemap.xml` nie jest potrzebne — nowa sitemapa ma ten sam adres.
- [ ] Hasło na środowisku podglądowym (hosting).
- [ ] `/kancelaria/` i `/polityka-prywatnosci/` są tymczasowo `noindex` (lista w `src/data/env.ts`) — zdjąć po uzupełnieniu treści.
- [ ] Wersje EN/SK: linki w menu są nieaktywne. Kiedy przyjdzie na nie czas, użyć i18n w Astro (`/en/...`, `/sk/...`).

## Adresy

Wszystkie strony mają adres z ukośnikiem na końcu (`/spadki/`) i są budowane jako `spadki/index.html`, więc działają na każdym hostingu statycznym bez reguł przepisywania. Adres `/spadki.html` nie istnieje (404), dzięki czemu nie powstają duplikaty. Większość serwerów sama przekierowuje `/spadki` na `/spadki/`.
