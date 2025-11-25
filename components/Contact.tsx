
import React, { useEffect, useRef, useState } from 'react';
import { Download, ArrowUpRight, Copy, Check } from 'lucide-react';

export const Contact: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const sizeRef = useRef({ width: 0, height: 0 });
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('mialiutnfg@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const handleMouseMove = (e: MouseEvent) => {
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
      
      sizeRef.current = { width: rect.width, height: rect.height };

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    window.addEventListener('resize', resize);
    resize();

    // --- Animation Logic ---
    const simplex = (x: number, y: number, z: number) => {
      return Math.sin(x * 1.1 + z) * Math.cos(y * 1.2 - z) + 
             Math.sin(x * 2.3 - z) * Math.cos(y * 2.1 + z) * 0.5;
    };

    const fbm = (x: number, y: number, z: number) => {
        const qx = simplex(x + 5.2, y + 1.3, z * 0.2);
        const qy = simplex(x - 9.2, y + 8.6, z * 0.2);
        const rx = simplex(x + 2.5 * qx + 1.7, y + 2.5 * qy + 9.2, z);
        const ry = simplex(x + 2.5 * qx + 8.3, y + 2.5 * qy + 2.8, z);
        return simplex(x + 2.5 * rx, y + 2.5 * ry, z);
    };

    const lerp = (start: number, end: number, amt: number) => (1 - amt) * start + amt * end;
    const getT = (val1: number, val2: number, threshold: number) => (threshold - val1) / (val2 - val1);

    const draw = () => {
      if (!ctx || !canvas) return;
      
      const { width, height } = sizeRef.current;
      ctx.clearRect(0, 0, width, height);
      
      mouseRef.current.x = lerp(mouseRef.current.x, targetMouseRef.current.x, 0.08);
      mouseRef.current.y = lerp(mouseRef.current.y, targetMouseRef.current.y, 0.08);

      const cellSize = 12; 
      const cols = Math.ceil(width / cellSize) + 1;
      const rows = Math.ceil(height / cellSize) + 1;
      const gridValues = new Float32Array(cols * rows);
      const scale = 0.0007; 

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let px = x * cellSize;
          let py = y * cellSize;
          
          const dx = px - mouseRef.current.x;
          const dy = py - mouseRef.current.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          const maxDist = 600;
          
          if (dist < maxDist) {
            px -= dx * 0.05;
            py -= dy * 0.05;
          }
          
          gridValues[y * cols + x] = fbm(px * scale + time * 0.05, py * scale, time * 0.1);
        }
      }

      const thresholds: number[] = [];
      for (let t = -1.2; t <= 1.2; t += 0.3) {
        thresholds.push(t);
      }
      
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let y = 0; y < rows - 1; y++) {
        for (let x = 0; x < cols - 1; x++) {
          const cx = (x + 0.5) * cellSize;
          const cy = (y + 0.5) * cellSize;
          const distToMouse = Math.hypot(cx - mouseRef.current.x, cy - mouseRef.current.y);
          
          let strokeStyle = 'rgba(255, 255, 255, 0.1)'; 
          let lineWidth = 1;
          
          if (distToMouse < 350) {
             const intensity = 1 - (distToMouse / 350);
             const smoothIntensity = intensity * intensity * (3 - 2 * intensity);
             strokeStyle = `rgba(255, 51, 51, ${0.2 + smoothIntensity * 0.8})`;
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

      time += 0.002;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    // Explicit height set to 50vh to compact the footer significantly
    <footer className="bg-black text-white border-t border-white/20 relative overflow-hidden h-[50vh] min-h-[400px] flex flex-col justify-between">
      {/* Animated Background */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Content Container - Centered Vertically */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 pointer-events-none flex-1">
        
        {/* LEFT COLUMN: CTA & Primary Actions */}
        <div className="px-5 md:px-8 border-b md:border-b-0 md:border-r border-white/20 flex flex-col justify-center">
          {/* Level 2 Variant: Footer Display */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter mb-4 leading-[0.85] mix-blend-overlay opacity-90">
            Let's<br/>Build<br/><span className="text-swiss-red">Together.</span>
          </h2>
          
          {/* Changed from flex-row to flex-col, gap-6 to gap-3, items-center to items-start */}
          <div className="flex flex-col gap-3 items-start pointer-events-auto">
            {/* Email Copy Button */}
            <button 
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 text-base md:text-lg font-medium hover:text-swiss-red transition-colors border-b-2 border-transparent hover:border-swiss-red pb-0.5 group"
            >
                mialiutnfg@gmail.com
                {copied ? (
                  <Check size={16} className="text-green-400" />
                ) : (
                  <Copy size={16} className="opacity-50 group-hover:opacity-100 group-hover:translate-y-px transition-all duration-300" />
                )}
            </button>

            {/* Resume Download Button */}
            <a 
                href="https://raw.githubusercontent.com/mialiu05/portfolio-assets/27e2ad8b19a574e482443dbe81c0a2d412797cda/Miao%20Liu%20-%20Product%20Designer%20CV.pdf" 
                download
                className="inline-flex items-center gap-2 text-base md:text-lg font-medium hover:text-swiss-red transition-colors border-b-2 border-transparent hover:border-swiss-red pb-0.5 group"
            >
                Download Resume 
                <Download size={16} className="opacity-50 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-300"/>
            </a>
          </div>
        </div>
        
        {/* RIGHT COLUMN: Social Links */}
        <div className="px-5 md:px-8 flex flex-col justify-center bg-black/10 backdrop-blur-[2px]">
            <div className="pointer-events-auto">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-3">Social</h4>
                <ul className="space-y-2">
              {/* 修改后的代码：包含具体的链接 */}
{[
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/miao-liu-a6aaaa28a/' }, // 👈 把这里改成你的链接
  { name: 'X', url: 'https://x.com/Mia10hf' },
  { name: 'GitHub', url: 'https://github.com/mialiu05' },
  { name: 'Instagram', url: 'https://www.instagram.com/miaol05?igsh=MWxpa25wYWI4bnRvNw%3D%3D&utm_source=qr' }
].map((item) => (
  <li key={item.name}>
    <a 
      href={item.url} 
      target="_blank" // 👈 新标签页打开
      rel="noopener noreferrer" // 👈 安全属性
      className="text-xl md:text-2xl font-bold hover:text-swiss-red transition-colors flex items-center group"
    >
      {item.name} 
      <ArrowUpRight 
        size={14} 
        className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-1 transition-all ml-1" 
      />
    </a>
  </li>
))}
                </ul>
            </div>
        </div>
      </div>

      {/* BOTTOM BAR: Copyright & Location */}
      <div className="relative z-10 border-t border-white/20 p-3 md:px-6 flex flex-col md:flex-row justify-between items-center gap-2 bg-black/20 backdrop-blur-md shrink-0">
         <p className="text-[10px] font-mono text-neutral-500 uppercase">
             © 2025 MIAO LIU. POWERED BY GEMINI 3 PRO.
         </p>
         <div className="flex items-center gap-4 text-[10px] font-mono text-neutral-500 uppercase">
            <span>Leipzig, DE</span>
            <span className="w-1 h-1 bg-swiss-red rounded-full"></span>
            <span>GMT+1</span>
         </div>
      </div>
    </footer>
  );
};
