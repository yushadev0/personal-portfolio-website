import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useLenis } from '../hooks/useLenis';
import { prefersReducedMotion } from '../lib/motion';
import styles from './RocketToTop.module.css';

/**
 * The rocket back-to-top from the previous site: appears once you've scrolled,
 * and on click the rocket dips, then blasts off the top of the screen while the
 * page scrolls home. Painted in the site accent.
 */
export function RocketToTop() {
  const { t } = useTranslation();
  const lenis = useLenis();
  const [shown, setShown] = useState(false);
  const [launching, setLaunching] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 480);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const launch = () => {
    if (launching) return;
    if (prefersReducedMotion() || !btnRef.current) {
      toTop();
      return;
    }
    const r = btnRef.current.getBoundingClientRect();
    setLaunching(true);

    const rocket = document.createElement('div');
    rocket.className = styles.flying;
    rocket.innerHTML = '<i class="fa-solid fa-rocket"></i>';
    rocket.style.left = `${r.left + r.width / 2}px`;
    rocket.style.top = `${r.top + r.height / 2}px`;
    document.body.appendChild(rocket);
    requestAnimationFrame(() => rocket.classList.add(styles.flyingActive));

    window.setTimeout(toTop, 420);
    window.setTimeout(() => {
      rocket.remove();
      setLaunching(false);
    }, 1650);
  };

  return (
    <button
      ref={btnRef}
      type="button"
      className={`${styles.btn} ${shown ? styles.show : ''} ${
        launching ? styles.launching : ''
      }`}
      onClick={launch}
      aria-label={t('footer.backToTop')}
      title={t('footer.backToTop')}
    >
      <i className="fa-solid fa-rocket" aria-hidden="true" />
    </button>
  );
}
