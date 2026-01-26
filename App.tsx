
import React, { useState, useEffect, useRef } from 'react';
import { ViewState } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProjectGrid } from './components/ProjectGrid';
import { ExperienceList } from './components/ExperienceList';
import { SkillsChart } from './components/SkillsChart';
import { WorkStyle } from './components/WorkStyle';
import { LifeGallery } from './components/LifeGallery';
import { Contact } from './components/Contact';
import { ProjectDetail } from './components/ProjectDetail';
import { Preloader } from './components/Preloader';
import { PROJECTS } from './constants';
import { Download } from 'lucide-react';

type AppView = 'landing' | 'project';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ViewState>('home');
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [exitingProject, setExitingProject] = useState(false);

  // Loading State
  const [isLoading, setIsLoading] = useState(true);
  // State to track when the reveal animation (scale up) is physically complete
  const [revealAnimFinished, setRevealAnimFinished] = useState(false);
  
  // Animation State for About Intro
  const [aboutVisible, setAboutVisible] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);

  const handleLoadComplete = () => {
    setIsLoading(false);
    // Wait for the CSS transition (1000ms) to complete before removing the transform property
    // This fixes position:fixed children (Header) relative to viewport
    setTimeout(() => {
        setRevealAnimFinished(true);
    }, 1000);
  };

  // Intersection Observer for Scroll Spy & Animation
  useEffect(() => {
    if (currentView !== 'landing') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as ViewState);
          }
          // Trigger About Animation
          if (entry.target.id === 'about' && entry.isIntersecting) {
             setAboutVisible(true);
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -20% 0px', 
        threshold: 0
      }
    );

    const sections = ['home', 'work', 'about', 'contact'];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [currentView]);

  const handleNavigate = (section: ViewState) => {
    // Special handling for Contact while in Project View -> Scroll to bottom of Project View
    if (currentView === 'project' && section === 'contact') {
       const contactSection = document.getElementById('contact');
       if (contactSection) {
         contactSection.scrollIntoView({ behavior: 'smooth' });
       }
       return;
    }

    // Project → Landing: fade-out exit, then switch
    if (currentView === 'project' && !exitingProject) {
      setExitingProject(true);
      setTimeout(() => {
        setExitingProject(false);
        setCurrentView('landing');
        setSelectedProjectId(null);
        // Wait for DOM to update after view switch, then scroll to target section
        setTimeout(() => {
          const el = document.getElementById(section);
          if (el) {
            // Use requestAnimationFrame to ensure DOM is fully rendered
            requestAnimationFrame(() => {
              el.scrollIntoView({ behavior: 'smooth' });
            });
          }
        }, 50);
      }, 280);
      return;
    }

    // Standard navigation within Landing View
    const element = document.getElementById(section);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  // Preload project assets when user clicks on a project
  const preloadProjectAssets = (projectId: string) => {
    const project = PROJECTS.find(p => p.id === projectId);
    if (!project) return;

    // Preload project cover image (critical - shown immediately)
    if (project.imageUrl) {
      const img = new Image();
      img.src = project.imageUrl;
    }

    // Preload project cover video metadata (if exists)
    if (project.videoUrl) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = project.videoUrl;
      video.load();
    }

    // Preload first few case study images (above the fold)
    if (project.caseStudy?.problem?.images && project.caseStudy.problem.images.length > 0) {
      project.caseStudy.problem.images.slice(0, 2).forEach(img => {
        const preloadImg = new Image();
        preloadImg.src = img.url;
      });
    } else if (project.caseStudy?.problem?.image) {
      const img = new Image();
      img.src = project.caseStudy.problem.image;
    }
  };

  const handleProjectClick = (id: string) => {
    // Preload project assets immediately when clicked
    preloadProjectAssets(id);
    
    // If already in a project view, exit current project first, then enter new one
    if (currentView === 'project' && selectedProjectId && selectedProjectId !== id) {
      setExitingProject(true);
      setTimeout(() => {
        setExitingProject(false);
        setSelectedProjectId(id);
        window.scrollTo(0, 0);
      }, 280); // Match fade-out duration
      return;
    }
    
    // First time entering a project or switching from landing
    setSelectedProjectId(id);
    setCurrentView('project');
    window.scrollTo(0, 0);
  };

  const handleBackToHome = () => {
    // Exit project with fade-out animation
    setExitingProject(true);
    setTimeout(() => {
      setExitingProject(false);
      setCurrentView('landing');
      setSelectedProjectId(null);
      setTimeout(() => {
        const element = document.getElementById('work');
        if (element) element.scrollIntoView();
      }, 50);
    }, 280); // Match fade-out duration
  };

  const selectedProject = PROJECTS.find(p => p.id === selectedProjectId);

  return (
    <>
      {/* Preloader Overlay */}
      {isLoading && <Preloader onComplete={handleLoadComplete} />}

      {/* Main App Container - Scaling Animation on Reveal */}
      <div 
        className={`bg-white text-black min-h-screen selection:bg-swiss-red selection:text-white transition-transform duration-1000 ease-out ${
            isLoading 
                ? 'h-screen overflow-hidden scale-[0.96] opacity-0' 
                : (revealAnimFinished ? 'opacity-100' : 'scale-100 opacity-100')
        }`}
      >
        <Header activeSection={activeSection} onNavigate={handleNavigate} />
        
        <main className="relative">
          {currentView === 'landing' ? (
            <>
              {/* Home Section */}
              <section id="home">
                <Hero />
              </section>

              {/* Work Section */}
              <section>
                <ProjectGrid id="work" onProjectClick={handleProjectClick} />
              </section>

              {/* About Section */}
              <section id="about" className="scroll-mt-16" ref={aboutRef}>
                {/* About Intro Header */}
                <div className="grid grid-cols-1 md:grid-cols-12 min-h-[60vh]">
                  {/* Left Column: Text */}
                  <div className="md:col-span-8 p-8 md:p-24 flex flex-col justify-center border-b md:border-b-0 md:border-r border-black overflow-hidden">
                    {/* Animated Content Container */}
                    <div className={`transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${aboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                        {/* Level 1: Display Title */}
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-8 leading-[0.85]">
                          About<br/>
                          <span 
                              className={`text-swiss-red text-4xl md:text-6xl tracking-normal block mt-2 transition-all duration-1000 delay-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${aboutVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
                          >
                              The Designer
                          </span>
                        </h1>
                        {/* Level 4: Lead Text */}
                        <p 
                          className={`text-lg md:text-2xl leading-relaxed max-w-2xl font-medium mb-10 text-neutral-800 transition-all duration-1000 delay-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${aboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                        >
                          I craft digital experiences where rigorous logic meets human emotion. 
    Specializing in AI and system strategy, I transform complex technology into clear, accessible narratives.
                        </p>
                        
                        <div className={`transition-all duration-1000 delay-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${aboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                          <a 
                            href="https://raw.githubusercontent.com/mialiu05/portfolio-assets/27e2ad8b19a574e482443dbe81c0a2d412797cda/Miao%20Liu%20-%20Product%20Designer%20CV.pdf" 
                            download
                            className="inline-flex items-center gap-3 border border-black px-8 py-4 text-xs font-bold tracking-widest hover:bg-black hover:text-white transition-all duration-300 group"
                          >
                            Download Resume 
                            <Download size={16} className="group-hover:translate-y-1 transition-transform duration-300"/>
                          </a>
                        </div>
                    </div>
                  </div>

                  {/* Right Column: Image */}
                  {/* Changed justify-end to justify-center for better balance */}
                  <div className="md:col-span-4 border-t md:border-t-0 border-black bg-[#f0f0f0] flex flex-col justify-center items-center p-8 md:p-12 overflow-hidden relative">
                     {/* Image Slide In Animation - Framed Style */}
                     <div className={`w-full max-w-sm h-auto mb-8 border border-black p-4 bg-white shadow-lg transition-all duration-1000 delay-500 ease-[cubic-bezier(0.22,1,0.36,1)] transform ${aboutVisible ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-12 rotate-2'}`}>
                        <img src="https://raw.githubusercontent.com/mialiu05/portfolio-assets/0b3ea60e75176203c59fd4721f0c3d4c30250004/profile.jpg" alt="Portrait" className="w-full h-full object-cover filter contrast-125" />
                     </div>
                     <div className={`flex items-center gap-3 font-mono text-xs font-bold tracking-widest text-neutral-500 transition-all duration-1000 delay-700 ${aboutVisible ? 'opacity-100' : 'opacity-0'}`}>
                         <span className="w-2 h-2 bg-swiss-red rounded-full animate-pulse"></span>
                         Leipzig, Germany
                     </div>
                  </div>
                </div>

                <ExperienceList />
                <SkillsChart />
                <WorkStyle />
                <LifeGallery />
              </section>

              {/* Contact Section */}
              <section id="contact" className="scroll-mt-16">
                <Contact />
              </section>
            </>
          ) : (
            selectedProject && (
              <ProjectDetail 
                  project={selectedProject} 
                  onBack={handleBackToHome} 
                  onNextProject={handleProjectClick}
                  isExiting={exitingProject}
              />
            )
          )}
        </main>
      </div>
    </>
  );
};

export default App;
