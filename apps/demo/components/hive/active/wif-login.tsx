"use client";

import { useState } from "react";
import { FileKey, AlertCircle, Loader2, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWifAuth } from "@/hooks/auth";
import { useHiveAuthOptional } from "@/providers/hive-auth-provider";
import type { HiveWIFLoginProps } from "@/types/auth";

/**
 * WIF Login Component
 *
 * Login by directly entering a WIF (Wallet Import Format) private key.
 *
 * WARNING: This is the LEAST SECURE method of authentication.
 * Use only for development/testing or when no other option is available.
 *
 * The key is NOT stored - it's only used for the current session.
 * Consider using HB-Auth for secure local key storage instead.
 *
 * @example
 * ```tsx
 * <HiveWIFLogin
 *   onSuccess={(result) => console.log("Logged in:", result.username)}
 *   onError={(error) => console.error(error.message)}
 * />
 * ```
 */
export function HiveWIFLogin({
  onSuccess,
  onError,
  onPending,
  defaultUsername = "",
  keyType = "posting",
  className,
}: HiveWIFLoginProps) {
  const [username, setUsername] = useState(defaultUsername);
  const [privateKey, setPrivateKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  const {
    isAuthenticating,
    error: hookError,
    authenticate,
    clearError,
  } = useWifAuth(keyType);

  const authContext = useHiveAuthOptional();

  async function handleLogin() {
    if (!username.trim() || !privateKey.trim()) return;

    onPending?.(true);
    clearError();

    try {
      const result = await authenticate(username, privateKey);

      if (authContext) {
        authContext.login(result);
      }

      // Clear the key from memory immediately after successful login
      setPrivateKey("");

      onSuccess(result);
    } catch (err) {
      if (hookError) {
        onError?.(hookError);
      }
    } finally {
      onPending?.(false);
    }
  }

  // Security warning screen
  if (!acknowledged) {
    return (
      <div className={cn("w-full max-w-sm", className)}>
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 space-y-4">
          <div className="flex gap-3">
            <AlertTriangle className="h-6 w-6 text-red-500 shrink-0" />
            <div>
              <p className="font-semibold text-red-500">Security Warning</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Direct key entry is the <strong>least secure</strong> method of
                authentication. Your private key could be exposed to:
              </p>
              <ul className="mt-2 text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Browser extensions</li>
                <li>Malicious scripts</li>
                <li>Clipboard managers</li>
                <li>Keyloggers</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-red-500/20 pt-4">
            <p className="text-sm text-muted-foreground mb-3">
              Only use this method for testing or if you understand the risks.
              Consider using <strong>Keychain</strong> or <strong>HB-Auth</strong> instead.
            </p>
            <button
              onClick={() => setAcknowledged(true)}
              className="w-full px-4 py-2 rounded-lg bg-red-500/10 text-red-500 font-medium hover:bg-red-500/20"
            >
              I Understand the Risks
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-sm", className)}>
      {/* Persistent warning */}
      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 mb-4">
        <p className="text-xs text-red-500 font-medium flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Direct key entry - Use with caution
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value.toLowerCase());
              clearError();
            }}
            placeholder="Enter your username"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            disabled={isAuthenticating}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Private {keyType.charAt(0).toUpperCase() + keyType.slice(1)} Key (WIF)
          </label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={privateKey}
              onChange={(e) => {
                setPrivateKey(e.target.value);
                clearError();
              }}
              placeholder="5..."
              className="w-full px-3 py-2.5 pr-10 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-orange-500/50 font-mono text-sm"
              disabled={isAuthenticating}
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showKey ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Your key is never stored or transmitted
          </p>
        </div>

        {hookError && (
          <div className="flex items-center gap-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            {hookError.message}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={isAuthenticating || !username.trim() || !privateKey.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-orange-600 text-white font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAuthenticating ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <FileKey className="h-5 w-5" />
              Login with Private Key
            </>
          )}
        </button>
      </div>
    </div>
  );
}
