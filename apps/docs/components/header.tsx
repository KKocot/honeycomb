"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Github, ChevronDown, Check } from "lucide-react";
import { HiveLogo } from "./hive-logo";
import { cn } from "@/lib/utils";
import { FRAMEWORKS, parseFramework, type Framework } from "@/lib/framework";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Detect active framework from pathname (e.g., /react/hive-provider -> react)
  const path_segments = pathname.split("/").filter(Boolean);
  const potential_framework = path_segments[0];
  const active_framework: Framework = parseFramework(potential_framework);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handle_click_outside(event: MouseEvent) {
      const target = event.target;
      if (
        dropdownRef.current &&
        target instanceof Node &&
        !dropdownRef.current.contains(target)
      ) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handle_click_outside);
      return () => {
        document.removeEventListener("mousedown", handle_click_outside);
      };
    }
  }, [isDropdownOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    function handle_escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("keydown", handle_escape);
      return () => {
        document.removeEventListener("keydown", handle_escape);
      };
    }
  }, [isDropdownOpen]);

  const handle_framework_select = (framework: Framework) => {
    // Check if current path has a valid framework prefix
    const is_valid_framework = FRAMEWORKS.some(
      (fw) => fw.id === active_framework
    );

    if (is_valid_framework && path_segments.length > 1) {
      // User is on a framework-specific page (e.g., /react/hive-provider)
      // Replace framework but keep the page path
      const page = path_segments.slice(1).join("/");
      router.push(`/${framework}/${page}`);
    } else {
      // User is on a non-framework page (e.g., /introduction)
      // Navigate to default framework page
      router.push(`/${framework}/hive-provider`);
    }

    setIsDropdownOpen(false);
  };

  const active_framework_label =
    FRAMEWORKS.find((fw) => fw.id === active_framework)?.label || "React";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center px-4">
        <Link href="/" className="flex items-center gap-2">
          <HiveLogo className="h-6 w-6" />
          <span className="font-semibold">Honeycomb</span>
        </Link>

        <nav className="ml-8 hidden items-center gap-6 text-sm md:flex">
          <Link
            href="/introduction"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Docs
          </Link>

          {/* Framework Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <span>{active_framework_label}</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {isDropdownOpen && (
              <div
                role="menu"
                className="absolute top-full left-0 mt-1 w-32 rounded-md border border-border bg-background shadow-lg"
              >
                <div className="py-1">
                  {FRAMEWORKS.map((fw) => (
                    <button
                      key={fw.id}
                      role="menuitem"
                      onClick={() => handle_framework_select(fw.id)}
                      className={cn(
                        "flex w-full items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-muted",
                        active_framework === fw.id
                          ? "font-medium text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      <span>{fw.label}</span>
                      {active_framework === fw.id && (
                        <Check className="h-4 w-4 text-hive-red" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <a
            href="https://github.com/KKocot/honeycomb"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
