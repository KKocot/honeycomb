"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface UsageTabsProps {
  tabs: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
}

export function UsageTabs({ tabs }: UsageTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "");

  return (
    <div className="space-y-4">
      <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "hover:bg-background/50 hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tabs.map((tab) => (
          <div key={tab.id} className={activeTab === tab.id ? "block" : "hidden"}>
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
