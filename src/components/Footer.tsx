import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import styles from './Footer.module.css';

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/yushadev0', icon: 'fa-brands fa-github' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/yusaguverdik/',
    icon: 'fa-brands fa-linkedin-in',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/yusaguverdik/',
    icon: 'fa-brands fa-instagram',
  },
];

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.brandLine}>{t('footer.brandLine1')}</span>
          <span className={`${styles.brandLine} ${styles.brandSub}`}>{t('footer.brandLine2')}</span>
          <span className={styles.rights}>{t('footer.rights')}</span>
        </div>

        <nav className={styles.cols} aria-label="Footer">
          <ul>
            <li><Link to="/work" className="tlink">{t('nav.work')}</Link></li>
            <li><Link to="/about" className="tlink">{t('nav.about')}</Link></li>
            <li><Link to="/contact" className="tlink">{t('nav.contact')}</Link></li>
          </ul>
          <ul>
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="me noreferrer" className={styles.social}>
                  <i className={`${s.icon} ${styles.socialIcon}`} aria-hidden="true" />
                  <span className="tlink">{s.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.colophon}>
          <span className="label">{t('footer.colophonLabel')}</span>
          <p>{t('footer.colophon')}</p>
        </div>
      </div>
    </footer>
  );
}
