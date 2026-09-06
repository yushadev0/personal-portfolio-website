import { createContext, useCallback, useContext, useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { morphText } from '../lib/textMorph';
import { prefersReducedMotion } from '../lib/motion';

interface LanguageMorphValue {
  switchLanguage: (lng: string) => void;
}

const Ctx = createContext<LanguageMorphValue | null>(null);

const TEXT_SELECTOR =
  'h1,h2,h3,h4,h5,h6,p,li,a,span,button,dt,dd,figcaption,strong,em,label,blockquote,summary,th,td,time';

function collectTextLeaves(): HTMLElement[] {
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  const out: HTMLElement[] = [];
  document.querySelectorAll<HTMLElement>(TEXT_SELECTOR).forEach((el) => {
    if (el.childElementCount !== 0) return;
    if (!el.textContent?.trim()) return;
    if (el.closest('[data-no-morph], pre, svg, [aria-hidden="true"]')) return;
    if (el.matches('input, textarea, select')) return;
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw) return;
    if (r.width < 2 || r.height < 2) return;
    out.push(el);
  });
  out.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
  return out.slice(0, 220);
}

const STEPS = 30;

export function LanguageMorphProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const busyRef = useRef(false);

  const switchLanguage = useCallback(
    (lng: string) => {
      const base = (i18n.resolvedLanguage ?? 'en').split('-')[0];
      if (lng === base || busyRef.current) return;

      if (prefersReducedMotion()) {
        i18n.changeLanguage(lng);
        return;
      }

      busyRef.current = true;
      const els = collectTextLeaves();

      // Swap the language first; React writes the new strings. Then decode each
      // leaf onto its new text — nothing else touches these nodes meanwhile.
      i18n.changeLanguage(lng).finally(() => {
        // a macrotask is enough for React to have committed the new strings,
        // and unlike rAF it always fires in headless/automation contexts.
        window.setTimeout(() => {
          const stoppers = els
            .filter((el) => el.isConnected)
            .map((el) => morphText(el, el.textContent ?? '', STEPS));
          window.setTimeout(
            () => {
              stoppers.forEach((s) => s());
              busyRef.current = false;
            },
            STEPS * 24 + 300,
          );
        }, 0);
      });
    },
    [i18n],
  );

  return <Ctx.Provider value={{ switchLanguage }}>{children}</Ctx.Provider>;
}

export function useLanguageMorph(): LanguageMorphValue {
  return useContext(Ctx) ?? { switchLanguage: () => {} };
}
