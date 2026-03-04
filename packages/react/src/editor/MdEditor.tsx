"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import type {
  MdEditorConfig,
  MdEditorCallbacks,
  PreviewMode,
  ToolbarAction,
  ToolbarItemType,
  EditorActionContext,
  UploadResult,
} from "@kkocot/honeycomb-core";
import { DEFAULT_TOOLBAR, insert_image_markdown } from "@kkocot/honeycomb-core";
import type { RendererOptions } from "@kkocot/honeycomb-renderer";
import { cn } from "../utils";
import { use_codemirror } from "./use-codemirror";
import { use_draft } from "./use-draft";
import { EditorToolbar } from "./EditorToolbar";
import { EditorPreview } from "./EditorPreview";

export interface MdEditorProps extends MdEditorCallbacks {
  value: string;
  onChange: (value: string) => void;
  config?: Partial<MdEditorConfig>;
  className?: string;
  rendererOptions?: Partial<RendererOptions>;
}

const DEFAULT_MIN_HEIGHT = 300;

export function MdEditor({
  value,
  onChange,
  config,
  className,
  rendererOptions,
  onFocus,
  onBlur,
  onUploadStart,
  onUploadComplete,
  onUploadError,
  onDraftSave,
  onDraftRestore,
}: MdEditorProps) {
  const toolbar_items = config?.toolbar ?? DEFAULT_TOOLBAR;
  const initial_preview = config?.previewMode ?? "off";
  const theme = config?.theme ?? "auto";
  const upload_handler = config?.uploadHandler;
  const draft_config = config?.draftConfig;
  const min_height = config?.minHeight ?? DEFAULT_MIN_HEIGHT;
  const max_height = config?.maxHeight;
  const convert_hive_urls = config?.convertHiveUrls ?? false;

  const [preview_mode, set_preview_mode] = useState<PreviewMode>(initial_preview);
  const [is_uploading, set_is_uploading] = useState(false);
  const [active_actions, set_active_actions] = useState<Set<ToolbarItemType>>(
    new Set(),
  );

  const handle_selection_change = useCallback(
    (context: EditorActionContext) => {
      const active = new Set<ToolbarItemType>();
      for (const item of toolbar_items) {
        if (item.type === "separator") continue;
        if (item.action.isActive?.(context)) {
          active.add(item.type);
        }
      }
      set_active_actions(active);
    },
    [toolbar_items],
  );

  const handle_change = useCallback(
    (new_value: string) => {
      onChange(new_value);
    },
    [onChange],
  );

  const {
    ref: editor_ref,
    execute_action,
    get_context,
    focus,
  } = use_codemirror({
    value,
    onChange: handle_change,
    placeholder: config?.placeholder,
    theme,
    onSelectionChange: handle_selection_change,
    convertHiveUrls: convert_hive_urls,
  });

  use_draft({
    config: draft_config,
    value,
    on_save: onDraftSave,
    on_restore: onDraftRestore,
  });

  // Auto-focus
  useEffect(() => {
    if (config?.autoFocus) {
      focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  const handle_toolbar_action = useCallback(
    (action: ToolbarAction) => {
      execute_action(action);
    },
    [execute_action],
  );

  const handle_file_upload = useCallback(
    async (file: File) => {
      if (!upload_handler) return;

      set_is_uploading(true);
      onUploadStart?.(file);

      try {
        const result: UploadResult = await upload_handler.upload(file);
        const context = get_context();
        if (context) {
          const action_result = insert_image_markdown(context, result);
          onChange(action_result.text);
        }
        onUploadComplete?.(result);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Upload failed");
        onUploadError?.(error);
      } finally {
        set_is_uploading(false);
      }
    },
    [upload_handler, get_context, onChange, onUploadStart, onUploadComplete, onUploadError],
  );

  const style = useMemo(
    () => ({
      minHeight: `${min_height}px`,
      ...(max_height ? { maxHeight: `${max_height}px` } : {}),
    }),
    [min_height, max_height],
  );

  const show_preview = preview_mode !== "off";
  const is_split = preview_mode === "split";
  const is_tab = preview_mode === "tab";

  const [active_tab, set_active_tab] = useState<"editor" | "preview">("editor");

  return (
    <div className={cn("border border-border rounded-lg overflow-hidden", className)}>
      <EditorToolbar
        items={toolbar_items}
        onAction={handle_toolbar_action}
        activeActions={active_actions}
        isUploading={is_uploading}
        previewMode={preview_mode}
        onPreviewModeChange={set_preview_mode}
        onFileUpload={upload_handler ? handle_file_upload : undefined}
      />

      {is_tab && show_preview && (
        <div className="flex border-b border-border">
          <button
            type="button"
            className={cn(
              "px-4 py-1.5 text-sm transition-colors",
              active_tab === "editor"
                ? "border-b-2 border-foreground text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => set_active_tab("editor")}
          >
            Write
          </button>
          <button
            type="button"
            className={cn(
              "px-4 py-1.5 text-sm transition-colors",
              active_tab === "preview"
                ? "border-b-2 border-foreground text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => set_active_tab("preview")}
          >
            Preview
          </button>
        </div>
      )}

      <div
        className={cn(is_split && "grid grid-cols-2 divide-x divide-border")}
        style={style}
      >
        <div
          className={cn(
            "overflow-y-auto",
            is_tab && active_tab === "preview" && "hidden",
          )}
          style={style}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <div ref={editor_ref} className="h-full [&_.cm-editor]:h-full [&_.cm-scroller]:overflow-auto" />
        </div>

        {show_preview && (
          <div
            className={cn(
              "overflow-y-auto",
              is_tab && active_tab === "editor" && "hidden",
            )}
            style={style}
          >
            <EditorPreview content={value} rendererOptions={rendererOptions} />
          </div>
        )}
      </div>
    </div>
  );
}
