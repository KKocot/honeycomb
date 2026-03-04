import {
  type Component,
  createSignal,
  createEffect,
  createMemo,
  Show,
  mergeProps,
} from "solid-js";
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
import { create_codemirror } from "./create-codemirror";
import { create_draft } from "./create-draft";
import { EditorToolbar } from "./EditorToolbar";
import { EditorPreview } from "./EditorPreview";

export interface MdEditorProps extends MdEditorCallbacks {
  value: string;
  onChange: (value: string) => void;
  config?: Partial<MdEditorConfig>;
  class?: string;
  renderer_options?: Partial<RendererOptions>;
}

const DEFAULT_MIN_HEIGHT = 300;

export const MdEditor: Component<MdEditorProps> = (raw_props) => {
  const props = mergeProps(
    { config: {} as Partial<MdEditorConfig> },
    raw_props,
  );

  const toolbar_items = () => props.config.toolbar ?? DEFAULT_TOOLBAR;
  const theme = () => props.config.theme ?? "auto";
  const upload_handler = () => props.config.uploadHandler;
  const min_height = () => props.config.minHeight ?? DEFAULT_MIN_HEIGHT;
  const max_height = () => props.config.maxHeight;
  const convert_hive_urls = () => props.config.convertHiveUrls ?? false;

  const [preview_mode, set_preview_mode] = createSignal<PreviewMode>(
    props.config.previewMode ?? "off",
  );
  const [is_uploading, set_is_uploading] = createSignal(false);
  const [active_actions, set_active_actions] = createSignal<
    Set<ToolbarItemType>
  >(new Set());
  const [active_tab, set_active_tab] = createSignal<"editor" | "preview">(
    "editor",
  );

  function handle_selection_change(context: EditorActionContext) {
    const active = new Set<ToolbarItemType>();
    for (const item of toolbar_items()) {
      if (item.type === "separator") continue;
      if (item.action.isActive?.(context)) {
        active.add(item.type);
      }
    }
    set_active_actions(active);
  }

  const { ref: editor_ref, execute_action, get_context, focus } =
    create_codemirror({
      value: () => props.value,
      on_change: (new_value: string) => props.onChange(new_value),
      placeholder: props.config.placeholder,
      theme: theme(),
      on_selection_change: handle_selection_change,
      convert_hive_urls: convert_hive_urls(),
    });

  create_draft({
    config: props.config.draftConfig,
    value: () => props.value,
    on_save: props.onDraftSave,
    on_restore: props.onDraftRestore,
  });

  // Auto-focus
  createEffect(() => {
    if (props.config.autoFocus) {
      focus();
    }
  });

  function handle_toolbar_action(action: ToolbarAction) {
    execute_action(action);
  }

  async function handle_file_upload(file: File) {
    const handler = upload_handler();
    if (!handler) return;

    set_is_uploading(true);
    props.onUploadStart?.(file);

    try {
      const result: UploadResult = await handler.upload(file);
      const context = get_context();
      if (context) {
        const action_result = insert_image_markdown(context, result);
        props.onChange(action_result.text);
      }
      props.onUploadComplete?.(result);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Upload failed");
      props.onUploadError?.(error);
    } finally {
      set_is_uploading(false);
    }
  }

  const style = createMemo(() => ({
    "min-height": `${min_height()}px`,
    ...(max_height() ? { "max-height": `${max_height()}px` } : {}),
  }));

  const show_preview = () => preview_mode() !== "off";
  const is_split = () => preview_mode() === "split";
  const is_tab = () => preview_mode() === "tab";

  return (
    <div class={cn("border border-border rounded-lg overflow-hidden", props.class)}>
      <EditorToolbar
        items={toolbar_items()}
        on_action={handle_toolbar_action}
        active_actions={active_actions()}
        is_uploading={is_uploading()}
        preview_mode={preview_mode()}
        on_preview_mode_change={set_preview_mode}
        on_file_upload={upload_handler() ? handle_file_upload : undefined}
      />

      <Show when={is_tab() && show_preview()}>
        <div class="flex border-b border-border">
          <button
            type="button"
            class={cn(
              "px-4 py-1.5 text-sm transition-colors",
              active_tab() === "editor"
                ? "border-b-2 border-foreground text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => set_active_tab("editor")}
          >
            Write
          </button>
          <button
            type="button"
            class={cn(
              "px-4 py-1.5 text-sm transition-colors",
              active_tab() === "preview"
                ? "border-b-2 border-foreground text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => set_active_tab("preview")}
          >
            Preview
          </button>
        </div>
      </Show>

      <div
        class={cn(is_split() && "grid grid-cols-2 divide-x divide-border")}
        style={style()}
      >
        <div
          class={cn(
            "overflow-y-auto",
            is_tab() && active_tab() === "preview" && "hidden",
          )}
          style={style()}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
        >
          <div
            ref={editor_ref}
            class="h-full [&_.cm-editor]:h-full [&_.cm-scroller]:overflow-auto"
          />
        </div>

        <Show when={show_preview()}>
          <div
            class={cn(
              "overflow-y-auto",
              is_tab() && active_tab() === "editor" && "hidden",
            )}
            style={style()}
          >
            <EditorPreview
              content={props.value}
              renderer_options={props.renderer_options}
            />
          </div>
        </Show>
      </div>
    </div>
  );
};
