# Panel palet kolorów (moduł do przenoszenia)

Pływający przycisk **Kolory**, w którym oglądający stronę testuje warianty kolorystyczne na żywo: gotowe palety, własne kolory po **HEX**, akcent, osobny kolor stopki, kontrola kontrastu, zapis własnych palet i odtwarzanie ich jednym kodem. Wszystko działa w przeglądarce, bez serwera.

## Pliki

| Plik | Rola | Edytujesz w nowym projekcie? |
|---|---|---|
| `palette.config.js` | role kolorów, zmienne CSS, gotowe palety, reguły odcieni pochodnych, kontrole kontrastu | **tak — tylko ten** |
| `palette.engine.js` | silnik (liczenie odcieni, zapis, kod, link) | nie |
| `PalettePanel.astro` | interfejs panelu | nie (ew. wygląd) |

## Przeniesienie do nowej strony (Astro)

1. Skopiuj folder `src/palette/` do nowego projektu.
2. W `palette.config.js` ustaw `storageKey`, role (`var` = zmienna CSS, `def` = kolor domyślny taki jak w CSS), gotowe palety i ewentualnie odcienie pochodne.
3. W layoucie (`<head>` i koniec `<body>`):
   ```astro
   import PalettePanel from '../palette/PalettePanel.astro';
   import paletteConfig from '../palette/palette.config.js?raw';
   import paletteEngine from '../palette/palette.engine.js?raw';
   ...
   {isDemo && <script is:inline set:html={`${paletteConfig}\n${paletteEngine}`} />}   // w <head>
   {isDemo && <PalettePanel />}                                                     // przed </body>
   ```
   `isDemo` to dowolna flaga „wersja pokazowa” — panel nie powinien trafiać na produkcję.
4. W CSS używaj zmiennych z konfiguracji zamiast stałych kolorów (`var(--bg)`, `var(--ink)`, `var(--muted)`…). Akcent jest opcjonalny: `var(--accent, currentColor)` — bez wybranego akcentu wygląda jak dotychczas.

Zasada: **domyślna paleta nie ustawia żadnych zmiennych**, więc strona bez panelu (albo z palety „domyślnej”) jest identyczna co do piksela.

## Jak działa paleta

Paleta to kilka **ról** (tło, tekst, akcent, stopka). Wszystkie pozostałe odcienie (tło pomocnicze, linie, szarości, kolory w stopce) liczą się z nich automatycznie. Pole `Akcent` albo `Stopka` puste = „auto” (jak tekst). Szarości same się przyciemniają, aż osiągną kontrast ≥ 4,6:1.

## Kod palety i linki

- **Kod:** kolory po spacji lub przecinku, w kolejności ról; `-` albo `auto` = pole automatyczne.  
  Przykład: `#fff8f0 #2b1d12 #c2410c -`. Akceptowane `#abc`, `abc`, `#aabbcc`.
- **Link:** `?paleta=granat` (gotowa) albo `?kolory=fff8f0,2b1d12,c2410c,-` (własna). Parametr w adresie ma pierwszeństwo przed zapisanym wyborem.
- **Zapis w przeglądarce** (`localStorage`): `<storageKey>-palette` (bieżący wybór), `<storageKey>-palettes` (lista „Zapisane przez Ciebie”). Starszy format `{ bg, ink }` jest migrowany automatycznie.

## Ograniczenia

- Zapis jest per przeglądarka; między urządzeniami przenosi się go kodem lub linkiem.
- Obrazy i grafiki nie zmieniają kolorów razem z paletą.
- Natywny wybierak koloru jest rysowany przez przeglądarkę/system (położenie okna nie podlega naszej kontroli).
