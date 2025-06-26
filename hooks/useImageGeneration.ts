'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';

interface GenerateImageOptions {
  negative_prompt?: string;
  num_images?: number;
  style?: string;
  super_resolution?: boolean;
  face_correct?: boolean;
  w?: number;
  h?: number;
  cfg_scale?: number;
  steps?: number;
}

interface GeneratedImageResult {
  id: string;
  text: string;
  url?: string;
  images?: string[];
  status?: 'pending' | 'generating' | 'completed' | 'failed';
  created_at: string;
  tune_id: number;
}

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  createdAt: Date;
  status: 'generating' | 'completed' | 'failed';
}

interface UseImageGenerationReturn {
  generateImages: (prompt: string, options?: GenerateImageOptions) => Promise<void>;
  isGenerating: boolean;
  error: string | null;
  generatedImages: GeneratedImage[];
  clearError: () => void;
  clearImages: () => void;
}

export function useImageGeneration(): UseImageGenerationReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const pollingIntervals = useRef<Set<NodeJS.Timeout>>(new Set());

  // 防止 hydration 错误
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const clearError = useCallback(() => setError(null), []);
  const clearImages = useCallback(() => setGeneratedImages([]), []);

  // 轮询获取生成结果
  const pollForResults = useCallback(async (promptId: string, tuneId: string, prompt: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/generate-image?promptId=${promptId}&tuneId=${tuneId || '1504944'}`);
        const result = await response.json();

        if (result.success && result.data) {
          const promptData = result.data;
          
          console.log('轮询结果:', promptData); // 调试日志
          
          // 检查是否有生成的图片
          if (promptData.images && promptData.images.length > 0) {
            // 清除轮询
            clearInterval(pollInterval);
            pollingIntervals.current.delete(pollInterval);

            // 更新图片状态为完成
            setGeneratedImages(prev => {
              // 移除占位图片
              const filtered = prev.filter(img => !img.id.includes('placeholder'));

              // 添加生成的图片
              const newImages = promptData.images.map((imageUrl: string, index: number) => ({
                id: `${promptId}-${index}`,
                url: imageUrl,
                prompt: prompt,
                createdAt: isMounted ? new Date() : new Date(0),
                status: 'completed' as const
              }));

              return [...newImages, ...filtered];
            });

            setIsGenerating(false);
          } else if (promptData.status === 'failed') {
            // 生成失败
            clearInterval(pollInterval);
            pollingIntervals.current.delete(pollInterval);
            
            setGeneratedImages(prev => 
              prev.map(img => 
                img.id.includes(`${promptId}-placeholder`)
                  ? { ...img, status: 'failed' as const }
                  : img
              )
            );
            setError('图像生成失败，请重试');
            setIsGenerating(false);
          }
          // 如果还在生成中，继续轮询
        } else {
          console.error('轮询API返回错误:', result);
        }
      } catch (err) {
        console.error('轮询错误:', err);
        // 轮询出错不立即停止，继续尝试
      }
    }, 3000); // 每3秒轮询一次

    pollingIntervals.current.add(pollInterval);

    // 设置超时，避免无限轮询
    setTimeout(() => {
      if (pollingIntervals.current.has(pollInterval)) {
        clearInterval(pollInterval);
        pollingIntervals.current.delete(pollInterval);
        setError('图像生成超时，请重试');
        setIsGenerating(false);
      }
    }, 180000); // 3分钟超时
  }, [isMounted]);

  const generateImages = useCallback(async (
    prompt: string,
    options: GenerateImageOptions = {}
  ) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt, 
          options: { 
            ...options, 
            num_images: 1 // 生成1张图片
          } 
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '图像生成失败');
      }

      if (result.success && result.data) {
        const promptData: GeneratedImageResult = result.data;
        
        // 创建1个占位图片
        const placeholderImages: GeneratedImage[] = Array.from({ length: 1 }, (_, index) => ({
          id: `${promptData.id}-placeholder-${index}`,
          url: '', // 空URL表示占位状态
          prompt: prompt,
          createdAt: isMounted ? new Date() : new Date(0),
          status: 'generating' as const
        }));

        // 添加占位图片到状态
        setGeneratedImages(prev => [...placeholderImages, ...prev]);

        // 开始轮询获取结果
        await pollForResults(promptData.id, String(promptData.tune_id || '1504944'), prompt);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      setError(errorMessage);
      setIsGenerating(false);
    }
  }, [pollForResults]);

  // 清理函数
  const cleanup = useCallback(() => {
    pollingIntervals.current.forEach(interval => clearInterval(interval));
    pollingIntervals.current.clear();
  }, []);

  // 组件卸载时清理轮询
  React.useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    generateImages,
    isGenerating,
    error,
    generatedImages,
    clearError,
    clearImages,
  };
} 