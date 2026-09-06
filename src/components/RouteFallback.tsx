import { useTranslation } from 'react-i18next';
import styles from './RouteFallback.module.css';

/** Minimal, quiet loading state for lazy routes. */
export function RouteFallback() {
  const { t } = useTranslation();
  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      <span className="mono">{t('hero.index')}</span>
      <span className={styles.bar} aria-hidden="true" />
    </div>
  );
}
