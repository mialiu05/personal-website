
import React, { useEffect, useRef, useState } from 'react';
import { SKILLS } from '../constants';
import { 
  PenTool, 
  Layout, 
  Compass, 
  Search, 
  Zap, 
  Eye, 
  Code, 
  Film,
  Figma,
  Image,
  Box,
  Cpu,
  Diamond,
  ListTodo,
  Hexagon,
  Bot,
  Globe,
  BarChart3,
  Wrench
} from 'lucide-react';

export const SkillsChart: React.FC = () => {
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
  
  // Helper to get icon based on name
  const getIcon = (name: string, size: number = 20) => {
    const lower = name.toLowerCase();
    
    // Specific Capabilities
    if (lower.includes('ai-driven')) return <Bot size={size} />;
    if (lower.includes('engineering')) return <Code size={size} />;
    if (lower.includes('research')) return <Search size={size} />;
    if (lower.includes('design systems')) return <Layout size={size} />;
    if (lower.includes('data')) return <BarChart3 size={size} />;
    if (lower.includes('strategy')) return <Compass size={size} />;
    if (lower.includes('prototyping')) return <Zap size={size} />;
    if (lower.includes('cross-cultural')) return <Globe size={size} />;

    // Tools
    if (lower.includes('figma')) return <Figma size={size} />;
    if (lower.includes('sketch')) return <Diamond size={size} />;
    if (lower.includes('adobe')) return <Image size={size} />;
    if (lower.includes('protopie')) return <Zap size={size} />;
    if (lower.includes('cinema') || lower.includes('3d') || lower.includes('spline')) return <Box size={size} />;
    if (lower.includes('react') || lower.includes('tailwind') || lower.includes('code')) return <Code size={size} />;
    if (lower.includes('ai') || lower.includes('genai') || lower.includes('chatgpt')) return <Bot size={size} />;
    if (lower.includes('linear')) return <ListTodo size={size} />;

    // Fallbacks
    if (lower.includes('product')) return <Hexagon size={size} />;
    if (lower.includes('motion')) return <Film size={size} />;
    
    return <PenTool size={size} />;
  };

  return (
    <div className="w-full border-t border-black bg-white" ref={sectionRef}>
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* Title Section - Level 2 */}
        <div className="md:col-span-4 p-8 md:p-12 border-b md:border-b-0 md:border-r border-black">
          <div className={`sticky top-24 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                Skills
              </h2>
          </div>
        </div>

        {/* Content Section */}
        <div className="md:col-span-8">
            {/* Skills (formerly Disciplines) Section */}
            <div className="p-8 md:p-12 border-b border-black">
                {/* Level 6: Label */}
                <h3 className={`text-xs font-bold uppercase tracking-widest mb-8 text-swiss-red flex items-center gap-2 transition-all duration-700 delay-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                    <span className="w-2 h-2 bg-black block"></span>
                    Skills
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                    {SKILLS.capabilities.map((skill, index) => (
                        <div 
                            key={skill} 
                            className={`flex items-center gap-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: `${300 + index * 50}ms` }}
                        >
                            <div className="text-neutral-400 transition-colors duration-300">
                                {getIcon(skill)}
                            </div>
                             {/* Level 4/5 Hybrid: Skill Item */}
                             <span className="text-lg md:text-xl font-bold tracking-tight text-off-black">
                                {skill}
                             </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tools Section - Icon Only Grid */}
             <div className="p-8 md:p-12">
                {/* Level 6: Label */}
                <h3 className={`text-xs font-bold uppercase tracking-widest mb-8 text-swiss-red flex items-center gap-2 transition-all duration-700 delay-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                    <span className="w-2 h-2 bg-black block"></span>
                    Software & Tools
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-8 md:gap-10">
                    {SKILLS.tools.map((tool, index) => (
                        <div 
                            key={tool} 
                            className={`flex flex-col items-center justify-center transition-all duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275) ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
                            style={{ transitionDelay: `${600 + index * 50}ms` }}
                            title={tool}
                        >
                            <div className="text-neutral-400 transition-all duration-300">
                                {getIcon(tool, 32)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
