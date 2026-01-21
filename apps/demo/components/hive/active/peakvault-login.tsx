"use client";

import { useState } from "react";
import { Wallet, Check, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePeakVaultAuth } from "@/hooks/auth";
import { useHiveAuthOptional } from "@/providers/hive-auth-provider";
import type { HivePeakVaultLoginProps } from "@/types/auth";

/**
 * PeakVault Login Component
 *
 * Login using the PeakVault browser extension (from PeakD).
 * Works standalone (with callbacks) or with HiveAuthProvider.
 *
 * @example Standalone usage
 * ```tsx
 * <HivePeakVaultLogin
 *   onSuccess={(result) => console.log("Logged in:", result.username)}
 *   onError={(error) => console.error(error.message)}
 * />
 * ```
 */
export function HivePeakVaultLogin({
  onSuccess,
  onError,
  onPending,
  defaultUsername = "",
  keyType = "posting",
  className,
}: HivePeakVaultLoginProps) {
  const [username, setUsername] = useState(defaultUsername);

  const {
    isAvailable,
    isChecking,
    isAuthenticating,
    error: hookError,
    authenticate,
    clearError,
  } = usePeakVaultAuth(keyType);

  const authContext = useHiveAuthOptional();

  async function handleLogin() {
    if (!username.trim()) return;

    onPending?.(true);
    clearError();

    try {
      const result = await authenticate(username);

      if (authContext) {
        authContext.login(result);
      }

      onSuccess(result);
    } catch (err) {
      if (hookError) {
        onError?.(hookError);
      }
    } finally {
      onPending?.(false);
    }
  }

  if (isChecking) {
    return (
      <div className={cn("w-full max-w-sm flex justify-center py-8", className)}>
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isAvailable === false) {
    return (
      <div className={cn("w-full max-w-sm", className)}>
        <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-orange-500">PeakVault Not Detected</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Install the PeakVault browser extension to continue.
              </p>
              <a
                href="https://peakd.com/me/wallet?vault=true"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm text-orange-500 hover:underline"
              >
                Get PeakVault
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
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAuthenticating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="h-5 w-5" />
              Login with PeakVault
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Check className="h-3 w-3 text-green-500" />
          PeakVault detected
        </div>
      </div>
    </div>
  );
}
