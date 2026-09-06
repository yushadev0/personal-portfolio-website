import { type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Moon, Sun } from 'lucide-react';

import { useTheme } from '../hooks/useTheme';
import styles from './Toggle.module.css';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { t } = useTranslation();
  const next = theme === 'dark' ? t('nav.themeLight') : t('nav.themeDark');

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={onClick}
      aria-label={`${t('nav.theme')}: ${next}`}
      title={next}
    >
      {theme === 'dark' ? <Sun size={15} strokeWidth={1.75} /> : <Moon size={15} strokeWidth={1.75} />}
    </button>
  );
}
