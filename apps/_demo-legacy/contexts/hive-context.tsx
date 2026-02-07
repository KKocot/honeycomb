"use client";

/**
 * HiveProvider and hooks re-exported from @kkocot/honeycomb-react
 * Demo app uses the library provider for testing
 */

export {
  HiveProvider,
  useHive,
  useHiveChain,
  useApiEndpoint,
  useHiveStatus,
} from "@kkocot/honeycomb-react";

/** Default user for demo (for passive components to fetch data) */
export const DEFAULT_USER = "barddev";
