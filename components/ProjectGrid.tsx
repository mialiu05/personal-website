
import React, { useRef, useState } from 'react';
import { PROJECTS } from '../constants';
import { ArrowUpRight } from 'lucide-react';

// Helper Component for Images with Placeholder
const LazyImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}> = ({ src, alt, className = '', loading = 'lazy' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(loading === 'eager');
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (loading === 'eager') return;
    const container = containerRef.current;
    if (!container) return;

    // Start loading images before they enter viewport (400px ahead for better performance)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.01, rootMargin: '400px' }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [loading]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div ref={containerRef} className={`absolute inset-0 ${className}`}>
      {/* Placeholder - Skeleton */}
      <div
        className={`absolute inset-0 bg-neutral-200 transition-opacity duration-500 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          background: 'linear-gradient(90deg, #e5e5e5 25%, #f0f0f0 50%, #e5e5e5 75%)',
          backgroundSize: '200% 100%',
          animation: isLoaded ? 'none' : 'shimmer 1.5s infinite',
        }}
      />

      {/* Actual Image */}
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          onLoad={handleLoad}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};

interface ProjectGridProps {
  onProjectClick?: (projectId: string) => void;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({ onProjectClick }) => {

  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const timeoutRefs = useRef<{ [key: string]: ReturnType<typeof setTimeout> }>({});

  const handleMouseEnter = (projectId: string) => {
    // Cancel any pending pause/reset to keep playing if user re-enters quickly
    if (timeoutRefs.current[projectId]) {
        clearTimeout(timeoutRefs.current[projectId]);
        delete timeoutRefs.current[projectId];
    }

    const video = videoRefs.current[projectId];
    if (video) {
      video.play().catch(e => console.log("Autoplay prevented", e));
    }
  };

  const handleMouseLeave = (projectId: string) => {
    // Delay the pause/reset logic to allow the CSS fade-out transition to complete visually
    timeoutRefs.current[projectId] = setTimeout(() => {
        const video = videoRefs.current[projectId];
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
    }, 700); // Match the duration of the image fade-in transition (700ms)
  };

  return (
    <section className="min-h-screen bg-white py-16 px-6 md:px-12">
      {/* Projects Grid with enhanced spacing and borders - Fixed to 2 columns for balanced layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1400px] mx-auto">
        {PROJECTS.map((project, index) => (
          <button
            key={project.id}
            onClick={() => !project.comingSoon && onProjectClick && onProjectClick(project.id)}
            onMouseEnter={() => !project.comingSoon && handleMouseEnter(project.id)}
            onMouseLeave={() => !project.comingSoon && handleMouseLeave(project.id)}
            disabled={project.comingSoon}
            className={`text-left group relative border border-black md:border-2 overflow-hidden w-full focus:outline-none focus:ring-2 focus:ring-swiss-red/50 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 bg-white ${project.comingSoon ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <div className="aspect-[4/3] overflow-hidden relative bg-neutral-100">
              {/* Static Image (Top Layer) - Grayscale, fades out on hover */}
              <LazyImage
                src={project.imageUrl}
                alt={project.title}
                loading={index < 3 ? 'eager' : 'lazy'}
                className={`w-full h-full object-cover z-10 transition-opacity duration-500 grayscale ${!project.comingSoon ? 'group-hover:opacity-0' : ''}`}
              />

              {/* Colored fallback image with slow zoom on hover (when no video) */}
              {!project.comingSoon && !project.videoUrl && (
                <LazyImage
                  src={project.imageUrl}
                  alt={project.title}
                  loading={index < 3 ? 'eager' : 'lazy'}
                  className="w-full h-full object-cover z-5 transition-transform duration-[800ms] ease-out group-hover:scale-[1.08]"
                />
              )}

              {/* Video: preload=metadata for first 3 projects (above fold), none for others */}
              {!project.comingSoon && project.videoUrl && (
                 <video
                    ref={el => {
                        if (el) videoRefs.current[project.id] = el;
                        else delete videoRefs.current[project.id];
                    }}
                    src={project.videoUrl}
                    muted
                    playsInline
                    preload={index < 3 ? "metadata" : "none"}
                    className="absolute inset-0 w-full h-full object-cover z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                 />
              )}

              {/* Overlay with Action */}
              <div className="absolute inset-0 z-20 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                  {project.comingSoon ? (
                      // Coming Soon Badge
                      <div className="bg-black text-white border border-black rounded-full px-6 py-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                         <span className="text-sm font-bold tracking-widest">Coming Soon</span>
                      </div>
                  ) : (
                      // Interaction Arrow
                      <div className="bg-white text-black border border-black rounded-full p-5 opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform scale-90 group-hover:scale-100">
                          <ArrowUpRight size={32} strokeWidth={2.5} />
                      </div>
                  )}
              </div>
            </div>

            <div className="p-6 md:p-8 lg:p-10 bg-white relative z-30 flex flex-col h-full">
               {/* Title (Level 3) - Enhanced with stronger weight */}
               <h3 className={`text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter mb-3 md:mb-4 transition-transform duration-300 ${!project.comingSoon ? 'group-hover:translate-x-2' : ''}`}>
                 {project.title}
               </h3>

               {/* Body (Level 5) - Lighter for better hierarchy */}
               <p className="text-neutral-500 leading-relaxed text-base md:text-lg lg:text-xl max-w-5xl font-normal mb-4">
                 {project.description}
               </p>

               {/* Tags (Level 6) */}
               <div className="flex flex-wrap gap-3 items-center">
                  {project.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="border-2 border-black px-3 py-1.5 text-[10px] md:text-xs font-bold tracking-widest bg-white">
                      {tag}
                    </span>
                  ))}
               </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
