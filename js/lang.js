function getNestedValue(obj, key) {
  return key.split('.').reduce((o, k) => (o || {})[k], obj);
}

function formatDates(lang = 'en') {
  const localeMonthShort = {
    de: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    es: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  };

  const monthNames = localeMonthShort[lang] || localeMonthShort['en'];

  document.querySelectorAll('.date-info').forEach(el => {
    const raw = el.getAttribute('data-date');
    if (!raw) return;

    // Normalize dash types just in case (en dash, em dash to regular hyphen)
    const normalized = raw.replace(/–|—/g, '-');
    const parts = normalized.split('-').map(p => p.trim());

    const formattedParts = parts.map(p => {
      const [mm, yyyy] = p.split('/');
      const monthIdx = parseInt(mm, 10) - 1;
      if (isNaN(monthIdx) || !yyyy) return p;
      return `${monthNames[monthIdx]} ${yyyy}`;
    });

    el.textContent = formattedParts.join(' – ');
  });
}

function applyTranslations(lang = 'en') {
  const rawData = document.getElementById('translations').textContent;
  const translations = JSON.parse(rawData)[lang];

  if (!translations) {
    console.warn(`Language '${lang}' not found.`);
    return;
  }

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const value = getNestedValue(translations, key);

    if (value !== undefined) {
      el.textContent = value;
    } else {
      console.warn(`Missing translation for key: '${key}'`);
    }
  });

  if (translations.title) {
    document.title = translations.title;
  }

  // Apply date formatting after translation
  formatDates(lang);
}

document.addEventListener('DOMContentLoaded', () => {
  const supportedLangs = ['de', 'en', 'es'];
  const browserLang = (navigator.language || navigator.userLanguage || 'en').slice(0, 2).toLowerCase();
  const langToUse = supportedLangs.includes(browserLang) ? browserLang : 'en';

  applyTranslations(langToUse);
});