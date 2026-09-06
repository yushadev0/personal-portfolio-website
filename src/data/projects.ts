/**
 * Immutable, non-localised project facts.
 * Prose (overview / why / engineering / …) lives in src/locales/<lng>/projects.json,
 * keyed by `slug`. Nothing here is invented — see old_version/ and the source repos.
 */

export type ProjectStatus = 'active' | 'maintained' | 'shipped' | 'archived' | 'wip';

export interface ProjectImage {
  src: string;
  /** i18n key under projects:<slug>.images for the caption, optional. */
  captionKey?: string;
  /** Portrait-oriented UI shot — rendered narrower and centred. */
  portrait?: boolean;
}

export interface Project {
  slug: string;
  /** Index number shown in the catalogue (01, 02, …). */
  index: number;
  name: string;
  /** Short descriptor — English default; localised version in projects.json overrides. */
  descriptor: string;
  year: number;
  status: ProjectStatus;
  /** i18n key under common:project categories is not used — category is a plain string. */
  category: string;
  stack: string[];
  repository?: string;
  demo?: string;
  download?: string;
  /** First image doubles as the hover preview in the catalogue. */
  images: ProjectImage[];
  /** Which prose sections this project provides, in render order. */
  sections: Array<'overview' | 'why' | 'engineering' | 'decisions' | 'result' | 'learned'>;
  featured: boolean;
}

export const PROJECTS: Project[] = [
  {
    slug: 'trace',
    index: 1,
    name: 'Trace',
    descriptor: 'A lightweight developer-oriented browser, built from scratch',
    year: 2026,
    status: 'active',
    category: 'Personal tool',
    stack: ['Delphi 12', 'CEF4Delphi', 'Chromium', 'Skia4Delphi', 'SQLite', 'FireDAC'],
    repository: 'https://github.com/yushadev0/trace-browser',
    download: 'https://github.com/yushadev0/trace-browser/releases/latest',
    images: [{ src: '/assets/projects/trace-1.png', captionKey: 'images.newtab' }],
    sections: ['overview', 'why', 'engineering', 'decisions', 'result', 'learned'],
    featured: true,
  },
  {
    slug: 'iposi',
    index: 2,
    name: 'Iposi',
    descriptor: 'An API testing tool and its local bridge agent',
    year: 2026,
    status: 'active',
    category: 'Developer tool',
    stack: ['Delphi', 'UniGUI', 'Indy', 'MSSQL'],
    repository: 'https://github.com/yushadev0/iposi',
    demo: 'https://yusa.app/iposi',
    images: [{ src: '/assets/projects/iposi-1.png', captionKey: 'images.app' }],
    sections: ['overview', 'why', 'engineering', 'decisions'],
    featured: true,
  },
  {
    slug: 'dgit',
    index: 3,
    name: 'DGit',
    descriptor: 'A Git interface that lives inside the Delphi IDE',
    year: 2026,
    status: 'active',
    category: 'Developer tool',
    stack: ['Delphi', 'Object Pascal', 'Git'],
    repository: 'https://github.com/yushadev0/dgit',
    images: [
      { src: '/assets/projects/dgit-2.png', captionKey: 'images.panel', portrait: true },
      { src: '/assets/projects/dgit-4.png', captionKey: 'images.history' },
      { src: '/assets/projects/dgit-3.png', captionKey: 'images.settings' },
    ],
    sections: ['overview', 'why', 'engineering', 'decisions'],
    featured: true,
  },
  {
    slug: 'telemetria',
    index: 4,
    name: 'Telemetria',
    descriptor: 'Formula 1 analysis and a live race-engineer view for Assetto Corsa',
    year: 2026,
    status: 'active',
    category: 'Data / motorsport',
    stack: ['Delphi VCL', 'UniGUI', 'JavaScript', 'FastAPI', 'WebSocket'],
    repository: 'https://github.com/yushadev0/telemetria',
    demo: 'https://yusa.app/telemetria',
    images: [
      { src: '/assets/projects/telemetria-1.png', captionKey: 'images.f1' },
      { src: '/assets/projects/telemetria-2.gif', captionKey: 'images.ac' },
    ],
    sections: ['overview', 'why', 'engineering', 'result'],
    featured: true,
  },
  {
    slug: 'octaily',
    index: 5,
    name: 'Octaily',
    descriptor: 'A daily puzzle platform with eight games, front to back',
    year: 2026,
    status: 'shipped',
    category: 'Platform / API',
    stack: ['Delphi', 'UniGUI', 'REST', 'MSSQL', 'HTML/CSS', 'Ajax'],
    repository: 'https://github.com/yushadev0/octaily',
    demo: 'https://yusa.app/octaily',
    images: [
      { src: '/assets/projects/octaily-1.jpg', captionKey: 'images.app' },
      { src: '/assets/projects/octaily-2.png', captionKey: 'images.api' },
    ],
    sections: ['overview', 'why', 'engineering', 'decisions'],
    featured: true,
  },
  {
    slug: 'minecraft-midi',
    index: 6,
    name: 'Minecraft MIDI & Pixelart Painter',
    descriptor: 'Turning MIDI files and images into Minecraft, over RCON',
    year: 2025,
    status: 'shipped',
    category: 'Creative coding',
    stack: ['Python', 'MCRCON', 'OpenCV', 'MIDI'],
    repository: 'https://github.com/yushadev0/mmpp',
    download: 'https://yusa.app/assets/files/world.rar',
    images: [{ src: '/assets/projects/mcpp-1.png', captionKey: 'images.editors' }],
    sections: ['overview', 'why', 'engineering'],
    featured: true,
  },
];

export const PROJECTS_BY_SLUG: Record<string, Project> = Object.fromEntries(
  PROJECTS.map((p) => [p.slug, p]),
);

export function getAdjacent(slug: string): { next: Project } {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  const next = PROJECTS[(i + 1) % PROJECTS.length];
  return { next };
}
