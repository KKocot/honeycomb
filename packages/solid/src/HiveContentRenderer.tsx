import { createMemo, createEffect, onCleanup } from "solid-js";
import {
  DefaultRenderer,
  build_default_options,
  DEFAULT_PLUGINS,
  type RendererOptions,
  type RendererPlugin,
} from "@kkocot/honeycomb-renderer";

export interface HiveContentRendererProps {
  body: string;
  author?: string;
  permlink?: string;
  options?: Partial<RendererOptions>;
  plugins?: RendererPlugin[];
  class?: string;
}

export function HiveContentRenderer(props: HiveContentRendererProps) {
  let ref: HTMLDivElement | undefined;

  const plugins = () => props.plugins ?? DEFAULT_PLUGINS;

  const renderer = createMemo(
    () =>
      new DefaultRenderer(
        build_default_options({ ...props.options, plugins: plugins() }),
      ),
  );

  const html = createMemo(() => {
    if (!props.body) return "";
    return renderer().render(props.body, {
      author: props.author,
      permlink: props.permlink,
    });
  });

  createEffect(() => {
    const current_html = html();
    if (!ref || !current_html) return;

    const cleanups: Array<() => void> = [];
    for (const plugin of plugins()) {
      if (plugin.onMount) {
        const cleanup = plugin.onMount(ref);
        if (cleanup) cleanups.push(cleanup);
      }
    }

    onCleanup(() => {
      for (const cleanup of cleanups) {
        cleanup();
      }
    });
  });

  return (
    <div
      ref={(el) => {
        ref = el;
      }}
      // Safe: DefaultRenderer sanitizes output via sanitize-html + SecurityChecker
      innerHTML={html()}
      class={props.class}
    />
  );
}
