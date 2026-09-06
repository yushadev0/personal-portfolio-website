import { type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Masthead } from '../components/Masthead';
import { Footer } from '../components/Footer';
import { RocketToTop } from '../components/RocketToTop';
import styles from './RootLayout.module.css';

export function RootLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <div className={styles.shell}>
      <a href="#main" className="skip-link">
        {t('nav.work')} ↓
      </a>
      {!isHome && <Masthead />}
      <main id="main" className={styles.main}>
        <div key={pathname} className={styles.routeView}>
          {children}
        </div>
      </main>
      <Footer />
      <RocketToTop />
    </div>
  );
}
