# 网站性能优化方案

## 问题分析

### 当前问题
1. **首页视频卡顿**：视频使用 `preload="none"`，只在 hover 时加载，导致首次播放延迟
2. **项目详情页图片加载慢**：图片使用 lazy loading，但预加载距离不够，导致滚动时卡顿
3. **缺少资源预加载**：没有使用 `<link rel="preload">` 预加载关键资源
4. **项目详情页资源未预加载**：进入项目详情页时，所有资源才开始加载

---

## 一、代码层面优化方案

### 1. 首页视频预加载优化

**问题**：视频 `preload="none"` 导致 hover 时才开始加载，造成卡顿

**解决方案**：
- 在 Preloader 期间预加载视频的前几秒（使用 `preload="metadata"` 或 `preload="auto"`）
- 使用 `<link rel="preload">` 预加载关键视频
- 优化视频加载策略：首屏视频使用 `preload="metadata"`，其他使用 `preload="none"`

**实现位置**：
- `components/ProjectGrid.tsx` - 修改视频的 `preload` 属性
- `components/Preloader.tsx` - 增强视频预加载逻辑
- `index.html` 或动态添加 `<link rel="preload">` 标签

### 2. 项目详情页图片预加载优化

**问题**：图片 lazy loading 的 `rootMargin` 不够，导致滚动时才开始加载

**解决方案**：
- 增加 `rootMargin` 到 800-1000px，提前加载
- 在进入项目详情页时，立即预加载首屏图片
- 使用 `<link rel="preload">` 预加载关键图片
- 实现图片优先级队列：首屏 > 中间内容 > 底部内容

**实现位置**：
- `components/ProjectDetail.tsx` - 修改 LazyImage 的 IntersectionObserver rootMargin
- `App.tsx` - 在切换到项目详情页时触发预加载
- 添加资源预加载管理器

### 3. 添加资源预加载管理器

**功能**：
- 在 Preloader 期间预加载所有首屏资源
- 在用户可能访问项目详情页时，提前预加载项目详情页的首屏资源
- 使用 `<link rel="preload">` 和 `fetchPriority="high"` 标记关键资源

**实现**：
```typescript
// utils/resourcePreloader.ts
export class ResourcePreloader {
  // 预加载图片
  static preloadImage(src: string, priority: 'high' | 'low' = 'low'): Promise<void>
  
  // 预加载视频元数据
  static preloadVideoMetadata(src: string): Promise<void>
  
  // 预加载项目详情页首屏资源
  static preloadProjectDetailResources(projectId: string): void
  
  // 使用 link rel="preload" 预加载关键资源
  static addPreloadLink(href: string, as: 'image' | 'video' | 'fetch'): void
}
```

### 4. 优化 IntersectionObserver 配置

**当前配置**：
- 首页图片：`rootMargin: '200px'`
- 详情页图片：`rootMargin: '500px'`
- 详情页视频：`rootMargin: '500px'`

**优化后配置**：
- 首页图片：`rootMargin: '400px'`（提前加载）
- 详情页首屏图片：`loading="eager"` + `fetchPriority="high"`
- 详情页其他图片：`rootMargin: '1000px'`（大幅提前）
- 详情页视频：`rootMargin: '800px'` + `preload="metadata"`

### 5. 实现渐进式加载策略

**策略**：
1. **首屏资源**（Above the fold）：立即加载，使用 `loading="eager"` 和 `fetchPriority="high"`
2. **临近资源**（Within 1000px）：提前预加载，使用 `loading="lazy"` 和较大的 `rootMargin`
3. **远端资源**（Beyond 1000px）：延迟加载，使用 `loading="lazy"` 和较小的 `rootMargin`

### 6. 添加资源加载优先级管理

**实现**：
- 使用 `fetchPriority` 属性标记关键资源
- 在 `<head>` 中添加 `<link rel="preload">` 标签
- 使用 `Resource Hints` API（`preconnect`, `dns-prefetch`）

### 7. 优化视频加载策略

**当前问题**：
- 首页视频：`preload="none"`，hover 时才开始加载
- 详情页视频：`preload="metadata"`，但可能不够

**优化方案**：
- 首页首屏视频：`preload="metadata"`（加载元数据，不加载完整视频）
- 首页其他视频：`preload="none"`（保持现状）
- 详情页首屏视频：`preload="auto"`（完整预加载）
- 详情页其他视频：`preload="metadata"`（加载元数据）

### 8. 实现智能预加载

**功能**：
- 检测用户鼠标移动方向，预测可能访问的项目
- 在用户 hover 项目卡片时，提前预加载项目详情页的首屏资源
- 使用 `requestIdleCallback` 在浏览器空闲时预加载非关键资源

---

## 二、对设计师的建议

### 1. 图片优化建议

#### 格式选择
- **优先使用 WebP**：比 JPEG/PNG 小 25-35%，质量相同
- **提供多种格式**：WebP（现代浏览器）+ JPEG/PNG（降级方案）
- **考虑 AVIF**：比 WebP 再小 20-30%，但浏览器支持较少

#### 尺寸优化
- **响应式图片**：提供多种尺寸（1x, 2x, 3x），使用 `srcset` 和 `sizes`
- **首屏图片**：宽度不超过 1920px（大多数显示器）
- **详情页图片**：根据实际显示宽度提供对应尺寸，避免加载超大图片
- **压缩质量**：JPEG 质量 80-85%，WebP 质量 80-90%

#### 文件大小目标
- **首屏图片**：< 200KB（每个）
- **详情页首屏图片**：< 300KB（每个）
- **详情页其他图片**：< 500KB（每个）
- **缩略图**：< 50KB（每个）

#### 具体建议
1. **使用图片压缩工具**：
   - [Squoosh](https://squoosh.app/) - Google 的在线压缩工具
   - [TinyPNG](https://tinypng.com/) - PNG/JPEG 压缩
   - [ImageOptim](https://imageoptim.com/) - Mac 桌面工具

2. **提供多种尺寸**：
   ```
   原图: 3000x2000px (2MB)
   ├── 1x: 1500x1000px (300KB) - 标准显示器
   ├── 2x: 3000x2000px (800KB) - Retina 显示器
   └── 3x: 4500x3000px (1.5MB) - 超高分辨率（可选）
   ```

3. **使用 CDN**：
   - 使用 GitHub Raw 或专业 CDN（如 Cloudflare、Vercel）
   - 启用 CDN 的图片优化功能（自动压缩、格式转换）

### 2. 视频优化建议

#### 格式选择
- **优先使用 MP4 (H.264)**：兼容性最好
- **提供 WebM 作为备选**：更小的文件大小
- **避免使用 MOV、AVI**：文件大，兼容性差

#### 编码设置
- **分辨率**：根据实际显示尺寸，不超过 1920x1080
- **帧率**：24-30fps（不需要 60fps）
- **码率**：
  - 首页 hover 视频：2-4 Mbps
  - 详情页视频：4-8 Mbps
- **关键帧间隔**：1-2 秒（便于快速定位）

#### 文件大小目标
- **首页 hover 视频**：< 2MB（每个，3-5 秒）
- **详情页视频**：< 10MB（每个，10-30 秒）
- **长视频**：考虑分段加载或使用流媒体

#### 具体建议
1. **使用视频压缩工具**：
   - [HandBrake](https://handbrake.fr/) - 免费开源
   - [FFmpeg](https://ffmpeg.org/) - 命令行工具
   - [Adobe Media Encoder](https://www.adobe.com/products/media-encoder.html) - 专业工具

2. **提供多种质量**：
   ```
   原视频: 1920x1080, 10Mbps, 30s (37MB)
   ├── 高质量: 1920x1080, 6Mbps (22MB) - 详情页
   ├── 中质量: 1280x720, 3Mbps (11MB) - 详情页备选
   └── 低质量: 960x540, 2Mbps (7MB) - 首页 hover
   ```

3. **提供 Poster 图片**：
   - 为每个视频提供高质量的封面图（Poster）
   - Poster 尺寸：1920x1080，< 200KB
   - 使用 WebP 格式

4. **视频分段**：
   - 如果视频 > 30 秒，考虑分段
   - 使用 HLS 或 DASH 流媒体格式（需要额外实现）

### 3. 资源组织建议

#### 文件命名
- 使用有意义的文件名：`game-cover-1920x1080.webp` 而不是 `IMG_1234.jpg`
- 包含尺寸信息：便于识别和选择

#### 目录结构
```
portfolio-assets/
├── images/
│   ├── covers/          # 项目封面
│   ├── thumbnails/      # 缩略图
│   └── detail/          # 详情页图片
├── videos/
│   ├── hover/           # 首页 hover 视频
│   └── detail/          # 详情页视频
└── posters/             # 视频封面图
```

### 4. 交付清单

#### 图片交付清单
- [ ] 所有图片提供 WebP 格式
- [ ] 提供 1x 和 2x 两种尺寸
- [ ] 首屏图片 < 200KB
- [ ] 详情页图片 < 500KB
- [ ] 所有图片经过压缩优化

#### 视频交付清单
- [ ] 所有视频为 MP4 (H.264) 格式
- [ ] 首页 hover 视频 < 2MB
- [ ] 详情页视频 < 10MB
- [ ] 每个视频提供 Poster 图片
- [ ] 视频分辨率不超过 1920x1080
- [ ] 视频码率优化（2-8 Mbps）

### 5. 工具推荐

#### 图片处理
- **Squoosh** (https://squoosh.app/) - 在线压缩
- **TinyPNG** (https://tinypng.com/) - PNG/JPEG 压缩
- **ImageOptim** (https://imageoptim.com/) - Mac 工具
- **GIMP** (https://www.gimp.org/) - 免费图片编辑

#### 视频处理
- **HandBrake** (https://handbrake.fr/) - 视频压缩
- **FFmpeg** (https://ffmpeg.org/) - 命令行工具
- **VLC** (https://www.videolan.org/) - 视频转换

#### 在线工具
- **CloudConvert** (https://cloudconvert.com/) - 格式转换
- **EZGIF** (https://ezgif.com/) - GIF/视频处理

---

## 三、实施优先级

### 高优先级（立即实施）
1. ✅ 增加图片 lazy loading 的 `rootMargin` 到 1000px
2. ✅ 首页视频改为 `preload="metadata"`
3. ✅ 在项目详情页加载时，立即预加载首屏图片
4. ✅ 添加 `<link rel="preload">` 预加载关键资源

### 中优先级（近期实施）
5. 实现资源预加载管理器
6. 优化视频加载策略（不同位置不同策略）
7. 实现智能预加载（hover 时预加载详情页资源）

### 低优先级（长期优化）
8. 实现渐进式图片加载（模糊占位符 → 低质量 → 高质量）
9. 使用 Service Worker 缓存资源
10. 实现资源优先级队列

---

## 四、预期效果

### 优化前
- 首页视频 hover 延迟：500-1000ms
- 详情页图片加载延迟：滚动时才开始加载，延迟 200-500ms
- 首屏加载时间：3-5 秒

### 优化后
- 首页视频 hover 延迟：< 100ms（已预加载元数据）
- 详情页图片加载延迟：提前 1000px 预加载，几乎无延迟
- 首屏加载时间：2-3 秒（减少 40%）

---

## 五、监控和测试

### 性能指标
- **LCP (Largest Contentful Paint)**：目标 < 2.5s
- **FID (First Input Delay)**：目标 < 100ms
- **CLS (Cumulative Layout Shift)**：目标 < 0.1
- **TTI (Time to Interactive)**：目标 < 3.5s

### 测试工具
- **Chrome DevTools** - Performance 面板
- **Lighthouse** - 性能评分
- **WebPageTest** - 详细性能分析
- **Network 面板** - 资源加载时间

### 测试场景
1. 首次访问（冷启动）
2. 从首页进入项目详情页
3. 在项目详情页中滚动
4. 首页 hover 视频
5. 慢速网络（3G）测试
