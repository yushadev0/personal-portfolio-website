import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import styles from './NavLinks.module.css';

const LINKS = [
  { to: '/work', key: 'nav.work', num: '01' },
  { to: '/about', key: 'nav.about', num: '02' },
  { to: '/contact', key: 'nav.contact', num: '03' },
] as const;

export function NavLinks({ className }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <nav className={`${styles.links} ${className ?? ''}`} aria-label="Primary">
      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
        >
          <span className={styles.num} aria-hidden="true">
            {link.num}
          </span>
          <span data-scramble>{t(link.key)}</span>
        </NavLink>
      ))}
    </nav>
  );
}
