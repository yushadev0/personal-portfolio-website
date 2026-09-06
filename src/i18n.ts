import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './locales/en/common.json';
import enProjects from './locales/en/projects.json';
import trCommon from './locales/tr/common.json';
import trProjects from './locales/tr/projects.json';

export const SUPPORTED_LANGUAGES = ['en', 'tr'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const resources = {
  en: { common: enCommon, projects: enProjects },
  tr: { common: trCommon, projects: trProjects },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    ns: ['common', 'projects'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'language',
      caches: ['localStorage'],
    },
    react: { useSuspense: false },
  });

i18n.on('languageChanged', (lng) => {
  const base = lng.split('-')[0];
  if (typeof document !== 'undefined') {
    document.documentElement.lang = base;
  }
});

export default i18n;
