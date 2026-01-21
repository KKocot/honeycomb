"use client";

import { useState, useCallback } from "react";
import {
  HiveLoginResult,
  HiveAuthError,
  KeyType,
  createAuthError,
  mapErrorToAuthError,
} from "@/types/auth";

/**
 * Validate WIF (Wallet Import Format) key format
 * WIF keys start with '5' and are 51 characters long
 */
export function isValidWifFormat(wif: string): boolean {
  return wif.startsWith("5") && wif.length === 51;
}

/**
 * Return type for WIF auth hook
 */
export interface UseWifAuthReturn {
  /** Whether auth is in progress */
  isAuthenticating: boolean;
  /** Current error if any */
  error: HiveAuthError | null;
  /** Perform authentication with WIF key */
  authenticate: (username: string, wifKey: string) => Promise<HiveLoginResult>;
  /** Clear error state */
  clearError: () => void;
}

/**
 * Headless hook for WIF (direct private key) authentication
 *
 * WARNING: Direct WIF key entry is the least secure method.
 * Use only for development/testing or when no other option is available.
 *
 * @example
 * ```tsx
 * function WifLogin() {
 *   const { isAuthenticating, authenticate, error } = useWifAuth();
 *
 *   const handleLogin = async () => {
 *     try {
 *       const result = await authenticate("myusername", "5...");
 *       console.log("Logged in:", result);
 *     } catch (err) {
 *       console.error("Login failed:", err);
 *     }
 *   };
 *
 *   return <button onClick={handleLogin}>Login with WIF</button>;
 * }
 * ```
 */
export function useWifAuth(keyType: KeyType = "posting"): UseWifAuthReturn {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<HiveAuthError | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const authenticate = useCallback(
    async (username: string, wifKey: string): Promise<HiveLoginResult> => {
      if (!username.trim()) {
        const err = createAuthError(
          "INVALID_USERNAME",
          "Username is required",
          undefined,
          true
        );
        setError(err);
        throw err;
      }

      if (!wifKey.trim()) {
        const err = createAuthError(
          "INVALID_KEY",
          "Private key is required",
          undefined,
          true
        );
        setError(err);
        throw err;
      }

      if (!isValidWifFormat(wifKey)) {
        const err = createAuthError(
          "INVALID_KEY",
          "Invalid WIF format. Private keys start with 5 and are 51 characters long.",
          undefined,
          true
        );
        setError(err);
        throw err;
      }

      setIsAuthenticating(true);
      setError(null);

      try {
        // In a real implementation, we would:
        // 1. Derive public key from WIF
        // 2. Fetch account from blockchain
        // 3. Verify the public key matches one of the account's posting keys
        //
        // For now, we trust the format is valid and proceed.
        // The key will be verified when actually signing transactions.

        // Simulate async verification
        await new Promise((r) => setTimeout(r, 300));

        const result: HiveLoginResult = {
          username: username.toLowerCase(),
          loginMethod: "wif",
          keyType,
        };

        return result;
      } catch (err) {
        const authError = mapErrorToAuthError(err);
        setError(authError);
        throw authError;
      } finally {
        setIsAuthenticating(false);
      }
    },
    [keyType]
  );

  return {
    isAuthenticating,
    error,
    authenticate,
    clearError,
  };
}

/**
 * Verify WIF key matches account's posting key
 *
 * Note: This is a placeholder - actual verification requires:
 * 1. Deriving public key from WIF
 * 2. Fetching account from blockchain
 * 3. Comparing public key with account's posting authorities
 *
 * For production use, implement this with @hiveio/wax or beekeeper
 */
export async function verifyWifKeyMatchesAccount(
  _chain: unknown,
  _username: string,
  _wifKey: string
): Promise<{ valid: boolean; publicKey?: string; error?: string }> {
  // TODO: Implement actual verification
  // For now, just validate the format
  console.warn(
    "verifyWifKeyMatchesAccount: Full verification not implemented. " +
    "Only format validation is performed."
  );

  return { valid: true };
}
