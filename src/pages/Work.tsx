import { useTranslation } from 'react-i18next';

import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { WorkIndex } from '../components/WorkIndex';
import { PROJECTS } from '../data/projects';
import styles from './Work.module.css';

export default function Work() {
  const { t } = useTranslation();
  useDocumentMeta({
    title: t('meta.work.title'),
    description: t('meta.work.description'),
    path: '/work',
  });

  return (
    <div className={`page ${styles.work}`}>
      <header className={styles.head}>
        <span className="eyebrow" data-scramble>
          {t('work.eyebrow')}
        </span>
        <h1 className={`display ${styles.title}`} data-scramble>
          {t('work.title')}
        </h1>
        <p className={styles.intro}>{t('work.intro')}</p>
        <span className={styles.count}>
          {t('work.count', { count: PROJECTS.length })}
        </span>
      </header>

      <WorkIndex projects={PROJECTS} counter />
    </div>
  );
}
