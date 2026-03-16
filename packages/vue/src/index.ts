/**
 * @hiveio/honeycomb-vue
 * Vue 3 composables for Hive Blockchain applications
 */

// Provider and composables
export {
  HiveProvider,
  useHive,
  useHiveChain,
  useApiEndpoint,
  useHiveStatus,
  hivePlugin,
  type HiveContextValue,
  type HealthCheckerServiceConfig,
} from "./hive-provider.js";

// HealthChecker
export {
  HealthCheckerComponent,
  type HealthCheckerComponentProps,
} from "./healthchecker.js";

// Account composable
export {
  useHiveAccount,
  type HiveAccount,
  type UseHiveAccountResult,
} from "./use-hive-account.js";

// Post composable
export {
  useHivePost,
  type HivePost,
  type UseHivePostResult,
} from "./use-hive-post.js";

// Components
export { ApiTracker, type ApiTrackerProps } from "./api-tracker.js";
export {
  HiveAvatar,
  type HiveAvatarProps,
  type AvatarSize,
} from "./avatar.js";
export {
  UserCard,
  type UserCardProps,
  type UserCardVariant,
} from "./user-card.js";
export {
  BalanceCard,
  type BalanceCardProps,
  type BalanceCardVariant,
} from "./balance-card.js";
export {
  HiveManabar,
  type HiveManabarProps,
  type ManabarVariant,
} from "./manabar.js";
export {
  HivePostCard,
  type HivePostCardProps,
  type PostVariant,
  type PostHideOption,
} from "./post-card.js";

// Post List
export {
  useHivePostList,
  type UseHivePostListOptions,
  type UseHivePostListResult,
} from "./use-hive-post-list.js";

export {
  HivePostList,
  type HivePostListProps,
} from "./post-list.js";

// Content Renderer
export {
  HiveContentRenderer,
  type HiveContentRendererProps,
} from "./HiveContentRenderer.js";

// Re-export renderer types and plugins
export type {
  RendererOptions,
  RendererPlugin,
  PostContext,
} from "@kkocot/honeycomb-renderer";
export {
  DefaultRenderer,
  TablePlugin,
  TwitterPlugin,
  TwitterResizePlugin,
  InstagramPlugin,
  InstagramResizePlugin,
  DEFAULT_PLUGINS,
  HighlightPlugin,
} from "@kkocot/honeycomb-renderer";

// Re-export post list types from core
export type {
  SortType,
  PaginationCursor,
  RankedPost,
  RankedPostsResult,
} from "@kkocot/honeycomb-core";

// Re-export core types
export type {
  HiveClientConfig,
  ConnectionStatus,
  EndpointStatus,
  EndpointError,
  HiveClientState,
  StateListener,
} from "@kkocot/honeycomb-core";

// Editor
export {
  MdEditor,
  type MdEditorProps,
  EditorToolbar,
  type EditorToolbarProps,
  EditorPreview,
  type EditorPreviewProps,
  use_codemirror,
  type UseCodemirrorOptions,
  type UseCodemirrorReturn,
  use_draft,
  type UseDraftOptions,
  type UseDraftReturn,
} from "./editor/index.js";

// Re-export editor types from core
export type {
  PreviewMode,
  EditorTheme,
  ToolbarItemType,
  EditorActionContext,
  EditorActionResult,
  ToolbarAction,
  ToolbarItem,
  UploadResult,
  UploadHandler,
  DraftData,
  DraftConfig,
  PasteData,
  KeyboardShortcut,
  EditorPlugin,
  EditorState as MdEditorState,
  MdEditorCallbacks,
  MdEditorConfig,
} from "@kkocot/honeycomb-core";

// Re-export editor utilities from core
export {
  DEFAULT_TOOLBAR,
  convert_hive_urls_in_text,
  insert_image_markdown,
  create_hive_upload_handler,
} from "@kkocot/honeycomb-core";

// Re-export default endpoints
export { DEFAULT_API_ENDPOINTS } from "@kkocot/honeycomb-core";

// Health checker service and types
export {
  HealthCheckerService,
  DEFAULT_HEALTHCHECKER_KEY,
  DEFAULT_HEALTHCHECKER_PROVIDERS,
  createDefaultCheckers,
} from "@kkocot/honeycomb-core";

export type {
  ApiChecker,
  ValidationErrorDetails,
  HealthCheckerFields,
} from "@kkocot/honeycomb-core";
