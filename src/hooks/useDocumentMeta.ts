import { useEffect } from 'react';

interface DocumentMeta {
  title: string;
  description?: string;
  /** Canonical path, e.g. "/work/trace". Defaults to current pathname. */
  path?: string;
  image?: string;
}

const SITE = 'https://yusa.app';

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

/** Per-route <title>, description, canonical and Open Graph tags. */
export function useDocumentMeta({ title, description, path, image }: DocumentMeta) {
  useEffect(() => {
    document.title = title;

    const url = SITE + (path ?? window.location.pathname);
    const desc = description ?? '';
    const img = image ?? `${SITE}/og.png`;

    if (desc) {
      setMeta('meta[name="description"]', 'name', 'description', desc);
      setMeta('meta[property="og:description"]', 'property', 'og:description', desc);
    }
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:url"]', 'property', 'og:url', url);
    setMeta('meta[property="og:image"]', 'property', 'og:image', img);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [title, description, path, image]);
}
