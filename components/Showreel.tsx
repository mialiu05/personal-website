import React from 'react';
import { Play } from 'lucide-react';

export const Showreel: React.FC = () => {
  return (
    <section className="w-full border-b border-black bg-black text-white relative overflow-hidden h-[75vh] md:h-[85vh] group">
      {/* Grid Overlay - Maintaining strict grid alignment */}
      <div className="absolute inset-0 z-20 pointer-events-none grid grid-cols-12 h-full w-full opacity-20">
         <div className="col-span-3 border-r border-dashed border-white/40 h-full hidden md:block"></div>
         <div className="col-span-3 border-r border-dashed border-white/40 h-full hidden md:block"></div>
         <div className="col-span-3 border-r border-dashed border-white/40 h-full hidden md:block"></div>
      </div>

      {/* Video Background */}
      <video 
        className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-700 grayscale contrast-125"
        autoPlay 
        muted 
        loop 
        playsInline
        poster="https://picsum.photos/1920/1080?grayscale"
      >
        {/* Abstract geometric video source */}
        <source src="https://cdn.pixabay.com/video/2016/09/21/5398-183786499_large.mp4" type="video/mp4" />
      </video>

      {/* Content Layer */}
      <div className="relative z-30 h-full flex flex-col justify-between p-8 md:p-12">
         {/* Header Row */}
         <div className="flex justify-between items-center border-b border-white/20 pb-4">
            <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-swiss-red rounded-sm animate-pulse shadow-[0_0_10px_rgba(255,51,51,0.8)]"></div>
                <span className="font-mono text-xs uppercase tracking-widest">Showreel 2024</span>
            </div>
            <span className="font-mono text-xs uppercase tracking-widest hidden md:block opacity-70">00:01:24:12</span>
         </div>

         {/* Bottom Row */}
         <div className="grid grid-cols-12 w-full items-end">
             <div className="col-span-12 md:col-span-9">
                <h2 
                  className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] select-none transition-colors duration-500"
                  style={{ WebkitTextStroke: '1px white', color: 'transparent' }}
                >
                   <span className="group-hover:text-white transition-colors duration-500">Design</span><br/>
                   <span className="group-hover:text-white transition-colors duration-500 delay-75">In Motion</span>
                </h2>
             </div>
             <div className="col-span-12 md:col-span-3 flex justify-end mt-8 md:mt-0">
                 <button className="w-20 h-20 md:w-32 md:h-32 border border-white rounded-full flex items-center justify-center hover:bg-swiss-red hover:border-swiss-red transition-all duration-300 group-hover:scale-110 hover:rotate-90 backdrop-blur-sm">
                    <Play size={32} fill="currentColor" className="ml-1" />
                 </button>
             </div>
         </div>
      </div>
    </section>
  );
};