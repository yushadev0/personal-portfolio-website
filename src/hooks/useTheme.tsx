import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { ThemeWipe } from '../components/ThemeWipe';

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  explicit: boolean;
  setTheme: (theme: Theme, origin?: { x: number; y: number }) => void;
  toggle: (origin?: { x: number; y: number }) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = 'theme';
const BG: Record<Theme, string> = { light: '#f7f6f3', dark: '#0e0e10' };

function readInitial(): { theme: Theme; explicit: boolean } {
  if (typeof document === 'undefined') return { theme: 'light', explicit: false };
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch {
    stored = null;
  }
  if (stored === 'light' || stored === 'dark') return { theme: stored, explicit: true };
  const current = document.documentElement.dataset.theme;
  if (current === 'light' || current === 'dark') return { theme: current, explicit: false };
  return { theme: 'light', explicit: false };
}

function reducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

interface WipeState {
  key: number;
  to: Theme;
  origin: { x: number; y: number };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [{ theme, explicit }, setState] = useState(readInitial);
  const [wipe, setWipe] = useState<WipeState | null>(null);
  const themeRef = useRef(theme);
  themeRef.current = theme;
  const busy = useRef(false);

  const commit = useCallback((next: Theme) => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* session-only */
    }
    setState({ theme: next, explicit: true });
  }, []);

  const setTheme = useCallback(
    (next: Theme, origin?: { x: number; y: number }) => {
      if (busy.current || next === themeRef.current) return;
      if (reducedMotion() || !origin) {
        commit(next);
        return;
      }
      busy.current = true;
      setWipe({ key: Date.now(), to: next, origin });
    },
    [commit],
  );

  const toggle = useCallback(
    (origin?: { x: number; y: number }) => {
      setTheme(themeRef.current === 'dark' ? 'light' : 'dark', origin);
    },
    [setTheme],
  );

  const onMidpoint = useCallback(() => {
    if (wipe) commit(wipe.to);
  }, [wipe, commit]);

  const onDone = useCallback(() => {
    setWipe(null);
    busy.current = false;
  }, []);

  // Follow the system while the user hasn't chosen explicitly.
  useEffect(() => {
    if (explicit) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => {
      const next: Theme = e.matches ? 'dark' : 'light';
      document.documentElement.dataset.theme = next;
      setState({ theme: next, explicit: false });
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [explicit]);

  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]:not([media])',
    );
    if (meta) meta.content = BG[theme];
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, explicit, setTheme, toggle }),
    [theme, explicit, setTheme, toggle],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
      {wipe && (
        <ThemeWipe
          key={wipe.key}
          origin={wipe.origin}
          bg={BG[wipe.to]}
          onMidpoint={onMidpoint}
          onDone={onDone}
        />
      )}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
