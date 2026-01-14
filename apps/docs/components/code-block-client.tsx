"use client";

import { useEffect, useState } from "react";
import { CopyButton } from "./copy-button";
import { cn } from "@/lib/utils";

interface CodeBlockClientProps {
  code: string;
  highlightedHtml?: string;
  language?: string;
  filename?: string;
  className?: string;
}

export function CodeBlockClient({
  code,
  highlightedHtml,
  language = "typescript",
  filename,
  className,
}: CodeBlockClientProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg border border-border overflow-hidden",
        className
      )}
    >
      {filename && (
        <div className="flex items-center justify-between border-b border-border bg-[#161b22] px-4 py-2">
          <span className="text-sm text-zinc-400">{filename}</span>
          <CopyButton value={code} />
        </div>
      )}
      <div className="relative">
        {!filename && (
          <CopyButton value={code} className="absolute right-2 top-2 z-10" />
        )}
        {highlightedHtml ? (
          <div
            className={cn(
              "[&>pre]:p-4 [&>pre]:overflow-x-auto [&>pre]:text-sm [&>pre]:!bg-[#0d1117] [&>pre]:m-0",
              "[&_.line]:leading-relaxed",
              !filename && "[&>pre]:pr-12"
            )}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        ) : (
          <pre className={cn("p-4 overflow-x-auto text-sm bg-[#0d1117] m-0", !filename && "pr-12")}>
            <code className={`language-${language}`}>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
