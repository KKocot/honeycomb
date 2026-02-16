"use client";

import { useEffect, useMemo, useRef } from "react";
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
  className?: string;
}

export function HiveContentRenderer({
  body,
  author,
  permlink,
  options,
  plugins = DEFAULT_PLUGINS,
  className,
}: HiveContentRendererProps) {
  const ref = useRef<HTMLDivElement>(null);
  const options_key = JSON.stringify(options);

  const renderer = useMemo(
    () => new DefaultRenderer(build_default_options({ ...options, plugins })),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- options_key tracks deep equality
    [options_key, plugins],
  );

  const html = useMemo(() => {
    if (!body) return "";
    return renderer.render(body, { author, permlink });
  }, [renderer, body, author, permlink]);

  useEffect(() => {
    const element = ref.current;
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
  }, [html, plugins]);

  return (
    <div
      ref={ref}
      dangerouslySetInnerHTML={{ __html: html }}
      className={className}
    />
  );
}
