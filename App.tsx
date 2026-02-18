import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Preloader } from './components/Preloader';
import WorkPage from './pages/WorkPage';
import AboutPage from './pages/AboutPage';
import ProjectDetailPage from './pages/ProjectDetailPage';

const App: React.FC = () => {
  const location = useLocation();
  const isInitialMount = useRef(true);

  // Track initial path to determine if Preloader should show (only on homepage)
  const initialPath = useRef(location.pathname);
  const shouldShowPreloader = initialPath.current === '/';

  // Scroll to top of the active section when switching Work / About (not document top)
  useEffect(() => {
    // Skip scroll on initial mount - let the page load naturally at top
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only scroll when navigating between Work and About
    if (location.pathname === '/' || location.pathname === '/about') {
      const sectionId = location.pathname === '/' ? 'home' : 'about';
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [location.pathname]);

  // Loading State - skip preloader if not on homepage
  const [isLoading, setIsLoading] = useState(shouldShowPreloader);
  const [revealAnimFinished, setRevealAnimFinished] = useState(!shouldShowPreloader);

  const handleLoadComplete = () => {
    setIsLoading(false);
    // Wait for the CSS transition (1000ms) to complete before removing the transform property
    setTimeout(() => {
        setRevealAnimFinished(true);
    }, 1000);
  };

  // Determine active section based on current route
  const getActiveSection = () => {
    if (location.pathname === '/about') return 'about';
    if (location.pathname.startsWith('/project')) return 'work';
    return 'work'; // Default to 'work' for home page
  };

  return (
    <>
      {/* Preloader Overlay - only show on homepage refresh */}
      {shouldShowPreloader && isLoading && <Preloader onComplete={handleLoadComplete} />}

      {/* Main App Container - Scaling Animation on Reveal */}
      <div
        className={`bg-white text-black min-h-screen selection:bg-swiss-red selection:text-white transition-transform duration-1000 ease-out ${
            isLoading
                ? 'h-screen overflow-hidden scale-[0.96] opacity-0'
                : (revealAnimFinished ? 'opacity-100' : 'scale-100 opacity-100')
        }`}
      >
        <Header activeSection={getActiveSection()} />

        <main className="relative">
          <Routes>
            <Route path="/" element={<WorkPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/project/:id" element={<ProjectDetailPage />} />
          </Routes>
        </main>
      </div>
    </>
  );
};

export default App;
