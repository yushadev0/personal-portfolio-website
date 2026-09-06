import { useTranslation } from 'react-i18next';

import { SUPPORTED_LANGUAGES, type Language } from '../i18n';
import { useLanguageMorph } from '../hooks/useLanguageMorph';
import styles from './Toggle.module.css';

export function LanguageToggle() {
  const { i18n, t } = useTranslation();
  const { switchLanguage } = useLanguageMorph();
  const current = (i18n.resolvedLanguage ?? 'en').split('-')[0] as Language;

  return (
    <div
      className={styles.langGroup}
      role="group"
      aria-label={t('nav.language')}
      data-no-morph
    >
      {SUPPORTED_LANGUAGES.map((lng, i) => (
        <span key={lng} className={styles.langItem}>
          {i > 0 && (
            <span className={styles.langSep} aria-hidden="true">
              /
            </span>
          )}
          <button
            type="button"
            className={`${styles.lang} ${current === lng ? styles.langActive : ''}`}
            aria-pressed={current === lng}
            onClick={() => switchLanguage(lng)}
          >
            {lng.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
