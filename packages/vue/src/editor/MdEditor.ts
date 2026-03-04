import {
  defineComponent,
  h,
  ref,
  computed,
  onMounted,
  type PropType,
} from "vue";
import type {
  MdEditorConfig,
  PreviewMode,
  ToolbarAction,
  ToolbarItemType,
  EditorActionContext,
  UploadResult,
} from "@kkocot/honeycomb-core";
import {
  DEFAULT_TOOLBAR,
  insert_image_markdown,
} from "@kkocot/honeycomb-core";
import type { RendererOptions } from "@kkocot/honeycomb-renderer";
import { cn } from "../utils.js";
import { use_codemirror } from "./use-codemirror.js";
import { use_draft } from "./use-draft.js";
import { EditorToolbar } from "./EditorToolbar.js";
import { EditorPreview } from "./EditorPreview.js";

export interface MdEditorProps {
  value: string;
  config?: Partial<MdEditorConfig>;
  class?: string;
  rendererOptions?: Partial<RendererOptions>;
}

const DEFAULT_MIN_HEIGHT = 300;

export const MdEditor = defineComponent({
  name: "MdEditor",
  props: {
    value: { type: String, required: true },
    config: {
      type: Object as PropType<Partial<MdEditorConfig>>,
      default: undefined,
    },
    class: { type: String, default: undefined },
    rendererOptions: {
      type: Object as PropType<Partial<RendererOptions>>,
      default: undefined,
    },
  },
  emits: [
    "update:value",
    "focus",
    "blur",
    "upload-start",
    "upload-complete",
    "upload-error",
    "draft-save",
    "draft-restore",
  ],
  setup(props, { emit }) {
    const toolbar_items = computed(
      () => props.config?.toolbar ?? DEFAULT_TOOLBAR,
    );
    const theme = computed(() => props.config?.theme ?? "auto");
    const upload_handler = computed(() => props.config?.uploadHandler);
    const min_height = computed(
      () => props.config?.minHeight ?? DEFAULT_MIN_HEIGHT,
    );
    const max_height = computed(() => props.config?.maxHeight);
    const convert_hive_urls = computed(
      () => props.config?.convertHiveUrls ?? false,
    );

    const preview_mode = ref<PreviewMode>(props.config?.previewMode ?? "off");
    const is_uploading = ref(false);
    const active_actions = ref<Set<ToolbarItemType>>(new Set());
    const active_tab = ref<"editor" | "preview">("editor");

    // Internal ref for the value to pass to composables
    const internal_value = computed(() => props.value);

    function handle_selection_change(context: EditorActionContext) {
      const active = new Set<ToolbarItemType>();
      for (const item of toolbar_items.value) {
        if (item.type === "separator") continue;
        if (item.action.isActive?.(context)) {
          active.add(item.type);
        }
      }
      active_actions.value = active;
    }

    function handle_change(new_value: string) {
      emit("update:value", new_value);
    }

    const { container_ref, execute_action, get_context, focus } =
      use_codemirror({
        value: internal_value,
        on_change: handle_change,
        placeholder: props.config?.placeholder,
        theme,
        on_selection_change: handle_selection_change,
        convert_hive_urls,
      });

    const draft_config = computed(() => props.config?.draftConfig);

    use_draft({
      config: draft_config,
      value: internal_value,
      on_save: (draft) => emit("draft-save", draft),
      on_restore: (draft) => emit("draft-restore", draft),
    });

    // Auto-focus
    onMounted(() => {
      if (props.config?.autoFocus) {
        focus();
      }
    });

    function handle_toolbar_action(action: ToolbarAction) {
      execute_action(action);
    }

    async function handle_file_upload(file: File) {
      const handler = upload_handler.value;
      if (!handler) return;

      is_uploading.value = true;
      emit("upload-start", file);

      try {
        const result: UploadResult = await handler.upload(file);
        const context = get_context();
        if (context) {
          const action_result = insert_image_markdown(context, result);
          emit("update:value", action_result.text);
        }
        emit("upload-complete", result);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Upload failed");
        emit("upload-error", error);
      } finally {
        is_uploading.value = false;
      }
    }

    const style = computed(() => ({
      minHeight: `${min_height.value}px`,
      ...(max_height.value ? { maxHeight: `${max_height.value}px` } : {}),
    }));

    const show_preview = computed(() => preview_mode.value !== "off");
    const is_split = computed(() => preview_mode.value === "split");
    const is_tab = computed(() => preview_mode.value === "tab");

    return () => {
      const children = [];

      // Toolbar
      children.push(
        h(EditorToolbar, {
          items: toolbar_items.value,
          onAction: handle_toolbar_action,
          activeActions: active_actions.value,
          isUploading: is_uploading.value,
          previewMode: preview_mode.value,
          onPreviewModeChange: (mode: PreviewMode) => {
            preview_mode.value = mode;
          },
          onFileUpload: upload_handler.value
            ? handle_file_upload
            : undefined,
        }),
      );

      // Tab bar (tab mode)
      if (is_tab.value && show_preview.value) {
        children.push(
          h("div", { class: "flex border-b border-border" }, [
            h(
              "button",
              {
                type: "button",
                class: cn(
                  "px-4 py-1.5 text-sm transition-colors",
                  active_tab.value === "editor"
                    ? "border-b-2 border-foreground text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                ),
                onClick: () => {
                  active_tab.value = "editor";
                },
              },
              "Write",
            ),
            h(
              "button",
              {
                type: "button",
                class: cn(
                  "px-4 py-1.5 text-sm transition-colors",
                  active_tab.value === "preview"
                    ? "border-b-2 border-foreground text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                ),
                onClick: () => {
                  active_tab.value = "preview";
                },
              },
              "Preview",
            ),
          ]),
        );
      }

      // Editor + Preview content
      const content_children = [];

      // Editor pane
      content_children.push(
        h(
          "div",
          {
            class: cn(
              "overflow-y-auto",
              is_tab.value &&
                active_tab.value === "preview" &&
                "hidden",
            ),
            style: style.value,
            onFocus: () => emit("focus"),
            onBlur: () => emit("blur"),
          },
          [
            h("div", {
              ref: container_ref,
              class:
                "h-full [&_.cm-editor]:h-full [&_.cm-scroller]:overflow-auto",
            }),
          ],
        ),
      );

      // Preview pane
      if (show_preview.value) {
        content_children.push(
          h(
            "div",
            {
              class: cn(
                "overflow-y-auto",
                is_tab.value &&
                  active_tab.value === "editor" &&
                  "hidden",
              ),
              style: style.value,
            },
            [
              h(EditorPreview, {
                content: props.value,
                rendererOptions: props.rendererOptions,
              }),
            ],
          ),
        );
      }

      children.push(
        h(
          "div",
          {
            class: cn(
              is_split.value && "grid grid-cols-2 divide-x divide-border",
            ),
            style: style.value,
          },
          content_children,
        ),
      );

      return h(
        "div",
        {
          class: cn(
            "border border-border rounded-lg overflow-hidden",
            props.class,
          ),
        },
        children,
      );
    };
  },
});
