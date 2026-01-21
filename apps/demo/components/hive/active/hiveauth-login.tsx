"use client";

import { useState, useEffect } from "react";
import { Smartphone, Loader2, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHiveAuthAuth } from "@/hooks/auth";
import { useHiveAuthOptional } from "@/providers/hive-auth-provider";
import type { HiveAuthLoginProps } from "@/types/auth";

/**
 * HiveAuth Login Component
 *
 * Login using the HiveAuth mobile app by scanning a QR code.
 * Works standalone (with callbacks) or with HiveAuthProvider.
 *
 * Flow:
 * 1. User enters username
 * 2. QR code is displayed
 * 3. User scans QR with HiveAuth mobile app
 * 4. User approves on phone
 * 5. Login completes
 *
 * @example
 * ```tsx
 * <HiveAuthLogin
 *   onSuccess={(result) => console.log("Logged in:", result.username)}
 *   onError={(error) => console.error(error.message)}
 *   appName="My Hive App"
 * />
 * ```
 */
export function HiveAuthLogin({
  onSuccess,
  onError,
  onPending,
  defaultUsername = "",
  appName = "Hive UI",
  keyType = "posting",
  className,
}: HiveAuthLoginProps) {
  const [username, setUsername] = useState(defaultUsername);

  const {
    state,
    isAuthenticating,
    qrCodeData,
    error: hookError,
    authenticate,
    cancel,
    reset,
  } = useHiveAuthAuth(appName, keyType);

  const authContext = useHiveAuthOptional();

  // Notify parent of pending state changes
  useEffect(() => {
    onPending?.(isAuthenticating);
  }, [isAuthenticating, onPending]);

  async function handleLogin() {
    if (!username.trim()) return;

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
    }
  }

  function handleCancel() {
    cancel();
  }

  function handleReset() {
    reset();
  }

  // Idle state - show username input
  if (state === "idle") {
    return (
      <div className={cn("w-full max-w-sm", className)}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Hive Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="Enter your username"
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-hive-red/50"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={!username.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-hive-red text-white font-medium hover:bg-hive-red/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Smartphone className="h-5 w-5" />
            Login with HiveAuth
          </button>

          <p className="text-center text-xs text-muted-foreground">
            Scan QR code with HiveAuth mobile app
          </p>
        </div>
      </div>
    );
  }

  // Connecting state
  if (state === "connecting") {
    return (
      <div className={cn("w-full max-w-sm", className)}>
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Connecting to HiveAuth...</p>
        </div>
      </div>
    );
  }

  // Waiting for scan - show QR code
  if (state === "waiting_for_scan" && qrCodeData) {
    return (
      <div className={cn("w-full max-w-sm", className)}>
        <div className="text-center space-y-4">
          {/* QR Code */}
          <div className="mx-auto w-48 h-48 bg-white rounded-lg p-4 flex items-center justify-center relative">
            {/* Simple QR placeholder - in production use a QR library */}
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({ length: 49 }).map((_, i) => {
                // Generate deterministic pattern from qrCodeData
                const hash = qrCodeData.charCodeAt(i % qrCodeData.length) + i;
                const isBlack = hash % 3 !== 0;
                return (
                  <div
                    key={i}
                    className={cn(
                      "w-5 h-5 rounded-sm",
                      isBlack ? "bg-black" : "bg-white"
                    )}
                  />
                );
              })}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white p-1 rounded">
                <Smartphone className="h-6 w-6 text-hive-red" />
              </div>
            </div>
          </div>

          <div>
            <p className="font-medium">Scan with HiveAuth app</p>
            <p className="text-sm text-muted-foreground mt-1">
              Open HiveAuth on your phone and scan this QR code
            </p>
          </div>

          <button
            onClick={handleCancel}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Waiting for approval
  if (state === "waiting_for_approval") {
    return (
      <div className={cn("w-full max-w-sm", className)}>
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-hive-red" />
          <p className="font-medium">Confirm on your phone</p>
          <p className="text-sm text-muted-foreground">
            Check your HiveAuth app and approve the login request
          </p>
          <button
            onClick={handleCancel}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Success state
  if (state === "success") {
    return (
      <div className={cn("w-full max-w-sm", className)}>
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
            <svg
              className="h-8 w-8 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="font-medium text-green-500">Login Successful!</p>
          <p className="text-sm text-muted-foreground">
            Welcome back, @{username}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (state === "error") {
    return (
      <div className={cn("w-full max-w-sm", className)}>
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <p className="font-medium text-red-500">Login Failed</p>
          <p className="text-sm text-muted-foreground">
            {hookError?.message || "An error occurred"}
          </p>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg bg-muted text-sm font-medium hover:bg-muted/80"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
}
