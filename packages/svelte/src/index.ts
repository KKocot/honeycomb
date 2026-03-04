// Provider
export { default as HiveProvider } from "./HiveProvider.svelte";
export type { HealthCheckerServiceConfig } from "./HiveProvider.svelte";

// Context hooks
export {
  useHive,
  useHiveChain,
  useApiEndpoint,
  useHiveStatus,
  HIVE_CONTEXT_KEY,
  type HiveContextValue,
  type HiveProviderProps,
} from "./context.svelte";

// Provider constants (re-export from core, matching React package API)
export {
  DEFAULT_API_ENDPOINTS,
  DEFAULT_HEALTHCHECKER_KEY,
} from "@kkocot/honeycomb-core";

// Re-export core types
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

// Display Components
export { default as HiveAvatar } from "./avatar.svelte";
export type { AvatarSize, HiveAvatarProps } from "./avatar.svelte";

export { default as UserCard } from "./user-card.svelte";
export type { UserCardVariant, UserCardProps } from "./user-card.svelte";

export { default as BalanceCard } from "./balance-card.svelte";
export type {
  BalanceCardVariant,
  BalanceCardProps,
} from "./balance-card.svelte";

export { default as ApiTracker } from "./api-tracker.svelte";
export type { ApiTrackerProps } from "./api-tracker.svelte";

export { default as HiveManabar } from "./manabar.svelte";
export type { ManabarVariant, HiveManabarProps } from "./manabar.svelte";

export { default as HivePostCard } from "./post-card.svelte";
export type {
  PostVariant,
  PostHideOption,
  HivePostCardProps,
} from "./post-card.svelte";

export { default as HivePostList } from "./post-list.svelte";
export type { HivePostListProps } from "./post-list.svelte";

export { default as HiveContentRenderer } from "./HiveContentRenderer.svelte";
export type { HiveContentRendererProps } from "./HiveContentRenderer.svelte";

// Health Checker Components
export { default as HealthCheckerComponent } from "./healthchecker.svelte";
export type { HealthCheckerComponentProps } from "./healthchecker.svelte";

export { default as ProviderCard } from "./healthchecker-provider-card.svelte";
export type { ProviderCardProps } from "./healthchecker-provider-card.svelte";

export { default as ProviderAddition } from "./healthchecker-provider-addition.svelte";
export type { ProviderAdditionProps } from "./healthchecker-provider-addition.svelte";

export { default as ConfirmationSwitchDialog } from "./healthchecker-confirmation-switch-dialog.svelte";
export type { ConfirmationSwitchDialogProps } from "./healthchecker-confirmation-switch-dialog.svelte";

export { default as ValidationErrorDialog } from "./healthchecker-validation-error-dialog.svelte";
export type { ValidationErrorDialogProps } from "./healthchecker-validation-error-dialog.svelte";

// Data Hooks
export {
  useHiveAccount,
  type HiveAccount,
  type UseHiveAccountResult,
} from "./use-hive-account.svelte";

export {
  useHivePost,
  type HivePost,
  type UseHivePostResult,
} from "./use-hive-post.svelte";

export {
  useHivePostList,
  type UseHivePostListOptions,
  type UseHivePostListResult,
} from "./use-hive-post-list.svelte";

// Re-export post list types from core
export type {
  SortType,
  PaginationCursor,
  RankedPost,
  RankedPostsResult,
} from "@kkocot/honeycomb-core";

// Content Renderer re-exports
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
export { EditorToolbar, type EditorToolbarProps } from "./editor";
export { EditorPreview, type EditorPreviewProps } from "./editor";
export {
  create_codemirror,
  type CreateCodemirrorOptions,
  type CreateCodemirrorReturn,
} from "./editor";
export {
  create_draft,
  type CreateDraftOptions,
  type CreateDraftReturn,
} from "./editor";

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
