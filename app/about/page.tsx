import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Target, Lightbulb } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回首页
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            关于我们
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            重新定义
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              创意生产力
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            我们致力于通过AI技术，让每个人都能轻松创造出令人惊叹的视觉内容。
            无论你是设计师、营销人员还是内容创作者，我们的工具都能帮助你释放创造力。
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center p-8 border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">精准生成</h3>
              <p className="text-muted-foreground">
                基于先进的AI算法，根据你的文字描述精确生成符合预期的图像内容。
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-8 border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">创意无限</h3>
              <p className="text-muted-foreground">
                从抽象艺术到写实摄影，从概念设计到产品展示，支持多种风格和类型。
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-8 border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">易于使用</h3>
              <p className="text-muted-foreground">
                直观的界面设计，无需专业技能，几分钟即可上手，快速产出高质量作品。
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mission Statement */}
        <div className="bg-muted/50 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">我们的使命</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            让AI技术真正服务于人类的创造力，帮助每个人都能轻松表达想法、
            实现创意梦想。我们相信，未来的创作应该更加自由、高效和有趣。
          </p>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button asChild size="lg" className="px-8 py-6 text-lg">
            <Link href="/auth/sign-up">
              开始创作之旅
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
} 