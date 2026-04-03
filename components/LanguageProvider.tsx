'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language, TranslationKey } from '@/lib/translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key: TranslationKey) => translations['en'][key] || key as string,
});

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
    ?.split('=')[1];
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    const stored = getCookie('roast-lang') as Language;
    if (stored === 'en' || stored === 'fr') {
      setLang(stored);
    }
  }, []);

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    document.cookie = `roast-lang=${newLang}; path=/; max-age=31536000`;
  };

  const t = (key: TranslationKey): string => {
    return translations[lang][key] || key as string;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
