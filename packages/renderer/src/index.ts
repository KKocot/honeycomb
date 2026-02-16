import { DefaultRenderer } from "./DefaultRenderer";
import { TwitterPlugin } from "./plugins/twitter-plugin";
import { TwitterResizePlugin } from "./plugins/twitter-resize-plugin";
import { InstagramPlugin } from "./plugins/instagram-plugin";
import { InstagramResizePlugin } from "./plugins/instagram-resize-plugin";
import { TablePlugin } from "./plugins/table-plugin";
import { HighlightPlugin } from "./plugins/highlight-plugin";

export { DefaultRenderer } from "./DefaultRenderer";
export type { RendererOptions } from "./DefaultRenderer";
export { TwitterPlugin } from "./plugins/twitter-plugin";
export { TwitterResizePlugin } from "./plugins/twitter-resize-plugin";
export { InstagramPlugin } from "./plugins/instagram-plugin";
export { InstagramResizePlugin } from "./plugins/instagram-resize-plugin";
export { TablePlugin } from "./plugins/table-plugin";
export { HighlightPlugin } from "./plugins/highlight-plugin";
export type { RendererPlugin } from "./plugins/renderer-plugin";
export type { EmbedTextNode } from "./embedder/abstract-embedder";
export type { PostContext } from "./sanitization/tag-transforming-sanitizer";
export type { RendererLogger } from "./types";
export { SecurityChecker } from "./security/security-checker";
export { LinkSanitizer } from "./security/link-sanitizer";
export { AccountNameValidator } from "./utils/account-name-validator";
export {
  build_default_options,
  DEFAULT_PLUGINS,
} from "./defaults";

export const HiveContentRenderer = {
  DefaultRenderer,
  TwitterPlugin,
  TwitterResizePlugin,
  InstagramPlugin,
  InstagramResizePlugin,
  TablePlugin,
  HighlightPlugin,
};

export default HiveContentRenderer;
