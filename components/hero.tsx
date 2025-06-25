import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ExternalLink } from "lucide-react";

export const Hero = () => {
  return (
    <section className="container mx-auto px-4 py-20 lg:py-32">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        {/* Left Column: Text Content */}
        <div className="flex flex-col gap-8">
          <Badge variant="outline" className="w-fit">
            现已上线!
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight">
            AI 智能图像生成器
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            告别繁琐的图像设计过程，使用我们的AI智能图像生成器，只需输入文字描述，即可在几分钟内创建令人惊叹的高质量图像。适用于设计师、营销人员和所有需要快速生成视觉内容的人。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
              <Link href="/auth/sign-up">
                免费体验 <ExternalLink className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/auth/sign-up">
                立即注册 <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
        {/* Right Column: Image Grid */}
        <div className="grid grid-cols-2 items-start gap-6">
          <div className="grid gap-6">
            <Image
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1287&auto=format&fit=crop"
              alt="Abstract architectural art"
              width={600}
              height={600}
              className="rounded-xl object-cover w-full aspect-square shadow-lg"
            />
            <Image
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1470&auto=format&fit=crop"
              alt="Beautiful landscape"
              width={600}
              height={600}
              className="rounded-xl object-cover w-full aspect-square shadow-lg"
            />
          </div>
          <div className="grid gap-6">
            <Image
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1364&auto=format&fit=crop"
              alt="Portrait of a woman"
              width={600}
              height={1200}
              className="rounded-xl object-cover w-full h-full shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};