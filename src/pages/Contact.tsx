import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';

import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useReveal } from '../hooks/useReveal';
import styles from './Contact.module.css';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xqezwrgz';
const EMAIL = 'yusaguverdik@gmail.com';

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/yushadev0', icon: 'fa-brands fa-github' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/yusaguverdik/',
    icon: 'fa-brands fa-linkedin-in',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/yusaguverdik/',
    icon: 'fa-brands fa-instagram',
  },
];

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function Contact() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<Status>('idle');
  const ref = useReveal<HTMLDivElement>({ stagger: 70, threshold: 0.05 });

  useDocumentMeta({
    title: t('meta.contact.title'),
    description: t('meta.contact.description'),
    path: '/contact',
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus('sending');
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <div ref={ref} className={`page ${styles.contact}`}>
      <header className={styles.head}>
        <span className="eyebrow" data-reveal data-scramble>
          {t('contact.eyebrow')}
        </span>
        <h1 className={`display ${styles.title}`} data-reveal data-scramble>
          {t('contact.title')}
        </h1>
        <p className={styles.lead} data-reveal>
          {t('contact.lead')}
        </p>
      </header>

      <div className={styles.grid}>
        <div className={styles.direct}>
          <div className={styles.field} data-reveal>
            <span className="label">{t('contact.emailLabel')}</span>
            <a href={`mailto:${EMAIL}`} className={styles.email}>
              {EMAIL}
            </a>
          </div>

          <div className={styles.field} data-reveal>
            <span className="label">{t('contact.elsewhereLabel')}</span>
            <ul className={styles.socials}>
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="me noreferrer" className={styles.social}>
                    <i className={`${s.icon} ${styles.socialIcon}`} aria-hidden="true" />
                    {s.label}
                    <ArrowUpRight size={13} strokeWidth={1.75} className={styles.socialArrow} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate data-reveal>
          <span className="label">{t('contact.formTitle')}</span>

          <label className={styles.formRow}>
            <span className={styles.formLabel}>{t('contact.formName')}</span>
            <span className={styles.inputWrap}>
              <span className={styles.prompt}>$</span>
              <input
                type="text"
                name="name"
                required
                autoComplete="name"
                placeholder={t('contact.formNamePh')}
              />
            </span>
          </label>

          <label className={styles.formRow}>
            <span className={styles.formLabel}>{t('contact.formEmail')}</span>
            <span className={styles.inputWrap}>
              <span className={styles.prompt}>$</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder={t('contact.formEmailPh')}
              />
            </span>
          </label>

          <label className={styles.formRow}>
            <span className={styles.formLabel}>{t('contact.formMessage')}</span>
            <span className={`${styles.inputWrap} ${styles.textareaWrap}`}>
              <span className={styles.prompt}>$</span>
              <textarea
                name="message"
                rows={5}
                required
                placeholder={t('contact.formMessagePh')}
              />
            </span>
          </label>

          <div className={styles.submitRow}>
            <button type="submit" className={styles.submit} disabled={status === 'sending'}>
              {status === 'sending' ? t('contact.formSending') : t('contact.formSubmit')}
            </button>
            <span
              className={`${styles.status} ${status === 'error' ? styles.statusError : ''}`}
              role="status"
              aria-live="polite"
            >
              {status === 'success' && t('contact.formSuccess')}
              {status === 'error' && t('contact.formError')}
            </span>
          </div>
        </form>
      </div>

      <p className={styles.closing}>{t('contact.closing')}</p>
    </div>
  );
}
