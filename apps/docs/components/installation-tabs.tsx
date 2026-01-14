"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface InstallationTabsProps {
  nextjsContent: React.ReactNode;
  viteContent: React.ReactNode;
  remixContent: React.ReactNode;
}

export function InstallationTabs({
  nextjsContent,
  viteContent,
  remixContent,
}: InstallationTabsProps) {
  const [activeTab, setActiveTab] = useState<"nextjs" | "vite" | "remix">("nextjs");

  return (
    <div className="space-y-4">
      <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
        <button
          onClick={() => setActiveTab("nextjs")}
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all",
            activeTab === "nextjs"
              ? "bg-background text-foreground shadow-sm"
              : "hover:bg-background/50 hover:text-foreground"
          )}
        >
          Next.js
        </button>
        <button
          onClick={() => setActiveTab("vite")}
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all",
            activeTab === "vite"
              ? "bg-background text-foreground shadow-sm"
              : "hover:bg-background/50 hover:text-foreground"
          )}
        >
          Vite
        </button>
        <button
          onClick={() => setActiveTab("remix")}
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all",
            activeTab === "remix"
              ? "bg-background text-foreground shadow-sm"
              : "hover:bg-background/50 hover:text-foreground"
          )}
        >
          Remix
        </button>
      </div>

      <div className="mt-4">
        {activeTab === "nextjs" && nextjsContent}
        {activeTab === "vite" && viteContent}
        {activeTab === "remix" && remixContent}
      </div>
    </div>
  );
}
