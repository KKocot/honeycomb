// Provider & Hooks (Passive-only)
export {
  HiveProvider,
  useHive,
  useHiveChain,
  useApiEndpoint,
  useHiveStatus,
  DEFAULT_API_ENDPOINTS,
  type HiveContextValue,
  type HiveProviderProps,
} from "./hive-provider";

// Re-export core types for convenience
export type {
  ConnectionStatus,
  EndpointStatus,
  HiveClientState,
} from "@kkocot/honeycomb-core";

// Health checker service (re-export from core)
export { HealthCheckerService } from "@kkocot/honeycomb-core";
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
