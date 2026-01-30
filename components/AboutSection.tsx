import React, { useEffect, useRef, useState } from 'react';
import { Download } from 'lucide-react';
import { EXPERIENCE, SKILLS, AUTHOR_BIO } from '../constants';
import {
  PenTool, Layout, Compass, Search, Zap, Code, Bot, Globe, BarChart3
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Helper to get icon based on name
  const getIcon = (name: string, size: number = 18) => {
    const lower = name.toLowerCase();

    if (lower.includes('ai-driven')) return <Bot size={size} />;
    if (lower.includes('engineering')) return <Code size={size} />;
    if (lower.includes('research')) return <Search size={size} />;
    if (lower.includes('design systems')) return <Layout size={size} />;
    if (lower.includes('data')) return <BarChart3 size={size} />;
    if (lower.includes('strategy')) return <Compass size={size} />;
    if (lower.includes('prototyping')) return <Zap size={size} />;
    if (lower.includes('cross-cultural')) return <Globe size={size} />;

    return <PenTool size={size} />;
  };

  return (
    <div ref={sectionRef} className="bg-white border-b border-black pt-16">
      {/* Title Area - Full Width */}
      <div className="p-8 md:p-12 border-b border-black">
        <h1
          className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter uppercase leading-none transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          About <span className="text-swiss-red">Me</span>
        </h1>
      </div>

      {/* Content Grid: Photo + Intro - 12 Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black">
        {/* Photo Column - 4 cols */}
        <div className="md:col-span-4 p-8 md:p-12 border-b md:border-b-0 md:border-r border-black bg-neutral-50 flex items-center justify-center md:justify-start">
          <div
            className={`w-full max-w-[320px] aspect-[3/4] border-2 border-black p-2 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-1000 delay-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <img
              src="https://raw.githubusercontent.com/mialiu05/portfolio-assets/0b3ea60e75176203c59fd4721f0c3d4c30250004/profile.jpg"
              alt="Miao Liu"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info Column - 8 cols */}
        <div className="md:col-span-8 p-8 md:p-12 flex flex-col justify-center bg-white">
          {/* Name */}
          <h2
            className={`text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-black mb-3 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            Miao Liu
          </h2>

          {/* Role */}
          <p
            className={`text-base md:text-lg font-mono text-neutral-500 mb-2 transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
            }`}
          >
            Product Designer
          </p>

          {/* Location */}
          <div
            className={`flex items-center gap-2 text-sm font-bold tracking-widest text-swiss-red mb-8 transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}
          >
            <span className="w-2 h-2 bg-swiss-red rounded-full animate-pulse"></span>
            Leipzig, Germany
          </div>

          {/* Bio */}
          <p
            className={`text-base md:text-lg lg:text-xl leading-relaxed text-neutral-700 mb-8 transition-all duration-1000 delay-600 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {AUTHOR_BIO.trim()}
          </p>

          {/* Download CV */}
          <div
            className={`transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <a
              href="https://raw.githubusercontent.com/mialiu05/portfolio-assets/27e2ad8b19a574e482443dbe81c0a2d412797cda/Miao%20Liu%20-%20Product%20Designer%20CV.pdf"
              download
              className="inline-flex items-center gap-3 px-8 py-4 border-2 border-black bg-white hover:bg-black hover:text-white transition-all duration-300 group cursor-pointer shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
            >
              <span className="text-sm font-bold tracking-widest">Download Resume</span>
              <Download size={18} className="group-hover:translate-y-1 transition-transform duration-300" />
            </a>
          </div>
        </div>
      </div>

      {/* Experience & Skills Section - 2 Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 bg-neutral-50">
        {/* Experience Column */}
        <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-black">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-8 text-neutral-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-neutral-400 block"></span>
            Experience
          </h3>

          <div className="relative border-l-2 border-neutral-300 ml-2 space-y-10">
            {EXPERIENCE.map((job, index) => (
              <div
                key={job.id}
                className={`relative pl-8 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${800 + index * 100}ms` }}
              >
                <div className="absolute -left-[6px] top-1 w-[13px] h-[13px] bg-black rounded-full border-2 border-white" />

                <div className="flex flex-col gap-2">
                  <span className="text-xs md:text-sm font-mono text-neutral-500">{job.period}</span>
                  <h4 className="text-lg md:text-xl lg:text-2xl font-black tracking-tight text-black">{job.role}</h4>
                  <p className="text-sm md:text-base font-bold text-neutral-400">{job.company}</p>
                  <p className="text-sm md:text-base leading-relaxed text-neutral-600 mt-1">{job.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Column */}
        <div className="p-8 md:p-12 bg-white">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-8 text-neutral-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-neutral-400 block"></span>
            Capabilities
          </h3>

          <div className="flex flex-col gap-3 mb-12">
            {SKILLS.capabilities.map((skill, index) => (
              <div
                key={skill}
                className={`flex items-center gap-3 p-2 -ml-2 transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
                style={{ transitionDelay: `${800 + index * 50}ms` }}
              >
                <div className="text-neutral-400">{getIcon(skill, 18)}</div>
                <span className="text-sm font-bold tracking-tight text-neutral-800">{skill}</span>
              </div>
            ))}
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-neutral-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-neutral-400 block"></span>
              Tools
            </h3>
            <div className="flex flex-wrap gap-2">
              {SKILLS.tools.map((tool, index) => (
                <span
                  key={tool}
                  className={`px-3 py-1.5 border border-black text-xs font-bold tracking-wide bg-white transition-all duration-500 ${
                    isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                  }`}
                  style={{ transitionDelay: `${1200 + index * 50}ms` }}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
