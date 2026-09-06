import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';

import { PROJECTS, type Project } from '../data/projects';
import { prefersReducedMotion, onEnter } from '../lib/motion';
import styles from './WorkIndex.module.css';

interface WorkIndexProps {
  projects?: Project[];
  /** Show the sticky "NN / NN" scroll counter (the full index page). */
  counter?: boolean;
}

const pad = (n: number) => String(n).padStart(2, '0');

export function WorkIndex({ projects = PROJECTS, counter = false }: WorkIndexProps) {
  const { t } = useTranslation(['common', 'projects']);
  const listRef = useRef<HTMLOListElement>(null);
  const [current, setCurrent] = useState(projects[0]?.index ?? 1);

  // Staggered reveal of each row on first view (CSS transitions, IO trigger).
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const rows = Array.from(list.querySelectorAll<HTMLElement>('[data-row]'));

    if (prefersReducedMotion()) {
      rows.forEach((r) => r.setAttribute('data-shown', ''));
      return;
    }

    rows.forEach((row) => {
      row.querySelectorAll<HTMLElement>('[data-row-part]').forEach((part, i) => {
        part.style.setProperty('--part-delay', `${i * 80}ms`);
      });
    });

    const cleanups = rows.map((row) =>
      onEnter(row, () => row.setAttribute('data-shown', ''), { threshold: 0.18 }),
    );
    return () => cleanups.forEach((c) => c());
  }, [projects]);

  // Sticky counter tracks the row nearest the viewport middle.
  useEffect(() => {
    if (!counter) return;
    const list = listRef.current;
    if (!list) return;
    const rows = Array.from(list.querySelectorAll<HTMLElement>('[data-row]'));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.index);
            if (idx) setCurrent(idx);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, [counter, projects]);

  return (
    <div className={styles.wrap}>
      {counter && (
        <div className={styles.counter} aria-hidden="true">
          <span className={styles.counterNow}>{pad(current)}</span>
          <span className={styles.counterTotal}>/ {pad(projects.length)}</span>
        </div>
      )}

      <ol ref={listRef} className={styles.list}>
        {projects.map((p) => {
          const title = t(`projects:${p.slug}.title`, { defaultValue: p.name });
          const descriptor = t(`projects:${p.slug}.descriptor`, {
            defaultValue: p.descriptor,
          });
          return (
            <li key={p.slug} className={styles.item} data-row data-index={p.index}>
              <Link to={`/work/${p.slug}`} className={styles.link}>
                <span className={styles.bar} aria-hidden="true" />

                <span className={styles.ghost} aria-hidden="true">
                  {pad(p.index)}
                </span>

                <span className={styles.num} data-row-part>
                  {pad(p.index)}
                </span>

                <span className={styles.body}>
                  <span className={styles.name} data-row-part>
                    {title}
                    <ArrowUpRight className={styles.arrow} size={22} strokeWidth={1.5} />
                  </span>
                  <span className={styles.descriptor} data-row-part>
                    {descriptor}
                  </span>
                </span>

                <span className={styles.meta} data-row-part>
                  <span className={styles.metaYear}>{p.year}</span>
                  <span className={styles.metaStatus}>
                    <span
                      className={styles.dot}
                      data-status={p.status}
                      aria-hidden="true"
                    />
                    {t(`common:status.${p.status}`)}
                  </span>
                  <span className={styles.metaStack}>{p.stack.slice(0, 4).join(' / ')}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
