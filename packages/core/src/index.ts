/**
 * @kkocot/honeycomb-core
 * Framework-agnostic core for Hive Blockchain connectivity with endpoint fallback
 */

// Main client
export { HiveClient, DEFAULT_API_ENDPOINTS } from "./hive-client.js";

// Endpoint management
export { EndpointManager } from "./endpoint-manager.js";

// Types
export type {
  HiveClientConfig,
  ConnectionStatus,
  EndpointStatus,
  EndpointError,
  HiveClientState,
  StateListener,
} from "./types.js";

// Utils
export {
  format_reputation,
  fetch_bridge_reputation,
  format_nai_asset,
  convert_vests_to_hp,
  calculate_manabar,
  format_mana_number,
  format_cooldown,
  format_time_ago,
  extract_thumbnail,
  MANA_REGENERATION_SECONDS,
  type NaiAsset,
  type ManabarData,
} from "./utils.js";

// Health checker service
export { HealthCheckerService } from "./healthchecker-service.js";
export type {
  ApiChecker,
  ValidationErrorDetails,
  HealthCheckerFields,
} from "./healthchecker-service.js";

// Default healthchecker configuration
export {
  DEFAULT_HEALTHCHECKER_KEY,
  DEFAULT_HEALTHCHECKER_PROVIDERS,
  createDefaultCheckers,
} from "./default-healthchecker.js";

// Post list
export {
  fetch_ranked_posts,
  format_payout,
  type SortType,
  type PaginationCursor,
  type RankedPost,
  type RankedPostsResult,
} from "./post-list.js";

// Author post list
export { fetch_account_posts } from "./author-post-list.js";
export type {
  AccountPost,
  AccountPostsResult,
  FetchAccountPostsOptions,
  AccountPostCursor,
  ParsedPostMetadata,
} from "./author-post-list.js";

// Editor types
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
  EditorState,
  MdEditorCallbacks,
  MdEditorConfig,
} from "./editor/index.js";

// Editor URL converter
export {
  is_hive_url,
  convert_hive_url,
  convert_hive_urls_in_text,
  type UrlConversion,
  type ConvertResult,
} from "./editor/index.js";

// Editor upload
export {
  create_hive_upload_handler,
  extract_images_from_markdown,
  insert_image_markdown,
  type HiveImageUploadConfig,
  type UploadProgress,
} from "./editor/index.js";

// Editor toolbar actions
export { DEFAULT_TOOLBAR } from "./editor/index.js";
