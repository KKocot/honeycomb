/**
 * @kkocot/honeycomb-solid
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
  type HiveContextValue,
  type HiveProviderProps,
} from "./hive-provider";

// Account Hook
export {
  useHiveAccount,
  type HiveAccount,
  type UseHiveAccountResult,
} from "./use-hive-account";

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

// Re-export core types
export type {
  HiveClientConfig,
  ConnectionStatus,
  EndpointStatus,
  EndpointError,
  HiveClientState,
  StateListener,
} from "@kkocot/honeycomb-core";
