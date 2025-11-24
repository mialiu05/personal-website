
import React, { useEffect, useRef, useState } from 'react';
import { EXPERIENCE } from '../constants';

export const ExperienceList: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 border-t border-black bg-white" ref={sectionRef}>
        <div className="md:col-span-4 p-8 md:p-12 border-b md:border-b-0 md:border-r border-black">
            {/* Level 2: Section Header - Slide In */}
            <div className={`sticky top-24 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                    Career<br/>History
                </h2>
            </div>
        </div>
        <div className="md:col-span-8">
            {EXPERIENCE.map((job, index) => (
                <div 
                    key={job.id} 
                    className="relative transition-colors"
                >
                    {/* Animated Border Bottom (Grid Drawing Effect) */}
                    {index !== EXPERIENCE.length - 1 && (
                        <div className={`absolute bottom-0 left-0 h-[1px] bg-black transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]`} 
                             style={{ 
                                 width: isVisible ? '100%' : '0%', 
                                 transitionDelay: `${index * 200 + 200}ms` 
                             }} 
                        />
                    )}
                    
                    {/* Content Container - Staggered Slide Up */}
                    <div 
                        className={`p-8 md:p-12 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                        style={{ transitionDelay: `${index * 150}ms` }}
                    >
                        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
                            {/* Level 3: Item Title */}
                            <h3 className="text-2xl md:text-3xl font-black tracking-tight">{job.role}</h3>
                            {/* Level 6: Meta */}
                            <span className="font-mono text-swiss-red text-xs md:text-sm font-bold mt-1 md:mt-0">{job.period}</span>
                        </div>
                        {/* Level 6: Subtitle Style */}
                        <h4 className="text-xs md:text-sm font-bold tracking-widest mb-6 text-neutral-500">{job.company}</h4>
                        {/* Level 5: Body */}
                        <p className="text-base md:text-lg leading-relaxed max-w-2xl font-normal text-neutral-700">
                            {job.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};