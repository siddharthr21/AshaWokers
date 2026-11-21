import { create } from 'zustand';
import i18n from '../i18n';

const initialLang = (() => {
  const stored = localStorage.getItem('language');
  if (stored === 'mr') {
    localStorage.setItem('language', 'hi');
    return 'hi';
  }
  return stored || 'hi';
})();

export const useLanguageStore = create((set) => ({
  language: initialLang,
  setLanguage: (lang) => {
    const targetLang = lang === 'mr' ? 'hi' : lang;
    i18n.changeLanguage(targetLang);
    localStorage.setItem('language', targetLang);
    set({ language: targetLang });
  },
}));
