
import React, { useRef, useEffect } from 'react';
import { PROJECTS } from '../constants';
import { ArrowUpRight } from 'lucide-react';

interface ProjectGridProps {
  onProjectClick?: (projectId: string) => void;
  id?: string;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({ onProjectClick, id }) => {
  
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
    // This prevents the video from jumping to frame 0 while still visible during the fade
    timeoutRefs.current[projectId] = setTimeout(() => {
        const video = videoRefs.current[projectId];
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
    }, 700); // Match the duration of the image fade-in transition (700ms)
  };

  return (
    <section className="min-h-screen bg-white border-b border-black">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-b border-black">
        <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-black bg-black text-white flex items-center justify-center">
          {/* Level 2: Section Header */}
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-center leading-none">
            Selected<br />Works<br /><span className="text-swiss-red">2019-25</span>
          </h2>
        </div>
        <div className="p-8 md:p-12 col-span-1 lg:col-span-2 flex items-center">
           {/* Level 4: Lead Text */}
           <p className="text-lg md:text-2xl leading-tight font-light text-neutral-800">
             Bridging design innovation and strategic thinking to build the next generation of digital products.
           </p>
        </div>
      </div>

      <div id={id} className="grid grid-cols-1 md:grid-cols-2 scroll-mt-16">
        {PROJECTS.map((project, index) => (
          <button 
            key={project.id} 
            onClick={() => !project.comingSoon && onProjectClick && onProjectClick(project.id)}
            onMouseEnter={() => !project.comingSoon && handleMouseEnter(project.id)}
            onMouseLeave={() => !project.comingSoon && handleMouseLeave(project.id)}
            disabled={project.comingSoon}
            className={`text-left group relative border-b border-black ${index % 2 === 0 ? 'md:border-r' : ''} overflow-hidden w-full focus:outline-none focus:ring-2 focus:ring-swiss-red/50 ${project.comingSoon ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <div className="aspect-[4/3] overflow-hidden relative bg-neutral-100">
              {/* Static Image (Top Layer) */}
              {/* Style: Always grayscale, fades out on hover to reveal video */}
              <img 
                src={project.imageUrl} 
                alt={project.title}
                className={`absolute inset-0 w-full h-full object-cover z-10 transition-all duration-700 grayscale ${!project.comingSoon ? 'group-hover:opacity-0' : ''}`}
              />
              
              {/* Dynamic Video (Bottom Layer) - Only render if not coming soon and video exists */}
              {/* Style: Full color, fades in on hover */}
              {!project.comingSoon && project.videoUrl && (
                 <video
                    ref={el => { 
                        if (el) videoRefs.current[project.id] = el; 
                        else delete videoRefs.current[project.id];
                    }}
                    src={project.videoUrl}
                    muted
                    playsInline
                    // Loop removed to play only once
                    className="absolute inset-0 w-full h-full object-cover z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                 />
              )}

              {/* Overlay with Action */}
              <div className="absolute inset-0 z-20 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                  {project.comingSoon ? (
                      // Coming Soon Badge
                      <div className="bg-black text-white border border-black rounded-full px-6 py-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                         <span className="text-sm font-bold uppercase tracking-widest">Coming Soon</span>
                      </div>
                  ) : (
                      // Interaction Arrow
                      <div className="bg-white text-black border border-black rounded-full p-5 opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform scale-90 group-hover:scale-100">
                          <ArrowUpRight size={32} strokeWidth={2.5} />
                      </div>
                  )}
              </div>
            </div>
            
            <div className="p-6 md:p-8 bg-white relative z-30 flex flex-col h-full border-t border-black/10">
               {/* Header Row: Tags (Level 6) */}
               <div className="flex flex-wrap gap-3 items-center mb-5">
                  {project.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="border border-black px-2 py-1 text-[10px] font-bold tracking-widest bg-white">
                      {tag}
                    </span>
                  ))}
               </div>
               
               {/* Title (Level 3) */}
               <h3 className={`text-2xl md:text-3xl font-black tracking-tighter mb-4 transition-transform duration-300 ${!project.comingSoon ? 'group-hover:translate-x-2' : ''}`}>
                 {project.title}
               </h3>
               
               {/* Body (Level 5) */}
               <p className="text-neutral-600 leading-relaxed text-base md:text-lg max-w-md font-normal">
                 {project.description}
               </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
