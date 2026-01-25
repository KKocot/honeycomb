"use client";

import "md-editor-rt/lib/style.css";
import "@vavt/rt-extension/lib/asset/Emoji.css";
import "@vavt/rt-extension/lib/asset/Mark.css";
import { MdEditor } from "md-editor-rt";
import { Emoji, Mark } from "@vavt/rt-extension";
import { Highlighter } from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  theme?: "light" | "dark";
  className?: string;
}

/**
 * Full-featured Markdown editor with emoji and highlighting support
 * Uses md-editor-rt under the hood
 */
export function HiveMarkdownEditor({
  value,
  onChange,
  theme = "dark",
  className,
}: MarkdownEditorProps) {
  return (
    <MdEditor
      language="en-US"
      value={value}
      onChange={onChange}
      preview={false}
      theme={theme}
      className={className}
      style={{ height: "100%" }}
      defToolbars={[
        <Emoji key="Emoji" trigger={<span>😀</span>} />,
        <Mark
          key="Mark"
          trigger={
            <span>
              <Highlighter className="h-4 w-4" />
            </span>
          }
        />,
      ]}
      toolbars={[
        "title",
        "bold",
        "underline",
        "italic",
        "-",
        "strikeThrough",
        "sub",
        "sup",
        "quote",
        "unorderedList",
        "orderedList",
        "task",
        "mermaid",
        "-",
        "codeRow",
        "code",
        "link",
        "image",
        "table",
        "katex",
        "-",
        0,
        1,
        "-",
        "revoke",
        "next",
        "pageFullscreen",
        "fullscreen",
        "htmlPreview",
        "catalog",
      ]}
      onError={(err) => {
        console.error("MdEditor error:", err);
      }}
    />
  );
}

export default HiveMarkdownEditor;
