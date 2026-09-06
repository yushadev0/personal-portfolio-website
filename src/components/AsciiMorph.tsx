import { useEffect, useRef } from 'react';

import { DENSITY } from '../data/skills';
import { prefersReducedMotion } from '../lib/motion';

interface AsciiMorphProps {
  lines: string[];
  className?: string;
  /** morph frames (~25ms each) */
  steps?: number;
}

function normalize(lines: string[]): string[] {
  const w = Math.max(0, ...lines.map((l) => l.length));
  return lines.map((l) => l.padEnd(w, ' '));
}

const dIndex = (c: string) => {
  const i = DENSITY.indexOf(c);
  return i === -1 ? DENSITY.length - 1 : i;
};

/**
 * Ports the previous site's ASCII morph: interpolates each character between
 * the outgoing and incoming frame through a density ramp, with a per-cell
 * random delay so the transition dissolves rather than swipes.
 */
export function AsciiMorph({ lines, className, steps = 46 }: AsciiMorphProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const currentRef = useRef<string[]>(normalize(lines));
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  // First paint.
  useEffect(() => {
    if (preRef.current) preRef.current.textContent = currentRef.current.join('\n');
  }, []);

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;

    const target = normalize(lines);
    const current = currentRef.current;

    if (prefersReducedMotion() || current.join('\n') === target.join('\n')) {
      pre.textContent = target.join('\n');
      currentRef.current = target;
      return;
    }

    const h = Math.max(current.length, target.length);
    const w = Math.max(0, ...current.map((l) => l.length), ...target.map((l) => l.length));
    const delay = Array.from({ length: h }, () =>
      Array.from({ length: w }, () => Math.random() * 0.4),
    );

    let frame = 0;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const t = frame / steps;
      let out = '';
      for (let y = 0; y < h; y++) {
        let row = '';
        for (let x = 0; x < w; x++) {
          const from = current[y]?.[x] ?? ' ';
          const to = target[y]?.[x] ?? ' ';
          const diFrom = dIndex(from);
          if (from === to) {
            const breathe = Math.sin((t + delay[y][x]) * Math.PI * 2);
            const offset = Math.round(breathe * 0.5);
            row += DENSITY[Math.max(0, Math.min(DENSITY.length - 1, diFrom + offset))];
          } else {
            const local = Math.min(1, Math.max(0, (t - delay[y][x]) / 0.4));
            const d = Math.round(diFrom + (dIndex(to) - diFrom) * local);
            row += DENSITY[Math.max(0, Math.min(DENSITY.length - 1, d))];
          }
        }
        out += row + (y < h - 1 ? '\n' : '');
      }
      pre.textContent = out;
      frame++;
      if (frame > steps) {
        clearInterval(timerRef.current);
        pre.textContent = target.join('\n');
        currentRef.current = target;
      }
    }, 25);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [lines, steps]);

  return <pre ref={preRef} className={className} aria-hidden="true" />;
}
