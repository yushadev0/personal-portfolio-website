import { useEffect, useMemo, type CSSProperties } from 'react';

import styles from './ThemeWipe.module.css';

const PAW =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>" +
  "<ellipse cx='32' cy='44' rx='17' ry='14' fill='%23ff7a45'/>" +
  "<ellipse cx='15' cy='26' rx='7.5' ry='10' fill='%23ff7a45'/>" +
  "<ellipse cx='27' cy='17' rx='8' ry='11' fill='%23ff7a45'/>" +
  "<ellipse cx='40' cy='17' rx='8' ry='11' fill='%23ff7a45'/>" +
  "<ellipse cx='50' cy='27' rx='7.5' ry='10' fill='%23ff7a45'/></svg>";

const N = 7;

interface Props {
  origin: { x: number; y: number };
  bg: string;
  onMidpoint: () => void;
  onDone: () => void;
}

/** Cat paw prints walk across; the new theme colour floods behind them. */
export function ThemeWipe({ origin, bg, onMidpoint, onDone }: Props) {
  useEffect(() => {
    const a = window.setTimeout(onMidpoint, 720);
    const b = window.setTimeout(onDone, 1500);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [onMidpoint, onDone]);

  const { paws, floodScale } = useMemo(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const toPt = { x: origin.x > W / 2 ? -0.15 * W : 1.15 * W, y: H * 1.12 };
    const dx = toPt.x - origin.x;
    const dy = toPt.y - origin.y;
    const len = Math.hypot(dx, dy) || 1;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    const nx = -dy / len;
    const ny = dx / len;
    const size = Math.min(76, Math.max(44, H * 0.064));

    const list = Array.from({ length: N }, (_, i) => {
      const p = i / (N - 1);
      const side = i % 2 === 0 ? 1 : -1;
      return {
        x: origin.x + dx * p + nx * side * size * 0.6 - size / 2,
        y: origin.y + dy * p + ny * side * size * 0.6 - size / 2,
        size,
        rot: angle + (Math.random() * 12 - 6),
        delay: i * 55,
      };
    });
    return { paws: list, floodScale: (Math.hypot(W, H) * 2.6) / 24 };
  }, [origin.x, origin.y]);

  return (
    <div className={styles.wrap} aria-hidden="true" data-theme-wipe>
      <span
        className={styles.flood}
        style={
          {
            background: bg,
            left: `${origin.x - 12}px`,
            top: `${origin.y - 12}px`,
            '--to': floodScale,
          } as CSSProperties
        }
      />
      {paws.map((p, i) => (
        <span
          key={i}
          className={styles.paw}
          style={
            {
              left: `${p.x}px`,
              top: `${p.y}px`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundImage: `url("${PAW}")`,
              animationDelay: `${p.delay}ms`,
              '--rot': `${p.rot}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
