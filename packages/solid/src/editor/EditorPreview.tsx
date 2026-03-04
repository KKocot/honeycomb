import type { Component } from "solid-js";
import { Show } from "solid-js";
import type { RendererOptions } from "@kkocot/honeycomb-renderer";
import { HiveContentRenderer } from "../HiveContentRenderer";
import { cn } from "../utils";

interface EditorPreviewProps {
  content: string;
  renderer_options?: Partial<RendererOptions>;
  class?: string;
}

export const EditorPreview: Component<EditorPreviewProps> = (props) => {
  return (
    <div
      class={cn(
        "prose prose-sm dark:prose-invert p-4 overflow-y-auto max-h-full",
        props.class,
      )}
    >
      <Show
        when={props.content}
        fallback={
          <p class="text-muted-foreground italic">Nothing to preview</p>
        }
      >
        <HiveContentRenderer
          body={props.content}
          options={props.renderer_options}
        />
      </Show>
    </div>
  );
};
