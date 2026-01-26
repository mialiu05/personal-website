# 网站加载性能优化指南

## 📊 当前问题分析

### 发现的问题
1. **Preloader 只加载前2个项目**，但首屏有4个项目
2. **图片和视频都来自 GitHub raw**，没有 CDN 加速
3. **没有图片压缩和格式优化**（PNG/JPG 未转换为 WebP）
4. **视频文件较大**，metadata 加载慢
5. **缺少响应式图片**（不同设备加载不同尺寸）

---

## ✅ 已完成的优化

### 1. Preloader 优化
- ✅ 现在加载**所有4个项目的图片**（之前只加载2个）
- ✅ 预加载**所有4个项目的视频 metadata**（之前只加载1个）
- ✅ 确保首屏资源在 Preloader 期间完全加载

### 2. 占位符系统
- ✅ 所有图片都有骨架屏占位符
- ✅ 平滑的加载过渡动画

---

## 🚀 进一步优化建议

### 一、图片优化（优先级：高）

#### 1. 格式转换：PNG/JPG → WebP
**当前状态**：所有图片都是 PNG/JPG  
**优化方案**：
- 使用 WebP 格式（比 PNG 小 25-35%，比 JPG 小 25-30%）
- 保留原格式作为 fallback

**工具推荐**：
- 在线工具：https://squoosh.app/
- 命令行：`cwebp input.png -q 80 -o output.webp`
- 批量处理：ImageMagick 或 Sharp (Node.js)

**实施步骤**：
```bash
# 示例：压缩并转换图片
# 1. 压缩原图
# 2. 转换为 WebP
# 3. 上传到 CDN
# 4. 更新 constants.ts 中的 URL
```

#### 2. 图片压缩
**目标**：
- 封面图片：宽度 ≤ 1200px，质量 80-85%
- 详情页图片：宽度 ≤ 1920px，质量 80-85%
- 缩略图：宽度 ≤ 600px，质量 75-80%

**工具**：
- TinyPNG: https://tinypng.com/（免费，每月 500 张）
- Squoosh: https://squoosh.app/（Google 开源，无限制）

#### 3. 响应式图片（srcset）
**当前**：所有设备加载同一张图片  
**优化**：根据设备加载不同尺寸

```tsx
// 示例实现
<picture>
  <source srcSet={`${imageUrl}?w=600 600w, ${imageUrl}?w=1200 1200w`} type="image/webp" />
  <img src={imageUrl} alt={alt} />
</picture>
```

---

### 二、视频优化（优先级：高）

#### 1. 视频压缩
**当前问题**：
- 视频文件可能很大（几 MB 到几十 MB）
- 只加载 metadata 也需要时间

**优化方案**：
- **压缩视频**：使用 H.264 编码，CRF 23-28
- **降低分辨率**：封面视频 ≤ 1280x720，详情页 ≤ 1920x1080
- **降低帧率**：30fps 足够（如果原视频是 60fps）

**工具**：
```bash
# 使用 FFmpeg 压缩
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k output.mp4

# 生成缩略图作为 poster
ffmpeg -i input.mp4 -ss 00:00:01 -vframes 1 poster.jpg
```

#### 2. 视频格式优化
- **主格式**：MP4 (H.264) - 兼容性最好
- **可选**：WebM (VP9) - 更小，但需要 fallback
- **Poster 图片**：确保所有视频都有高质量的 poster

#### 3. 视频分段加载
**当前**：整个视频文件  
**优化**：使用 HLS 或 DASH 分段加载（对于大视频）

---

### 三、CDN 和托管优化（优先级：中）

#### 1. 使用专业 CDN
**当前**：GitHub raw（无 CDN，全球访问慢）  
**推荐**：
- **Vercel/Netlify**：如果网站部署在这里，可以使用他们的 CDN
- **Cloudflare**：免费 CDN，全球加速
- **AWS CloudFront**：付费但性能好
- **Imgix/Cloudinary**：图片专用 CDN，支持自动优化

#### 2. 图片 CDN 服务（推荐）
**Cloudinary** 或 **Imgix**：
- 自动格式转换（WebP/AVIF）
- 自动压缩和优化
- 响应式图片（通过 URL 参数）
- 免费额度通常足够个人网站

**示例**：
```typescript
// 之前
imageUrl: 'https://raw.githubusercontent.com/.../cover.png'

// 使用 Cloudinary
imageUrl: 'https://res.cloudinary.com/your-cloud/image/upload/q_auto,f_auto,w_1200/cover.png'
```

---

### 四、加载策略优化（优先级：中）

#### 1. 资源优先级
```tsx
// 关键资源（首屏）
<link rel="preload" as="image" href={project1Image} />
<link rel="preload" as="image" href={project2Image} />

// 非关键资源（延迟加载）
<img loading="lazy" decoding="async" />
```

#### 2. 渐进式加载
- **首屏**：只加载前 2-4 个项目
- **滚动时**：按需加载其他内容
- **预加载**：鼠标悬停时预加载视频

#### 3. 缓存策略
```html
<!-- 在 index.html 中添加 -->
<meta http-equiv="Cache-Control" content="public, max-age=31536000">
```

---

### 五、代码优化（优先级：低）

#### 1. 图片懒加载优化
当前已实现，但可以进一步优化：
- 使用 `loading="lazy"` 的 `IntersectionObserver` 提前加载（距离视口 200px 时开始）

#### 2. 视频预加载策略
```tsx
// 当前：preload="none"（好）
// 可以：鼠标悬停时提前加载视频（已实现）
```

---

## 📋 实施优先级

### 立即实施（高优先级）
1. ✅ **Preloader 优化**（已完成）
2. 🔲 **图片压缩**（预计减少 50-70% 大小）
3. 🔲 **转换为 WebP**（预计减少 25-35% 大小）
4. 🔲 **视频压缩**（预计减少 60-80% 大小）

### 短期实施（1-2周）
5. 🔲 **使用 CDN**（Cloudinary 或 Cloudflare）
6. 🔲 **添加响应式图片**

### 长期优化（可选）
7. 🔲 **视频分段加载**（如果视频仍然很大）
8. 🔲 **Service Worker 缓存**

---

## 🛠️ 具体操作步骤

### 步骤 1：压缩所有图片
1. 下载所有图片到本地
2. 使用 TinyPNG 或 Squoosh 压缩
3. 转换为 WebP 格式
4. 上传到新的 CDN（或 GitHub）

### 步骤 2：压缩所有视频
1. 使用 FFmpeg 压缩视频
2. 生成 poster 图片
3. 上传到 CDN

### 步骤 3：更新 constants.ts
```typescript
// 更新所有 imageUrl 和 videoUrl
imageUrl: 'https://your-cdn.com/optimized/cover.webp',
videoUrl: 'https://your-cdn.com/optimized/cover.mp4',
```

### 步骤 4：测试
1. 清除浏览器缓存
2. 测试加载速度
3. 使用 Chrome DevTools Network 面板检查

---

## 📈 预期效果

### 优化前
- 首屏加载：3-5 秒
- 图片总大小：~5-10 MB
- 视频总大小：~20-50 MB

### 优化后（预期）
- 首屏加载：1-2 秒 ⚡
- 图片总大小：~1-2 MB（减少 70-80%）
- 视频总大小：~5-10 MB（减少 70-80%）

---

## 🔍 性能监控

### 工具推荐
1. **Chrome DevTools**：Network 面板
2. **Lighthouse**：性能评分
3. **WebPageTest**：https://www.webpagetest.org/
4. **PageSpeed Insights**：https://pagespeed.web.dev/

### 关键指标
- **FCP (First Contentful Paint)**：< 1.8s
- **LCP (Largest Contentful Paint)**：< 2.5s
- **TTI (Time to Interactive)**：< 3.8s

---

## 💡 额外建议

### 1. 使用图片占位符（已完成 ✅）
- 骨架屏提供即时反馈
- 避免布局跳动

### 2. 考虑使用 Next.js Image 组件
如果未来迁移到 Next.js，可以使用 `<Image>` 组件：
- 自动优化
- 自动懒加载
- 自动响应式

### 3. 监控真实用户性能
- 使用 Google Analytics 或其他工具
- 监控不同地区和设备的加载速度

---

## 📞 需要帮助？

如果在实施过程中遇到问题，可以：
1. 检查浏览器 Network 面板，找出加载最慢的资源
2. 使用 Lighthouse 获取具体优化建议
3. 逐步优化，不要一次性改太多
