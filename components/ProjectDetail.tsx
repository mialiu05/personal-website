
import React, { useEffect, useState, useRef } from 'react';
import { Project } from '../types';
import { ArrowRight, ExternalLink, ArrowUpRight, List } from 'lucide-react';
import { PROJECTS } from '../constants';
import { Contact } from './Contact';
import { preloadProjectDetailResources } from '../utils/resourcePreloader';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onNextProject: (id: string) => void;
  isExiting?: boolean;
}

// Helper Component for Auto-Playing Videos with Loop and Placeholder
// 1. Auto-plays when scrolled into view
// 2. Loops continuously when mouse hovers
// 3. Shows placeholder (poster or skeleton) until video is ready
// preload=metadata + optional poster reduce initial bandwidth; full video loads on play.
const AutoPlayVideo: React.FC<{ src: string; className?: string; poster?: string }> = ({ src, className, poster }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Increased rootMargin to 800px to start loading video metadata earlier for smoother experience
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.01, rootMargin: '800px' }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isInView) return;

    const handleCanPlay = () => {
      setIsReady(true);
      video.play().catch(() => {});
    };

    const handleLoadedMetadata = () => {
      // Video metadata loaded, show poster or start loading
      if (poster) {
        setIsReady(true);
      }
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    // Auto-play when scrolled into view
    if (isInView) {
      video.play().catch(() => {});
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      if (!isInView) {
        video.pause();
      }
    };
  }, [isInView, poster]);

  const handleMouseEnter = () => {
    const video = videoRef.current;
    if (video) {
      // Ensure video plays and loops when mouse hovers
      video.play().catch(() => {});
    }
  };

  // Only use natural height if explicitly h-auto, not for object-contain (which should keep aspect ratio)
  const needsNaturalHeight = className.includes('h-auto');
  
  // Container class - use grid layout for overlay, similar to LazyImage
  const containerClass = needsNaturalHeight
    ? `relative overflow-hidden w-full grid`  // Natural height - removed place-items-stretch to prevent height issues
    : `relative overflow-hidden w-full h-full grid place-items-stretch`; // Default: fill parent
  
  return (
    <div ref={containerRef} className={containerClass}>
      {/* Placeholder - Show poster or skeleton until video is ready - Only show when not ready */}
      {!isReady && (
        <div 
          className={`col-start-1 row-start-1 w-full ${needsNaturalHeight ? 'h-auto' : 'h-full'} bg-neutral-200 transition-opacity duration-500 opacity-100`}
          style={{
            ...(needsNaturalHeight ? { 
              height: 'auto',
              minHeight: 0
            } : {}),
          }}
        >
          {poster ? (
            <img 
              src={poster} 
              alt="" 
              className={`w-full ${needsNaturalHeight ? 'h-auto' : 'h-full'} ${className.includes('object-contain') ? 'object-contain' : 'object-cover'}`}
              loading="lazy"
            />
          ) : (
            <div 
              className={`w-full ${needsNaturalHeight ? 'h-auto' : 'h-full'}`}
              style={{
                background: 'linear-gradient(90deg, #e5e5e5 25%, #f0f0f0 50%, #e5e5e5 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                ...(needsNaturalHeight ? { 
                  minHeight: 0
                } : {}),
              }}
            />
          )}
        </div>
      )}
      
      {/* Video */}
      {isInView && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          preload="metadata"
          muted
          playsInline
          loop
          onMouseEnter={handleMouseEnter}
          className={`col-start-1 row-start-1 block w-full ${needsNaturalHeight ? 'h-auto' : 'h-full'} ${className.includes('object-contain') ? 'object-contain' : 'object-cover'} transition-opacity duration-500 ${
            isReady ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
      
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

// Helper for Staggered Scroll Animations - FADE ONLY
const ScrollReveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Start revealing slightly before element enters viewport for smoother experience
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.05, rootMargin: '100px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`transition-opacity duration-700 ease-out ${className} ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Helper Component for Images with Placeholder
const LazyImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'auto' | 'sync';
}> = ({ src, alt, className = '', loading = 'lazy', decoding = 'async' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Increased rootMargin to 1000px to start loading much earlier for smoother experience
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.01, rootMargin: '1000px' }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Determine if we need to maintain aspect ratio or allow natural height
  const hasAspectRatio = className.includes('aspect-');
  const needsNaturalHeight = className.includes('h-auto');
  
  // Container class logic:
  // - If className has aspect-ratio, container should fill parent (h-full) and aspect-ratio is handled by parent
  // - If needsNaturalHeight, use natural height
  // - Otherwise, fill parent container
  const containerClass = hasAspectRatio
    ? `relative overflow-hidden w-full h-full grid place-items-stretch`  // Fill parent when aspect-ratio is on parent
    : needsNaturalHeight
      ? `relative overflow-hidden w-full grid`        // Natural height - removed place-items-stretch to prevent height issues
      : `relative overflow-hidden w-full h-full grid place-items-stretch`; // Default: fill parent
  
  // Placeholder positioning: 
  // - If container has aspect-ratio class, use absolute to fill (aspect ratio is handled by container)
  // - If needsNaturalHeight, use relative with minHeight
  // - Otherwise, use absolute to fill container
  // const placeholderPosition = needsNaturalHeight ? 'relative' : 'absolute inset-0';
  
  return (
    <div ref={containerRef} className={containerClass}>
      {/* Placeholder - Skeleton - Only show when image is not loaded */}
      {!isLoaded && (
        <div 
          className={`col-start-1 row-start-1 w-full ${needsNaturalHeight ? 'h-auto' : 'h-full'} bg-neutral-200 transition-opacity duration-500 opacity-100`}
          style={{
            background: 'linear-gradient(90deg, #e5e5e5 25%, #f0f0f0 50%, #e5e5e5 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            ...(needsNaturalHeight ? { 
              height: 'auto',
              minHeight: 0
            } : {}),
          }}
        />
      )}
      
      {/* Actual Image - Always render when in view to maintain layout */}
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={loading}
          decoding={decoding}
          onLoad={handleLoad}
          className={`col-start-1 row-start-1 block w-full ${needsNaturalHeight ? 'h-auto' : 'h-full'} ${className.includes('object-contain') ? 'object-contain' : className.includes('object-cover') ? 'object-cover' : ''} transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
      
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

// Helper for Image Reveal Animation - FADE ONLY (now wraps LazyImage)
const ImageReveal: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Increased rootMargin to start loading images earlier (500px ahead) for smoother experience
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.05, rootMargin: '500px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Check if className contains aspect-ratio - if so, inner div needs h-full to inherit height
  const hasAspectRatio = className.includes('aspect-');

  return (
    <div ref={ref} className={`overflow-hidden w-full ${className}`}>
      <div className={`transition-opacity duration-1000 ease-out w-full ${hasAspectRatio ? 'h-full' : 'h-auto'} ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ minHeight: 0 }}>
        {children}
      </div>
    </div>
  );
};


export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack, onNextProject, isExiting = false }) => {
  
  // Logic to find the next available project, skipping "Coming Soon" items
  const availableProjects = PROJECTS.filter(p => !p.comingSoon);
  const currentIndex = availableProjects.findIndex(p => p.id === project.id);
  const nextIndex = (currentIndex + 1) % availableProjects.length;
  const nextProject = availableProjects[nextIndex];

  const isGT30 = project.id === '4';

  const [activeSection, setActiveSection] = useState<string>('');
  const [tocOpen, setTocOpen] = useState(false);

  // Canvas Animation Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const sizeRef = useRef({ width: 0, height: 0 });

  // Video Refs for Next Project
  const nextVideoRef = useRef<HTMLVideoElement>(null);
  const nextVideoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNextMouseEnter = () => {
    if (nextVideoTimeoutRef.current) {
        clearTimeout(nextVideoTimeoutRef.current);
        nextVideoTimeoutRef.current = null;
    }
    if (nextVideoRef.current) {
        nextVideoRef.current.play().catch(e => console.log("Autoplay prevented", e));
    }
  };

  const handleNextMouseLeave = () => {
    nextVideoTimeoutRef.current = setTimeout(() => {
        if (nextVideoRef.current) {
            nextVideoRef.current.pause();
            nextVideoRef.current.currentTime = 0;
        }
    }, 700);
  };

  // Helper function to normalize website URL
  const normalizeWebsiteUrl = (url: string | undefined): string => {
    if (!url) return '';
    // If URL already starts with http:// or https://, use it as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Otherwise, prepend https://
    return `https://${url}`;
  };

  const metaDetails = [
    { label: 'Duration', value: project.duration },
    { label: 'Website', value: project.website, isLink: true },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setTocOpen(false);
    }
  };

  const hasReflection = project.caseStudy.reflection?.items && project.caseStudy.reflection.items.length > 0;
  const sections = ['Challenge', 'Approach', 'Outcome'];
  if (hasReflection) sections.push('Reflection');

  // Preload first-screen resources when component mounts
  useEffect(() => {
    // Collect all image URLs from the project
    const imageUrls: string[] = [];
    
    // Add project cover image
    if (project.imageUrl) imageUrls.push(project.imageUrl);
    
    // Add problem section images
    if (project.caseStudy.problem.images) {
      project.caseStudy.problem.images.forEach(img => {
        if (img.url) imageUrls.push(img.url);
      });
    } else if (project.caseStudy.problem.image) {
      imageUrls.push(project.caseStudy.problem.image);
    }
    
    // Add approach section images (first few)
    if (project.caseStudy.method.subsections) {
      project.caseStudy.method.subsections.slice(0, 2).forEach(sub => {
        sub.units?.forEach(unit => {
          if (unit.image?.url) imageUrls.push(unit.image.url);
        });
      });
    } else if (project.caseStudy.method.blocks) {
      project.caseStudy.method.blocks.slice(0, 2).forEach(block => {
        block.images?.slice(0, 3).forEach(img => {
          if (img.url) imageUrls.push(img.url);
        });
      });
    }
    
    // Collect video URLs
    const videoUrls: string[] = [];
    if (project.videoUrl) videoUrls.push(project.videoUrl);
    
    // Preload first-screen resources
    preloadProjectDetailResources(imageUrls, videoUrls);
  }, [project]);

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = sections.map(s => s.toLowerCase());
      
      let foundActive = false;
      for (const section of sectionIds) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Check if section is active (near top of viewport)
          if (rect.top >= 0 && rect.top <= window.innerHeight * 0.4) {
            setActiveSection(section);
            foundActive = true;
            break;
          }
          // Also check if we are scrolling up and section is already visible
          if (rect.bottom > 0 && rect.top < window.innerHeight * 0.4) {
             setActiveSection(section);
             foundActive = true;
             // Don't break here to find the topmost one if overlapping, but usually break is fine for top-down scan
             break;
          }
        }
      }

      // If no section is found active, check if we are past the last section or before the first
      if (!foundActive) {
          // Check if we are past the last content area (Outcome or Reflection)
          // The last section is sections[sections.length - 1]
          const lastSectionId = sections[sections.length - 1].toLowerCase();
          const lastElement = document.getElementById(lastSectionId);
          
          if (lastElement) {
              const rect = lastElement.getBoundingClientRect();
              if (rect.bottom < 0) {
                  // We scrolled past the last section
                  setActiveSection('');
              } else {
                  // We might be before the first section or between sections
                  // Check first section
                  const firstSectionId = sections[0].toLowerCase();
                  const firstElement = document.getElementById(firstSectionId);
                  if (firstElement) {
                      const firstRect = firstElement.getBoundingClientRect();
                      if (firstRect.top > window.innerHeight) {
                          // Before the first section
                          setActiveSection('');
                      }
                  }
              }
          }
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [sections]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseRef.current = { 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const resize = () => {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      sizeRef.current = { width: rect.width, height: rect.height };

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    window.addEventListener('resize', resize);
    resize();

    const simplex = (x: number, y: number, z: number) => {
      return Math.sin(x * 1.1 + z) * Math.cos(y * 1.2 - z) + 
             Math.sin(x * 2.3 - z) * Math.cos(y * 2.1 + z) * 0.5;
    };

    const fbm = (x: number, y: number, z: number) => {
        const qx = simplex(x + 5.2, y + 1.3, z * 0.2);
        const qy = simplex(x - 9.2, y + 8.6, z * 0.2);
        const rx = simplex(x + 2.5 * qx + 1.7, y + 2.5 * qy + 9.2, z);
        const ry = simplex(x + 2.5 * qx + 8.3, y + 2.5 * qy + 2.8, z);
        return simplex(x + 2.5 * rx, y + 2.5 * ry, z);
    };

    const lerp = (start: number, end: number, amt: number) => (1 - amt) * start + amt * end;
    const getT = (val1: number, val2: number, threshold: number) => (threshold - val1) / (val2 - val1);

    const draw = () => {
      if (!ctx || !canvas) return;
      
      const { width, height } = sizeRef.current;
      ctx.clearRect(0, 0, width, height);
      
      mouseRef.current.x = lerp(mouseRef.current.x, targetMouseRef.current.x, 0.08);
      mouseRef.current.y = lerp(mouseRef.current.y, targetMouseRef.current.y, 0.08);

      const cellSize = 12; 
      const cols = Math.ceil(width / cellSize) + 1;
      const rows = Math.ceil(height / cellSize) + 1;
      const gridValues = new Float32Array(cols * rows);
      const scale = 0.0007; 

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let px = x * cellSize;
          let py = y * cellSize;
          
          const dx = px - mouseRef.current.x;
          const dy = py - mouseRef.current.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          const maxDist = 600;
          
          if (dist < maxDist) {
            px -= dx * 0.05;
            py -= dy * 0.05;
          }
          
          gridValues[y * cols + x] = fbm(px * scale + time * 0.05, py * scale, time * 0.1);
        }
      }

      const thresholds: number[] = [];
      for (let t = -1.2; t <= 1.2; t += 0.3) {
        thresholds.push(t);
      }
      
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let y = 0; y < rows - 1; y++) {
        for (let x = 0; x < cols - 1; x++) {
          const cx = (x + 0.5) * cellSize;
          const cy = (y + 0.5) * cellSize;
          const distToMouse = Math.hypot(cx - mouseRef.current.x, cy - mouseRef.current.y);
          
          let strokeStyle = 'rgba(10, 10, 10, 0.08)'; 
          let lineWidth = 1;
          
          if (distToMouse < 350) {
             const intensity = 1 - (distToMouse / 350);
             const smoothIntensity = intensity * intensity * (3 - 2 * intensity);
             strokeStyle = `rgba(255, 51, 51, ${0.1 + smoothIntensity * 0.9})`;
             lineWidth = 1 + smoothIntensity * 1.5;
          }

          ctx.strokeStyle = strokeStyle;
          ctx.lineWidth = lineWidth;

          const v0 = gridValues[y * cols + x];
          const v1 = gridValues[y * cols + (x + 1)];
          const v2 = gridValues[(y + 1) * cols + (x + 1)];
          const v3 = gridValues[(y + 1) * cols + x];

          const minV = Math.min(v0, v1, v2, v3);
          const maxV = Math.max(v0, v1, v2, v3);

          for (let i = 0; i < thresholds.length; i++) {
             const threshold = thresholds[i];
             if (threshold < minV || threshold > maxV) continue;

             let state = 0;
             if (v0 > threshold) state |= 8;
             if (v1 > threshold) state |= 4;
             if (v2 > threshold) state |= 2;
             if (v3 > threshold) state |= 1;

             if (state === 0 || state === 15) continue;

             const pt0 = { x: (x + getT(v0, v1, threshold)) * cellSize, y: y * cellSize };
             const pt1 = { x: (x + 1) * cellSize, y: (y + getT(v1, v2, threshold)) * cellSize };
             const pt2 = { x: (x + getT(v3, v2, threshold)) * cellSize, y: (y + 1) * cellSize };
             const pt3 = { x: x * cellSize, y: (y + getT(v0, v3, threshold)) * cellSize };
             
             ctx.beginPath();
             switch (state) {
               case 1: ctx.moveTo(pt3.x, pt3.y); ctx.lineTo(pt2.x, pt2.y); break;
               case 2: ctx.moveTo(pt1.x, pt1.y); ctx.lineTo(pt2.x, pt2.y); break;
               case 3: ctx.moveTo(pt3.x, pt3.y); ctx.lineTo(pt1.x, pt1.y); break;
               case 4: ctx.moveTo(pt0.x, pt0.y); ctx.lineTo(pt1.x, pt1.y); break;
               case 5: ctx.moveTo(pt0.x, pt0.y); ctx.lineTo(pt3.x, pt3.y); ctx.moveTo(pt1.x, pt1.y); ctx.lineTo(pt2.x, pt2.y); break;
               case 6: ctx.moveTo(pt0.x, pt0.y); ctx.lineTo(pt2.x, pt2.y); break;
               case 7: ctx.moveTo(pt3.x, pt3.y); ctx.lineTo(pt0.x, pt0.y); break;
               case 8: ctx.moveTo(pt3.x, pt3.y); ctx.lineTo(pt0.x, pt0.y); break;
               case 9: ctx.moveTo(pt0.x, pt0.y); ctx.lineTo(pt2.x, pt2.y); break;
               case 10: ctx.moveTo(pt0.x, pt0.y); ctx.lineTo(pt1.x, pt1.y); ctx.moveTo(pt3.x, pt3.y); ctx.lineTo(pt2.x, pt2.y); break;
               case 11: ctx.moveTo(pt0.x, pt0.y); ctx.lineTo(pt1.x, pt1.y); break;
               case 12: ctx.moveTo(pt3.x, pt3.y); ctx.lineTo(pt1.x, pt1.y); break;
               case 13: ctx.moveTo(pt1.x, pt1.y); ctx.lineTo(pt2.x, pt2.y); break;
               case 14: ctx.moveTo(pt3.x, pt3.y); ctx.lineTo(pt2.x, pt2.y); break;
             }
             ctx.stroke();
          }
        }
      }

      time += 0.002;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const renderTocItems = (isCompact: boolean = false) => {
      const activeIndex = sections.findIndex(s => s.toLowerCase() === activeSection);
      const itemHeight = isCompact ? 28 : 36; 
      const indicatorHeight = isCompact ? 12 : 16;
      const paddingY = (itemHeight - indicatorHeight) / 2;
      const trackHeight = ((sections.length - 1) * itemHeight) + indicatorHeight;

      return (
          <div className="relative">
              <div 
                className="absolute left-0 w-[1px] bg-neutral-200" 
                style={{ top: paddingY, height: trackHeight }}
              />
              <div 
                  className="absolute left-[-0.5px] w-[2px] bg-swiss-red transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                      top: (Math.max(0, activeIndex) * itemHeight) + paddingY,
                      height: indicatorHeight,
                      opacity: activeIndex >= 0 ? 1 : 0
                  }}
              />
              <ul className="flex flex-col">
                {sections.map((section, idx) => {
                    const isActive = activeIndex === idx;
                    return (
                        <li key={section} style={{ height: itemHeight }} className="flex items-center pl-4 relative group">
                            <button 
                                onClick={() => scrollToSection(section.toLowerCase())}
                                className="text-left flex flex-col justify-center w-full h-full focus:outline-none"
                            >
                                <div className={`flex flex-col items-start transition-all duration-300 ${isActive ? 'opacity-100 translate-x-1' : 'opacity-40 group-hover:opacity-80 group-hover:translate-x-0.5'}`}>
                                     <span className={`font-mono leading-none mb-0.5 text-neutral-500 ${isCompact ? 'text-[8px]' : 'text-[10px]'}`}>
                                         0{idx + 1}
                                     </span>
                                     <span className={`font-bold tracking-tight leading-none ${isCompact ? 'text-xs' : 'text-sm'} text-black`}>
                                        {section}
                                    </span>
                                </div>
                            </button>
                        </li>
                    );
                })}
            </ul>
          </div>
      );
  };

  const FloatingToc = () => {
      // Only show TOC when we are in the case study content area
      // activeSection is set by the scroll listener in useEffect above
      // It will be non-empty when we are in Challenge, Approach, Outcome, or Reflection
      const shouldShow = activeSection !== '';

      return (
      <>
        {/* Toggle button: always visible below lg so Contents never "disappears" */}
        <button
          type="button"
          onClick={() => setTocOpen((o) => !o)}
          aria-label="Toggle contents"
          className={`lg:hidden fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-white border-2 border-black px-4 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-all duration-300 font-mono text-xs font-bold uppercase tracking-widest ${shouldShow ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        >
          <List size={16} />
          Contents
        </button>
        {/* Overlay + panel: floating layer when open */}
        <div
          className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ease-out ${
            tocOpen && shouldShow ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
            aria-hidden="true"
            onClick={() => setTocOpen(false)}
          />
          <div className="hidden md:block absolute left-8 top-28 w-[180px]">
            <div className="bg-white/95 backdrop-blur-md border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-5 rounded-sm">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-4 block">Contents</span>
              <div>{renderTocItems(false)}</div>
            </div>
          </div>
          <div className="md:hidden absolute left-4 right-4 top-24 max-w-[200px]">
            <div className="bg-white/95 backdrop-blur-md border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 rounded-sm">
              <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 mb-3 block">Contents</span>
              <div>{renderTocItems(true)}</div>
            </div>
          </div>
        </div>
      </>
  );
  };

  // Grid class for Summary Outcome - Responsive grid that adapts to screen size
  // 2 items: 1 col (mobile) → 2 cols (tablet+)
  // 3 items: 1 col (mobile) → 2 cols (tablet) → 3 cols (desktop)
  // 4 items: 1 col (mobile) → 2 cols (tablet) → 4 cols (desktop)
  const outcomeGridClass = project.impact.length === 2
    ? 'grid-cols-1 sm:grid-cols-2'
    : project.impact.length >= 4 
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' 
        : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
  
  return (
    <div
      key={project.id}
      className={`min-h-screen bg-white pt-16 shadow-2xl relative ${isExiting ? 'animate-page-fade-out pointer-events-none' : 'animate-page-fade-in'}`}
    >
      <FloatingToc />
      <section className="border-b border-black bg-white relative overflow-hidden min-h-[40vh] flex flex-col justify-center">
        <canvas ref={canvasRef} className="absolute inset-0 z-0" />
        <div className="grid grid-cols-12 relative z-10 pointer-events-none">
            <div className="col-span-12 p-12 md:p-24">
                <ScrollReveal>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-6 break-words pointer-events-auto">{project.title}</h1>
                </ScrollReveal>
                <div className="flex flex-wrap gap-3 mt-2 pointer-events-auto">
                    {project.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="border border-black px-3 py-1 text-[10px] md:text-xs lg:text-sm font-bold tracking-widest bg-white/50 transition-colors cursor-default">{tag}</span>
                    ))}
                </div>
            </div>
        </div>
      </section>

      <section className="border-b border-black">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-black bg-neutral-100">
                <ImageReveal className="w-full aspect-[4/3] lg:aspect-[4/3] relative group overflow-hidden">
                     {project.videoUrl ? (
                         <AutoPlayVideo src={project.videoUrl} poster={project.imageUrl} className="w-full h-full object-cover" />
                     ) : (
                         <LazyImage src={project.imageUrl} alt={project.title} className="w-full h-full" loading="eager" />
                     )}
                </ImageReveal>
            </div>

            <div className="lg:col-span-5 p-6 md:p-8 lg:p-12 flex flex-col">
                <div className="mb-8">
                    <ScrollReveal>
                        <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-swiss-red flex items-center gap-2">
                           <span className="w-2 h-2 bg-black block"></span> Overview
                        </h3>
                        <p className="text-base md:text-lg lg:text-xl font-medium leading-relaxed text-neutral-800">{project.intro}</p>
                    </ScrollReveal>
                </div>
                
                <div className="mt-auto">
                    <div className="border-t border-black pt-6 mb-6">
                         <div className="mb-6">
                            <span className="block text-[10px] md:text-xs lg:text-sm font-bold uppercase tracking-widest text-neutral-400 mb-1">Contribution</span>
                            <span className="text-sm md:text-base lg:text-lg font-bold block leading-relaxed">{project.role}</span>
                         </div>
                         <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                            {metaDetails.map((item) => (
                                <div key={item.label}>
                                    <span className="block text-[10px] md:text-xs lg:text-sm font-bold uppercase tracking-widest text-neutral-400 mb-1">{item.label}</span>
                                    {item.isLink ? (
                                        <a href={normalizeWebsiteUrl(item.value)} target="_blank" rel="noreferrer" className="text-sm md:text-base lg:text-lg font-bold flex items-center gap-2 hover:text-swiss-red transition-colors break-words">
                                            <span className="break-all">{item.value}</span> <ExternalLink size={12} className="flex-shrink-0" />
                                        </a>
                                    ) : (
                                        <span className="text-sm md:text-base lg:text-lg font-bold block break-words">{item.value}</span>
                                    )}
                                </div>
                            ))}
                         </div>
                    </div>

                    <div className="border-t border-black/10 pt-6">
                        <span className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3">Outcome</span>
                        <div className={`grid ${outcomeGridClass} gap-4`}>
                            {project.impact.map((item, idx) => (
                                <div key={idx}>
                                    <span className="block text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-swiss-red tracking-tighter leading-none mb-1 whitespace-nowrap">{item.value}</span>
                                    <p className="text-sm md:text-base font-bold leading-tight text-black mb-2">{item.label}</p>
                                    {item.description && (
                                        <p className="text-sm md:text-base font-normal leading-relaxed text-neutral-500">{item.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <section id="case-study-wrapper" className="border-b border-black relative">
        <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="hidden md:block md:col-span-4 lg:col-span-3 border-r border-black">
                <div className="sticky top-24 p-8">
                    <span className="text-[10px] md:text-xs lg:text-sm font-bold uppercase tracking-widest text-neutral-400 mb-4 block">Contents</span>
                    <div>{renderTocItems(false)}</div>
                </div>
            </div>

            <div className="col-span-1 md:col-span-8 lg:col-span-9 bg-white">
                <div id="challenge" className="border-b border-black/10">
                     <div className="p-[1.5em] md:p-[2.5em] max-w-5xl">
                        <ScrollReveal>
                            <span className="text-swiss-red font-mono text-xs font-bold uppercase tracking-widest mb-[0.75em] block">01. THE CHALLENGE</span>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tighter mb-[0.4em] leading-[0.9]">{project.caseStudy.problem.title}</h2>
                            <p className="text-base md:text-lg lg:text-xl leading-relaxed text-neutral-600 max-w-5xl">{project.caseStudy.problem.content}</p>
                        </ScrollReveal>
                     </div>
                     {project.caseStudy.problem.images && (
                        <div className="border-t border-black/10 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-px bg-black/10">
                            {project.caseStudy.problem.images.map((img, idx) => (
                                <div key={idx} className="bg-white flex flex-col h-full">
                                    <ImageReveal className={`${project.id === '3' ? 'aspect-[7/9]' : 'aspect-[4/3]'} overflow-hidden border-b border-black/20 md:border-black/10 flex-shrink-0`}>
                                        <LazyImage src={img.url} alt={img.caption} className="w-full h-full" />
                                    </ImageReveal>
                                    <div className="py-[0.75em] px-[1em] flex-1">
                                        <p className="text-sm md:text-base font-mono leading-relaxed text-neutral-500 border-l-2 border-swiss-red pl-[0.75em]">{img.caption}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                     )}
                     {!project.caseStudy.problem.images && project.caseStudy.problem.image && (
                        <ImageReveal className="w-full aspect-video md:aspect-[21/9] border-t border-black/10 overflow-hidden">
                            <LazyImage src={project.caseStudy.problem.image} alt="Challenge" className="w-full h-full" />
                        </ImageReveal>
                     )}
                </div>

                 <div id="approach" className="border-b border-black/10">
                    {!project.caseStudy.method.subsections && !project.caseStudy.method.blocks ? (
                        <div className="p-[1.5em] md:p-[2.5em] max-w-5xl">
                            <ScrollReveal>
                                <span className="text-swiss-red font-mono text-xs font-bold uppercase tracking-widest mb-[0.75em] block">02. THE APPROACH</span>
                                <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tighter mb-[0.4em] leading-[0.9]">{project.caseStudy.method.title}</h2>
                                <p className="text-base md:text-lg lg:text-xl leading-relaxed text-neutral-600 max-w-5xl">{project.caseStudy.method.content}</p>
                            </ScrollReveal>
                        </div>
                    ) : null}
                    
                    {project.caseStudy.method.subsections ? (
                        <div className="flex flex-col">
                            {project.caseStudy.method.subsections.map((sub, sIdx) => (
                                <div key={sIdx} className={`bg-white ${sIdx !== (project.caseStudy.method.subsections?.length || 0) - 1 ? 'border-b border-black/10' : ''}`}>
                                    {/* 标题区域 */}
                                    <div className="p-[1.5em] md:p-[2.5em]">
                                        <ScrollReveal>
                                            {sIdx === 0 && <span className="text-swiss-red font-mono text-xs md:text-sm font-bold uppercase tracking-widest mb-[1em] block">02. THE APPROACH</span>}
                                            <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tighter mb-[0.4em] leading-[0.9]">{sub.title}</h3>
                                            <p className="text-base md:text-lg lg:text-xl leading-relaxed text-neutral-600 max-w-5xl">{sub.content}</p>
                                        </ScrollReveal>
                                    </div>

                                    {/* 图片/视频单元格区域 */}
                                    <div className="border-t border-black/10">
                                        {sub.units.map((unit, uIdx) => (
                                            <div key={uIdx} className="bg-white border-b border-black/10 last:border-b-0">
                                                {/* 单元格文字 */}
                                                {(unit.title || unit.content) && (
                                                    <div className="p-[1.5em] md:px-[2.5em] pb-[0.5em]">
                                                        <ScrollReveal>
                                                            {unit.title && (
                                                                <h4 className="text-xl md:text-2xl lg:text-3xl font-bold mb-[0.5em] tracking-tight">{unit.title}</h4>
                                                            )}
                                                            <p className="text-base md:text-lg lg:text-xl leading-relaxed text-neutral-600 max-w-5xl">{unit.content}</p>
                                                        </ScrollReveal>
                                                    </div>
                                                )}
                                                <ImageReveal className="w-full overflow-hidden mb-6 md:mb-8">
                                                    {unit.image?.type === 'video' ? (
                                                        <AutoPlayVideo src={unit.image.url} className="w-full h-auto object-contain" />
                                                    ) : (
                                                        <LazyImage src={unit.image?.url || ''} alt={unit.image?.caption || ''} className="w-full h-auto object-contain" />
                                                    )}
                                                </ImageReveal>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : project.caseStudy.method.blocks ? (
                        /* Mixed Block Structure (Vertical + Grid) */
                        <div className="">
                             {project.caseStudy.method.blocks.map((block, bIdx) => (
                                <div key={bIdx} className={`bg-white ${bIdx !== (project.caseStudy.method.blocks?.length ?? 0) - 1 ? 'border-b border-black/10' : ''}`}>
                                     {(block.title || block.content) && (
                                         <div className="p-[1.5em] md:p-[2.5em]">
                                             <ScrollReveal>
                                                 <div className="max-w-5xl">
                                                     {bIdx === 0 && <span className="text-swiss-red font-mono text-xs md:text-sm font-bold uppercase tracking-widest mb-[1em] block">02. THE APPROACH</span>}
                                                     {block.title && <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tighter mb-[0.4em] leading-[0.9]">{block.title}</h3>}
                                                     {block.content && (
                                                         <div>
                                                             {block.content.split(/\n\s*\n/).filter(p => p.trim()).map((paragraph, pIdx) => (
                                                                 <p key={pIdx} className={`text-base md:text-lg lg:text-xl leading-relaxed text-neutral-600 ${pIdx > 0 ? 'mt-[0.5em]' : ''}`}>
                                                                     {paragraph.trim().split('\n').join(' ')}
                                                                 </p>
                                                             ))}
                                                         </div>
                                                     )}
                                                 </div>
                                             </ScrollReveal>
                                         </div>
                                     )}
                                     {/* Block Layout Logic: Grid (2 cols) vs Vertical (1 col) */}
                                     {block.layout === 'grid' ? (
                                         <div className="grid gap-2 md:gap-px bg-black/10 grid-cols-1 md:grid-cols-2">
                                             {block.images.map((img, iIdx) => (
                                                <div key={iIdx} className="bg-white">
                                                    <ImageReveal className="w-full overflow-hidden border-b border-black/20 md:border-black/10">
                                                        <div className="w-full relative">
                                                            <LazyImage src={img.url} alt={img.caption} className="w-full h-auto object-contain" />
                                                        </div>
                                                    </ImageReveal>
                                                    {img.caption && (
                                                        <div className="py-[0.75em] px-[1em]">
                                                            <p className="text-sm md:text-base lg:text-lg font-mono leading-relaxed text-neutral-500 border-l-2 border-swiss-red pl-[0.75em] mb-0">{img.caption}</p>
                                                        </div>
                                                    )}
                                                </div>
                                             ))}
                                         </div>
                                     ) : (
                                         /* VERTICAL LAYOUT: Match subsections structure - no grid, direct flex-col */
                                         <div className="border-t border-black/10 space-y-6 md:space-y-8">
                                             {block.images.map((img, iIdx) => (
                                                <div key={iIdx} className="bg-white border-b border-black/10 last:border-b-0">
                                                    {img.caption && (
                                                        <div className="p-[1.5em] md:px-[2.5em] pb-[1em]">
                                                            <ScrollReveal>
                                                                <p className="text-base md:text-lg lg:text-xl leading-relaxed text-neutral-600 max-w-5xl">{img.caption}</p>
                                                            </ScrollReveal>
                                                        </div>
                                                    )}
                                                    <ImageReveal className="w-full overflow-hidden mb-6 md:mb-8">
                                                        {img.type === 'video' ? (
                                                            <div className="w-full relative">
                                                                <AutoPlayVideo src={img.url} className="w-full h-auto object-contain" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-full relative">
                                                                <LazyImage src={img.url} alt={img.caption} className="w-full h-auto object-contain" />
                                                            </div>
                                                        )}
                                                    </ImageReveal>
                                                </div>
                                             ))}
                                         </div>
                                     )}
                                </div>
                             ))}
                        </div>
                    ) : (
                        /* Legacy Fallback */
                        project.caseStudy.method.images && project.caseStudy.method.images.length > 0 ? (
                            <div className="border-t border-black/10 flex flex-col divide-y divide-black/10">
                                 {project.caseStudy.method.images.map((img, idx) => (
                                    <div key={idx} className="w-full bg-white">
                                        {img.caption && (
                                            <div className="p-[1.5em] md:px-[2.5em] pb-[1em]">
                                                <ScrollReveal>
                                                    <p className="text-base md:text-lg leading-relaxed text-neutral-600 max-w-5xl">{img.caption}</p>
                                                </ScrollReveal>
                                            </div>
                                        )}
                                        <ImageReveal className="w-full aspect-video overflow-hidden">
                                            <LazyImage src={img.url} alt={img.caption || `Approach step ${idx + 1}`} className="w-full h-full" />
                                        </ImageReveal>
                                    </div>
                                 ))}
                            </div>
                        ) : (
                             <ImageReveal className="w-full aspect-video md:aspect-[21/9] border-t border-black/10 overflow-hidden">
                                <LazyImage src={project.caseStudy.method.image} alt="Approach" className="w-full h-full" />
                            </ImageReveal>
                        )
                    )}
                </div>

                 <div id="outcome" className="border-b border-black/10">
                    <div className="p-[1.5em] md:p-[2.5em] max-w-5xl">
                        <ScrollReveal>
                            <span className="text-swiss-red font-mono text-xs font-bold uppercase tracking-widest mb-[0.75em] block">03. THE OUTCOME</span>
                        </ScrollReveal>
                    </div>
                    {project.impact && (
                        <div className={`border-t border-black/10 grid ${outcomeGridClass} divide-y md:divide-y-0 md:divide-x divide-black/10`}>
                            {project.impact.map((item, idx) => (
                                <div key={idx} className="p-5 md:p-8">
                                    <ScrollReveal delay={idx * 100}>
                                        <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-swiss-red tracking-tighter leading-none mb-3 whitespace-nowrap">{item.value}</span>
                                        <p className="text-sm md:text-base font-bold leading-tight text-black mb-1">{item.label}</p>
                                        {item.description && (
                                            <p className="text-sm md:text-base font-normal leading-relaxed text-neutral-500">{item.description}</p>
                                        )}
                                    </ScrollReveal>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                 {hasReflection && (
                    <div id="reflection" className="bg-neutral-50">
                        <div className="p-[1.5em] md:p-[2.5em] max-w-5xl">
                            <ScrollReveal>
                                <span className="text-swiss-red font-mono text-xs font-bold uppercase tracking-widest block">04. REFLECTION</span>
                            </ScrollReveal>
                        </div>
                        {project.caseStudy.reflection.items && (
                            <div className="border-t border-black/10 flex flex-col divide-y divide-black/10">
                                {project.caseStudy.reflection.items.map((item, idx) => (
                                    <div key={idx} className="p-[1.5em] md:px-[2.5em] md:py-[2em]">
                                        <ScrollReveal delay={idx * 150}>
                                            <h4 className="text-xl md:text-2xl font-black tracking-tight mb-[0.5em] text-black">{item.title}</h4>
                                            <p className="text-base md:text-lg font-medium leading-relaxed text-neutral-600 max-w-5xl">{item.description}</p>
                                        </ScrollReveal>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                 )}
            </div>
        </div>
      </section>

      <section className="bg-black text-white border-t border-black">
          <button 
            onClick={() => {
                window.scrollTo(0,0);
                onNextProject(nextProject.id);
            }}
            onMouseEnter={handleNextMouseEnter}
            onMouseLeave={handleNextMouseLeave}
            className="w-full grid grid-cols-1 md:grid-cols-2 group text-left border-b border-black"
          >
              <div className="p-8 md:p-8 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/20 relative overflow-hidden min-h-[300px]">
                   <div className="absolute inset-0 bg-swiss-red transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 z-0"></div>
                   <div className="relative z-10">
                        <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 group-hover:text-black mb-4 block">Next Project</span>
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter group-hover:text-black transition-colors break-words hyphens-auto">{nextProject.title}</h2>
                   </div>
              </div>
              
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-neutral-900">
                  <LazyImage src={nextProject.imageUrl} alt="Next" className="absolute inset-0 w-full h-full z-10 transition-all duration-700 grayscale group-hover:opacity-0" />
                  {nextProject.videoUrl && (
                     <video 
                        ref={nextVideoRef}
                        src={nextProject.videoUrl}
                        preload="none"
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                     />
                  )}
                  <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                      <div className="bg-white text-black border border-black rounded-full p-5 opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform scale-90 group-hover:scale-100">
                          <ArrowUpRight size={32} strokeWidth={2.5} />
                      </div>
                  </div>
              </div>
          </button>
      </section>

      <div id="contact">
        <Contact />
      </div>
    </div>
  );
};
