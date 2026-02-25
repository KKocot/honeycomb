<script lang="ts" module>
  export interface HiveContentRendererProps {
    body: string;
    author?: string;
    permlink?: string;
    options?: Partial<
      import("@kkocot/honeycomb-renderer").RendererOptions
    >;
    plugins?: import("@kkocot/honeycomb-renderer").RendererPlugin[];
    class?: string;
  }
</script>

<script lang="ts">
  import {
    DefaultRenderer,
    build_default_options,
    DEFAULT_PLUGINS,
    type RendererPlugin,
  } from "@kkocot/honeycomb-renderer";

  let {
    body,
    author,
    permlink,
    options,
    plugins = DEFAULT_PLUGINS,
    class: class_name,
  }: HiveContentRendererProps = $props();

  let container_el: HTMLDivElement | undefined = $state(undefined);

  const options_key = $derived(JSON.stringify(options));

  const renderer = $derived.by(() => {
    // Track options_key for deep equality
    const _key = options_key;
    return new DefaultRenderer(
      build_default_options({ ...options, plugins }),
    );
  });

  const html = $derived.by(() => {
    if (!body) return "";
    return renderer.render(body, { author, permlink });
  });

  $effect(() => {
    const element = container_el;
    // Track html to re-run when content changes
    const _html = html;

    if (!element) return;

    const cleanups: Array<() => void> = [];
    for (const plugin of plugins) {
      if (plugin.onMount) {
        const cleanup = plugin.onMount(element);
        if (cleanup) cleanups.push(cleanup);
      }
    }

    return () => {
      for (const cleanup of cleanups) {
        cleanup();
      }
    };
  });
</script>

<div bind:this={container_el} class={class_name}>
  {@html html}
</div>
