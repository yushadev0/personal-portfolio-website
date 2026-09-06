import { useEffect, useRef } from 'react';

import { prefersReducedMotion } from '../lib/motion';

/**
 * Attach to a container. Every descendant marked [data-reveal] / [data-reveal-clip]
 * animates in the first time IT (individually) scrolls into view. Items get a
 * small stagger only when several enter together. Pure CSS transitions.
 */
export function useReveal<T extends HTMLElement = HTMLElement>(options?: {
  stagger?: number;
  threshold?: number;
}) {
  const ref = useRef<T>(null);
  const { stagger = 80, threshold = 0.15 } = options ?? {};

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = Array.from(
      el.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-clip]'),
    );
    if (!items.length) return;

    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      items.forEach((t) => t.setAttribute('data-revealed', ''));
      return;
    }

    let batchStart = 0;
    let batchCount = 0;

    const io = new IntersectionObserver(
      (entries) => {
        const now = performance.now();
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          if (now - batchStart > 220) {
            batchStart = now;
            batchCount = 0;
          }
          target.style.setProperty('--reveal-delay', `${batchCount * stagger}ms`);
          batchCount += 1;
          target.setAttribute('data-revealed', '');
          io.unobserve(target);
        });
      },
      { threshold, rootMargin: '0px 0px -6% 0px' },
    );

    items.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [stagger, threshold]);

  return ref;
}
