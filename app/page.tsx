import { Hero } from "@/components/hero";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const navItems = [
    { name: "首页", link: "/" },
    { name: "关于", link: "/about" },
    { name: "支持", link: "/contact" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <FloatingNav
        navItems={navItems}
        actionItem={
          <Button asChild variant="default" size="sm">
            <Link href="/auth/login">登录</Link>
          </Button>
        }
      />
      <main className="flex-1 pt-0">
        <Hero />
      </main>
    </div>
  );
}
