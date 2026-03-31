import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from "react";
import { en, TranslationKeys } from "./translations/en";
import { sq } from "./translations/sq";
import { fr } from "./translations/fr";
import { de } from "./translations/de";

export type Language = "en" | "sq" | "fr" | "de";

export const languages: { code: Language; name: string; flag: string }[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "sq", name: "Shqip", flag: "🇦🇱" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
];

const translations: Record<Language, TranslationKeys> = {
  en,
  sq,
  fr,
  de,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
}

// Create context with a default value to avoid the "must be used within provider" error during HMR
const defaultContextValue: LanguageContextType = {
  language: "en",
  setLanguage: () => {},
  t: en,
};

const LanguageContext = createContext<LanguageContextType>(defaultContextValue);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem("language") as Language;
      return saved && translations[saved] ? saved : "en";
    } catch {
      return "en";
    }
  });

  const setLanguage = useCallback((lang: Language) => {
    console.log("Setting language to:", lang);
    setLanguageState(lang);
    try {
      localStorage.setItem("language", lang);
      console.log("Language saved to localStorage:", lang);
    } catch (e) {
      console.error("Failed to save language:", e);
    }
  }, []);

  const t = translations[language];

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
