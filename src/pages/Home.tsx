import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { Hero } from '../components/Hero';
import { Section } from '../components/Section';
import { WorkIndex } from '../components/WorkIndex';
import { Capabilities } from '../components/Capabilities';
import { KedySection } from '../components/Kedy';
import { PROJECTS } from '../data/projects';
import styles from './Home.module.css';

export default function Home() {
  const { t } = useTranslation();
  useDocumentMeta({
    title: t('meta.home.title'),
    description: t('meta.home.description'),
    path: '/',
  });

  const featured = PROJECTS.filter((p) => p.featured);

  return (
    <>
      <Hero />

      <Section
        id="work"
        eyebrow={t('home.workEyebrow')}
        title={t('home.workTitle')}
        note={t('home.workNote')}
        aside={
          <Link to="/work" className="tlink">
            {t('home.viewAll')} →
          </Link>
        }
      >
        <WorkIndex projects={featured} />
      </Section>

      <Capabilities />

      <Section eyebrow={t('home.aboutEyebrow')} title={t('home.aboutTitle')}>
        <div className={styles.split}>
          <p className={styles.lead}>{t('home.aboutBody')}</p>
          <Link to="/about" className="tlink">
            {t('home.aboutLink')} →
          </Link>
        </div>
      </Section>

      <KedySection />

      <Section eyebrow={t('home.contactEyebrow')} title={t('home.contactTitle')}>
        <div className={styles.split}>
          <p className={styles.lead}>{t('home.contactBody')}</p>
          <Link to="/contact" className="tlink">
            {t('home.contactLink')} →
          </Link>
        </div>
      </Section>
    </>
  );
}
