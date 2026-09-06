import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { KedyMark } from '../components/Kedy';
import styles from './NotFound.module.css';

export default function NotFound() {
  const { t } = useTranslation();
  useDocumentMeta({
    title: t('meta.notFound.title'),
    description: t('meta.notFound.description'),
  });

  return (
    <section className={`page ${styles.wrap}`}>
      <KedyMark className={styles.cat} />
      <p className={styles.code} data-scramble>
        {t('notFound.code')}
      </p>
      <h1 className={`display ${styles.title}`} data-scramble>
        {t('notFound.title')}
      </h1>
      <p className={styles.body}>{t('notFound.body')}</p>
      <Link to="/" className="tlink">
        {t('notFound.home')} →
      </Link>
    </section>
  );
}
