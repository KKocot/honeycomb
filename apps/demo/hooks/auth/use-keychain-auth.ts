"use client";

import { useState, useEffect, useCallback } from "react";
import {
  HiveLoginResult,
  HiveAuthError,
  UseHiveAuthMethodReturn,
  KeyType,
  createAuthError,
  mapErrorToAuthError,
} from "@/types/auth";

/**
 * Check if Hive Keychain extension is installed
 */
export function hasKeychain(): boolean {
  return typeof window !== "undefined" && !!window.hive_keychain;
}

/**
 * Headless hook for Hive Keychain authentication
 *
 * Use this for custom login UIs or when you need more control.
 * For a ready-to-use component, use HiveKeychainLogin instead.
 *
 * @example
 * ```tsx
 * function CustomKeychainLogin() {
 *   const { isAvailable, isAuthenticating, authenticate, error } = useKeychainAuth();
 *
 *   if (!isAvailable) return <p>Please install Hive Keychain</p>;
 *
 *   return (
 *     <button
 *       onClick={() => authenticate("myusername")}
 *       disabled={isAuthenticating}
 *     >
 *       {isAuthenticating ? "Signing..." : "Login with Keychain"}
 *     </button>
 *   );
 * }
 * ```
 */
export function useKeychainAuth(keyType: KeyType = "posting"): UseHiveAuthMethodReturn {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<HiveAuthError | null>(null);

  // Check if Keychain is available
  useEffect(() => {
    const checkAvailability = () => {
      const available = hasKeychain();
      setIsAvailable(available);
      setIsChecking(false);
    };

    // Check immediately
    checkAvailability();

    // Check again after a short delay (extension might load async)
    const timer = setTimeout(checkAvailability, 500);

    return () => clearTimeout(timer);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const authenticate = useCallback(
    async (username: string): Promise<HiveLoginResult> => {
      if (!window.hive_keychain) {
        const err = createAuthError(
          "EXTENSION_NOT_FOUND",
          "Hive Keychain extension not found. Please install it from hive-keychain.com",
          undefined,
          false
        );
        setError(err);
        throw err;
      }

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

      setIsAuthenticating(true);
      setError(null);

      try {
        // Generate unique challenge
        const challenge = `hive-ui-login:${username}:${Date.now()}:${Math.random().toString(36).slice(2)}`;

        // Map key type to Keychain format
        const keychainKeyType = keyType.charAt(0).toUpperCase() + keyType.slice(1) as "Posting" | "Active";

        // Request signature from Keychain
        const signature = await new Promise<string>((resolve, reject) => {
          window.hive_keychain!.requestSignBuffer(
            username.toLowerCase(),
            challenge,
            keychainKeyType,
            (response) => {
              if (response.success && response.result) {
                resolve(response.result);
              } else {
                reject(new Error(response.message || response.error || "Keychain signing failed"));
              }
            }
          );
        });

        const result: HiveLoginResult = {
          username: username.toLowerCase(),
          loginMethod: "keychain",
          keyType,
          publicKey: undefined, // Could extract from signature verification
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
    isAvailable,
    isChecking,
    isAuthenticating,
    error,
    authenticate,
    clearError,
  };
}
