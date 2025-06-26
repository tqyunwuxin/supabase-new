import { NextRequest, NextResponse } from 'next/server';

interface GenerateImageRequest {
  prompt: string;
  options?: {
    negative_prompt?: string;
    num_images?: number;
    style?: string;
    super_resolution?: boolean;
    face_correct?: boolean;
    w?: number;
    h?: number;
    cfg_scale?: number;
    steps?: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, options = {} }: GenerateImageRequest = await request.json();

    // 验证输入
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: '请提供有效的提示词' },
        { status: 400 }
      );
    }

    // 检查环境变量
    const apiKey = process.env.ASTRIA_API_KEY;
    // 使用 Flux1.dev 基础模型 ID，这是官方文档推荐的
    const tuneId = process.env.ASTRIA_TUNE_ID || '1504944';
    
    if (!apiKey) {
      return NextResponse.json(
        { error: '服务配置错误：缺少 API 密钥' },
        { status: 500 }
      );
    }

    // 构建 FormData
    const form = new FormData();
    form.append('prompt[text]', prompt.trim());
    
    // 设置生成1张图片
    form.append('prompt[num_images]', String(options.num_images || 1));
    
    // 检查是否是 Flux 模型（ID: 1504944）
    const isFluxModel = tuneId === '1504944';
    
    // 添加默认参数以提高图片质量
    form.append('prompt[style]', options.style || 'Photographic');
    form.append('prompt[super_resolution]', String(options.super_resolution !== false));
    form.append('prompt[face_correct]', String(options.face_correct !== false));
    form.append('prompt[w]', String(options.w || 512));
    form.append('prompt[h]', String(options.h || 512));
    
    // Flux 模型的 cfg_scale 必须小于 5，普通模型默认 7
    const cfgScale = isFluxModel ? (options.cfg_scale || 3.5) : (options.cfg_scale || 7);
    form.append('prompt[cfg_scale]', String(Math.min(cfgScale, isFluxModel ? 4.9 : 15)));
    
    form.append('prompt[steps]', String(options.steps || 25));
    
    // Flux 模型不支持 negative_prompt，只有其他模型才添加
    if (!isFluxModel) {
      const defaultNegativePrompt = 'blurry, low quality, distorted, ugly, bad anatomy, watermark, signature';
      form.append('prompt[negative_prompt]', options.negative_prompt || defaultNegativePrompt);
    }

    // 调用 Astria API
    const response = await fetch(
      `https://api.astria.ai/tunes/${tuneId}/prompts`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        body: form
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Astria API Error:', error);
      
      // 根据状态码返回不同错误信息
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'API 密钥无效或已过期' },
          { status: 401 }
        );
      } else if (response.status === 429) {
        return NextResponse.json(
          { error: '请求过于频繁，请稍后再试' },
          { status: 429 }
        );
      } else {
        return NextResponse.json(
          { error: '图像生成失败，请稍后重试' },
          { status: response.status }
        );
      }
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      data: result,
      message: '图像生成任务已提交，正在处理中...'
    });

  } catch (error) {
    console.error('Generate image error:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// 获取生成状态的接口
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const promptId = searchParams.get('promptId');
    const tuneId = searchParams.get('tuneId') || '1504944';
    
    if (!promptId) {
      return NextResponse.json(
        { error: '缺少 promptId 参数' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ASTRIA_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: '服务配置错误：缺少 API 密钥' },
        { status: 500 }
      );
    }

    // 查询生成状态
    const response = await fetch(
      `https://api.astria.ai/tunes/${tuneId}/prompts/${promptId}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Astria API Error:', error);
      return NextResponse.json(
        { error: '获取生成状态失败' },
        { status: response.status }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Get prompt status error:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 