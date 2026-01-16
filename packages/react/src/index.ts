// Provider & Hooks
export {
  HiveProvider,
  useHive,
  useHiveChain,
  useHiveUser,
  useIsLoggedIn,
  useHiveAuth,
  useApiEndpoint,
  DEFAULT_API_ENDPOINTS,
  type HiveUser,
  type HiveContextValue,
  type HiveProviderProps,
} from "./hive-provider";

// Auth Components
export {
  KeychainLogin,
  hasKeychain,
  type KeychainLoginProps,
} from "./keychain-login";

export {
  PeakVaultLogin,
  hasPeakVault,
  type PeakVaultLoginProps,
} from "./peakvault-login";

// Social Components
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

// Hooks
export {
  useHiveAccount,
  type HiveAccount,
  type UseHiveAccountResult,
} from "./use-hive-account";

// Types
export type {
  LoginProps,
  HiveKeychain,
  HiveKeychainResponse,
  PeakVault,
  PeakVaultResponse,
} from "./types";

// Utils
export { cn } from "./utils";
