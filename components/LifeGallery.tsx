
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
        className={`absolute inset-0 bg-neutral-800 transition-opacity duration-500 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          background: 'linear-gradient(90deg, #404040 25%, #505050 50%, #404040 75%)',
          backgroundSize: '200% 100%',
          animation: isLoaded ? 'none' : 'shimmer 1.5s infinite',
        }}
      />
      
      {/* Actual Image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={handleLoad}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
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

export const LifeGallery: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const images = [
    'https://assets.imiaoliu.com/beyondwork1.webp',
    'https://assets.imiaoliu.com/beyond%20work2.webp',
    'https://assets.imiaoliu.com/beyond%20work3.webp',
    'https://assets.imiaoliu.com/beyond%20work4.webp',
    'https://assets.imiaoliu.com/beyondwork5.webp',
    'https://assets.imiaoliu.com/beyond%20work6.webp',
    'https://assets.imiaoliu.com/beyond%20work7.webp',
    'https://assets.imiaoliu.com/beyond%20work8.webp',
  ];

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

  return (
    <section className="border-t border-black bg-off-black text-white" ref={sectionRef}>
        <div className="grid grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-4 p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/20 flex flex-col justify-center">
                {/* Level 2: Section Header */}
                <div className={`transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
                        Outside<br/><span className="text-swiss-red">Work</span>
                    </h2>
                    {/* Level 5/6 Hybrid: Caption */}
                    <p className="text-neutral-400 max-w-5xl text-sm font-medium font-mono leading-relaxed transition-all duration-1000 delay-200 ease-[cubic-bezier(0.22,1,0.36,1)]">
                        I find energy in travel and sports, currently on a mission to reduce screen time and rediscover the analog world.
                    </p>
                </div>
            </div>
            <div className="md:col-span-8">
                {/* 
                   Refactored to use gap-px strategy for pixel-perfect borders 
                   Container bg is the line color (white/20).
                   Items are bg-off-black.
                   gap-px creates the internal lines.
                */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/20 border-r border-b border-white/20">
                    {images.map((src, i) => (
                        <div 
                            key={i} 
                            className={`aspect-square bg-off-black overflow-hidden relative transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] transform ${
                                isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
                            }`}
                            style={{ transitionDelay: `${300 + i * 100}ms` }}
                        >
                            <LazyImage 
                                src={src} 
                                alt={`Gallery ${i}`}
                                className="block"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
  );
};