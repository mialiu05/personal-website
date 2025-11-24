
import React, { useEffect, useState } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const duration = 2000; // 2 seconds total loading time
    const interval = 20;
    const steps = duration / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setCount((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (count === 100) {
      // Delay slightly at 100% before sliding up
      setTimeout(() => {
        setIsExiting(true);
        // Notify parent after the slide animation (1000ms) + buffer
        setTimeout(onComplete, 1000); 
      }, 400);
    }
  }, [count, onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-[#050505] text-white flex flex-col justify-between transition-transform duration-[1000ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
        isExiting ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      {/* Grid Overlay */}
      <div className="absolute inset-0 grid grid-cols-12 h-full w-full opacity-20 pointer-events-none">
         <div className="col-span-3 border-r border-dashed border-white/30 h-full hidden md:block"></div>
         <div className="col-span-3 border-r border-dashed border-white/30 h-full hidden md:block"></div>
         <div className="col-span-3 border-r border-dashed border-white/30 h-full hidden md:block"></div>
      </div>

      {/* Header */}
      <div className="p-6 md:p-12 border-b border-white/10 flex justify-between items-start relative z-10">
         <h1 className="font-bold tracking-tighter text-sm md:text-base">MIAO LIU ©25</h1>
         <div className="flex gap-4 text-[10px] font-mono uppercase tracking-widest opacity-60">
            <span className="animate-pulse text-swiss-red">●</span>
            <span>Loading Experience</span>
         </div>
      </div>

      {/* Center / Counter */}
      <div className="p-6 md:p-12 flex-1 flex flex-col justify-end relative z-10 pb-24">
         <div className="text-[15vw] leading-none font-black tracking-tighter tabular-nums mix-blend-difference">
            {Math.round(count)}%
         </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-[4px] bg-white/10 relative z-10">
         <div 
            className="h-full bg-swiss-red transition-all duration-75 ease-linear"
            style={{ width: `${count}%` }}
         />
      </div>
    </div>
  );
};
