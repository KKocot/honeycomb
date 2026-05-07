/**
 * @hiveio/honeycomb-solid
 * Solid.js components for Hive Blockchain applications
 */

// Provider & Hooks
export {
  HiveProvider,
  useHive,
  useHiveChain,
  useApiEndpoint,
  useHiveStatus,
  DEFAULT_API_ENDPOINTS,
  DEFAULT_HEALTHCHECKER_KEY,
  type HiveContextValue,
  type HiveProviderProps,
  type HealthCheckerServiceConfig,
} from "./hive-provider";

// Account Hook
export {
  useHiveAccount,
  type HiveAccount,
  type UseHiveAccountResult,
} from "./use-hive-account";

// Post Hook
export {
  useHivePost,
  type HivePost,
  type UseHivePostResult,
} from "./use-hive-post";

// Health checker service (re-export from core)
export {
  HealthCheckerService,
  createDefaultCheckers,
  DEFAULT_HEALTHCHECKER_PROVIDERS,
} from "@kkocot/honeycomb-core";
export type {
  ApiChecker,
  ValidationErrorDetails,
  HealthCheckerFields,
} from "@kkocot/honeycomb-core";

// Health checker component
export {
  HealthCheckerComponent,
  type HealthCheckerComponentProps,
} from "./healthchecker";

// Display Components
export { ApiTracker, type ApiTrackerProps } from "./api-tracker";
export {
  HiveAvatar,
  type HiveAvatarProps,
  type AvatarSize,
} from "./avatar";
export {
  UserCard,
  type UserCardProps,
  type UserCardVariant,
} from "./user-card";
export {
  BalanceCard,
  type BalanceCardProps,
  type BalanceCardVariant,
} from "./balance-card";
export {
  HiveManabar,
  type HiveManabarProps,
  type ManabarVariant,
} from "./manabar";
export {
  HivePostCard,
  type HivePostCardProps,
  type PostVariant,
  type PostHideOption,
} from "./post-card";

// Post List
export {
  useHivePostList,
  type UseHivePostListOptions,
  type UseHivePostListResult,
} from "./use-hive-post-list";

export {
  HivePostList,
  type HivePostListProps,
} from "./post-list";

// Re-export post list types from core
export type {
  SortType,
  PaginationCursor,
  RankedPost,
  RankedPostsResult,
} from "@kkocot/honeycomb-core";

// Author Post List
export {
  useHiveAuthorPostList,
  type UseHiveAuthorPostListOptions,
  type UseHiveAuthorPostListResult,
} from "./use-hive-author-post-list";

export {
  HiveAuthorPostList,
  type HiveAuthorPostListProps,
} from "./author-post-list";

// Re-export author post list types from core
export type {
  AccountPost,
  AccountPostCursor,
  AccountPostsResult,
} from "@kkocot/honeycomb-core";

// Content Renderer
export {
  HiveContentRenderer,
  type HiveContentRendererProps,
} from "./HiveContentRenderer";

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

// Vite plugins (separate entry point):
// import { wasmUrlPlugin } from "@hiveio/honeycomb-solid/plugins"

// Markdown Editor
export { MdEditor, type MdEditorProps } from "./editor";
export { EditorToolbar } from "./editor";
export { EditorPreview } from "./editor";
export { create_codemirror } from "./editor";
export { create_draft } from "./editor";

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
  MdEditorCallbacks,
  MdEditorConfig,
} from "@kkocot/honeycomb-core";
export {
  DEFAULT_TOOLBAR,
  create_hive_upload_handler,
  insert_image_markdown,
  convert_hive_urls_in_text,
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
