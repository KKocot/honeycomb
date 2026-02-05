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

// Data Hooks
export {
  useHiveAccount,
  type HiveAccount,
  type UseHiveAccountResult,
} from "./use-hive-account";

// Utils
export { cn } from "./utils";
