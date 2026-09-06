import { animate, createTimeline, stagger, utils } from 'animejs';

export { animate, createTimeline, stagger, utils };

/** True if the visitor asked for reduced motion (read once, imperatively). */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Fire `fn` once when `el` scrolls into view. Cheap IntersectionObserver —
 * used for generic section reveals; anime.js timelines drive the showpieces.
 */
export function onEnter(
  el: Element,
  fn: () => void,
  { threshold = 0.15, rootMargin = '0px 0px -8% 0px' } = {},
): () => void {
  if (typeof IntersectionObserver === 'undefined') {
    fn();
    return () => {};
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          fn();
          io.disconnect();
          break;
        }
      }
    },
    { threshold, rootMargin },
  );
  io.observe(el);
  return () => io.disconnect();
}

export const EASE_OUT = 'out(3)';
export const EASE_IO = 'inOut(2.4)';
