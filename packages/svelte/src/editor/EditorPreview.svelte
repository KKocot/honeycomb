<script lang="ts" module>
  import type { RendererOptions } from "@kkocot/honeycomb-renderer";

  export interface EditorPreviewProps {
    content: string;
    renderer_options?: Partial<RendererOptions>;
    class?: string;
  }
</script>

<script lang="ts">
  import HiveContentRenderer from "../HiveContentRenderer.svelte";
  import { cn } from "../utils";

  let {
    content,
    renderer_options,
    class: class_name,
  }: EditorPreviewProps = $props();
</script>

<div
  class={cn(
    "prose prose-sm dark:prose-invert p-4 overflow-y-auto max-h-full",
    class_name,
  )}
>
  {#if content}
    <HiveContentRenderer body={content} options={renderer_options} />
  {:else}
    <p class="text-muted-foreground italic">Nothing to preview</p>
  {/if}
</div>
