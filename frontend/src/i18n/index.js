import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import mr from './mr.json';
import hi from './hi.json';
import kn from './kn.json';

const storedLang = (() => {
  const stored = localStorage.getItem('language');
  if (stored === 'mr') {
    localStorage.setItem('language', 'hi');
    return 'hi';
  }
  return stored || 'hi';
})();

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      mr: { translation: mr },
      hi: { translation: hi },
      kn: { translation: kn }
    },
    lng: storedLang,
    fallbackLng: 'hi',
    interpolation: { escapeValue: false },
    react: { useSuspense: false }
  });

export default i18n;
