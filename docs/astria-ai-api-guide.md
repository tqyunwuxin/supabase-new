# Astria.ai 文生图 API 使用指南

基于 [Astria.ai API 文档](https://docs.astria.ai/docs/api/prompt/create/) 整理

## 概述

Astria.ai 提供了强大的文生图 API 服务，支持通过文本描述生成高质量的 AI 图像。该 API 基于深度学习模型，支持多种图像生成功能和定制选项。

## API 基本信息

- **基础 URL**: `https://api.astria.ai`
- **认证方式**: Bearer Token
- **请求方式**: POST
- **端点**: `/tunes/:id/prompts`

## 认证

在所有请求中需要在 Header 中包含 API 密钥：

```bash
Authorization: Bearer YOUR_API_KEY
```

## 核心功能

### 1. 基础文生图

**端点**: `POST /tunes/:id/prompts`

#### 必需参数

| 参数 | 类型 | 描述 |
|------|------|------|
| `text` | string | 图像描述文本（提示词） |

#### 主要可选参数

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `negative_prompt` | string | - | 负面提示词，逗号分隔的不希望出现的内容 |
| `num_images` | integer | 1 | 生成图像数量（1-8） |
| `seed` | integer | 随机 | 随机种子（0 到 2^32） |
| `w` | integer | - | 图像宽度（8的倍数） |
| `h` | integer | - | 图像高度（8的倍数） |
| `cfg_scale` | float | - | 提示词遵循程度（0-15） |
| `steps` | integer | - | 扩散步数（0-50） |

#### 高级功能参数

| 参数 | 类型 | 描述 |
|------|------|------|
| `super_resolution` | boolean | 4倍超分辨率 |
| `face_correct` | boolean | 面部修正 |
| `face_swap` | boolean | 面部替换 |
| `inpaint_faces` | boolean | 面部修复（需要超分辨率） |
| `hires_fix` | boolean | 高分辨率细节增强 |
| `film_grain` | boolean | 添加胶片噪点 |

#### 风格参数

| 参数 | 可选值 |
|------|--------|
| `style` | `Cinematic`, `Animated`, `Digital Art`, `Photographic`, `Fantasy art`, `Neonpunk`, `Enhance`, `Comic book`, `Lowpoly`, `Line art` |
| `color_grading` | `Film Velvia`, `Film Portra`, `Ektar` |
| `scheduler` | `euler`, `euler_a`, `dpm++2m_karras`, `dpm++sde_karras`, `dpm++2m`, `dpm++sde`, `lcm`, `tcd` |

### 2. ControlNet 功能

支持基于输入图像的控制生成：

| 参数 | 描述 |
|------|------|
| `controlnet` | 控制类型：`composition`, `reference`, `segroom`, `ipadapter`, `lineart`, `canny`, `depth`, `mlsd`, `hed`, `pose`, `tile`, `qr` |
| `input_image` | 输入图像（二进制文件） |
| `input_image_url` | 输入图像URL |
| `denoising_strength` | 去噪强度（0.0-1.0） |
| `controlnet_conditioning_scale` | ControlNet 条件强度（0.0-1.0） |

### 3. 图像修复（Inpainting）

| 参数 | 描述 |
|------|------|
| `mask_image` | 遮罩图像（二进制文件） |
| `mask_image_url` | 遮罩图像URL |

## 调用示例

### cURL 示例

```bash
curl -X POST -H "Authorization: Bearer $API_KEY" https://api.astria.ai/tunes/1/prompts \
  -F prompt[text]="a painting of ohwx man in the style of Van Gogh" \
  -F prompt[negative_prompt]="old, blemish, wrinkles" \
  -F prompt[super_resolution]=true \
  -F prompt[face_correct]=true \
  -F prompt[num_images]=2
```

### Node.js 示例

```javascript
const fetch = require('node-fetch');
const FormData = require('form-data');

const API_URL = 'https://api.astria.ai/tunes/1/prompts';
const API_KEY = 'YOUR_API_KEY';

const form = new FormData();
form.append('prompt[text]', 'a beautiful landscape with mountains and lake');
form.append('prompt[negative_prompt]', 'blurry, low quality');
form.append('prompt[num_images]', 1);
form.append('prompt[style]', 'Photographic');
form.append('prompt[super_resolution]', true);

const response = await fetch(API_URL, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${API_KEY}`
  },
  body: form
});

const result = await response.json();
console.log(result);
```

### Python 示例

```python
import requests

API_URL = 'https://api.astria.ai/tunes/1/prompts'
API_KEY = 'YOUR_API_KEY'

headers = {
    'Authorization': f'Bearer {API_KEY}'
}

data = {
    'prompt[text]': 'a cute cartoon cat playing in a garden',
    'prompt[negative_prompt]': 'scary, dark, ugly',
    'prompt[num_images]': 1,
    'prompt[style]': 'Animated',
    'prompt[super_resolution]': True,
    'prompt[w]': 512,
    'prompt[h]': 512
}

response = requests.post(API_URL, headers=headers, data=data)
result = response.json()
print(result)
```

## 响应格式

成功请求返回的 JSON 格式：

```json
{
  "id": 1,
  "text": "a painting of ohwx man in the style of Van Gogh",
  "negative_prompt": "old, blemish, wrinkles",
  "cfg_scale": null,
  "steps": null,
  "seed": null,
  "created_at": "2022-10-06T16:12:54.505Z",
  "updated_at": "2022-10-06T16:12:54.505Z",
  "tune_id": 1,
  "url": "http://api.astria.ai/tunes/1/prompts/1.json"
}
```

## 回调机制

支持设置回调 URL，当图像生成完成时会自动通知：

```bash
-F prompt[callback]="https://your-website.com/webhook/astria"
```

## 最佳实践

### 1. 提示词优化
- 使用详细、具体的描述
- 包含风格、颜色、构图等细节
- 避免过于复杂的句子

### 2. 负面提示词
- 列出不希望出现的元素
- 常用: `blurry, low quality, distorted, ugly`

### 3. 参数调优
- `cfg_scale`: 7-12 范围内效果较好
- `steps`: 20-50 步通常足够
- `super_resolution`: 用于提升图像质量

### 4. 成本控制
- 合理设置 `num_images` 数量
- 根据需求选择是否开启高级功能

## 错误处理

常见错误及解决方案：

| 错误码 | 描述 | 解决方案 |
|--------|------|----------|
| 401 | 认证失败 | 检查 API 密钥是否正确 |
| 400 | 参数错误 | 检查必需参数和参数格式 |
| 429 | 请求过于频繁 | 实施请求限流 |
| 500 | 服务器错误 | 稍后重试 |

## 集成到项目中

### 环境变量配置

```bash
# .env.local
ASTRIA_API_KEY=your_api_key_here
ASTRIA_TUNE_ID=your_tune_id_here
```

### 封装 API 调用

```javascript
// lib/astria.js
export async function generateImage(prompt, options = {}) {
  const form = new FormData();
  form.append('prompt[text]', prompt);
  
  // 添加可选参数
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined) {
      form.append(`prompt[${key}]`, value);
    }
  });

  const response = await fetch(
    `https://api.astria.ai/tunes/${process.env.ASTRIA_TUNE_ID}/prompts`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ASTRIA_API_KEY}`
      },
      body: form
    }
  );

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return await response.json();
}
```

## 总结

Astria.ai 提供了功能丰富的文生图 API，支持：
- ✅ 基础文本到图像生成
- ✅ 多种艺术风格
- ✅ 图像增强功能
- ✅ ControlNet 控制
- ✅ 图像修复
- ✅ 批量生成
- ✅ 回调通知

该 API 适合集成到各种应用中，为用户提供 AI 图像生成功能。

---
*文档更新时间: 2024年*
*基于官方文档: https://docs.astria.ai/docs/api/prompt/create/* 