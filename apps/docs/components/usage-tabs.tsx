"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    const tab_ids = tabs.map((t) => t.id);
    if (!tab_ids.includes(activeTab)) {
      const current_label = activeTab.split("-").pop();
      const matching_tab = tabs.find((t) => t.id.endsWith(`-${current_label}`));
      setActiveTab(matching_tab?.id || tabs[0]?.id || "");
    }
  }, [tabs, activeTab]);

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
