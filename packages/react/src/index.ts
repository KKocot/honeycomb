// Provider & Hooks (Passive-only)
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

// Re-export core types for convenience
export type {
  ConnectionStatus,
  EndpointStatus,
  HiveClientState,
} from "@kkocot/honeycomb-core";

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
  ApiTracker,
  type ApiTrackerProps,
} from "./api-tracker";

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

// Data Hooks
export {
  useHiveAccount,
  type HiveAccount,
  type UseHiveAccountResult,
} from "./use-hive-account";

export {
  useHivePost,
  type HivePost,
  type UseHivePostResult,
} from "./use-hive-post";

export {
  useHivePostList,
  type UseHivePostListOptions,
  type UseHivePostListResult,
} from "./use-hive-post-list";

// Re-export post list types from core
export type {
  SortType,
  PaginationCursor,
  RankedPost,
  RankedPostsResult,
} from "@kkocot/honeycomb-core";

export {
  HivePostList,
  type HivePostListProps,
} from "./post-list";

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

// Markdown Editor
export { MdEditor, type MdEditorProps } from "./editor";
export { EditorToolbar } from "./editor";
export { EditorPreview } from "./editor";
export { use_codemirror } from "./editor";
export { use_draft } from "./editor";

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
