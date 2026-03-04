import { defineComponent, h, type PropType } from "vue";
import type { RendererOptions } from "@kkocot/honeycomb-renderer";
import { HiveContentRenderer } from "../HiveContentRenderer.js";
import { cn } from "../utils.js";

export interface EditorPreviewProps {
  content: string;
  rendererOptions?: Partial<RendererOptions>;
  class?: string;
}

export const EditorPreview = defineComponent({
  name: "EditorPreview",
  props: {
    content: { type: String, required: true },
    rendererOptions: {
      type: Object as PropType<Partial<RendererOptions>>,
      default: undefined,
    },
    class: { type: String, default: undefined },
  },
  setup(props) {
    return () =>
      h(
        "div",
        {
          class: cn(
            "prose prose-sm dark:prose-invert p-4 overflow-y-auto max-h-full",
            props.class,
          ),
        },
        props.content
          ? [
              h(HiveContentRenderer, {
                body: props.content,
                options: props.rendererOptions,
              }),
            ]
          : [
              h(
                "p",
                { class: "text-muted-foreground italic" },
                "Nothing to preview",
              ),
            ],
      );
  },
});
