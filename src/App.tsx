import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ThemeProvider } from './hooks/useTheme';
import { LenisProvider } from './hooks/useLenis';
import { LanguageMorphProvider } from './hooks/useLanguageMorph';
import { RootLayout } from './layouts/RootLayout';
import { RouteFallback } from './components/RouteFallback';

const Home = lazy(() => import('./pages/Home'));
const Work = lazy(() => import('./pages/Work'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <LenisProvider>
          <LanguageMorphProvider>
          <RootLayout>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/work" element={<Work />} />
                <Route path="/work/:slug" element={<ProjectDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </RootLayout>
          </LanguageMorphProvider>
        </LenisProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
