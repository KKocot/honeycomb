import { Component, For, Show } from "solid-js";
import type {
  ToolbarItem,
  ToolbarAction,
  PreviewMode,
  ToolbarItemType,
} from "@kkocot/honeycomb-core";
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

  return shortcut.replace("Mod", is_mac ? "Cmd" : "Ctrl").replace("-", "+");
}

interface EditorToolbarProps {
  items: ToolbarItem[];
  on_action: (action: ToolbarAction) => void;
  active_actions: Set<ToolbarItemType>;
  is_uploading: boolean;
  preview_mode: PreviewMode;
  on_preview_mode_change: (mode: PreviewMode) => void;
  on_file_upload?: (file: File) => void;
}

export const EditorToolbar: Component<EditorToolbarProps> = (props) => {
  let file_input_ref: HTMLInputElement | undefined;

  function handle_file_change(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file && props.on_file_upload) {
      props.on_file_upload(file);
    }
    target.value = "";
  }

  function handle_preview_toggle() {
    props.on_preview_mode_change(PREVIEW_CYCLE[props.preview_mode]);
  }

  return (
    <div class="flex items-center gap-1 px-2 py-1 border-b border-border flex-wrap">
      <For each={props.items}>
        {(item, index) => {
          if (item.type === "separator") {
            return (
              <div
                class="w-px h-5 bg-border mx-1"
                role="separator"
                data-index={index()}
              />
            );
          }

          if (item.type === "upload_image") {
            return (
              <button
                type="button"
                title={item.label}
                disabled={props.is_uploading}
                class={cn(
                  "p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors",
                  props.is_uploading && "opacity-50 cursor-not-allowed",
                )}
                onClick={() => file_input_ref?.click()}
              >
                <span class="text-xs font-medium">
                  {TOOLBAR_LABELS.Upload}
                </span>
              </button>
            );
          }

          const label =
            item.icon ? (TOOLBAR_LABELS[item.icon] ?? item.label) : item.label;
          const tooltip = item.shortcut
            ? `${item.label} (${format_shortcut(item.shortcut)})`
            : item.label;

          return (
            <button
              type="button"
              title={tooltip}
              class={cn(
                "p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors",
                props.active_actions.has(item.type) &&
                  "bg-accent text-foreground",
              )}
              onClick={() => props.on_action(item.action)}
            >
              <span class="text-xs font-medium">{label}</span>
            </button>
          );
        }}
      </For>

      <div class="flex-1" />

      <button
        type="button"
        title={PREVIEW_LABELS[props.preview_mode]}
        class="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        onClick={handle_preview_toggle}
      >
        <span class="text-xs font-medium">
          {PREVIEW_BUTTON_TEXT[props.preview_mode]}
        </span>
      </button>

      <Show when={props.on_file_upload}>
        <input
          ref={(el) => {
            file_input_ref = el;
          }}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          class="hidden"
          onChange={handle_file_change}
        />
      </Show>
    </div>
  );
};
