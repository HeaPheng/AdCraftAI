"use client";

import * as React from "react";
import { en } from "@/locales/en";
import { km } from "@/locales/km";
import type { TranslationKey } from "@/lib/translations";

export type Language = "en" | "km";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = React.useState<Language>("en");
  const [isMounted, setIsMounted] = React.useState(false);

  // Load language preference from localStorage on client-side mount
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem("adcraft_language") as Language;
    if (savedLanguage === "en" || savedLanguage === "km") {
      setLanguageState(savedLanguage);
    }
    setIsMounted(true);
  }, []);

  // Update HTML element lang attribute and persist selection
  React.useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem("adcraft_language", language);
    document.documentElement.setAttribute("lang", language);
  }, [language, isMounted]);

  const setLanguage = React.useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = React.useCallback(
    (key: TranslationKey): string => {
      // Determine active dictionary
      const dictionary = language === "km" ? km : en;

      // Check if key exists in active dictionary
      let value = dictionary[key];

      if (value === undefined) {
        // Fallback to English dictionary
        value = en[key];
        
        // Log warning in development environment for missing Khmer translations
        if (process.env.NODE_ENV === "development" && language === "km") {
          console.warn(`[i18n] Missing Khmer translation fallback to English for key: "${key}"`);
        }
      }

      return value || "";
    },
    [language]
  );

  const value = React.useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext() {
  const context = React.useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguageContext must be used within a LanguageProvider");
  }
  return context;
}
