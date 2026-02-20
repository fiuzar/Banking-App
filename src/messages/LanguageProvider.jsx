'use client';

import { createContext, useContext, useState } from "react";
import { languages } from "@/lib/translations";

export const LanguageContext = createContext(null);

export function LanguageProvider({ children, initialLocale = "en" }) {
  // ✅ Initialize locale from initialLocale
  const [locale, setLocale] = useState(initialLocale);

  const t = (namespace, key) => {
  if (!namespace || !key) {
    // console.warn("Invalid translation call:", namespace, key);
    return "";
  }

  const keys = key.split(".");
  let value = languages[locale]?.[namespace];

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
};



  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }} mainLocale={locale}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);

// {languages[locale]?.HomePage?.features_showcase?.list?.map((item, i) => (
//   <li key={i} className="flex gap-3">
//     ✅ {item}
//   </li>
// ))}