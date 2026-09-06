import { useEffect, useId, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { KEDY_PATH, KEDY_VIEWBOX } from '../data/kedy-path';
import { useReveal } from '../hooks/useReveal';
import { usePointerParallax } from '../hooks/usePointerParallax';
import { prefersReducedMotion } from '../lib/motion';
import styles from './Kedy.module.css';

/** The kedY mark — a geometric sleeping cat. "ked" + the Y from Yuşa. */
export function KedyMark({
  className,
  fluid = false,
}: {
  className?: string;
  fluid?: boolean;
}) {
  const uid = useId().replace(/[:]/g, '');
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);
  const wrapRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = wrapRef.current;
    const disp = dispRef.current;
    if (!fluid || !svg || !disp || prefersReducedMotion()) return;

    let raf = 0;
    let cur = 0;
    let target = 0;
    let last = 0;
    let running = false;

    const tick = (now: number) => {
      cur += (target - cur) * 0.12;
      disp.setAttribute('scale', cur.toFixed(2));
      if (Math.abs(target - cur) > 0.02 || now - last < 400) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };
    const kick = () => {
      last = performance.now();
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };
    const onEnter = () => {
      target = 14;
      kick();
    };
    const onMove = () => {
      target = 14;
      kick();
    };
    const onLeave = () => {
      target = 0;
      kick();
    };

    svg.addEventListener('pointerenter', onEnter);
    svg.addEventListener('pointermove', onMove);
    svg.addEventListener('pointerleave', onLeave);
    return () => {
      svg.removeEventListener('pointerenter', onEnter);
      svg.removeEventListener('pointermove', onMove);
      svg.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [fluid]);

  return (
    <svg
      ref={wrapRef}
      className={className}
      viewBox={KEDY_VIEWBOX}
      role="img"
      aria-label="kedY"
      xmlns="http://www.w3.org/2000/svg"
    >
      {fluid && (
        <filter id={`kf-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.02"
            numOctaves="2"
            seed="7"
            result="noise"
          >
            <animate
              attributeName="baseFrequency"
              dur="9s"
              values="0.012 0.02;0.02 0.012;0.012 0.02"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            ref={dispRef}
            in="SourceGraphic"
            in2="noise"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      )}
      <path
        d={KEDY_PATH}
        fill="currentColor"
        fillRule="evenodd"
        filter={fluid ? `url(#kf-${uid})` : undefined}
      />
    </svg>
  );
}

export function KedySection() {
  const { t } = useTranslation();
  const ref = useReveal<HTMLDivElement>({ stagger: 120 });
  const parallaxRef = usePointerParallax<HTMLElement>();

  return (
    <section ref={parallaxRef} className={`page ${styles.section}`} id="kedy">
      <div ref={ref} className={styles.grid}>
        <div className={styles.figure} data-reveal>
          <div className={styles.tilt}>
            <KedyMark className={styles.cat} fluid />
          </div>
        </div>
        <div className={styles.text}>
          <span className="eyebrow" data-reveal>
            {t('kedy.eyebrow')}
          </span>
          <h2 className={`display ${styles.title}`} data-reveal>
            {t('kedy.title')}
          </h2>
          <p data-reveal>{t('kedy.body')}</p>
        </div>
      </div>
    </section>
  );
}
