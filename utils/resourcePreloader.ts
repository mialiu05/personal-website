/**
 * Resource Preloader Utility
 * 用于预加载图片、视频等资源，提升网站性能
 */

/**
 * 预加载图片
 */
export function preloadImage(src: string, priority: 'high' | 'low' = 'low'): Promise<void> {
  return new Promise((resolve, reject) => {
    // 检查是否已经加载
    const existingLink = document.querySelector(`link[rel="preload"][as="image"][href="${src}"]`);
    if (existingLink) {
      resolve();
      return;
    }

    // 使用 link rel="preload" 预加载
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    if (priority === 'high') {
      link.setAttribute('fetchpriority', 'high');
    }
    document.head.appendChild(link);

    // 同时使用 Image 对象预加载
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => {
      // 即使失败也 resolve，不阻塞流程
      resolve();
    };
    img.src = src;
  });
}

/**
 * 预加载视频元数据
 */
export function preloadVideoMetadata(src: string): Promise<void> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => resolve();
    video.onerror = () => resolve(); // 即使失败也继续
    video.src = src;
    video.load();
  });
}

/**
 * 预加载视频（完整加载）
 */
export function preloadVideo(src: string, priority: 'high' | 'low' = 'low'): Promise<void> {
  return new Promise((resolve) => {
    // 使用 link rel="preload" 预加载
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'video';
    link.href = src;
    if (priority === 'high') {
      link.setAttribute('fetchpriority', 'high');
    }
    document.head.appendChild(link);

    const video = document.createElement('video');
    video.preload = 'auto';
    video.oncanplaythrough = () => resolve();
    video.onerror = () => resolve();
    video.src = src;
    video.load();
  });
}

/**
 * 批量预加载图片
 */
export async function preloadImages(
  sources: string[],
  priority: 'high' | 'low' = 'low',
  concurrency: number = 3
): Promise<void> {
  const chunks: string[][] = [];
  for (let i = 0; i < sources.length; i += concurrency) {
    chunks.push(sources.slice(i, i + concurrency));
  }

  for (const chunk of chunks) {
    await Promise.all(chunk.map(src => preloadImage(src, priority)));
  }
}

/**
 * 批量预加载视频元数据
 */
export async function preloadVideoMetadatas(
  sources: string[],
  concurrency: number = 2
): Promise<void> {
  const chunks: string[][] = [];
  for (let i = 0; i < sources.length; i += concurrency) {
    chunks.push(sources.slice(i, i + concurrency));
  }

  for (const chunk of chunks) {
    await Promise.all(chunk.map(src => preloadVideoMetadata(src)));
  }
}

/**
 * 预加载项目详情页的首屏资源
 * 包括：项目封面图、首屏图片和视频
 */
export function preloadProjectDetailResources(
  imageUrls: string[],
  videoUrls: string[] = []
): void {
  // 使用 requestIdleCallback 在浏览器空闲时预加载
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // 预加载首屏图片（前3-5张）
      const firstScreenImages = imageUrls.slice(0, 5);
      preloadImages(firstScreenImages, 'high', 2);

      // 预加载视频元数据
      if (videoUrls.length > 0) {
        const firstScreenVideos = videoUrls.slice(0, 3);
        preloadVideoMetadatas(firstScreenVideos, 1);
      }
    });
  } else {
    // 降级方案：延迟执行
    setTimeout(() => {
      const firstScreenImages = imageUrls.slice(0, 5);
      preloadImages(firstScreenImages, 'high', 2);
      if (videoUrls.length > 0) {
        const firstScreenVideos = videoUrls.slice(0, 3);
        preloadVideoMetadatas(firstScreenVideos, 1);
      }
    }, 100);
  }
}
