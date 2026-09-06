import { type ReactNode } from 'react';

import { useReveal } from '../hooks/useReveal';
import styles from './Section.module.css';

interface SectionProps {
  /** e.g. "02 / SELECTED WORK" */
  eyebrow?: string;
  title?: string;
  /** Optional intro paragraph shown under the title. */
  note?: string;
  /** Right-aligned slot next to the eyebrow (a link, count, etc.). */
  aside?: ReactNode;
  id?: string;
  children: ReactNode;
  /** Drop the top hairline rule. */
  flush?: boolean;
}

export function Section({ eyebrow, title, note, aside, id, children, flush }: SectionProps) {
  const ref = useReveal<HTMLElement>({ stagger: 90 });

  return (
    <section
      ref={ref}
      id={id}
      className={`page ${styles.section} ${flush ? styles.flush : ''}`}
    >
      {(eyebrow || aside) && (
        <div className={styles.top} data-reveal>
          {eyebrow && (
            <span className="eyebrow" data-scramble>
              {eyebrow}
            </span>
          )}
          {aside && <div className={styles.aside}>{aside}</div>}
        </div>
      )}
      {title && (
        <h2 className={`display ${styles.title}`} data-reveal-clip>
          <span data-scramble>{title}</span>
        </h2>
      )}
      {note && (
        <p className={styles.note} data-reveal>
          {note}
        </p>
      )}
      <div className={styles.body} data-reveal>
        {children}
      </div>
    </section>
  );
}
