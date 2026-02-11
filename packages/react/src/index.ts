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

// Utils
export { cn } from "./utils";
