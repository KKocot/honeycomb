"use client";

import Link from "next/link";
import { Github } from "lucide-react";
import { HiveLogo } from "./hive-logo";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center px-4">
        <Link href="/" className="flex items-center gap-2">
          <HiveLogo className="h-6 w-6" />
          <span className="font-semibold">Hive UI</span>
        </Link>

        <nav className="ml-8 hidden items-center gap-6 text-sm md:flex">
          <Link
            href="/docs"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Docs
          </Link>
          <Link
            href="/docs/components"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Components
          </Link>
          <Link
            href="/examples"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Examples
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <a
            href="https://github.com/your-org/hive-ui"
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
