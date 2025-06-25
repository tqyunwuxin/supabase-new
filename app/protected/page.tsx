import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ImageGenerator } from "@/components/image-generator";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          欢迎回来，{data.user.email?.split('@')[0]}！
        </h1>
        <p className="text-muted-foreground">
          使用AI技术创造令人惊叹的图像作品
        </p>
      </div>
      
      <ImageGenerator />
    </div>
  );
}
