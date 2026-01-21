"use client";

import { useState } from "react";
import { Key, Check, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useKeychainAuth } from "@/hooks/auth";
import { useHiveAuthOptional } from "@/providers/hive-auth-provider";
import type { HiveKeychainLoginProps } from "@/types/auth";

/**
 * Hive Keychain Login Component
 *
 * Login using the Hive Keychain browser extension.
 * Works standalone (with callbacks) or with HiveAuthProvider.
 *
 * @example Standalone usage (no provider required)
 * ```tsx
 * function MyLogin() {
 *   return (
 *     <HiveKeychainLogin
 *       onSuccess={(result) => {
 *         console.log("Logged in as", result.username);
 *         // Handle login in your app
 *       }}
 *       onError={(error) => {
 *         console.error("Login failed:", error.message);
 *       }}
 *     />
 *   );
 * }
 * ```
 *
 * @example With HiveAuthProvider
 * ```tsx
 * function App() {
 *   return (
 *     <HiveAuthProvider>
 *       <HiveKeychainLogin
 *         onSuccess={(result) => {
 *           // Provider automatically updates user state
 *           router.push("/dashboard");
 *         }}
 *       />
 *     </HiveAuthProvider>
 *   );
 * }
 * ```
 */
export function HiveKeychainLogin({
  onSuccess,
  onError,
  onPending,
  defaultUsername = "",
  keyType = "posting",
  className,
}: HiveKeychainLoginProps) {
  const [username, setUsername] = useState(defaultUsername);

  // Headless hook for auth logic
  const {
    isAvailable,
    isChecking,
    isAuthenticating,
    error: hookError,
    authenticate,
    clearError,
  } = useKeychainAuth(keyType);

  // Optional provider integration
  const authContext = useHiveAuthOptional();

  async function handleLogin() {
    if (!username.trim()) return;

    onPending?.(true);
    clearError();

    try {
      const result = await authenticate(username);

      // If provider is available, update its state
      if (authContext) {
        authContext.login(result);
      }

      onSuccess(result);
    } catch (err) {
      // Error is already set in the hook
      if (hookError) {
        onError?.(hookError);
      }
    } finally {
      onPending?.(false);
    }
  }

  // Loading state while checking extension
  if (isChecking) {
    return (
      <div className={cn("w-full max-w-sm flex justify-center py-8", className)}>
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Extension not installed
  if (isAvailable === false) {
    return (
      <div className={cn("w-full max-w-sm", className)}>
        <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-orange-500">Keychain Not Detected</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Install the Hive Keychain browser extension to continue.
              </p>
              <a
                href="https://hive-keychain.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm text-orange-500 hover:underline"
              >
                Get Hive Keychain
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-sm", className)}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Hive Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value.toLowerCase());
              clearError();
            }}
            placeholder="Enter your username"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-hive-red/50"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            disabled={isAuthenticating}
          />
        </div>

        {hookError && (
          <div className="flex items-center gap-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            {hookError.message}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={isAuthenticating || !username.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-hive-red text-white font-medium hover:bg-hive-red/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAuthenticating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Key className="h-5 w-5" />
              Login with Keychain
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Check className="h-3 w-3 text-green-500" />
          Keychain detected
        </div>
      </div>
    </div>
  );
}
