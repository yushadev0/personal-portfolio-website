import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SKILLS } from '../data/skills';
import { AsciiMorph } from './AsciiMorph';
import { useReveal } from '../hooks/useReveal';
import { usePointerParallax } from '../hooks/usePointerParallax';
import styles from './Capabilities.module.css';

const CYCLE_MS = 3000;

export function Capabilities() {
  const { t } = useTranslation();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const revealRef = useReveal<HTMLDivElement>({ stagger: 110 });
  const parallaxRef = usePointerParallax<HTMLElement>();

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((v) => (v + 1) % SKILLS.length), CYCLE_MS);
    return () => clearInterval(id);
  }, [paused]);

  const engineering = t('capabilities.engineering', { returnObjects: true }) as string[];
  const tech = t('capabilities.tech', { returnObjects: true }) as string[];
  const active = SKILLS[i];

  return (
    <section ref={parallaxRef} className={`page ${styles.section}`} id="capabilities">
      <div ref={revealRef} className={styles.grid}>
        <div className={styles.head} data-reveal>
          <span className="eyebrow">{t('capabilities.eyebrow')}</span>
          <h2 className={`display ${styles.title}`}>{t('capabilities.title')}</h2>
          <p className={styles.note}>{t('capabilities.note')}</p>
        </div>

        <div
          className={styles.terminal}
          data-reveal
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
        >
          <div className={styles.terminalInner}>
          <div className={styles.bar}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.barTitle}>user@yusa — asciify</span>
          </div>
          <div className={styles.screen}>
            <AsciiMorph lines={active.icon} className={styles.icon} />
            <AsciiMorph lines={active.name} className={styles.name} />
          </div>
          <div className={styles.ticks} aria-hidden="true">
            {SKILLS.map((s, idx) => (
              <button
                key={s.key}
                type="button"
                className={`${styles.tick} ${idx === i ? styles.tickOn : ''}`}
                onClick={() => setI(idx)}
              >
                {s.label}
              </button>
            ))}
          </div>
          </div>
        </div>

        <div className={styles.cols}>
          <div className={styles.col} data-reveal>
            <span className="label">{t('capabilities.engineeringTitle')}</span>
            <ul>
              {engineering.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <div className={styles.col} data-reveal>
            <span className="label">{t('capabilities.techTitle')}</span>
            <ul className={styles.techList}>
              {tech.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
