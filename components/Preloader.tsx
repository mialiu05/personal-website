
import React, { useEffect, useRef, useState } from 'react';
import { PROJECTS } from '../constants';

const MIN_MS = 700;
const ASSET_TIMEOUT_MS = 4000;
const HOLD_AT_100_MS = 280;
const EXIT_TRANSITION_MS = 1000;
const PROGRESS_TO_90_MS = 1200; // Time to reach 90% (smoother progression)
const FINAL_TRANSITION_MS = 300; // Smooth transition from 90% to 100%

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

function preloadVideoMetadata(src: string): Promise<void> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => resolve();
    video.onerror = () => resolve(); // Continue even if video fails
    video.src = src;
    video.load();
  });
}

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;
    const start = Date.now();

    // Load ALL 4 project images for first screen (above the fold)
    const criticalImages = PROJECTS.slice(0, 4).map((p) => p.imageUrl);
    
    // Load metadata for all project videos (for hover effects)
    const criticalVideos = PROJECTS.slice(0, 4)
      .filter((p) => !p.comingSoon && p.videoUrl)
      .map((p) => p.videoUrl!);

    // Preload images with timeout
    const imagesPromise = Promise.race([
      Promise.all(criticalImages.map(preloadImage)),
      new Promise<void>((r) => setTimeout(r, ASSET_TIMEOUT_MS)),
    ]);

    // Preload video metadata (fire-and-forget, but track for progress)
    const videosPromise = Promise.race([
      Promise.all(criticalVideos.map(preloadVideoMetadata)),
      new Promise<void>((r) => setTimeout(r, ASSET_TIMEOUT_MS)),
    ]);

    // Wait for both images and videos (or timeout)
    const assetsPromise = Promise.all([imagesPromise, videosPromise]);

    let progressInterval: ReturnType<typeof setInterval> | null = null;
    let finalTransitionStartTime: number | null = null;

    const updateProgress = () => {
      if (cancelled.current) return;
      const elapsed = Date.now() - start;
      
      if (finalTransitionStartTime !== null) {
        // Smooth transition from 90% to 100%
        const transitionElapsed = Date.now() - finalTransitionStartTime;
        const transitionProgress = Math.min(1, transitionElapsed / FINAL_TRANSITION_MS);
        // Ease-out curve for smooth finish
        const eased = 1 - Math.pow(1 - transitionProgress, 3);
        setCount(Math.round(90 + eased * 10));
      } else {
        // Progressive growth: 0-70% in MIN_MS, then 70-90% over PROGRESS_TO_90_MS
        let progress = 0;
        if (elapsed < MIN_MS) {
          progress = (elapsed / MIN_MS) * 70;
        } else {
          const extraTime = elapsed - MIN_MS;
          const extraProgress = Math.min(20, (extraTime / PROGRESS_TO_90_MS) * 20);
          progress = 70 + extraProgress;
        }
        setCount(Math.round(Math.min(90, progress)));
      }
    };

    progressInterval = setInterval(updateProgress, 16); // ~60fps for smoother animation

    // Wait for minimum time AND critical assets to load
    Promise.all([
      new Promise<void>((r) => setTimeout(r, MIN_MS)),
      assetsPromise,
    ]).then(() => {
      if (cancelled.current) return;
      
      // Start smooth transition to 100%
      finalTransitionStartTime = Date.now();
      
      // Complete the transition
      setTimeout(() => {
        if (cancelled.current) return;
        if (progressInterval) clearInterval(progressInterval);
        setCount(100);
        setTimeout(() => {
          if (cancelled.current) return;
          setIsExiting(true);
          setTimeout(onComplete, EXIT_TRANSITION_MS);
        }, HOLD_AT_100_MS);
      }, FINAL_TRANSITION_MS);
    });

    return () => {
      cancelled.current = true;
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#050505] text-white flex flex-col justify-between transition-transform duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        isExiting ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="absolute inset-0 grid grid-cols-12 h-full w-full opacity-20 pointer-events-none">
        <div className="col-span-3 border-r border-dashed border-white/30 h-full hidden md:block" />
        <div className="col-span-3 border-r border-dashed border-white/30 h-full hidden md:block" />
        <div className="col-span-3 border-r border-dashed border-white/30 h-full hidden md:block" />
      </div>

      <div className="p-6 md:p-12 border-b border-white/10 flex justify-between items-start relative z-10">
        <h1 className="font-bold tracking-tighter text-sm md:text-base">MIAO LIU ©26</h1>
        <div className="flex gap-4 text-[10px] font-mono uppercase tracking-widest opacity-60">
          <span className="animate-pulse text-swiss-red">●</span>
          <span>Loading Experience</span>
        </div>
      </div>

      <div className="p-6 md:p-12 flex-1 flex flex-col justify-end relative z-10 pb-24">
        <div className="text-[15vw] leading-none font-black tracking-tighter tabular-nums mix-blend-difference">
          {Math.round(count)}%
        </div>
      </div>

      <div className="w-full h-[4px] bg-white/10 relative z-10">
        <div
          className="h-full bg-swiss-red transition-all duration-75 ease-linear"
          style={{ width: `${count}%` }}
        />
      </div>
    </div>
  );
};
