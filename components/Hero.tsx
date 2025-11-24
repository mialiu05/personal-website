
import React, { useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { AUTHOR_NAME, AUTHOR_ROLE } from '../constants';

export const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });
  // Store logical dimensions for the loop to avoid DOM thrashing
  const sizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Adjust mouse coordinates relative to canvas if needed, 
      // but since canvas is usually top-left or full width, clientX/Y works well enough 
      // for the visual effect unless the hero is scrolled away (but it's at top).
      // To be precise relative to canvas:
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
      
      // Update size ref for the draw loop
      sizeRef.current = { width: rect.width, height: rect.height };

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    window.addEventListener('resize', resize);
    resize();

    // Base Noise Function (Simplex-ish)
    const simplex = (x: number, y: number, z: number) => {
      return Math.sin(x * 1.1 + z) * Math.cos(y * 1.2 - z) + 
             Math.sin(x * 2.3 - z) * Math.cos(y * 2.1 + z) * 0.5;
    };

    // Domain Warping: Feeding noise into noise for organic swirl patterns
    // Tuned for softer, more fluid shapes (less jagged)
    const fbm = (x: number, y: number, z: number) => {
        // First layer of distortion
        const qx = simplex(x + 5.2, y + 1.3, z * 0.2);
        const qy = simplex(x - 9.2, y + 8.6, z * 0.2);

        // Second layer using warped coordinates (Reduced intensity from 4.0 to 2.5 for smoother flow)
        const rx = simplex(x + 2.5 * qx + 1.7, y + 2.5 * qy + 9.2, z);
        const ry = simplex(x + 2.5 * qx + 8.3, y + 2.5 * qy + 2.8, z);

        // Final composed noise
        return simplex(x + 2.5 * rx, y + 2.5 * ry, z);
    };

    // Linear Interpolation helper
    const lerp = (start: number, end: number, amt: number) => (1 - amt) * start + amt * end;
    const getT = (val1: number, val2: number, threshold: number) => (threshold - val1) / (val2 - val1);

    const draw = () => {
      if (!ctx || !canvas) return;
      
      const { width, height } = sizeRef.current;
      ctx.clearRect(0, 0, width, height);
      
      // Smooth mouse movement
      mouseRef.current.x = lerp(mouseRef.current.x, targetMouseRef.current.x, 0.08);
      mouseRef.current.y = lerp(mouseRef.current.y, targetMouseRef.current.y, 0.08);

      // KEY CHANGE: Smaller cell size = Higher resolution = Smoother curves (less angular)
      const cellSize = 12; 
      const cols = Math.ceil(width / cellSize) + 1;
      const rows = Math.ceil(height / cellSize) + 1;
      
      // Optimization: Precompute grid values
      const gridValues = new Float32Array(cols * rows);
      
      // KEY CHANGE: Smaller scale = Larger shapes/islands
      const scale = 0.0007; 

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let px = x * cellSize;
          let py = y * cellSize;
          
          // Mouse Grid Distortion
          const dx = px - mouseRef.current.x;
          const dy = py - mouseRef.current.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          const maxDist = 600; // Larger influence radius
          
          // Warp the coordinate space near mouse
          if (dist < maxDist) {
            // Smoother falloff curve
            const force = Math.pow((1 - dist / maxDist), 3) * 150;
            px -= dx * 0.05; // Gentle push
            py -= dy * 0.05;
          }
          
          // Generate Domain Warped Noise
          gridValues[y * cols + x] = fbm(px * scale + time * 0.05, py * scale, time * 0.1);
        }
      }

      // KEY CHANGE: Wider threshold steps = Sparser lines (less dense)
      const thresholds: number[] = [];
      for (let t = -1.2; t <= 1.2; t += 0.3) {
        thresholds.push(t);
      }
      
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Optimised Marching Squares
      for (let y = 0; y < rows - 1; y++) {
        for (let x = 0; x < cols - 1; x++) {
          // Calculate cell center for distance check
          const cx = (x + 0.5) * cellSize;
          const cy = (y + 0.5) * cellSize;
          const distToMouse = Math.hypot(cx - mouseRef.current.x, cy - mouseRef.current.y);
          
          // Dynamic Style based on Mouse Distance
          let strokeStyle = 'rgba(10, 10, 10, 0.08)'; // Slightly higher base opacity for clarity
          let lineWidth = 1;
          
          if (distToMouse < 350) {
             const intensity = 1 - (distToMouse / 350);
             // Smooth transition to Swiss Red
             // Using ease-in-out for nicer interaction feel
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

             // Interpolation for smooth vertex placement
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

      time += 0.002; // Slower, more majestic movement
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const scrollToWork = () => {
    const element = document.getElementById('work');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="h-[65vh] min-h-[600px] pt-16 flex flex-col border-b border-black relative overflow-hidden bg-white">
      {/* Animated Topographic Background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0"
      />

      {/* Content Layer */}
      <div className="flex-1 grid grid-cols-12 px-4 md:px-8 relative z-10 pointer-events-none">
        {/* Grid overlay */}
        <div className="absolute inset-0 grid grid-cols-12 h-full w-full opacity-10">
            <div className="col-span-3 border-r border-dashed border-black h-full hidden md:block"></div>
            <div className="col-span-3 border-r border-dashed border-black h-full hidden md:block"></div>
            <div className="col-span-3 border-r border-dashed border-black h-full hidden md:block"></div>
        </div>

        <div className="col-span-12 md:col-span-10 lg:col-span-9 flex flex-col justify-center z-20 pr-4 md:pr-12 h-full py-12">
           {/* Main Intro Statement - Sentence Case, Reduced spacing */}
           <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter leading-[1.2] mb-8 text-off-black pointer-events-auto mix-blend-hard-light max-w-5xl">
             Miao Liu is a product designer specializing in <span className="text-swiss-red">AI-driven</span>, cross-cultural experiences grounded in design innovation, system thinking, and strategy.
           </h1>
           
           {/* Secondary Info - Sentence Case, Adjusted tracking */}
           <div className="pointer-events-auto pl-6 border-l-2 border-black">
             <p className="text-xs md:text-sm font-bold tracking-wide text-neutral-500">
               Previously at{' '}
               <a 
                 href="https://www.oppo.com/en/" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="underline hover:text-swiss-red transition-colors"
               >
                 OPPO
               </a>
               {' '}and{' '}
               <a 
                 href="https://www.transsion.com" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="underline hover:text-swiss-red transition-colors"
               >
                 Transsion
               </a>
             </p>
           </div>
        </div>

        <div className="col-span-12 md:col-span-2 lg:col-span-3 flex flex-col justify-end pb-12 z-20">
          <button 
            onClick={scrollToWork}
            className="group bg-white/80 backdrop-blur-md p-6 border-l-2 border-swiss-red pointer-events-auto hover:bg-black hover:text-white hover:border-black transition-all duration-300 shadow-sm text-left w-full"
          >
            <p className="text-lg font-bold leading-tight tracking-wide mb-4">
              View My Work
            </p>
            <div className="text-swiss-red group-hover:text-white animate-bounce">
              <ArrowDown size={24} />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
