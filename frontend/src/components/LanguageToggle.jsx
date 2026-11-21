import { useState } from 'react';
import { useLanguageStore } from '../stores/languageStore';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguageStore();
  const [switching, setSwitching] = useState(false);

  const handleSwitch = async (lang) => {
    if (lang === language) return;
    setSwitching(true);
    setLanguage(lang);
    // Give a moment for translations to start loading, then clear spinner
    setTimeout(() => setSwitching(false), 800);
  };

  return (
    <div className="flex bg-[#02343F] border border-[#F0EDCC]/30 rounded-lg overflow-hidden relative shadow-sm">
      {['en', 'hi', 'kn'].map((lang) => (
        <button
          key={lang}
          onClick={() => handleSwitch(lang)}
          disabled={switching}
          className={`px-3 py-1 text-xs font-semibold transition-all ${language === lang
              ? 'bg-[#F0EDCC] text-[#02343F] shadow-sm font-bold'
              : 'text-[#F0EDCC]/80 hover:bg-[#F0EDCC]/15 hover:text-[#F0EDCC] disabled:opacity-60'
            }`}
        >
          {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिंदी' : 'ಕನ್ನಡ'}
        </button>
      ))}
      {switching && (
        <span
          className="material-symbols-outlined"
          style={{
            position: 'absolute', right: '-22px', top: '50%', transform: 'translateY(-50%)',
            fontSize: '16px', color: '#F0EDCC',
            animation: 'spin 0.8s linear infinite',
          }}
        >refresh</span>
      )}
      <style>{`@keyframes spin { from { transform: translateY(-50%) rotate(0deg); } to { transform: translateY(-50%) rotate(360deg); } }`}</style>
    </div>
  );
}
