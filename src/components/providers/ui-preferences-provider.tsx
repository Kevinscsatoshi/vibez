"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  isLanguage,
  type I18nKey,
  type Language,
  type ThemeMode,
  translate,
} from "@/lib/i18n";

type UiPreferencesContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  t: (key: I18nKey, vars?: Record<string, string | number>) => string;
};

const UiPreferencesContext = createContext<UiPreferencesContextValue | null>(null);

const LANGUAGE_STORAGE_KEY = "vibez.language";
const THEME_STORAGE_KEY = "vibez.theme";

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const fromDom = document.documentElement.dataset.theme;
  if (fromDom === "light" || fromDom === "dark") return fromDom;
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return "light";
}

function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored && isLanguage(stored)) return stored;
  const browserLang = window.navigator.language.toLowerCase();
  if (browserLang.startsWith("zh")) return "zh";
  if (browserLang.startsWith("ja")) return "ja";
  if (browserLang.startsWith("ko")) return "ko";
  if (browserLang.startsWith("es")) return "es";
  if (browserLang.startsWith("fr")) return "fr";
  if (browserLang.startsWith("de")) return "de";
  return "en";
}

export function UiPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => getInitialLanguage());
  const [theme, setThemeState] = useState<ThemeMode>(() => getInitialTheme());

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    // Toggle .dark class for shadcn component compatibility
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
  }, []);

  const setTheme = useCallback((next: ThemeMode) => {
    setThemeState(next);
  }, []);

  const t = useCallback(
    (key: I18nKey, vars?: Record<string, string | number>) =>
      translate(language, key, vars),
    [language]
  );

  const value = useMemo(
    () => ({ language, setLanguage, theme, setTheme, t }),
    [language, setLanguage, theme, setTheme, t]
  );

  return (
    <UiPreferencesContext.Provider value={value}>
      {children}
    </UiPreferencesContext.Provider>
  );
}

export function useUiPreferences() {
  const context = useContext(UiPreferencesContext);
  if (!context) {
    throw new Error("useUiPreferences must be used within UiPreferencesProvider");
  }
  return context;
}
