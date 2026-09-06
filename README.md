# Yuşa Göverdik — Personal Portfolio

An editorial, archive-style portfolio for a software engineer — built to read
like an engineering notebook rather than a resume. Projects are the evidence;
the interface just gets out of the way.

**Live:** [yusa.app](https://yusa.app)

---

## Concept

The site is structured as a catalogue of things built, broken and rebuilt.
A large typographic manifesto opens it, a numbered index lists the work, and
each project has its own route with a compact case study — overview, why it
exists, the engineering, the decisions. No card grid, no logo wall, no fake
metrics.

Light and dark are designed as two separate themes on a shared set of semantic
tokens, not a colour inversion. Everything is bilingual (English / Turkish) from
a single set of translation resources.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | **React 18** + **TypeScript** |
| Build tool | **Vite 5** (`es2020`, manual vendor chunks) |
| Routing | **React Router 6** — lazy routes, deep linking, per-route `<title>`/meta |
| i18n | **react-i18next** + `i18next-browser-languagedetector` — `common` / `projects` namespaces, persisted language |
| Motion | **anime.js 4** for timelines & staggers, **Lenis** for inertial smooth scroll |
| Icons | **lucide-react** |
| Styling | CSS Modules + hand-written design tokens (`--background`, `--foreground`, `--accent`, …) |
| SEO | Per-route metadata, Open Graph tags, generated `sitemap.xml`, `robots.txt` |

No CSS framework and no component library — the layout is a plain editorial
grid, and the interactions are small hand-rolled hooks.

## Notable details

- **Manifesto fluidify** — letters ripple and lift only where the pointer passes.
- **ASCII morph** — an old density-ramp text engine, reused for the skills panel
  and for the transition when you switch language.
- **Cat-paw theme wipe** — switching light/dark walks a trail of paw prints
  across the screen (a nod to *kedY*, the little cat mark used as the favicon).
- **Pointer parallax** on the capability panel and the *kedY* section.
- **Reveals on scroll** via `IntersectionObserver`, plus a clip-path route
  transition — all disabled under `prefers-reduced-motion`.

## Project structure

```
src/
  components/      UI + interaction pieces (Manifesto, WorkIndex, ThemeWipe, …)
  data/            projects.ts, skills.ts, kedy-path.ts  (facts only, no prose)
  hooks/           useTheme, useLanguageMorph, usePointerParallax, useReveal, …
  layouts/         RootLayout — masthead / footer / route shell
  lib/             motion.ts, textMorph.ts
  locales/         en/ · tr/  →  common.json + projects.json
  pages/           Home · Work · ProjectDetail · About · Contact · NotFound
  styles/          global.css, tokens.css
scripts/
  gen-sitemap.mjs  runs on prebuild
public/
  web.config       IIS rewrite + caching + MIME config
  favicon.svg      the kedY mark
  robots.txt · sitemap.xml
```

Content is kept out of the components: `src/data/*` holds immutable facts,
everything the visitor reads lives in `src/locales/**`.

## Getting started

Requires **Node 18+**.

```bash
npm ci            # install exact dependency versions
npm run dev       # start Vite dev server
npm run build     # type-check + production build to dist/
npm run preview   # serve the built dist/ locally
npm run lint      # tsc --noEmit
```

`npm run build` runs `scripts/gen-sitemap.mjs` first (via `prebuild`), then
`tsc -b && vite build`.

## Deployment

The output in `dist/` is a fully static SPA. Any host works as long as unknown
paths fall back to `index.html` for client-side routing.

- **IIS** — `public/web.config` ships in the build with the SPA rewrite rule,
  long-cache headers for the hashed `assets/`, an `index.html` revalidation
  rule, and the `.rar` MIME map. Needs the *URL Rewrite* module on the server.
- **Vercel / Netlify** — `vercel.json` and `public/_redirects` provide the same
  fallback.

## License

Personal project. The code is public for reference — feel free to read it and
take ideas. Please don't redeploy it as your own portfolio.

© 2026 Yuşa Göverdik
