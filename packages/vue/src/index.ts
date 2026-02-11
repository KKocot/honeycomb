/**
 * @kkocot/honeycomb-vue
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
} from "./hive-provider.js";

// Account composable
export {
  useHiveAccount,
  type HiveAccount,
  type UseHiveAccountResult,
} from "./use-hive-account.js";

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

// Re-export core types
export type {
  HiveClientConfig,
  ConnectionStatus,
  EndpointStatus,
  EndpointError,
  HiveClientState,
  StateListener,
} from "@kkocot/honeycomb-core";

// Re-export default endpoints
export { DEFAULT_API_ENDPOINTS } from "@kkocot/honeycomb-core";
