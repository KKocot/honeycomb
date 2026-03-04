<script lang="ts" module>
  import type {
    MdEditorConfig,
    MdEditorCallbacks,
    PreviewMode,
    ToolbarItemType,
  } from "@kkocot/honeycomb-core";
  import type { RendererOptions } from "@kkocot/honeycomb-renderer";

  export interface MdEditorProps extends MdEditorCallbacks {
    value: string;
    onchange: (value: string) => void;
    config?: Partial<MdEditorConfig>;
    class?: string;
    renderer_options?: Partial<RendererOptions>;
  }
</script>

<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import type {
    ToolbarAction,
    EditorActionContext,
    UploadResult,
  } from "@kkocot/honeycomb-core";
  import {
    DEFAULT_TOOLBAR,
    insert_image_markdown,
  } from "@kkocot/honeycomb-core";
  import { cn } from "../utils";
  import { create_codemirror } from "./create-codemirror.svelte";
  import { create_draft } from "./create-draft.svelte";
  import EditorToolbar from "./EditorToolbar.svelte";
  import EditorPreview from "./EditorPreview.svelte";

  const DEFAULT_MIN_HEIGHT = 300;

  let {
    value,
    onchange,
    config,
    class: class_name,
    renderer_options,
    onFocus,
    onBlur,
    onUploadStart,
    onUploadComplete,
    onUploadError,
    onDraftSave,
    onDraftRestore,
  }: MdEditorProps = $props();

  const toolbar_items = $derived(config?.toolbar ?? DEFAULT_TOOLBAR);
  const theme = $derived(config?.theme ?? "auto");
  const upload_handler = $derived(config?.uploadHandler);
  const min_height = $derived(config?.minHeight ?? DEFAULT_MIN_HEIGHT);
  const max_height = $derived(config?.maxHeight);
  const convert_hive_urls = $derived(config?.convertHiveUrls ?? false);

  // svelte-ignore state_referenced_locally -- one-time config capture, intentional
  const initial_placeholder = config?.placeholder;
  // svelte-ignore state_referenced_locally
  const initial_draft_config = config?.draftConfig;
  // svelte-ignore state_referenced_locally
  const initial_auto_focus = config?.autoFocus ?? false;
  // svelte-ignore state_referenced_locally
  let preview_mode = $state<PreviewMode>(config?.previewMode ?? "off");
  let is_uploading = $state(false);
  let active_actions: Set<ToolbarItemType> = $state(new Set());
  let active_tab = $state<"editor" | "preview">("editor");

  let editor_container: HTMLDivElement | undefined = $state(undefined);

  function handle_selection_change(context: EditorActionContext) {
    const active = new Set<ToolbarItemType>();
    for (const item of toolbar_items) {
      if (item.type === "separator") continue;
      if (item.action.isActive?.(context)) {
        active.add(item.type);
      }
    }
    active_actions = active;
  }

  const cm = create_codemirror({
    initial_value: "",
    on_change: (new_value: string) => onchange(new_value),
    placeholder: initial_placeholder,
    theme: theme,
    on_selection_change: handle_selection_change,
    convert_hive_urls: convert_hive_urls,
  });

  const draft = create_draft({
    config: initial_draft_config,
    on_save: (d) => onDraftSave?.(d),
    on_restore: (d) => onDraftRestore?.(d),
  });

  // Sync external value changes into CodeMirror
  $effect(() => {
    cm.sync_value(value);
  });

  // Sync theme changes
  $effect(() => {
    cm.sync_theme(theme);
  });

  // Sync convert_hive_urls changes
  $effect(() => {
    cm.sync_convert_hive_urls(convert_hive_urls);
  });

  // Debounced draft save on value change
  $effect(() => {
    draft.save(value);
  });

  onMount(() => {
    if (editor_container) {
      cm.attach(editor_container);
      // After attach, sync the initial value
      cm.sync_value(value);
    }

    if (initial_auto_focus) {
      cm.focus();
    }

    const cleanup_sync = draft.start_cross_tab_sync();

    return () => {
      cleanup_sync();
    };
  });

  onDestroy(() => {
    cm.destroy();
  });

  function handle_toolbar_action(action: ToolbarAction) {
    cm.execute_action(action);
  }

  async function handle_file_upload(file: File) {
    if (!upload_handler) return;

    is_uploading = true;
    onUploadStart?.(file);

    try {
      const result: UploadResult = await upload_handler.upload(file);
      const context = cm.get_context();
      if (context) {
        const action_result = insert_image_markdown(context, result);
        onchange(action_result.text);
      }
      onUploadComplete?.(result);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Upload failed");
      onUploadError?.(error);
    } finally {
      is_uploading = false;
    }
  }

  function build_style_string(
    min_h: number,
    max_h: number | undefined,
  ): string {
    let s = `min-height: ${min_h}px`;
    if (max_h !== undefined) {
      s += `; max-height: ${max_h}px`;
    }
    return s;
  }

  const style_str = $derived(build_style_string(min_height, max_height));

  const show_preview = $derived(preview_mode !== "off");
  const is_split = $derived(preview_mode === "split");
  const is_tab = $derived(preview_mode === "tab");
</script>

<div
  class={cn("border border-border rounded-lg overflow-hidden", class_name)}
>
  <EditorToolbar
    items={toolbar_items}
    on_action={handle_toolbar_action}
    {active_actions}
    {is_uploading}
    {preview_mode}
    on_preview_mode_change={(mode) => {
      preview_mode = mode;
    }}
    on_file_upload={upload_handler ? handle_file_upload : undefined}
  />

  {#if is_tab && show_preview}
    <div class="flex border-b border-border">
      <button
        type="button"
        class={cn(
          "px-4 py-1.5 text-sm transition-colors",
          active_tab === "editor"
            ? "border-b-2 border-foreground text-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
        onclick={() => {
          active_tab = "editor";
        }}
      >
        Write
      </button>
      <button
        type="button"
        class={cn(
          "px-4 py-1.5 text-sm transition-colors",
          active_tab === "preview"
            ? "border-b-2 border-foreground text-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
        onclick={() => {
          active_tab = "preview";
        }}
      >
        Preview
      </button>
    </div>
  {/if}

  <div
    class={cn(is_split && "grid grid-cols-2 divide-x divide-border")}
    style={style_str}
  >
    <div
      class={cn(
        "overflow-y-auto",
        is_tab && active_tab === "preview" && "hidden",
      )}
      style={style_str}
      onfocus={onFocus}
      onblur={onBlur}
    >
      <div
        bind:this={editor_container}
        class="h-full [&_.cm-editor]:h-full [&_.cm-scroller]:overflow-auto"
      ></div>
    </div>

    {#if show_preview}
      <div
        class={cn(
          "overflow-y-auto",
          is_tab && active_tab === "editor" && "hidden",
        )}
        style={style_str}
      >
        <EditorPreview content={value} {renderer_options} />
      </div>
    {/if}
  </div>
</div>
