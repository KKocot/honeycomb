"use client";

import { useRef, useCallback } from "react";
import { Bold, Italic, Strikethrough, Code, FileCode, Heading, Quote, Minus, Table, Link, Image, EyeOff, List, ListOrdered, ListChecks, Upload, Eye, SplitSquareHorizontal, Undo, Redo, type LucideIcon } from "lucide-react";
import type {
  ToolbarItem,
  ToolbarAction,
  PreviewMode,
  ToolbarItemType,
} from "@kkocot/honeycomb-core";
import { cn } from "../utils";

const ICON_MAP: Record<string, LucideIcon> = {
  Bold,
  Italic,
  Strikethrough,
  Code,
  FileCode,
  Heading,
  Quote,
  Minus,
  Table,
  Link,
  Image,
  EyeOff,
  List,
  ListOrdered,
  ListChecks,
  Upload,
  Undo,
  Redo,
};

const PREVIEW_ICONS: Record<PreviewMode, LucideIcon> = {
  off: Eye,
  tab: SplitSquareHorizontal,
  split: EyeOff,
};

const PREVIEW_LABELS: Record<PreviewMode, string> = {
  off: "Show preview",
  tab: "Split view",
  split: "Hide preview",
};

const PREVIEW_CYCLE: Record<PreviewMode, PreviewMode> = {
  off: "tab",
  tab: "split",
  split: "off",
};

function format_shortcut(shortcut: string): string {
  const is_mac =
    typeof navigator !== "undefined" &&
    navigator.platform.toLowerCase().includes("mac");

  return shortcut
    .replace("Mod", is_mac ? "Cmd" : "Ctrl")
    .replace("-", "+");
}

interface EditorToolbarProps {
  items: ToolbarItem[];
  onAction: (action: ToolbarAction) => void;
  activeActions: Set<ToolbarItemType>;
  isUploading: boolean;
  previewMode: PreviewMode;
  onPreviewModeChange: (mode: PreviewMode) => void;
  onFileUpload?: (file: File) => void;
}

export function EditorToolbar({
  items,
  onAction,
  activeActions,
  isUploading,
  previewMode,
  onPreviewModeChange,
  onFileUpload,
}: EditorToolbarProps) {
  const file_input_ref = useRef<HTMLInputElement>(null);

  const handle_file_change = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && onFileUpload) {
        onFileUpload(file);
      }
      if (event.target) {
        event.target.value = "";
      }
    },
    [onFileUpload],
  );

  const handle_preview_toggle = useCallback(() => {
    onPreviewModeChange(PREVIEW_CYCLE[previewMode]);
  }, [previewMode, onPreviewModeChange]);

  const PreviewIcon = PREVIEW_ICONS[previewMode];

  return (
    <div className="flex items-center gap-1 px-2 py-1 border-b border-border flex-wrap">
      {items.map((item, index) => {
        if (item.type === "separator") {
          return (
            <div
              key={`sep-${index}`}
              className="w-px h-5 bg-border mx-1"
              role="separator"
            />
          );
        }

        if (item.type === "upload_image") {
          return (
            <button
              key={item.type}
              type="button"
              title={item.label}
              disabled={isUploading}
              className={cn(
                "p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors",
                isUploading && "opacity-50 cursor-not-allowed",
              )}
              onClick={() => file_input_ref.current?.click()}
            >
              <Upload className="h-4 w-4" />
            </button>
          );
        }

        const IconComponent = item.icon ? ICON_MAP[item.icon] : null;
        const is_active = activeActions.has(item.type);
        const tooltip = item.shortcut
          ? `${item.label} (${format_shortcut(item.shortcut)})`
          : item.label;

        return (
          <button
            key={item.type}
            type="button"
            title={tooltip}
            className={cn(
              "p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors",
              is_active && "bg-accent text-foreground",
            )}
            onClick={() => onAction(item.action)}
          >
            {IconComponent ? (
              <IconComponent className="h-4 w-4" />
            ) : (
              <span className="text-xs font-medium">{item.label}</span>
            )}
          </button>
        );
      })}

      <div className="flex-1" />

      <button
        type="button"
        title={PREVIEW_LABELS[previewMode]}
        className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        onClick={handle_preview_toggle}
      >
        <PreviewIcon className="h-4 w-4" />
      </button>

      {onFileUpload && (
        <input
          ref={file_input_ref}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
          onChange={handle_file_change}
        />
      )}
    </div>
  );
}
