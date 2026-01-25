"use client";

import dynamic from "next/dynamic";
import Renderer from "@/components/renderer";
import { useState, useEffect } from "react";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse h-full w-full bg-muted" />
  ),
});

/**
 * Główny komponent demo - edytor markdown z podglądem na żywo
 */
const Content = () => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    fetch("/test-post.md")
      .then((response) => response.text())
      .then((text) => setContent(text))
      .catch((error) => console.error("Error loading default content:", error));
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Editor and Preview grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-0 overflow-hidden">
        {/* Editor panel */}
        <div className="flex flex-col min-h-[50vh] lg:min-h-0 border-b lg:border-b-0 lg:border-r border-border overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/30 shrink-0">
            <div className="h-2.5 w-2.5 rounded-full bg-primary" />
            <h2 className="text-sm font-medium">Markdown Editor</h2>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            <Editor value={content} onChange={(e) => setContent(e)} />
          </div>
        </div>

        {/* Preview panel */}
        <div className="flex flex-col min-h-[50vh] lg:min-h-0 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/30 shrink-0">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <h2 className="text-sm font-medium">Rendered Output</h2>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto p-4">
            <Renderer content={content} />
          </div>
        </div>
      </div>

      {/* Info section */}
      <div className="px-4 py-2 border-t border-border bg-muted/30">
        <p className="text-xs text-center text-muted-foreground">
          This demo uses{" "}
          <code className="px-1 py-0.5 rounded bg-primary/10 text-primary font-mono text-[10px]">
            honeycomb-renderer
          </code>{" "}
          to render Markdown with Hive blockchain features.
        </p>
      </div>
    </div>
  );
};

export default Content;
