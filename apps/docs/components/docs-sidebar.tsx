"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Eye, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { docsConfig } from "@/lib/docs-config";
import { parseFramework, type Framework } from "@/lib/framework";

export function DocsSidebar() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  // Detect active framework from pathname (e.g., /react/hive-provider -> react)
  const path_segments = pathname.split("/").filter(Boolean);
  const potential_framework = path_segments[0];
  const activeFramework: Framework = parseFramework(potential_framework);

  // Filter items based on search query
  const filteredConfig = useMemo(() => {
    if (!searchQuery.trim()) return docsConfig;

    const query = searchQuery.toLowerCase();
    return docsConfig
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            section.title.toLowerCase().includes(query)
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [searchQuery]);

  // Group sections by type
  const generalSections = filteredConfig.filter(s => !s.type);
  const activeSections = filteredConfig.filter(s => s.type === "active");
  const passiveSections = filteredConfig.filter(s => s.type === "passive");

  const renderSection = (section: typeof docsConfig[0]) => (
    <div key={section.title}>
      <h4 className="mb-2 px-2 text-sm font-semibold text-foreground">
        {section.title}
      </h4>
      <ul className="space-y-1">
        {section.items.map((item) => {
          // Replace /react/ in href with active framework
          let href = item.href;
          if (href.startsWith("/react/")) {
            href = href.replace("/react/", `/${activeFramework}/`);
          }

          return (
            <li key={item.href}>
              <Link
                href={item.disabled ? "#" : href}
                className={cn(
                  "block rounded-md px-2 py-1.5 text-sm transition-colors",
                  pathname === href
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  item.disabled &&
                    "pointer-events-none opacity-50"
                )}
              >
                {item.title}
                {item.label && (
                  <span className="ml-2 rounded bg-hive-red/10 px-1.5 py-0.5 text-xs text-hive-red">
                    {item.label}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 border-r border-border md:sticky md:block">
      <div className="h-full overflow-y-auto py-6 pr-6 pl-4">
        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-9 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-hive-red/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* No results */}
        {filteredConfig.length === 0 && (
          <p className="px-2 text-sm text-muted-foreground">
            No components found for &quot;{searchQuery}&quot;
          </p>
        )}

        <nav className="space-y-6">
          {/* General sections (Getting Started, Configuration) */}
          {generalSections.map(renderSection)}

          {/* ACTIVE Components Section */}
          {activeSections.length > 0 && (
            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-4 px-2">
                <Zap className="h-4 w-4 text-hive-red" />
                <span className="text-xs font-bold uppercase tracking-wider text-hive-red">
                  Active
                </span>
                <span className="text-xs text-muted-foreground">Actions</span>
              </div>
              <div className="space-y-6">
                {activeSections.map(renderSection)}
              </div>
            </div>
          )}

          {/* PASSIVE Components Section */}
          {passiveSections.length > 0 && (
            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-4 px-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Passive
                </span>
                <span className="text-xs text-muted-foreground">Display</span>
              </div>
              <div className="space-y-6">
                {passiveSections.map(renderSection)}
              </div>
            </div>
          )}

          {/* Hooks section (no type) - render at the end */}
          {generalSections.filter(s => s.title === "Hooks").length === 0 &&
           docsConfig.filter(s => s.title === "Hooks").map(renderSection)}
        </nav>
      </div>
    </aside>
  );
}
