// KONFIGURACJA PANELU PALET — jedyny plik, który zmienia się między projektami.
// Reszta (palette.engine.js, PalettePanel.astro) jest ogólna. Zob. README.md w tym folderze.
window.PALETTE_CONFIG = {
  // Prefiks kluczy w localStorage (osobny dla każdego projektu).
  storageKey: 'gacon',

  // Role kolorów, w tej kolejności pokazują się w panelu i w „kodzie palety”.
  //  var   — zmienna CSS, którą ustawia panel
  //  def   — kolor domyślny (musi odpowiadać wartości w CSS)
  //  auto  — rola, z której bierze się kolor, gdy pole jest puste (null = pole obowiązkowe)
  roles: [
    { id: 'bg', label: 'Tło', var: '--bg', def: '#ffffff', auto: null },
    { id: 'ink', label: 'Tekst', var: '--ink', def: '#141414', auto: null },
    { id: 'accent', label: 'Akcent', var: '--accent', def: null, auto: 'ink' },
    { id: 'footer', label: 'Stopka', var: '--footer', def: null, auto: 'ink' },
  ],

  // Odcienie liczone z ról: mix = [A, B, udział A]. A i B to id roli albo zmienna wcześniejszego odcienia.
  // min = pilnuje kontrastu: odcień jest przyciemniany (przesuwany w stronę A), aż kontrast do `against` >= ratio.
  derived: [
    { var: '--alt', mix: ['ink', 'bg', 0.05] },
    { var: '--soft', mix: ['ink', 'bg', 0.82] },
    { var: '--muted', mix: ['ink', 'bg', 0.63], min: { against: '--alt', ratio: 4.6 } },
    { var: '--rule', mix: ['ink', 'bg', 0.175] },
    { var: '--prose', mix: ['ink', 'bg', 0.94] },
    { var: '--inv-muted', mix: ['bg', 'footer', 0.65], min: { against: 'footer', ratio: 4.6 } },
    { var: '--inv-rule', mix: ['bg', 'footer', 0.2] },
  ],

  // Kontrole czytelności pokazywane w panelu (WCAG: 4,5 dla tekstu, 3 dla elementów graficznych).
  checks: [
    { a: 'ink', b: 'bg', min: 4.5, label: 'Tekst na tle' },
    { a: 'bg', b: 'footer', min: 4.5, label: 'Tekst w stopce' },
    { a: 'accent', b: 'bg', min: 4.5, label: 'Akcent na tle' },
  ],

  // Zmienna <meta name="theme-color"> (pasek przeglądarki w telefonie) podąża za tą rolą.
  themeColorRole: 'bg',

  // Gotowe palety: c = kolory w kolejności ról; pominięty/null = auto.
  presets: [
    { id: 'monochrom', name: 'Monochrom', c: ['#ffffff', '#141414'] },
    { id: 'monochrom-rudy', name: 'Monochrom + rudy', c: ['#ffffff', '#141414', '#b4410b'] },
    { id: 'papier', name: 'Papier', c: ['#faf6ee', '#1f1b16', '#9a3412'] },
    { id: 'granat', name: 'Granat', c: ['#f6f8fb', '#0f2340', '#1d4ed8'] },
    { id: 'zielen', name: 'Butelkowa zieleń', c: ['#f5f8f4', '#11301f', '#8a5a00'] },
    { id: 'burgund', name: 'Burgund', c: ['#fbf7f6', '#3b1019'] },
    { id: 'terakota', name: 'Terakota', c: ['#fbf5f0', '#4a1f10'] },
    { id: 'grafit', name: 'Grafit (ciemna)', c: ['#131313', '#ececea', '#f59e0b'] },
    { id: 'noc', name: 'Granatowa noc', c: ['#0e1a2b', '#e8eef7', '#7dd3fc'] },
  ],
};
