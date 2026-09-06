/**
 * Generates public/sitemap.xml from the project list.
 * Run via `npm run sitemap` (also wired into prebuild).
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const SITE = 'https://yusa.app';

// Keep in sync with src/data/projects.ts
const slugs = ['trace', 'iposi', 'dgit', 'telemetria', 'octaily', 'minecraft-midi'];
const routes = ['/', '/work', '/about', '/contact', ...slugs.map((s) => `/work/${s}`)];
const today = new Date().toISOString().slice(0, 10);

const body = routes
  .map(
    (r) =>
      `  <url>\n    <loc>${SITE}${r}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n  </url>`,
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

writeFileSync(resolve(here, '../public/sitemap.xml'), xml);
console.log(`sitemap.xml written (${routes.length} urls)`);
