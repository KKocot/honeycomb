import { defineComponent, h, ref, type PropType } from "vue";
import type {
  ToolbarItem,
  ToolbarAction,
  PreviewMode,
  ToolbarItemType,
} from "@kkocot/honeycomb-core";
import { cn } from "../utils.js";

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

export interface EditorToolbarProps {
  items: ToolbarItem[];
  onAction: (action: ToolbarAction) => void;
  activeActions: Set<ToolbarItemType>;
  isUploading: boolean;
  previewMode: PreviewMode;
  onPreviewModeChange: (mode: PreviewMode) => void;
  onFileUpload?: (file: File) => void;
}

export const EditorToolbar = defineComponent({
  name: "EditorToolbar",
  props: {
    items: {
      type: Array as PropType<ToolbarItem[]>,
      required: true,
    },
    onAction: {
      type: Function as PropType<(action: ToolbarAction) => void>,
      required: true,
    },
    activeActions: {
      type: Object as PropType<Set<ToolbarItemType>>,
      required: true,
    },
    isUploading: {
      type: Boolean,
      required: true,
    },
    previewMode: {
      type: String as PropType<PreviewMode>,
      required: true,
    },
    onPreviewModeChange: {
      type: Function as PropType<(mode: PreviewMode) => void>,
      required: true,
    },
    onFileUpload: {
      type: Function as PropType<(file: File) => void>,
      default: undefined,
    },
  },
  setup(props) {
    const file_input_ref = ref<HTMLInputElement | null>(null);

    function handle_file_change(event: Event) {
      if (!(event.target instanceof HTMLInputElement)) return;
      const file = event.target.files?.[0];
      if (file && props.onFileUpload) {
        props.onFileUpload(file);
      }
      event.target.value = "";
    }

    function handle_preview_toggle() {
      props.onPreviewModeChange(PREVIEW_CYCLE[props.previewMode]);
    }

    return () => {
      const children = props.items.map((item, index) => {
        if (item.type === "separator") {
          return h("div", {
            key: `sep-${index}`,
            class: "w-px h-5 bg-border mx-1",
            role: "separator",
          });
        }

        if (item.type === "upload_image") {
          return h(
            "button",
            {
              key: item.type,
              type: "button",
              title: item.label,
              disabled: props.isUploading,
              class: cn(
                "p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors",
                props.isUploading && "opacity-50 cursor-not-allowed",
              ),
              onClick: () => file_input_ref.value?.click(),
            },
            [h("span", { class: "text-xs font-medium" }, TOOLBAR_LABELS.Upload)],
          );
        }

        const label =
          item.icon ? (TOOLBAR_LABELS[item.icon] ?? item.label) : item.label;
        const tooltip = item.shortcut
          ? `${item.label} (${format_shortcut(item.shortcut)})`
          : item.label;
        const is_active = props.activeActions.has(item.type);

        return h(
          "button",
          {
            key: item.type,
            type: "button",
            title: tooltip,
            class: cn(
              "p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors",
              is_active && "bg-accent text-foreground",
            ),
            onClick: () => props.onAction(item.action),
          },
          [h("span", { class: "text-xs font-medium" }, label)],
        );
      });

      // Spacer
      children.push(h("div", { key: "spacer", class: "flex-1" }));

      // Preview toggle
      children.push(
        h(
          "button",
          {
            key: "preview-toggle",
            type: "button",
            title: PREVIEW_LABELS[props.previewMode],
            class:
              "p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors",
            onClick: handle_preview_toggle,
          },
          [
            h(
              "span",
              { class: "text-xs font-medium" },
              PREVIEW_BUTTON_TEXT[props.previewMode],
            ),
          ],
        ),
      );

      // Hidden file input
      if (props.onFileUpload) {
        children.push(
          h("input", {
            key: "file-input",
            ref: file_input_ref,
            type: "file",
            accept: "image/jpeg,image/png,image/gif,image/webp",
            class: "hidden",
            onChange: handle_file_change,
          }),
        );
      }

      return h(
        "div",
        {
          class:
            "flex items-center gap-1 px-2 py-1 border-b border-border flex-wrap",
        },
        children,
      );
    };
  },
});
