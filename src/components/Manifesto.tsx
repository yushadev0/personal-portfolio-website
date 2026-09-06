import { useEffect, useRef } from 'react';

import { prefersReducedMotion } from '../lib/motion';
import styles from './Manifesto.module.css';

/**
 * Hero manifesto, split per character. As the pointer travels over the type the
 * characters it passes near go "fluid" — a spring-eased lift, swell and wave
 * that ripples out from the cursor and settles back to rest.
 */
export function Manifesto({ lines }: { lines: string[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || prefersReducedMotion()) return;

    const chars = Array.from(wrap.querySelectorAll<HTMLElement>('[data-ch]'));
    const st = chars.map(() => ({ v: 0 }));
    const R = 180;
    let px = -9999;
    let py = -9999;
    let raf = 0;
    let lastMove = -9999;

    const loop = (now: number) => {
      let active = false;
      for (let i = 0; i < chars.length; i++) {
        const r = chars[i].getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = cx - px;
        const dy = cy - py;
        const d = Math.hypot(dx, dy);
        const prox = d < R ? Math.pow(1 - d / R, 1.6) : 0;

        const s = st[i];
        s.v += (prox - s.v) * 0.16;

        if (s.v < 0.002) {
          if (s.v !== 0) {
            s.v = 0;
            chars[i].style.transform = '';
            chars[i].style.color = '';
          }
          continue;
        }
        active = true;
        const w = Math.sin(now / 120 + i * 0.8);
        const lift = -s.v * 30 + w * s.v * 10;
        const push = (dx / (d || 1)) * -s.v * 12;
        const swell = 1 + s.v * 0.4;
        const rot = w * s.v * 10;
        chars[i].style.transform = `translate(${push.toFixed(1)}px, ${lift.toFixed(
          1,
        )}px) scale(${swell.toFixed(3)}) rotate(${rot.toFixed(2)}deg)`;
        chars[i].style.color = s.v > 0.55 ? 'var(--accent)' : '';
      }

      if (active || now - lastMove < 500) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      lastMove = performance.now();
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onLeave = () => {
      px = -9999;
      py = -9999;
      if (!raf) raf = requestAnimationFrame(loop);
    };

    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);
    return () => {
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
      chars.forEach((c) => {
        c.style.transform = '';
        c.style.color = '';
      });
    };
  }, [lines]);

  return (
    <div ref={wrapRef} className={styles.wrap}>
      <h1 className={`display ${styles.manifesto}`}>
        {lines.map((line, i) => (
          <span key={i} className={styles.lineMask}>
            <span className={styles.line} data-hline>
              {Array.from(line).map((ch, j) =>
                ch === ' ' ? (
                  <span key={j} className={styles.space}>
                    {' '}
                  </span>
                ) : (
                  <span key={j} className={styles.ch} data-ch="">
                    {ch}
                  </span>
                ),
              )}
            </span>
          </span>
        ))}
      </h1>
    </div>
  );
}
