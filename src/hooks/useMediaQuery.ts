import { useEffect, useState } from 'react';

/** Subscribe to a CSS media query. SSR-safe (returns `false` before mount). */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** True on devices whose primary input can hover (i.e. a mouse). */
export function useHasHover(): boolean {
  return useMediaQuery('(hover: hover) and (pointer: fine)');
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
