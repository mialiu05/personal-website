
import React, { useEffect, useState, useRef } from 'react';
import { Project } from '../types';
import { ArrowRight, ExternalLink, ArrowUpRight } from 'lucide-react';
import { PROJECTS } from '../constants';
import { Contact } from './Contact';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onNextProject: (id: string) => void;
}

// Helper Component for Auto-Playing Videos Once (Triggered by Scroll OR Hover)
const AutoPlayVideo: React.FC<{ src: string; className?: string }> = ({ src, className }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);

  // 1. Scroll Trigger
  useEffect(() => {
    const video = videoRef.current;
    if (!video || hasPlayed) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(err => console.log("Autoplay blocked/failed", err));
          setHasPlayed(true);
          observer.disconnect(); // Stop observing after play trigger
        }
      },
      { threshold: 0.25 } // Trigger when 25% visible
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, [hasPlayed]);

  // 2. Hover Trigger
  const handleMouseEnter = () => {
    const video = videoRef.current;
    if (video && !hasPlayed) {
        video.play().catch(err => console.log("Hover play blocked/failed", err));
        setHasPlayed(true);
    }
  };

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      playsInline
      onMouseEnter={handleMouseEnter} // Trigger on hover if not played yet
      className={`block ${className}`}
      // No loop attribute ensures it stops after playing once
    />
  );
};

// Helper for Staggered Scroll Animations - FADE ONLY
const ScrollReveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
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

// Helper for Image Reveal Animation - FADE ONLY
const ImageReveal: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`overflow-hidden w-full ${className}`}>
      <div className={`transition-opacity duration-1000 ease-out w-full h-full ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {children}
      </div>
    </div>
  );
};


export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack, onNextProject }) => {
  
  // Logic to find the next available project, skipping "Coming Soon" items
  const availableProjects = PROJECTS.filter(p => !p.comingSoon);
  const currentIndex = availableProjects.findIndex(p => p.id === project.id);
  const nextIndex = (currentIndex + 1) % availableProjects.length;
  const nextProject = availableProjects[nextIndex];

  const [activeSection, setActiveSection] = useState<string>('');
  const [showFloatingToc, setShowFloatingToc] = useState(false);

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
    }
  };

  const hasReflection = project.caseStudy.reflection?.items && project.caseStudy.reflection.items.length > 0;
  const sections = ['Challenge', 'Approach', 'Outcome'];
  if (hasReflection) sections.push('Reflection');

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = sections.map(s => s.toLowerCase());
      
      // 1. Active Section Spy
      for (const section of sectionIds) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= window.innerHeight * 0.4) {
            setActiveSection(section);
            break;
          }
        }
      }

      // 2. Floating TOC Visibility Logic
      const wrapper = document.getElementById('case-study-wrapper');
      if (wrapper) {
        const rect = wrapper.getBoundingClientRect();
        // Visible as soon as the top of content enters view (top < screenHeight)
        // Hides when bottom scrolls past the top (bottom < 100) or pushed fully below (top > screenHeight)
        const isVisible = rect.top < window.innerHeight && rect.bottom > 150;
        setShowFloatingToc(isVisible);
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

  const FloatingToc = () => (
      <div className={`lg:hidden fixed z-40 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none top-0 left-0 w-full h-full ${showFloatingToc ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            <div className="hidden md:block absolute left-8 top-32 w-[180px] pointer-events-auto">
                <div className="bg-white/80 backdrop-blur-md border border-black/5 shadow-sm p-5 rounded-sm">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-4 block">Contents</span>
                    <div>{renderTocItems(false)}</div>
                </div>
            </div>
            <div className="md:hidden absolute left-4 top-24 w-[140px] pointer-events-auto">
                <div className="bg-white/90 backdrop-blur-md border border-black/5 shadow-sm p-4 rounded-sm">
                    <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 mb-3 block">Contents</span>
                    <div>{renderTocItems(true)}</div>
                </div>
            </div>
      </div>
  );

  // Grid class for Summary Outcome - 2 items (50/50), 4 items (4 cols), 3 items (3 cols)
  const outcomeGridClass = project.impact.length === 2
    ? 'grid-cols-1 md:grid-cols-2'
    : project.impact.length >= 4 
        ? 'grid-cols-2 md:grid-cols-2 lg:grid-cols-4' 
        : 'grid-cols-2 md:grid-cols-3';
  
  return (
    <div key={project.id} className="min-h-screen bg-white pt-16 animate-page-enter shadow-2xl relative">
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
                        <span key={tag} className="border border-black px-3 py-1 text-[10px] md:text-xs font-bold tracking-widest bg-white/50 transition-colors cursor-default">{tag}</span>
                    ))}
                </div>
            </div>
        </div>
      </section>

      <section className="border-b border-black">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-black bg-neutral-100">
                <ImageReveal className="w-full aspect-[4/3] relative group overflow-hidden">
                     {project.videoUrl ? (
                         <AutoPlayVideo src={project.videoUrl} className="w-full h-full object-cover" />
                     ) : (
                         <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                     )}
                </ImageReveal>
            </div>

            <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between h-full">
                <div>
                    <ScrollReveal>
                        <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-swiss-red flex items-center gap-2">
                           <span className="w-2 h-2 bg-black block"></span> Overview
                        </h3>
                        <p className="text-lg font-medium leading-relaxed text-neutral-800 mb-8">{project.intro}</p>
                    </ScrollReveal>
                </div>
                
                <div className="mt-auto">
                    <div className="border-t border-black pt-6 mb-6">
                         <div className="mb-6">
                            <span className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Contribution</span>
                            <span className="text-sm md:text-base font-bold block leading-relaxed">{project.role}</span>
                         </div>
                         <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                            {metaDetails.map((item) => (
                                <div key={item.label}>
                                    <span className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">{item.label}</span>
                                    {item.isLink ? (
                                        <a href={`https://${item.value}`} target="_blank" rel="noreferrer" className="text-sm md:text-base font-bold flex items-center gap-2 hover:text-swiss-red transition-colors truncate">
                                            {item.value} <ExternalLink size={12} />
                                        </a>
                                    ) : (
                                        <span className="text-sm md:text-base font-bold block truncate">{item.value}</span>
                                    )}
                                </div>
                            ))}
                         </div>
                    </div>

                    <div className="border-t border-black/10 pt-4">
                        <span className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3">Outcome</span>
                        <div className={`grid ${outcomeGridClass} gap-4`}>
                            {project.impact.map((item, idx) => (
                                <div key={idx}>
                                    <span className="block text-2xl md:text-3xl font-black text-swiss-red tracking-tighter leading-none mb-1">{item.value}</span>
                                    <p className="text-xs md:text-sm font-bold leading-tight text-black mb-2">{item.label}</p>
                                    {item.description && (
                                        <p className="text-xs md:text-sm font-normal leading-relaxed text-neutral-500">{item.description}</p>
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
            <div className="hidden lg:block lg:col-span-3 border-r border-black">
                <div className="sticky top-24 p-12">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-6 block">Contents</span>
                    <div>{renderTocItems(false)}</div>
                </div>
            </div>

            <div className="col-span-1 lg:col-span-9 bg-white">
                <div id="challenge" className="border-b border-black/10">
                     <div className="p-8 md:p-12 md:pb-8 max-w-5xl">
                        <ScrollReveal>
                            <span className="text-swiss-red font-mono text-xs font-bold uppercase tracking-widest mb-4 block">01. THE CHALLENGE</span>
                            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 leading-[0.9]">{project.caseStudy.problem.title}</h2>
                            <p className="text-base md:text-lg leading-relaxed text-neutral-600 max-w-5xl">{project.caseStudy.problem.content}</p>
                        </ScrollReveal>
                     </div>
                     {project.caseStudy.problem.images && (
                        <div className="border-t border-black/10 grid grid-cols-1 md:grid-cols-2 gap-px bg-black/10">
                            {project.caseStudy.problem.images.map((img, idx) => (
                                <div key={idx} className="bg-white flex flex-col h-full">
                                    <ImageReveal className={`${project.id === '3' ? 'aspect-[7/9]' : 'aspect-[4/3]'} overflow-hidden border-b border-black/10`}>
                                        <img src={img.url} alt={img.caption} className="w-full h-full object-cover block" />
                                    </ImageReveal>
                                    <div className="p-6 flex-1">
                                        <p className="text-xs font-mono leading-relaxed text-neutral-500 border-l-2 border-swiss-red pl-3">{img.caption}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                     )}
                     {!project.caseStudy.problem.images && project.caseStudy.problem.image && (
                        <ImageReveal className="w-full aspect-video md:aspect-[21/9] border-t border-black/10 overflow-hidden">
                            <img src={project.caseStudy.problem.image} alt="Challenge" className="w-full h-full object-cover block" />
                        </ImageReveal>
                     )}
                </div>

                 <div id="approach" className="border-b border-black/10">
                    {!project.caseStudy.method.subsections && !project.caseStudy.method.blocks ? (
                        <div className="p-8 md:p-12 md:pb-8 max-w-5xl">
                            <ScrollReveal>
                                <span className="text-swiss-red font-mono text-xs font-bold uppercase tracking-widest mb-4 block">02. THE APPROACH</span>
                                <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 leading-[0.9]">{project.caseStudy.method.title}</h2>
                                <p className="text-base md:text-lg leading-relaxed text-neutral-600 max-w-5xl">{project.caseStudy.method.content}</p>
                            </ScrollReveal>
                        </div>
                    ) : null}
                    
                    {project.caseStudy.method.subsections ? (
                        <div className="flex flex-col">
                            {project.caseStudy.method.subsections.map((sub, sIdx) => (
                                <div key={sIdx} className={`bg-white ${sIdx !== (project.caseStudy.method.subsections?.length || 0) - 1 ? 'border-b border-black/10' : ''}`}>
                                    {/* 标题区域 */}
                                    <div className="p-8 md:p-12 md:pb-8">
                                        <ScrollReveal>
                                            {sIdx === 0 && <span className="text-swiss-red font-mono text-xs font-bold uppercase tracking-widest mb-4 block">02. THE APPROACH</span>}
                                            <h3 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 leading-[0.9]">{sub.title}</h3>
                                            <p className="text-base md:text-lg leading-relaxed text-neutral-600 max-w-5xl">{sub.content}</p>
                                        </ScrollReveal>
                                    </div>

                                    {/* 图片/视频单元格区域 */}
                                    <div className="border-t border-black/10">
                                        {sub.units.map((unit, uIdx) => (
                                            <div key={uIdx} className="bg-white border-b border-black/10 last:border-b-0 flex flex-col">
                                                {/* 单元格文字 */}
                                                {(unit.title || unit.content) && (
                                                    <div className="p-8 md:px-12 md:pb-6">
                                                        <ScrollReveal>
                                                            {unit.title && (
                                                                <h4 className="text-xl md:text-2xl font-bold mb-3 tracking-tight">{unit.title}</h4>
                                                            )}
                                                            <p className="text-base md:text-lg leading-relaxed text-neutral-600 max-w-5xl">{unit.content}</p>
                                                        </ScrollReveal>
                                                    </div>
                                                )}
                                                
                                                {/* 单元格媒体 (Image/Video) - Enforce auto height and block display */}
                                                <ImageReveal className="w-full overflow-hidden flex flex-col">
                                                    {unit.image?.type === 'video' ? (
                                                        <AutoPlayVideo src={unit.image.url} className="w-full h-auto block" />
                                                    ) : (
                                                        <img src={unit.image?.url || ''} alt={unit.image?.caption || ''} className="w-full h-auto block" />
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
                                         <div className={`${project.id === '3' ? 'p-6 md:px-12 md:py-6' : 'p-8 md:p-12 md:pb-8'}`}>
                                             <ScrollReveal>
                                                 {bIdx === 0 && <span className="text-swiss-red font-mono text-xs font-bold uppercase tracking-widest mb-4 block">02. THE APPROACH</span>}
                                                 {block.title && <h3 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 leading-[0.9]">{block.title}</h3>}
                                                 {block.content && <p className={`text-base md:text-lg leading-relaxed text-neutral-600 max-w-5xl ${project.id === '3' ? 'mb-12' : 'mb-12'}`}>{block.content}</p>}
                                             </ScrollReveal>
                                         </div>
                                     )}
                                     {/* Block Layout Logic: Grid (2 cols) vs Vertical (1 col) */}
                                     <div className={`grid gap-px bg-black/10 ${block.layout === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                                         {block.images.map((img, iIdx) => (
                                            <div key={iIdx} className="bg-white">
                                                {/* CONDITIONAL RENDERING BASED ON LAYOUT */}
                                                
                                                {/* GRID LAYOUT: Image First, Caption Second (Technical) */}
                                                {block.layout === 'grid' && (
                                                    <>
                                                        <ImageReveal className={`w-full overflow-hidden border-b border-black/10
                                                            ${project.id === '3' ? 'aspect-[7/9]' : 'aspect-[4/3]'}
                                                        `}>
                                                            <img src={img.url} alt={img.caption} className="w-full h-full object-cover block" />
                                                        </ImageReveal>
                                                        {img.caption && (
                                                            <div className="p-6">
                                                                <p className="text-xs font-mono leading-relaxed text-neutral-500 border-l-2 border-swiss-red pl-3 mb-0">{img.caption}</p>
                                                            </div>
                                                        )}
                                                    </>
                                                )}

                                                {/* VERTICAL LAYOUT: Caption First (Body), Image Second */}
                                                {block.layout === 'vertical' && (
                                                    <>
                                                        {img.caption && (
                                                            <div className={`md:px-12 ${project.id === '3' ? 'p-6 pt-6 pb-1' : 'p-8 md:pb-6'}`}>
                                                                <ScrollReveal>
                                                                    <p className="text-base md:text-lg leading-relaxed text-neutral-600 max-w-5xl">{img.caption}</p>
                                                                </ScrollReveal>
                                                            </div>
                                                        )}
                                                        {/* 
                                                            PROJECT 3 VERTICAL FIX: 
                                                            No forced aspect-ratio here.
                                                            Image uses h-auto to be full natural height.
                                                            ImageReveal has NO className (gets w-full by default) to avoid forced h-full.
                                                        */}
                                                        <ImageReveal className={`w-full overflow-hidden border-b border-black/10 last:border-b-0
                                                            ${project.id === '3' ? '' : 'aspect-[4/3]'}
                                                        `}>
                                                            {img.type === 'video' ? (
                                                                <AutoPlayVideo src={img.url} className={`w-full block origin-center ${project.id === '3' ? 'h-auto' : 'h-full object-cover'}`} />
                                                            ) : (
                                                                <img src={img.url} alt={img.caption} className={`w-full block origin-center ${project.id === '3' ? 'h-auto' : 'h-full object-cover'}`} />
                                                            )}
                                                        </ImageReveal>
                                                    </>
                                                )}
                                            </div>
                                         ))}
                                     </div>
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
                                            <div className="p-8 md:px-12 md:pb-6">
                                                <ScrollReveal>
                                                    <p className="text-base md:text-lg leading-relaxed text-neutral-600 max-w-5xl">{img.caption}</p>
                                                </ScrollReveal>
                                            </div>
                                        )}
                                        <ImageReveal className="w-full overflow-hidden">
                                            <img src={img.url} alt={img.caption || `Approach step ${idx + 1}`} className="w-full h-auto object-cover block origin-center" />
                                        </ImageReveal>
                                    </div>
                                 ))}
                            </div>
                        ) : (
                             <ImageReveal className="w-full aspect-video md:aspect-[21/9] border-t border-black/10 overflow-hidden">
                                <img src={project.caseStudy.method.image} alt="Approach" className="w-full h-full object-cover block" />
                            </ImageReveal>
                        )
                    )}
                </div>

                 <div id="outcome" className="border-b border-black/10">
                    <div className="p-8 md:p-12 md:pb-12 max-w-5xl">
                        <ScrollReveal>
                            <span className="text-swiss-red font-mono text-xs font-bold uppercase tracking-widest mb-4 block">03. THE OUTCOME</span>
                        </ScrollReveal>
                    </div>
                    
                    {project.impact && (
                        <div className={`border-t border-black/10 grid ${outcomeGridClass} divide-y md:divide-y-0 md:divide-x divide-black/10`}>
                            {project.impact.map((item, idx) => (
                                <div key={idx} className="p-8 md:p-12">
                                    <ScrollReveal delay={idx * 100}>
                                        <span className="block text-4xl md:text-6xl font-black text-swiss-red tracking-tighter leading-none mb-4 break-words">{item.value}</span>
                                        <p className="text-sm md:text-base font-bold leading-tight text-black mb-2">{item.label}</p>
                                        {item.description && (
                                            <p className="text-xs md:text-sm font-normal leading-relaxed text-neutral-500">{item.description}</p>
                                        )}
                                    </ScrollReveal>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                 {hasReflection && (
                    <div id="reflection" className="bg-neutral-50">
                        <div className="p-8 md:px-12 md:pt-16 md:pb-8 max-w-5xl">
                            <ScrollReveal>
                                <span className="text-swiss-red font-mono text-xs font-bold uppercase tracking-widest block">04. REFLECTION</span>
                            </ScrollReveal>
                        </div>
                        {project.caseStudy.reflection.items && (
                            <div className="border-t border-black/10 flex flex-col divide-y divide-black/10">
                                {project.caseStudy.reflection.items.map((item, idx) => (
                                    <div key={idx} className="p-8 md:px-12 md:py-12">
                                        <ScrollReveal delay={idx * 150}>
                                            <h4 className="text-xl md:text-2xl font-black tracking-tight mb-3 text-black">{item.title}</h4>
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
                  <img src={nextProject.imageUrl} alt="Next" className="absolute inset-0 w-full h-full object-cover z-10 transition-all duration-700 grayscale group-hover:opacity-0" />
                  {nextProject.videoUrl && (
                     <video 
                        ref={nextVideoRef}
                        src={nextProject.videoUrl} 
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
