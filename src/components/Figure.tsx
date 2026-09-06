import { useEffect, useRef } from 'react';

import { onEnter, prefersReducedMotion } from '../lib/motion';
import styles from './Figure.module.css';

interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
  priority?: boolean;
  /** Portrait UI shot — constrained width, centred. */
  portrait?: boolean;
}

export function Figure({ src, alt, caption, priority = false, portrait = false }: FigureProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) {
      el?.setAttribute('data-revealed', '');
      return;
    }
    return onEnter(el, () => el.setAttribute('data-revealed', ''), { threshold: 0.2 });
  }, []);

  return (
    <figure
      ref={ref}
      className={`${styles.figure} ${portrait ? styles.portrait : ''}`}
      data-reveal-fig
    >
      <div className={styles.frame}>
        <img src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async" />
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
