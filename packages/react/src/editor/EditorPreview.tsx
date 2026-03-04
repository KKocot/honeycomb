"use client";

import type { RendererOptions } from "@kkocot/honeycomb-renderer";
import { HiveContentRenderer } from "../HiveContentRenderer";
import { cn } from "../utils";

interface EditorPreviewProps {
  content: string;
  rendererOptions?: Partial<RendererOptions>;
  className?: string;
}

export function EditorPreview({
  content,
  rendererOptions,
  className,
}: EditorPreviewProps) {
  return (
    <div
      className={cn(
        "prose prose-sm dark:prose-invert p-4 overflow-y-auto max-h-full",
        className,
      )}
    >
      {content ? (
        <HiveContentRenderer body={content} options={rendererOptions} />
      ) : (
        <p className="text-muted-foreground italic">Nothing to preview</p>
      )}
    </div>
  );
}
