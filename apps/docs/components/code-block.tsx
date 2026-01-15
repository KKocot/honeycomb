import { CopyButton } from "./copy-button";
import { cn } from "@/lib/utils";
import { highlightCode } from "@/lib/highlighter";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export async function CodeBlock({
  code,
  language = "typescript",
  filename,
  className,
}: CodeBlockProps) {
  const highlightedHtml = await highlightCode(code.trim(), language);

  return (
    <div
      className={cn(
        "relative rounded-lg border border-border overflow-hidden",
        className
      )}
    >
      {filename && (
        <div className="flex items-center justify-between border-b border-border bg-[#21252b] px-4 py-2">
          <span className="text-sm text-zinc-400">{filename}</span>
          <CopyButton value={code} />
        </div>
      )}
      <div className="relative">
        {!filename && (
          <CopyButton value={code} className="absolute right-2 top-2 z-10" />
        )}
        <div
          className={cn(
            "[&>pre]:p-4 [&>pre]:overflow-x-auto [&>pre]:text-sm [&>pre]:!bg-[#282c34] [&>pre]:m-0",
            "[&_.line]:leading-relaxed",
            !filename && "[&>pre]:pr-12"
          )}
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      </div>
    </div>
  );
}

// Synchronous version for client components - no syntax highlighting
export function CodeBlockSync({
  code,
  language = "typescript",
  filename,
  className,
}: CodeBlockProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg border border-border overflow-hidden",
        className
      )}
    >
      {filename && (
        <div className="flex items-center justify-between border-b border-border bg-[#21252b] px-4 py-2">
          <span className="text-sm text-zinc-400">{filename}</span>
          <CopyButton value={code} />
        </div>
      )}
      <div className="relative">
        {!filename && (
          <CopyButton value={code} className="absolute right-2 top-2 z-10" />
        )}
        <pre className={cn("p-4 overflow-x-auto text-sm !bg-[#282c34] m-0 text-zinc-300", !filename && "pr-12")}>
          <code>{code.trim()}</code>
        </pre>
      </div>
    </div>
  );
}
