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

// Data Hooks
export {
  useHiveAccount,
  type HiveAccount,
  type UseHiveAccountResult,
} from "./use-hive-account";

// Utils
export { cn } from "./utils";
