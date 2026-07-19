import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type Lang = 'en' | 'hi' | 'mr' | 'gu' | 'pa' | 'bn' | 'ta' | 'te' | 'kn' | 'ml' | 'or' | 'as' | 'ur';

interface SettingsContextValue {
  theme: Theme;
  toggleTheme: () => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  largeFonts: boolean;
  toggleLargeFonts: () => void;
  accessibilityMode: boolean;
  toggleAccessibility: () => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

const THEME_KEY = 'janmitra_theme';
const LANG_KEY = 'janmitra_lang';
const HC_KEY = 'janmitra_hc';
const LF_KEY = 'janmitra_lf';
const ACC_KEY = 'janmitra_acc';

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(THEME_KEY) as Theme) || 'light');
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem(LANG_KEY) as Lang) || 'en');
  const [highContrast, setHighContrast] = useState<boolean>(() => localStorage.getItem(HC_KEY) === '1');
  const [largeFonts, setLargeFonts] = useState<boolean>(() => localStorage.getItem(LF_KEY) === '1');
  const [accessibilityMode, setAccessibilityMode] = useState<boolean>(() => localStorage.getItem(ACC_KEY) === '1');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) root.classList.add('hc');
    else root.classList.remove('hc');
    localStorage.setItem(HC_KEY, highContrast ? '1' : '0');
  }, [highContrast]);

  useEffect(() => {
    const root = document.documentElement;
    if (largeFonts) root.classList.add('large-fonts');
    else root.classList.remove('large-fonts');
    localStorage.setItem(LF_KEY, largeFonts ? '1' : '0');
  }, [largeFonts]);

  useEffect(() => {
    const root = document.documentElement;
    if (accessibilityMode) root.classList.add('a11y');
    else root.classList.remove('a11y');
    localStorage.setItem(ACC_KEY, accessibilityMode ? '1' : '0');
  }, [accessibilityMode]);

  const value: SettingsContextValue = {
    theme,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    lang,
    setLang: (l) => {
      setLangState(l);
      localStorage.setItem(LANG_KEY, l);
    },
    highContrast,
    toggleHighContrast: () => setHighContrast((v) => !v),
    largeFonts,
    toggleLargeFonts: () => setLargeFonts((v) => !v),
    accessibilityMode,
    toggleAccessibility: () => setAccessibilityMode((v) => !v),
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
