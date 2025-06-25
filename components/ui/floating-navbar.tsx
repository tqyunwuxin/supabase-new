"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const FloatingNav = ({
  navItems,
  actionItem,
  className,
}: {
  navItems: {
    name: string;
    link: string;
  }[];
  actionItem?: React.ReactNode;
  className?: string;
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className={cn("w-full py-3", className)}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        {isMounted && (
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((navItem, idx) => (
              <Link
                key={`link=${idx}`}
                href={navItem.link}
                className={cn(
                  "text-sm font-medium text-muted-foreground hover:text-foreground"
                )}
              >
                {navItem.name}
              </Link>
            ))}
          </nav>
        )}
        <div>{actionItem}</div>
      </div>
    </header>
  );
}; 