import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowDown } from 'lucide-react';

import { animate, createTimeline, stagger, prefersReducedMotion, EASE_OUT } from '../lib/motion';
import { NavLinks } from './NavLinks';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';
import { Manifesto } from './Manifesto';
import styles from './Hero.module.css';

const GRID_COLS = 18;
const GRID_ROWS = 11;

export function Hero() {
  const { t } = useTranslation();
  const rootRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const lines = t('hero.manifestoLines', { returnObjects: true }) as string[];
  const roles = t('hero.roles', { returnObjects: true }) as string[];

  useEffect(() => {
    const root = rootRef.current;
    const grid = gridRef.current;
    if (!root) return;

    const cells = grid ? Array.from(grid.children) : [];
    const linesEls = root.querySelectorAll<HTMLElement>('[data-hline]');
    const fadeEls = root.querySelectorAll<HTMLElement>('[data-hfade]');

    if (prefersReducedMotion()) {
      cells.forEach((c) => ((c as HTMLElement).style.opacity = '0.4'));
      linesEls.forEach((el) => (el.style.transform = 'none'));
      fadeEls.forEach((el) => (el.style.opacity = '1'));
      return;
    }

    // Hide the manifesto lines before the reveal (CSS keeps them visible so
    // that lines added later — e.g. a language with more lines — just show).
    linesEls.forEach((el) => (el.style.transform = 'translateY(110%)'));

    const tl = createTimeline({ defaults: { ease: EASE_OUT } });

    if (cells.length) {
      tl.add(
        cells,
        {
          opacity: [0, 0.42],
          scale: [0.2, 1],
          duration: 900,
          delay: stagger(22, { grid: [GRID_COLS, GRID_ROWS], from: 'center' }),
        },
        0,
      );
    }

    tl.add(linesEls, { y: ['110%', '0%'], duration: 1100, delay: stagger(90) }, 260).add(
      fadeEls,
      { opacity: [0, 1], y: [16, 0], duration: 800, delay: stagger(70) },
      '-=700',
    );

    // Idle drift + pointer parallax on the grid.
    let raf = 0;
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width - 0.5) * 26;
      target.y = ((e.clientY - r.top) / r.height - 0.5) * 26;
    };
    const tick = () => {
      cur.x += (target.x - cur.x) * 0.06;
      cur.y += (target.y - cur.y) * 0.06;
      if (grid) grid.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    root.addEventListener('pointermove', onMove);
    raf = requestAnimationFrame(tick);

    const shimmer = cells.length
      ? animate(cells, {
          opacity: [0.42, 0.12],
          duration: 2400,
          delay: stagger(42, { grid: [GRID_COLS, GRID_ROWS], from: 'center' }),
          loop: true,
          alternate: true,
          ease: 'inOut(2)',
        })
      : null;

    return () => {
      tl.pause();
      shimmer?.pause();
      root.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header ref={rootRef} className={styles.hero}>
      <div ref={gridRef} className={styles.grid} aria-hidden="true">
        {Array.from({ length: GRID_COLS * GRID_ROWS }).map((_, i) => (
          <span key={i} className={styles.cell} />
        ))}
      </div>

      <div className={`page ${styles.inner}`}>
        <div className={styles.controls} data-hfade>
          <Link to="/" className={styles.brand} aria-label={t('nav.brandLine1')}>
            <span>{t('nav.brandLine1')}</span>
            <span className={styles.brandSub} data-scramble>
              {t('nav.brandLine2')}
            </span>
          </Link>
          <div className={styles.controlsRight}>
            <NavLinks />
            <span className={styles.divider} aria-hidden="true" />
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>

        <span className={`mono ${styles.index}`} data-hfade data-scramble>
          {t('hero.index')}
        </span>

        <Manifesto lines={lines} />

        <div className={styles.meta} data-hfade>
          <div className={styles.identity}>
            <span className={styles.name}>{t('nav.brandLine1')}</span>
            <span className={styles.role} data-scramble>
              {t('nav.brandLine2')}
            </span>
          </div>
          <ul className={styles.roles}>
            {roles.map((r) => (
              <li key={r} data-scramble>
                {r}
              </li>
            ))}
          </ul>
        </div>

        <p className={styles.statement} data-hfade>
          {t('hero.statement')}
        </p>

        <div className={styles.footerRow} data-hfade>
          <a href="#work" className={styles.cue}>
            <span data-scramble>{t('hero.cue')}</span>{' '}
            <ArrowDown size={13} strokeWidth={1.75} />
          </a>
          <span className={styles.since}>{t('hero.since')}</span>
        </div>
      </div>
    </header>
  );
}
