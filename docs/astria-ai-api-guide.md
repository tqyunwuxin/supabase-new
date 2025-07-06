# Astria.ai 文生图 API 完整指南

> 基于 [Astria.ai API 文档](https://docs.astria.ai/docs/api/prompt/create/) 整理  
> 项目：Next.js + TypeScript + Supabase 集成方案

---

## 📚 目录

- [📋 概述](#-概述)
- [🔧 API 基础参考](#-api-基础参考)  
- [🚀 当前项目实现](#-当前项目实现)
- [💰 收费策略与配置建议](#-收费策略与配置建议)
- [🎨 高级功能拓展规划](#-高级功能拓展规划)
- [💼 商业化策略](#-商业化策略)
- [📈 实施路线图](#-实施路线图)

---

## 📋 概述

Astria.ai 提供了强大的文生图 API 服务，支持通过文本描述生成高质量的 AI 图像。该 API 基于深度学习模型，支持多种图像生成功能和定制选项。

### 🎯 核心特性
- ✅ 基础文本到图像生成
- ✅ 多种艺术风格 (摄影、动画、数字艺术等)
- ✅ 图像增强功能 (超分辨率、面部修正)
- ✅ ControlNet 控制生成
- ✅ 图像修复 (Inpainting)
- ✅ 批量生成和回调机制

### 💰 收费标准 (2024年)
- **Flux 模型**: $0.23/8张 = **$0.029/张**
- **Stable Diffusion**: $0.10/8张 = **$0.0125/张**
- **附加功能**: 超分辨率/面部修正 **+$0.0125/张**
- **实际成本**: $0.0415/张 (含超分辨率)

---

## 🔧 API 基础参考

### 基本信息
- **基础 URL**: `https://api.astria.ai`
- **认证方式**: Bearer Token
- **请求方式**: POST
- **端点**: `/tunes/:id/prompts`

### 认证
```bash
Authorization: Bearer YOUR_API_KEY
```

### 核心参数

#### 必需参数
| 参数 | 类型 | 描述 |
|------|------|------|
| `text` | string | 图像描述文本（提示词） |

#### 主要可选参数
| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `negative_prompt` | string | - | 负面提示词 |
| `num_images` | integer | 1 | 生成图像数量（1-8） |
| `w` | integer | - | 图像宽度（8的倍数） |
| `h` | integer | - | 图像高度（8的倍数） |
| `cfg_scale` | float | - | 提示词遵循程度（0-15） |
| `steps` | integer | - | 扩散步数（0-50） |

#### 高级功能参数
| 参数 | 类型 | 描述 | 成本影响 |
|------|------|------|----------|
| `super_resolution` | boolean | 4倍超分辨率 | +$0.0125 |
| `face_correct` | boolean | 面部修正 | +$0.0125 |
| `face_swap` | boolean | 面部替换 | +$0.0125 |
| `hires_fix` | boolean | 高分辨率细节增强 | 无 |
| `film_grain` | boolean | 添加胶片噪点 | 无 |

#### 风格参数
| 参数 | 可选值 |
|------|--------|
| `style` | `Cinematic`, `Animated`, `Digital Art`, `Photographic`, `Fantasy art`, `Neonpunk`, `Comic book` 等 |
| `scheduler` | `euler`, `dpm++2m_karras`, `dpm++sde_karras`, `lcm`, `tcd` |

### ControlNet 功能
| 参数 | 描述 |
|------|------|
| `controlnet` | 控制类型：`composition`, `reference`, `lineart`, `canny`, `depth`, `pose` 等 |
| `input_image` | 输入图像（二进制文件） |
| `denoising_strength` | 去噪强度（0.0-1.0） |

### 响应格式
```json
{
  "id": 1,
  "text": "提示词",
  "cfg_scale": null,
  "created_at": "2022-10-06T16:12:54.505Z",
  "tune_id": 1,
  "url": "http://api.astria.ai/tunes/1/prompts/1.json"
}
```

---

## 🚀 当前项目实现

### 📁 项目结构
```
with-supabase-app/
├── app/api/generate-image/
│   └── route.ts                 # API 路由
├── hooks/
│   └── useImageGeneration.ts    # 自定义 Hook
├── components/
│   ├── image-generator.tsx      # 主要组件
│   └── ui/skeleton.tsx         # 骨架屏组件
├── .env.local                   # 环境变量
└── next.config.ts              # Next.js 配置
```

### 🔧 环境变量配置
```bash
# .env.local
ASTRIA_API_KEY=sd_N1TQoX2f8RN59sM4HbhLasZKgRfskF
ASTRIA_TUNE_ID=1504944

# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 🌐 Next.js 配置
```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https", 
        hostname: "api.astria.ai", // ⭐ Astria 图片域名
      },
    ],
  },
};

export default nextConfig;
```

### 🛠️ API 路由实现
```typescript
// app/api/generate-image/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, options = {} } = await request.json();
    
    if (!prompt?.trim()) {
      return NextResponse.json({ error: '请提供有效的提示词' }, { status: 400 });
    }

    const apiKey = process.env.ASTRIA_API_KEY;
    const tuneId = process.env.ASTRIA_TUNE_ID || '1504944';
    
    if (!apiKey) {
      return NextResponse.json({ error: '服务配置错误' }, { status: 500 });
    }

    // 🎯 Flux 模型适配
    const isFluxModel = tuneId === '1504944';
    const form = new FormData();
    
    form.append('prompt[text]', prompt.trim());
    form.append('prompt[num_images]', String(options.num_images || 1));
    form.append('prompt[style]', options.style || 'Photographic');
    form.append('prompt[super_resolution]', String(options.super_resolution !== false));
    form.append('prompt[face_correct]', String(options.face_correct !== false));
    form.append('prompt[w]', String(options.w || 512));
    form.append('prompt[h]', String(options.h || 512));
    
    // ⚡ Flux 限制：cfg_scale < 5
    const cfgScale = isFluxModel ? (options.cfg_scale || 3.5) : (options.cfg_scale || 7);
    form.append('prompt[cfg_scale]', String(Math.min(cfgScale, isFluxModel ? 4.9 : 15)));
    form.append('prompt[steps]', String(options.steps || 25));
    
    // 🚫 Flux 不支持 negative_prompt
    if (!isFluxModel && options.negative_prompt) {
      form.append('prompt[negative_prompt]', options.negative_prompt);
    }

    const response = await fetch(`https://api.astria.ai/tunes/${tuneId}/prompts`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}` },
      body: form
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Astria API Error:', error);
      return NextResponse.json({ error: '图像生成失败' }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
}

// 🔄 轮询状态接口
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const promptId = searchParams.get('promptId');
  const tuneId = searchParams.get('tuneId') || '1504944';
  
  if (!promptId) {
    return NextResponse.json({ error: '缺少 promptId' }, { status: 400 });
  }

  const response = await fetch(`https://api.astria.ai/tunes/${tuneId}/prompts/${promptId}`, {
    headers: { 'Authorization': `Bearer ${process.env.ASTRIA_API_KEY}` }
  });

  const result = await response.json();
  return NextResponse.json({ success: true, data: result });
}
```

### 🎣 自定义 Hook (核心功能)
```typescript
// hooks/useImageGeneration.ts
'use client';
import React, { useState, useCallback, useRef, useEffect } from 'react';

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  createdAt: Date;
  status: 'generating' | 'completed' | 'failed';
}

export function useImageGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const pollingIntervals = useRef<Set<NodeJS.Timeout>>(new Set());

  useEffect(() => { setIsMounted(true); }, []);

  // 🔄 轮询获取结果
  const pollForResults = useCallback(async (promptId: string, tuneId: string, prompt: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/generate-image?promptId=${promptId}&tuneId=${tuneId}`);
        const result = await response.json();

        if (result.success && result.data?.images?.length > 0) {
          clearInterval(pollInterval);
          pollingIntervals.current.delete(pollInterval);

          setGeneratedImages(prev => {
            const filtered = prev.filter(img => !img.id.includes('placeholder'));
            const newImages = result.data.images.map((imageUrl: string, index: number) => ({
              id: `${promptId}-${index}`,
              url: imageUrl,
              prompt,
              createdAt: isMounted ? new Date() : new Date(0),
              status: 'completed' as const
            }));
            return [...newImages, ...filtered];
          });
          setIsGenerating(false);
        }
      } catch (err) {
        console.error('轮询错误:', err);
      }
    }, 3000);

    pollingIntervals.current.add(pollInterval);
    
    // ⏰ 3分钟超时
    setTimeout(() => {
      if (pollingIntervals.current.has(pollInterval)) {
        clearInterval(pollInterval);
        setError('生成超时');
        setIsGenerating(false);
      }
    }, 180000);
  }, [isMounted]);

  const generateImages = useCallback(async (prompt: string, options = {}) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, options: { ...options, num_images: 1 } }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      if (result.success && result.data) {
        // 🎬 占位图片
        const placeholderImages = [{
          id: `${result.data.id}-placeholder-0`,
          url: '',
          prompt,
          createdAt: isMounted ? new Date() : new Date(0),
          status: 'generating' as const
        }];

        setGeneratedImages(prev => [...placeholderImages, ...prev]);
        await pollForResults(result.data.id, String(result.data.tune_id || '1504944'), prompt);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
      setIsGenerating(false);
    }
  }, [pollForResults, isMounted]);

  const clearError = useCallback(() => setError(null), []);
  const clearImages = useCallback(() => setGeneratedImages([]), []);

  // 🧹 清理轮询
  React.useEffect(() => {
    return () => {
      pollingIntervals.current.forEach(interval => clearInterval(interval));
      pollingIntervals.current.clear();
    };
  }, []);

  return { generateImages, isGenerating, error, generatedImages, clearError, clearImages };
}
```

### 🎨 图像生成器组件
```typescript
// components/image-generator.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon, Loader2, Download, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useImageGeneration } from "@/hooks/useImageGeneration";

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const { generateImages, isGenerating, error, generatedImages, clearError, clearImages } = useImageGeneration();

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    clearError();
    
    try {
      await generateImages(prompt, {
        style: 'Photographic',
        super_resolution: true,        // ⭐ 512→1024
        face_correct: true,           // ⭐ 面部修正
        w: 512,
        h: 512,
        cfg_scale: 3.5,              // Flux 适配
        steps: 25
      });
      setPrompt("");
    } catch (err) {
      console.error('生成失败:', err);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* 输入区域 */}
      <div className="space-y-4">
        <Input
          placeholder="描述您想要生成的图像..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
          disabled={isGenerating}
        />
        
        <div className="flex gap-3">
          <Button 
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                AI 正在生成...
              </>
            ) : (
              <>
                <ImageIcon className="w-4 h-4 mr-2" />
                生成图像
              </>
            )}
          </Button>
          
          {generatedImages.length > 0 && (
            <Button variant="outline" onClick={clearImages}>
              <RotateCcw className="w-4 h-4 mr-2" />
              清空
            </Button>
          )}
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {/* 图像网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {generatedImages.map((image) => (
          <Card key={image.id} className="aspect-square overflow-hidden group">
            <CardContent className="p-0 h-full relative">
              {image.url ? (
                <>
                  <Image
                    src={image.url}
                    alt={image.prompt}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = image.url;
                        link.download = `generated-${image.id}.jpg`;
                        link.click();
                      }}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

## 💰 收费策略与配置建议

### 🎯 推荐生成数量配置

#### 🎯 默认配置 (推荐)
- **生成数量**: `1张` 
- **原因**: 平衡成本与用户体验，单张$0.0415对用户友好
- **适用场景**: 普通用户日常使用

#### 💎 高级配置 (可选)
- **生成数量**: `2-4张`
- **原因**: 为用户提供更多选择，成本$0.083-0.166
- **适用场景**: 付费用户或重要项目

#### ⚠️ 不推荐
- **生成数量**: `5张以上`
- **原因**: 成本过高 (>$0.208)，用户体验下降

### 🔧 可配置的后台参数

#### 基础生成参数
| 参数 | 建议值 | 用户可见 | 描述 |
|------|--------|----------|------|
| `num_images` | 1-4 | ✅ | 生成图片数量 |
| `w` | 512/768/1024 | ✅ | 图像宽度 |
| `h` | 512/768/1024 | ✅ | 图像高度 |
| `style` | 见风格列表 | ✅ | 艺术风格 |
| `negative_prompt` | 预设/自定义 | ✅ | 负面提示词 |

#### 技术参数 (后台管理)
| 参数 | 推荐值 | 调整建议 |
|------|--------|----------|
| `cfg_scale` | 3.5 (Flux) / 7-12 (SD) | 根据模型类型自动调整 |
| `steps` | 20-25 | 平衡质量与生成时间 |
| `seed` | 随机 | 可提供固定种子选项 |
| `scheduler` | `dpm++2m_karras` | 推荐调度器 |

#### 高级功能 (可开关)
| 功能 | 成本影响 | 建议默认值 |
|------|----------|------------|
| `super_resolution` | +$0.0125 | ✅ 开启 |
| `face_correct` | +$0.0125 | ✅ 开启 |
| `hires_fix` | 无额外费用 | ✅ 开启 |
| `film_grain` | 无额外费用 | ❌ 关闭 |
| `face_swap` | +$0.0125 | ❌ 关闭 |

### 📐 当前图像尺寸配置

#### 默认尺寸配置
- **基础尺寸**: `512×512 像素`
- **开启超分辨率后**: `1024×1024 像素` ⭐
- **实际输出**: 由于默认开启 `super_resolution: true`，最终图片为 **1024×1024**
- **适用场景**: 高质量输出、专业用途
- **生成时间**: 约30-45秒

#### 推荐尺寸配置选项
```javascript
const imageSizes = {
  'small': { w: 512, h: 512, label: '正方形 (512×512)' },
  'medium': { w: 768, h: 768, label: '中等 (768×768)' },
  'portrait': { w: 512, h: 768, label: '竖版 (512×768)' },
  'landscape': { w: 768, h: 512, label: '横版 (768×512)' },
  'large': { w: 1024, h: 1024, label: '高清 (1024×1024)' }
};
```

#### 尺寸对生成的影响
| 基础尺寸 | 超分辨率后 | 生成时间 | 成本 | 质量 | 推荐用途 |
|----------|------------|----------|------|------|----------|
| 512×512 | **1024×1024** | 30-45秒 | $0.0415 | 🔥高质量 | **当前默认** |
| 768×768 | 1536×1536 | 45-60秒 | $0.0415 | 超高质量 | 专业用途 |
| 1024×1024 | 2048×2048 | 60-90秒 | $0.0415 | 最高质量 | 企业用途 |

**注**: 由于默认开启超分辨率，实际输出尺寸都是原尺寸的2倍

---

## 🎨 高级功能拓展规划

### 🎨 1. ControlNet 功能 (高商业价值)
```typescript
interface ControlNetOptions extends GenerateImageOptions {
  controlnet: 'composition' | 'reference' | 'lineart' | 'canny' | 'depth' | 'pose';
  input_image?: File;           // 用户上传的参考图像
  input_image_url?: string;     // 或图像URL
  denoising_strength?: number;  // 0.0-1.0，控制变化程度
  controlnet_conditioning_scale?: number; // 0.0-1.0，控制条件强度
}
```

**商业场景:**
- 🏠 **室内设计**: 上传房间照片，生成不同装修风格
- 👥 **人像生成**: 基于人物姿势生成不同服装/场景
- 🎭 **艺术创作**: 线稿生成彩色作品
- 📷 **图像风格化**: 保持构图改变风格

**收费策略**: 比基础生成贵 50-100% ($0.06-0.08/张)

### 🖌️ 2. 图像修复 (Inpainting) (超高价值)
```typescript
interface InpaintingOptions extends GenerateImageOptions {
  mask_image?: File;        // 遮罩图像，白色区域会被重新生成
  mask_image_url?: string;  // 遮罩图像URL
  inpaint_faces?: boolean;  // 专门的面部修复
}
```

**商业场景:**
- 🛠️ **照片修复**: 去除背景物体、修复缺陷
- 🎨 **创意编辑**: 替换图像中的特定部分
- 👤 **肖像美化**: 智能面部修复和优化
- 🏢 **房产图片**: 移除杂物、美化环境

**收费策略**: 高级功能，$0.10-0.15/张

### 🔄 3. 面部替换 (Face Swap) (特色功能)
```typescript
interface FaceSwapOptions extends GenerateImageOptions {
  face_swap: true;
  reference_face?: File;    // 参考面部图像
  target_image?: File;      // 目标图像
}
```

**商业场景:**
- 🎭 **娱乐应用**: 明星换脸、角色扮演
- 📸 **商业摄影**: 模特试衣、产品展示
- 🎮 **游戏/虚拟**: 虚拟形象生成

**收费策略**: 按次收费，$0.20-0.30/张

### 🎬 4. 批量生成与变体系统
```typescript
interface BatchGenerationOptions {
  variations: number;       // 同一提示词的变体数量
  seed_range?: [number, number]; // 种子范围
  style_variations?: string[];   // 不同风格变体
  aspect_ratios?: string[];      // 不同比例 ['1:1', '16:9', '9:16']
}
```

**商业场景:**
- 🎨 **设计师工具**: 快速生成多个方案
- 📱 **社交媒体**: 同时生成多种尺寸
- 🛍️ **电商应用**: 产品的多角度展示
- 📚 **内容创作**: 插图的多种选择

### 🎛️ 5. 高级参数控制面板
```typescript
interface AdvancedOptions extends GenerateImageOptions {
  // 🎨 艺术控制
  style: 'Photographic' | 'Animated' | 'Digital Art' | 'Fantasy art' | 'Cinematic';
  color_grading: 'Film Velvia' | 'Film Portra' | 'Ektar';
  film_grain: boolean;
  
  // ⚙️ 技术参数
  scheduler: 'euler' | 'dpm++2m_karras' | 'lcm' | 'tcd';
  seed: number;              // 可重复生成
  hires_fix: boolean;        // 高分辨率细节增强
  
  // 💎 质量控制
  quality_boost: boolean;     // 额外质量增强
  detail_level: 'low' | 'medium' | 'high' | 'ultra';
}
```

### 📊 6. 用户系统集成
```sql
-- 与 Supabase 集成的数据库表结构
CREATE TABLE user_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  prompt TEXT NOT NULL,
  parameters JSONB,
  result_urls TEXT[],
  cost DECIMAL(10,4),
  credits_used INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  generation_time INTEGER,
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5)
);

CREATE TABLE user_credits (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  balance INTEGER DEFAULT 0,
  total_purchased INTEGER DEFAULT 0,
  total_used INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 🔮 7. AI 功能增强
```typescript
// 智能提示词优化
interface PromptEnhancement {
  auto_enhance: boolean;           // 自动优化提示词
  style_suggestions: string[];     // 风格建议
  quality_keywords: string[];      // 质量关键词
  negative_auto: boolean;          // 自动生成负面提示词
}

// 内容识别
interface ContentAnalysis {
  subject_detection: boolean;      // 主体识别
  scene_analysis: boolean;         // 场景分析
  color_palette: string[];         // 色彩分析
  mood_detection: string;          // 情绪识别
}
```

---

## 💼 商业化策略

### 💰 盈利模式设计
1. **免费额度**: 每日免费生成 2-3 张 (成本控制在 $0.08-0.12)
2. **付费套餐**: 
   - 基础版: $4.99/月 - 120张图片 (单张成本$0.042)
   - 专业版: $9.99/月 - 300张图片 (单张成本$0.033)
   - 企业版: 按需定制

### 📊 成本效益分析
- **Flux 模型成本**: $0.0415/张 (含超分辨率)
- **建议售价**: $0.08-0.15/张 (90-260% 利润率)
- **用户体验平衡点**: 1张/次 (低成本高频使用)

### 🎯 用户分层策略

#### 🎯 免费用户 (获客)
- 每日 3 张基础生成
- 512×512 尺寸
- 基础风格选择
- 带水印

#### 💎 付费用户 (盈利)
- 无限制生成
- 所有尺寸和风格
- 高级功能 (ControlNet, Inpainting)
- 无水印
- 优先队列
- 批量下载

#### 🏢 企业用户 (高价值)
- API 接入
- 自定义模型训练
- 白标解决方案
- 专用服务器
- 技术支持

---

## 📈 实施路线图

### 🚀 Phase 1 (当前已完成)
- ✅ 基础文生图
- ✅ 超分辨率
- ✅ 面部修正
- ✅ 轮询系统
- ✅ 用户界面

### 🎨 Phase 2 (3-4周)
- 🔄 ControlNet 集成
- 📐 多尺寸选项
- 🎛️ 高级参数面板
- 💾 Supabase 集成

### 💎 Phase 3 (6-8周)
- 🖌️ Inpainting 功能
- 👥 用户系统
- 💰 付费体系
- 📊 使用统计

### 🚀 Phase 4 (10-12周)
- 🔄 Face Swap
- 🤖 AI 优化
- 🎬 批量生成
- 🏢 企业功能

### 🎯 优先级建议

1. **近期优先级**: ControlNet > 多尺寸 > 用户系统
2. **商业价值**: Inpainting > Face Swap > 批量生成
3. **技术难度**: Face Swap > ControlNet > Inpainting
4. **用户需求**: 多尺寸 > ControlNet > 高级参数

基于当前项目基础，建议优先实施 **ControlNet 功能**，它能显著提升用户体验和商业价值，同时技术实现相对简单。

---

## 📋 总结

Astria.ai 提供了功能丰富的文生图 API，本项目已成功集成基础功能，当前配置为：
- ✅ **默认生成**: 1张1024×1024高质量图片
- ✅ **成本控制**: $0.0415/张 (含超分辨率)
- ✅ **技术架构**: Next.js + TypeScript + Supabase
- ✅ **用户体验**: 轮询机制 + 骨架屏 + 实时反馈

**下一步建议**: 优先实施 ControlNet 功能，开启高级功能拓展之路。

---
*文档更新时间: 2024年12月*  
*基于官方文档: https://docs.astria.ai/docs/api/prompt/create/* 