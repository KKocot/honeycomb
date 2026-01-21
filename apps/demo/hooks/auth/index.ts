/**
 * Hive UI Authentication Hooks
 *
 * Headless hooks for implementing custom authentication UIs.
 * For ready-to-use components, see components/hive/active/*.tsx
 */

// Keychain hook
export { useKeychainAuth, hasKeychain } from "./use-keychain-auth";

// PeakVault hook
export { usePeakVaultAuth, hasPeakVault } from "./use-peakvault-auth";

// HiveAuth hook
export { useHiveAuthAuth } from "./use-hiveauth-auth";
export type { HiveAuthState, UseHiveAuthReturn } from "./use-hiveauth-auth";

// HB-Auth hook
export { useHBAuthAuth, initHBAuth } from "./use-hbauth-auth";
export type { HBAuthMode, UseHBAuthReturn } from "./use-hbauth-auth";

// WIF hook
export { useWifAuth, isValidWifFormat, verifyWifKeyMatchesAccount } from "./use-wif-auth";
export type { UseWifAuthReturn } from "./use-wif-auth";
