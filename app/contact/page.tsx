import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, MessageCircle, FileText, Clock } from "lucide-react";

export default function ContactPage() {
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
            支持中心
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            需要
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              帮助
            </span>
            ？
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            我们随时准备为你提供支持。无论是技术问题、使用疑问，还是建议反馈，
            我们都会尽快为你解答。
          </p>
        </div>

        {/* Support Options */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">邮件支持</h3>
              <p className="text-sm text-muted-foreground mb-4">
                发送详细问题描述
              </p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="mailto:support@example.com">
                  发送邮件
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">在线客服</h3>
              <p className="text-sm text-muted-foreground mb-4">
                实时解答疑问
              </p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="#">
                  开始对话
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">帮助文档</h3>
              <p className="text-sm text-muted-foreground mb-4">
                查看详细教程
              </p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="#">
                  查看文档
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">系统状态</h3>
              <p className="text-sm text-muted-foreground mb-4">
                查看服务状态
              </p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="#">
                  查看状态
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">常见问题</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">如何开始使用AI图像生成器？</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  注册账户后，在文本框中输入你想要生成的图像描述，点击"生成"按钮即可。
                  建议使用详细的描述词汇以获得更好的效果。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">生成图像需要多长时间？</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  通常在30秒到2分钟之间，具体时间取决于图像复杂度和当前服务器负载。
                  我们会持续优化以提供更快的生成速度。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">生成的图像有版权限制吗？</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  你拥有通过我们平台生成的所有图像的完整使用权，可以用于商业和个人用途。
                  但请避免生成涉及版权或不当内容的图像。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">如何获得更好的生成效果？</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  使用具体的描述词汇，包括风格、颜色、构图等细节。避免过于复杂的描述，
                  可以尝试多次生成并调整描述来获得满意的结果。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-muted/50 rounded-2xl p-8 text-center mt-16">
          <h3 className="text-2xl font-bold mb-4">还有其他问题？</h3>
          <p className="text-muted-foreground mb-6">
            我们的支持团队将在24小时内回复你的问题
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="mailto:support@example.com">
                联系支持团队
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/auth/sign-up">
                免费开始使用
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
} 