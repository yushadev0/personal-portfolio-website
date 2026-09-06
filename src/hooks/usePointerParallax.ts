import { useEffect, useRef } from 'react';

import { prefersReducedMotion } from '../lib/motion';

/**
 * Drives eased `--px` / `--py` custom properties (-1 … 1) on the element from
 * the pointer's position within it. CSS layers then translate by
 * `calc(var(--px) * <depth>px)` for a parallax / tilt effect.
 */
export function usePointerParallax<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let running = false;
    let lastMove = 0;

    const tick = (now: number) => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.setProperty('--px', cx.toFixed(4));
      el.style.setProperty('--py', cy.toFixed(4));
      if (
        Math.abs(tx - cx) > 0.0015 ||
        Math.abs(ty - cy) > 0.0015 ||
        now - lastMove < 500
      ) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      lastMove = performance.now();
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
      el.style.removeProperty('--px');
      el.style.removeProperty('--py');
    };
  }, []);

  return ref;
}
