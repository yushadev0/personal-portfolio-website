import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { NavLinks } from './NavLinks';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';
import styles from './Masthead.module.css';

/**
 * Static masthead for inner pages — a row that sits at the top of the page and
 * scrolls away with the content. Not a fixed navbar.
 */
export function Masthead() {
  const { t } = useTranslation();

  return (
    <div className={`page ${styles.masthead}`}>
      <Link to="/" className={styles.brand} aria-label={t('nav.brandLine1')}>
        <span className={styles.brandLine}>{t('nav.brandLine1')}</span>
        <span className={`${styles.brandLine} ${styles.brandSub}`} data-scramble>
          {t('nav.brandLine2')}
        </span>
      </Link>

      <div className={styles.right}>
        <NavLinks />
        <span className={styles.divider} aria-hidden="true" />
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </div>
  );
}
