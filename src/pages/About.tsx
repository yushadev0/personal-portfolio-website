import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useReveal } from '../hooks/useReveal';
import styles from './About.module.css';

interface Entry {
  period: string;
  title: string;
  place?: string;
  note?: string;
}

export default function About() {
  const { t } = useTranslation();
  const ref = useReveal<HTMLDivElement>({ stagger: 70, threshold: 0.05 });
  useDocumentMeta({
    title: t('meta.about.title'),
    description: t('meta.about.description'),
    path: '/about',
  });

  const body = t('about.body', { returnObjects: true }) as string[];
  const education = t('about.education', { returnObjects: true }) as Entry[];
  const experience = t('about.experience', { returnObjects: true }) as Entry[];
  const exploring = t('about.exploring', { returnObjects: true }) as string[];

  return (
    <div ref={ref} className={`page ${styles.about}`}>
      <header className={styles.head}>
        <span className="eyebrow" data-reveal data-scramble>
          {t('about.eyebrow')}
        </span>
        <h1 className={`display ${styles.lead}`} data-reveal data-scramble>
          {t('about.lead')}
        </h1>
      </header>

      <div className={styles.grid}>
        <div className={styles.bodyCol}>
          {body.map((p, i) => (
            <p key={i} className={styles.para} data-reveal>
              {p}
            </p>
          ))}
        </div>

        <div className={styles.sideCol}>
          <TimelineBlock title={t('about.experienceTitle')} entries={experience} />
          <TimelineBlock title={t('about.educationTitle')} entries={education} />

          <section className={styles.block} data-reveal>
            <h2 className="label">{t('about.exploringTitle')}</h2>
            <ul className={styles.exploring}>
              {exploring.map((item) => (
                <li key={item} data-scramble>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <p className={styles.cta} data-reveal>
            <Link to="/contact" className="tlink">
              {t('nav.contact')} →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function TimelineBlock({ title, entries }: { title: string; entries: Entry[] }) {
  return (
    <section className={styles.block} data-reveal>
      <h2 className="label">{title}</h2>
      <ul className={styles.timeline}>
        {entries.map((e, i) => (
          <li key={i} className={styles.entry} data-reveal>
            <span className={styles.period}>{e.period}</span>
            <span className={styles.entryTitle} data-scramble>
              {e.title}
            </span>
            {e.place && <span className={styles.place}>{e.place}</span>}
            {e.note && <span className={styles.entryNote}>{e.note}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}
