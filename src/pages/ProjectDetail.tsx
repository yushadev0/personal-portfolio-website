import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

import { useEffect, useRef } from 'react';

import { PROJECTS_BY_SLUG, getAdjacent, type Project } from '../data/projects';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { onEnter, prefersReducedMotion } from '../lib/motion';
import { Figure } from '../components/Figure';
import NotFound from './NotFound';
import styles from './ProjectDetail.module.css';

const pad = (n: number) => String(n).padStart(2, '0');

export default function ProjectDetail() {
  const { slug = '' } = useParams();
  const { t, i18n } = useTranslation(['projects', 'common']);
  const articleRef = useRef<HTMLElement>(null);
  const project = PROJECTS_BY_SLUG[slug];

  useEffect(() => {
    const el = articleRef.current;
    if (!el) return;
    const blocks = Array.from(el.querySelectorAll<HTMLElement>('[data-block]'));
    if (prefersReducedMotion()) {
      blocks.forEach((b) => b.setAttribute('data-shown', ''));
      return;
    }
    blocks.forEach((b) => {
      b.querySelectorAll<HTMLElement>('[data-block-part]').forEach((p, i) =>
        p.style.setProperty('--part-delay', `${i * 70}ms`),
      );
    });
    const cleanups = blocks.map((b) =>
      onEnter(b, () => b.setAttribute('data-shown', ''), { threshold: 0.12 }),
    );
    return () => cleanups.forEach((c) => c());
  }, [slug]);

  const title = project ? t(`projects:${slug}.title`, { defaultValue: project.name }) : '';
  const descriptor = project
    ? t(`projects:${slug}.descriptor`, { defaultValue: project.descriptor })
    : '';

  useDocumentMeta({
    title: project ? `${title} — Yuşa Göverdik` : t('common:meta.notFound.title'),
    description: descriptor || undefined,
    path: `/work/${slug}`,
    image: project?.images[0] ? `https://yusa.app${project.images[0].src}` : undefined,
  });

  if (!project) return <NotFound />;

  const tp = (key: string) => t(`common:project.${key}`);
  const paragraphs = (section: string): string[] => {
    const value = t(`projects:${slug}.${section}`, { returnObjects: true, defaultValue: [] });
    return Array.isArray(value) ? (value as string[]) : [];
  };
  const caption = (key?: string): string | undefined =>
    key ? t(`projects:${slug}.images.${key}`, { defaultValue: '' }) || undefined : undefined;

  const { next } = getAdjacent(slug);
  const funFact = t(`projects:${slug}.funFact`, { defaultValue: '' });
  const secondaryImages = project.images.slice(1);

  return (
    <article ref={articleRef} className={styles.article}>
      <div className={`page ${styles.head}`} data-block>
        <Link to="/work" className={styles.crumb} data-block-part>
          <span className={styles.prompt}>$</span> cd ..
          <span className={styles.path}> / work / {slug}</span>
        </Link>

        <div className={styles.headGrid}>
          <span className={styles.index} data-block-part>
            {pad(project.index)}
          </span>
          <div className={styles.headMain} data-block-part>
            <h1 className={`display ${styles.title}`} data-scramble>
              {title}
            </h1>
            <p className={styles.descriptor}>{descriptor}</p>
          </div>

          <dl className={styles.facts} data-block-part>
            <Fact label={tp('year')} value={String(project.year)} />
            <Fact label={tp('status')} value={t(`common:status.${project.status}`)} />
            <Fact label={tp('category')} value={project.category} />
            <Fact label={tp('stack')} value={project.stack.join(', ')} />
            <div className={styles.factLinks}>
              <dt className="label">{tp('links')}</dt>
              <dd>
                {project.repository && (
                  <ExternalLink href={project.repository} label={tp('repository')} />
                )}
                {project.demo && <ExternalLink href={project.demo} label={tp('demo')} />}
                {project.download && (
                  <ExternalLink href={project.download} label={tp('download')} />
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {project.images[0] && (
        <div className={`page ${styles.hero}`}>
          <Figure
            src={project.images[0].src}
            alt={title}
            caption={caption(project.images[0].captionKey)}
            portrait={project.images[0].portrait}
            priority
          />
        </div>
      )}

      <div className={`page ${styles.body}`}>
        {project.sections.map((section, i) => {
          const paras = paragraphs(section);
          if (paras.length === 0) return null;
          return (
            <section key={section} className={styles.section} data-block>
              <div className={styles.sectionHead} data-block-part>
                <span className={styles.sectionNum}>{pad(i + 1)}</span>
                <h2 className={styles.sectionTitle} data-scramble>
                  {tp(section)}
                </h2>
              </div>
              <div className={styles.prose}>
                {paras.map((p, j) => (
                  <p key={j} data-block-part>
                    {p}
                  </p>
                ))}
              </div>
            </section>
          );
        })}

        {secondaryImages.length > 0 && (
          <div className={styles.section} data-block>
            <div className={styles.sectionHead} data-block-part>
              <span className={styles.sectionNum} />
              <h2 className={styles.sectionTitle}>{tp('gallery')}</h2>
            </div>
            <div className={styles.gallery} data-block-part>
              {secondaryImages.map((img) => (
                <Figure
                  key={img.src}
                  src={img.src}
                  alt={title}
                  caption={caption(img.captionKey)}
                  portrait={img.portrait}
                />
              ))}
            </div>
          </div>
        )}

        {funFact && (
          <aside className={styles.funFact} data-block>
            <span className="label" data-block-part>
              {tp('funFact')}
            </span>
            <p data-block-part>{funFact}</p>
          </aside>
        )}
      </div>

      <NextProject project={next} lang={i18n.language} label={tp('next')} />
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.fact}>
      <dt className="label">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={styles.extLink}>
      {label} <ArrowUpRight size={12} strokeWidth={1.75} />
    </a>
  );
}

function NextProject({
  project,
  label,
}: {
  project: Project;
  lang: string;
  label: string;
}) {
  const { t } = useTranslation('projects');
  const title = t(`${project.slug}.title`, { defaultValue: project.name });
  return (
    <Link to={`/work/${project.slug}`} className={`page ${styles.next}`}>
      <span className="label">{label}</span>
      <span className={styles.nextTitle}>
        {title} <ArrowRight size={22} strokeWidth={1.5} />
      </span>
    </Link>
  );
}
