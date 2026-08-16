"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";

type Language = "en" | "ru";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
});

const LANGUAGE_EVENT = "jr-language-change";
let volatileLanguage: Language = "en";

function getLanguageSnapshot(): Language {
  try {
    const saved = localStorage.getItem("language");
    volatileLanguage = saved === "ru" ? "ru" : "en";
  } catch {
    // Some privacy modes block storage. Keep language switching usable in memory.
  }
  return volatileLanguage;
}

function getServerLanguageSnapshot(): Language {
  return "en";
}

function subscribeToLanguage(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === "language") onStoreChange();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(LANGUAGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(LANGUAGE_EVENT, onStoreChange);
  };
}

function writeLanguage(lang: Language) {
  volatileLanguage = lang;
  try {
    localStorage.setItem("language", lang);
  } catch {
    // The in-memory snapshot still updates through LANGUAGE_EVENT.
  }
  window.dispatchEvent(new Event(LANGUAGE_EVENT));
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(
    subscribeToLanguage,
    getLanguageSnapshot,
    getServerLanguageSnapshot,
  );

  const handleSetLanguage = (lang: Language) => {
    writeLanguage(lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dataset.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
