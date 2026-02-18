
import React, { useEffect, useRef, useState } from 'react';

// Helper Component for Images with Placeholder
const LazyImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Start loading images before they enter viewport (200px ahead)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.01, rootMargin: '200px' }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

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
          src={src}
          alt={alt}
          onLoad={handleLoad}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};

export const WorkStyle: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Start loading images before they enter viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Toggle visibility based on intersection status to replay animation
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const styles = [
    {
      title: 'I Create',
      description: 'Technology needs direction. Beyond visual craft, I actively shape system specifications and product value propositions, believing that true innovation emerges when emerging tech meets solid business logic.',
      image: 'https://assets.imiaoliu.com/I1.webp'
    },
    {
      title: 'I Collaborate',
      description: 'Communication is the ultimate problem-solving tool. I thrive in cross-functional environments by bridging engineering and design through user research and agile sprints to align diverse perspectives.',
      image: 'https://assets.imiaoliu.com/I2.webp'
    },
    {
      title: 'I Empower',
      description: 'I believe in designing for the team as much as for the user. By establishing onboarding guides, documentation standards, and review processes, I scale my impact by empowering others to grow.',
      image: 'https://assets.imiaoliu.com/I3.webp'
    }
  ];

  return (
    <section className="border-t border-black bg-white" ref={sectionRef}>
        <div className="p-8 md:p-12 border-b border-black">
            {/* Level 2: Section Header - Slide Up */}
            <div className={`transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                    Work Style
                </h2>
            </div>
        </div>
      
      {/* Switched to gap-based grid for pixel-perfect equal widths */}
      <div className="grid grid-cols-1 md:grid-cols-3 bg-black gap-px">
        {styles.map((item, index) => (
           <div 
             key={index} 
             className={`flex flex-col bg-white h-full overflow-hidden`}
           >
              {/* Image Reveal */}
              <div 
                  className={`aspect-[4/5] w-full overflow-hidden border-b border-black bg-neutral-100 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] transform ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
              >
                 <LazyImage 
                    src={item.image} 
                    alt={item.title}
                />
              </div>
              
              {/* Text Content Staggered After Image */}
              <div className="p-8 flex-1 flex flex-col justify-between bg-white">
                 <div 
                    className={`transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{ transitionDelay: `${index * 200 + 300}ms` }}
                 >
                    <span className="text-swiss-red font-mono text-xs mb-3 block">0{index + 1}</span>
                    {/* Level 3: Card Title */}
                    <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-4">{item.title}</h3>
                    {/* Level 5: Body */}
                    <p className="text-base md:text-lg leading-relaxed font-normal text-neutral-600">
                        {item.description}
                    </p>
                 </div>
              </div>
           </div>
        ))}
      </div>
    </section>
  );
};