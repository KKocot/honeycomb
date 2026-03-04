<script lang="ts" module>
  import type {
    ToolbarItem,
    ToolbarAction,
    PreviewMode,
    ToolbarItemType,
  } from "@kkocot/honeycomb-core";

  export interface EditorToolbarProps {
    items: ToolbarItem[];
    on_action: (action: ToolbarAction) => void;
    active_actions: Set<ToolbarItemType>;
    is_uploading: boolean;
    preview_mode: PreviewMode;
    on_preview_mode_change: (mode: PreviewMode) => void;
    on_file_upload?: (file: File) => void;
  }
</script>

<script lang="ts">
  import { cn } from "../utils";

  const TOOLBAR_LABELS: Record<string, string> = {
    Bold: "B",
    Italic: "I",
    Strikethrough: "S",
    Code: "<>",
    FileCode: "{ }",
    Heading: "H",
    Quote: '"',
    Minus: "--",
    Table: "T",
    Link: "#",
    Image: "Img",
    List: "UL",
    ListOrdered: "OL",
    ListChecks: "[]",
    Upload: "Up",
    Undo: "\u21A9",
    Redo: "\u21AA",
  };

  const PREVIEW_LABELS: Record<PreviewMode, string> = {
    off: "Show preview",
    tab: "Split view",
    split: "Hide preview",
  };

  const PREVIEW_BUTTON_TEXT: Record<PreviewMode, string> = {
    off: "\u25B6",
    tab: "\u25EB",
    split: "\u2716",
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

  let {
    items,
    on_action,
    active_actions,
    is_uploading,
    preview_mode,
    on_preview_mode_change,
    on_file_upload,
  }: EditorToolbarProps = $props();

  let file_input_el: HTMLInputElement | undefined = $state(undefined);

  function handle_file_change(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) return;
    const file = event.target.files?.[0];
    if (file && on_file_upload) {
      on_file_upload(file);
    }
    event.target.value = "";
  }

  function handle_preview_toggle() {
    on_preview_mode_change(PREVIEW_CYCLE[preview_mode]);
  }
</script>

<div
  class="flex items-center gap-1 px-2 py-1 border-b border-border flex-wrap"
>
  {#each items as item, index (item.type === "separator" ? `sep-${index}` : item.type)}
    {#if item.type === "separator"}
      <div class="w-px h-5 bg-border mx-1" role="separator"></div>
    {:else if item.type === "upload_image"}
      <button
        type="button"
        title={item.label}
        disabled={is_uploading}
        class={cn(
          "p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors",
          is_uploading && "opacity-50 cursor-not-allowed",
        )}
        onclick={() => file_input_el?.click()}
      >
        <span class="text-xs font-medium">{TOOLBAR_LABELS.Upload}</span>
      </button>
    {:else}
      {@const label = item.icon
        ? (TOOLBAR_LABELS[item.icon] ?? item.label)
        : item.label}
      {@const tooltip = item.shortcut
        ? `${item.label} (${format_shortcut(item.shortcut)})`
        : item.label}
      <button
        type="button"
        title={tooltip}
        class={cn(
          "p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors",
          active_actions.has(item.type) && "bg-accent text-foreground",
        )}
        onclick={() => on_action(item.action)}
      >
        <span class="text-xs font-medium">{label}</span>
      </button>
    {/if}
  {/each}

  <div class="flex-1"></div>

  <button
    type="button"
    title={PREVIEW_LABELS[preview_mode]}
    class="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
    onclick={handle_preview_toggle}
  >
    <span class="text-xs font-medium">
      {PREVIEW_BUTTON_TEXT[preview_mode]}
    </span>
  </button>

  {#if on_file_upload}
    <input
      bind:this={file_input_el}
      type="file"
      accept="image/jpeg,image/png,image/gif,image/webp"
      class="hidden"
      onchange={handle_file_change}
    />
  {/if}
</div>
