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

// PeakVault type declaration
declare global {
  interface Window {
    peakvault?: {
      requestSignBuffer: (
        username: string,
        message: string,
        keyType: "Posting" | "Active" | "Memo",
        callback: (response: { success: boolean; result?: string; message?: string }) => void
      ) => void;
      requestBroadcast?: (
        username: string,
        operations: [string, Record<string, unknown>][],
        keyType: "Posting" | "Active",
        callback: (response: { success: boolean; result?: string; message?: string; error?: string }) => void
      ) => void;
    };
  }
}

/**
 * Check if PeakVault extension is installed
 */
export function hasPeakVault(): boolean {
  return typeof window !== "undefined" && !!window.peakvault;
}

/**
 * Headless hook for PeakVault authentication
 *
 * Use this for custom login UIs or when you need more control.
 * For a ready-to-use component, use HivePeakVaultLogin instead.
 *
 * @example
 * ```tsx
 * function CustomPeakVaultLogin() {
 *   const { isAvailable, isAuthenticating, authenticate, error } = usePeakVaultAuth();
 *
 *   if (!isAvailable) return <p>Please install PeakVault</p>;
 *
 *   return (
 *     <button
 *       onClick={() => authenticate("myusername")}
 *       disabled={isAuthenticating}
 *     >
 *       {isAuthenticating ? "Signing..." : "Login with PeakVault"}
 *     </button>
 *   );
 * }
 * ```
 */
export function usePeakVaultAuth(keyType: KeyType = "posting"): UseHiveAuthMethodReturn {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<HiveAuthError | null>(null);

  // Check if PeakVault is available
  useEffect(() => {
    const checkAvailability = () => {
      const available = hasPeakVault();
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
      if (!window.peakvault) {
        const err = createAuthError(
          "EXTENSION_NOT_FOUND",
          "PeakVault extension not found. Please install it from peakd.com",
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

        // Map key type to PeakVault format
        const peakVaultKeyType = keyType.charAt(0).toUpperCase() + keyType.slice(1) as "Posting" | "Active" | "Memo";

        // Request signature from PeakVault
        const signature = await new Promise<string>((resolve, reject) => {
          window.peakvault!.requestSignBuffer(
            username.toLowerCase(),
            challenge,
            peakVaultKeyType,
            (response) => {
              if (response.success && response.result) {
                resolve(response.result);
              } else {
                reject(new Error(response.message || "PeakVault signing failed"));
              }
            }
          );
        });

        const result: HiveLoginResult = {
          username: username.toLowerCase(),
          loginMethod: "peakvault",
          keyType,
          publicKey: undefined,
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
