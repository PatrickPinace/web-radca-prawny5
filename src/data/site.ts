// Jedno źródło danych kontaktowych i rejestrowych.
// Wartości w nawiasach kwadratowych trzeba uzupełnić przed publikacją.
// UWAGA: obecne dane są FIKCYJNE (wersja demonstracyjna, `demo: true`). Build produkcyjny jest wtedy zablokowany —
// po wstawieniu prawdziwych danych ustaw `demo: false`.
export const site = {
  firm: 'Kancelaria Radców Prawnych Piotr Gacoń',
  person: 'Piotr Gacoń',
  role: 'radca prawny',
  city: 'Mielec',
  demo: true,
  street: 'ul. Przykładowa 12/3',
  postalCode: '39-300',
  phone: '123 456 789', // format wyświetlany, np. "600 000 000"
  phoneHref: '+48123456789', // format do tel:, np. "+48600000000"
  email: 'kontakt@example.com',
  hours: 'pn–pt 9:00–17:00',
  nip: '000-000-00-00',
  chamber: 'Rzeszowie', // Okręgowa Izba Radców Prawnych
  registryNo: 'RZ-0000',
  // Jedno źródło języków: nazwa po polsku (stopka, teksty), nazwa własna (hero) i kod (dane strukturalne).
  languages: [
    { name: 'polski', native: 'Polski', code: 'pl' },
    { name: 'angielski', native: 'English', code: 'en' },
    { name: 'słowacki', native: 'Slovenčina', code: 'sk' },
  ],
};

export const nav = [
  { href: '/kancelaria/', label: 'Kancelaria' },
  { href: '/#zakres', label: 'Zakres spraw' },
  { href: '/kontakt/', label: 'Kontakt' },
];
