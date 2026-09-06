import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import Lenis from 'lenis';
import { useLocation } from 'react-router-dom';

import { usePrefersReducedMotion } from './useMediaQuery';

const LenisContext = createContext<Lenis | null>(null);

/**
 * Apple-style inertial smooth scrolling. Disabled entirely when the visitor
 * asks for reduced motion — native scroll then, no hijacking.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const rafRef = useRef<number>();
  const { pathname } = useLocation();

  useEffect(() => {
    if (reduced) {
      setLenis(null);
      return;
    }

    const instance = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      lerp: 0.11,
    });
    setLenis(instance);

    const raf = (time: number) => {
      instance.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      instance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  // Jump to top on route change (Lenis owns scroll position).
  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname, lenis]);

  // Smooth same-page anchor jumps through Lenis.
  useEffect(() => {
    if (!lenis) return;
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest?.('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute('href')!.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -72, duration: 1.2 });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}
