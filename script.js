const translations = document.querySelectorAll('[data-i18n-tr]');
const languageButton = document.querySelector('[data-lang-target]');
const year = document.querySelector('#year');

const meta = {
  tr: {
    lang: 'tr',
    title: 'Mustafa Kalkanlı | Siber Güvenlik Stratejisi',
    description:
      'Mustafa Kalkanlı’nın siber güvenlik yönetimi, strateji, kurumsal dayanıklılık ve dijital adli analiz yaklaşımı.',
    next: 'en',
    label: 'EN',
    aria: 'Switch language to English',
  },
  en: {
    lang: 'en',
    title: 'Mustafa Kalkanli | Cybersecurity Strategy',
    description:
      'Explore Mustafa Kalkanli’s perspective on cybersecurity management, strategy, organizational resilience, and digital forensics.',
    next: 'tr',
    label: 'TR',
    aria: 'Dili Türkçeye çevir',
  },
};

function setLocale(locale) {
  const selected = meta[locale] ? locale : 'tr';
  const current = meta[selected];

  document.documentElement.lang = current.lang;
  document.title = current.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', current.description);

  translations.forEach((element) => {
    element.textContent = element.dataset[`i18n${selected[0].toUpperCase()}${selected.slice(1)}`] ?? element.textContent;
  });

  if (languageButton) {
    languageButton.textContent = current.label;
    languageButton.dataset.langTarget = current.next;
    languageButton.setAttribute('aria-label', current.aria);
  }

  localStorage.setItem('mk_locale', selected);
}

languageButton?.addEventListener('click', () => setLocale(languageButton.dataset.langTarget ?? 'en'));

if (year) {
  year.textContent = String(new Date().getFullYear());
}

setLocale(localStorage.getItem('mk_locale') ?? 'tr');
