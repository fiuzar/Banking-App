'use client';

import { createContext, useContext, useState, useEffect } from "react";
import { languages } from "@/lib/translations";
import { useRouter, usePathname } from "next/navigation";

export const LanguageContext = createContext(null);

export function LanguageProvider({ children, initialLocale = "en" }) {
  const [locale, setLocale] = useState(initialLocale);
  const router = useRouter();
  const pathname = usePathname();

  // Helper to update cookie manually if needed
  const setLocaleCookie = (newLocale) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 30}`;
  };

  const changeLanguage = (newLocale) => {
    if (newLocale === locale) return;

    // 1. Update Cookie so Middleware remembers
    setLocaleCookie(newLocale);

    // 2. Update Local State
    setLocale(newLocale);

    // 3. Update URL (e.g., /en/app -> /fr/app)
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const t = (namespace, key) => {
    if (!namespace || !key) return "";

    const keys = key.split(".");
    let value = languages[locale]?.[namespace];

    if (!value) return key;

    for (const k of keys) {
      value = value?.[k];
    }

    // Fallback to English if the translation is missing in the current locale
    if (!value && locale !== 'en') {
      let fallbackValue = languages['en']?.[namespace];
      for (const k of keys) {
        fallbackValue = fallbackValue?.[k];
      }
      return fallbackValue || key;
    }

    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);