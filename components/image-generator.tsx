"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Coins, Plus, ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  createdAt: Date;
}

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [credits, setCredits] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim() || credits <= 0) return;
    
    setIsGenerating(true);
    // 模拟AI图像生成过程
    setTimeout(() => {
      // 使用一些卡通风格的示例图片，模拟生成结果
      const sampleImages = [
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?q=80&w=500&auto=format&fit=crop"
      ];
      
      const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
      
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: randomImage,
        prompt: prompt,
        createdAt: new Date(),
      };
      setGeneratedImages([newImage, ...generatedImages]);
      setCredits(credits - 1);
      setIsGenerating(false);
      setPrompt("");
    }, 3000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* 输入区域 */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <Input
              placeholder="输入你想生成的故事片段..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="text-base h-12 bg-white border-gray-300"
              disabled={isGenerating}
            />
          </div>
          
          <div className="flex items-center gap-3">
            {/* 点数显示 */}
            <div className="flex items-center gap-2 h-12 px-4 bg-gray-50 border border-gray-300 rounded-md">
              <span className="text-sm font-medium text-gray-700">点数: {credits}</span>
            </div>
            
            {/* 充值按钮 */}
            <Button 
              variant="outline" 
              className="h-12 px-6 border-gray-300 hover:bg-gray-50"
            >
              充值
            </Button>
          </div>
        </div>

        {/* 生成按钮 */}
        <Button 
          onClick={handleGenerate}
          disabled={!prompt.trim() || credits <= 0 || isGenerating}
          className="w-full h-12 bg-gray-500 hover:bg-gray-600 text-white"
          variant="secondary"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              生成中...
            </>
          ) : (
            "生成图片"
          )}
        </Button>

        {credits <= 0 && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-400">
              点数不足，请先充值后继续生成图像。
            </p>
          </div>
        )}
      </div>

      {/* 图像展示区域 */}
      <div>
        <h2 className="text-xl font-medium mb-6 text-gray-900 dark:text-gray-100">我的图片库</h2>
        
        {generatedImages.length === 0 ? (
          /* 空状态占位卡片 */
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="aspect-square bg-gray-50 border-gray-200">
              <CardContent className="flex flex-col items-center justify-center h-full p-4 text-center">
                <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-xs text-gray-500">
                  点击生成按钮<br />
                  输入描述生成图片
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* 图片网格 */
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* 生成中的占位卡片 */}
            {isGenerating && (
              <Card className="aspect-square border-2 border-primary/20">
                <CardContent className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                  <p className="text-xs text-gray-500">AI正在创作中...</p>
                </CardContent>
              </Card>
            )}
            
            {/* 已生成的图片 */}
            {generatedImages.map((image) => (
              <Card key={image.id} className="aspect-square overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0 h-full">
                  <div className="relative h-full">
                    <Image
                      src={image.url}
                      alt={image.prompt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 