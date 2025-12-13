"use client"

import { createContext, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { translations } from '../i18n/translations';

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const params = useParams();
  // Safe fallback if params is null
  const initialLang = params?.lang || 'en';

  const [language, setLanguage] = useState(initialLang);
  const CLIENT_URL = "http://localhost:3000";

  // Sync state with URL params when they change
  useEffect(() => {
    if (params?.lang && translations[params.lang]) {
      setLanguage(params.lang);
    }
  }, [params?.lang]);

  // Handle side effects (document direction, localStorage) only after mount or change
  useEffect(() => {
    document.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    localStorage.setItem('appLanguage', language);
  }, [language]);

  const changeLanguage = (lang) => {
    // Just update state locally for immediate feedback if needed, 
    // although navigation in Header will eventually update params & trigger useEffect.
    if (translations[lang]) {
      setLanguage(lang);
    }
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        // Fallback to English if translation missing
        let fallback = translations['en'];
        for (const fk of keys) {
          if (fallback && fallback[fk] !== undefined) {
            fallback = fallback[fk];
          } else {
            return key;
          }
        }
        return fallback;
      }
    }
    return value;
  };

  return (
    <MyContext.Provider
      value={{
        CLIENT_URL,
        language,
        changeLanguage,
        t
      }}
    >
      {children}
    </MyContext.Provider>
  );
};