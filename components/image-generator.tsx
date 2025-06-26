"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageIcon, Loader2, AlertCircle, Download, RotateCcw, X } from "lucide-react";
import Image from "next/image";
import { useImageGeneration } from "@/hooks/useImageGeneration";

// 骨架屏组件
function ImageSkeleton() {
  return (
    <Card className="aspect-square">
      <CardContent className="p-0 h-full">
        <div className="relative h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 p-4">
            <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
            </div>
            <div className="text-center">
              <Skeleton className="h-3 w-20 mb-2" />
              <Skeleton className="h-2 w-16" />
            </div>
          </div>
          
          {/* 波浪动画效果 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-pulse" 
                 style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const { 
    generateImages, 
    isGenerating, 
    error, 
    generatedImages, 
    clearError, 
    clearImages 
  } = useImageGeneration();

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    clearError();
    
    try {
      await generateImages(prompt, {
        style: 'Photographic',
        super_resolution: true,
        face_correct: true,
        w: 512,
        h: 512,
        cfg_scale: 3.5, // Flux 模型适配的参数
        steps: 25
      });
      setPrompt("");
    } catch (err) {
      console.error('生成失败:', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* 错误提示 */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700">{error}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearError}
            className="text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* 输入区域 */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <Input
              placeholder="描述您想要生成的图像，例如：一只可爱的小猫在花园里玩耍..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-base h-12 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              disabled={isGenerating}
            />
          </div>
          
          <div className="flex items-center gap-3">
            {/* 清空按钮 */}
            {generatedImages.length > 0 && (
              <Button 
                variant="outline" 
                onClick={clearImages}
                disabled={isGenerating}
                className="h-12 px-6 border-gray-300 hover:bg-gray-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                清空
              </Button>
            )}
          </div>
        </div>

        {/* 生成按钮 */}
        <Button 
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              AI 正在生成图像...
            </>
          ) : (
            <>
              <ImageIcon className="w-4 h-4 mr-2" />
              生成图像
            </>
          )}
        </Button>

        {/* 提示信息 */}
        <div className="text-sm text-gray-500 text-center">
          💡 提示：详细的描述能生成更好的图像效果 | 每张图片约 $0.029 (Flux) / $0.0125 (SD)
        </div>
      </div>

      {/* 图像展示区域 */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">
            生成的图像 {generatedImages.length > 0 && `(${generatedImages.filter(img => img.status === 'completed').length})`}
          </h2>
          {isGenerating && (
            <div className="text-sm text-blue-600 font-medium">
              正在生成中...
            </div>
          )}
        </div>
        
        {generatedImages.length === 0 && !isGenerating ? (
          /* 空状态 */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="aspect-square bg-gray-50 border-gray-200 border-dashed">
              <CardContent className="flex flex-col items-center justify-center h-full p-4 text-center">
                <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-xs text-gray-500">
                  等待生成<br />
                  点击生成按钮开始
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* 图片网格 */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {generatedImages.map((image) => (
              <div key={image.id}>
                {image.status === 'generating' && !image.url ? (
                  <ImageSkeleton />
                ) : image.status === 'failed' ? (
                  <Card className="aspect-square border-red-200 bg-red-50">
                    <CardContent className="flex flex-col items-center justify-center h-full p-4 text-center">
                      <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
                      <p className="text-xs text-red-600">生成失败</p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="aspect-square overflow-hidden hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="p-0 h-full relative">
                      <div className="relative h-full">
                        <Image
                          src={image.url}
                          alt={image.prompt}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                        
                        {/* 悬停遮罩 */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end">
                          <div className="p-3 bg-gradient-to-t from-black/50 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p className="text-white text-xs line-clamp-2">{image.prompt}</p>
                          </div>
                        </div>

                        {/* 操作按钮 */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="bg-white/80 hover:bg-white text-gray-700"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = image.url;
                              link.download = `generated-image-${image.id}.jpg`;
                              link.click();
                            }}
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 