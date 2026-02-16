import { TablePlugin } from "./plugins/table-plugin";
import { TwitterResizePlugin } from "./plugins/twitter-resize-plugin";
import { InstagramResizePlugin } from "./plugins/instagram-resize-plugin";
import type { RendererOptions } from "./DefaultRenderer";
import type { RendererPlugin } from "./plugins/renderer-plugin";

export const DEFAULT_PLUGINS: RendererPlugin[] = [
  new TablePlugin(),
  new TwitterResizePlugin(),
  new InstagramResizePlugin(),
];

export function build_default_options(
  overrides?: Partial<RendererOptions>,
): RendererOptions {
  return {
    baseUrl: "https://hive.blog/",
    breaks: true,
    skipSanitization: false,
    allowInsecureScriptTags: false,
    addNofollowToLinks: true,
    addTargetBlankToLinks: true,
    doNotShowImages: false,
    assetsWidth: 640,
    assetsHeight: 480,
    imageProxyFn: (url: string) => url,
    hashtagUrlFn: (hashtag: string) =>
      `/trending/${hashtag}`,
    usertagUrlFn: (account: string) => `/@${account}`,
    isLinkSafeFn: () => false,
    addExternalCssClassToMatchingLinksFn: () => true,
    plugins: DEFAULT_PLUGINS,
    ...overrides,
  };
}
