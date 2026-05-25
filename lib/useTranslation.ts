import { useLanguage } from "@/context/LanguageContext";
import { translations, type Translations } from "./translations";

export type { Translations };

export function useTranslation(): Translations {
  const { language } = useLanguage();
  return translations[language] as Translations;
}
