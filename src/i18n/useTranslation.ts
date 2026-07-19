import { useSettings } from '../context/SettingsContext';
import { getTranslation, type TranslationKey } from './translations';

export function useTranslation() {
  const { lang } = useSettings();
  const t = (key: TranslationKey): string => {
    const tr = getTranslation(lang);
    return tr[key] ?? key;
  };
  return { t, lang };
}
