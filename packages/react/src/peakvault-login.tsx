"use client";

import { useState, useCallback } from "react";
import type { LoginProps } from "./types";
import { cn } from "./utils";

export interface PeakVaultLoginProps extends LoginProps {
  /** Key type to use for signing (default: "Posting") */
  keyType?: "Posting" | "Active";
  /** Custom button text */
  buttonText?: string;
  /** Show loading spinner */
  showSpinner?: boolean;
}

/**
 * Check if PeakVault extension is available
 */
export function hasPeakVault(): boolean {
  if (typeof window === "undefined") return false;
  return !!window.peakvault?.requestSignBuffer;
}

/**
 * PeakVault Login Component
 *
 * Provides authentication using the PeakVault browser extension from PeakD.
 * SSR-compatible - renders safely on server, functionality activates on client.
 *
 * @example
 * ```tsx
 * <PeakVaultLogin
 *   onSuccess={(username) => console.log('Logged in:', username)}
 *   onError={(error) => console.error(error)}
 * />
 * ```
 */
export function PeakVaultLogin({
  onSuccess,
  onError,
  className,
  keyType = "Posting",
  buttonText = "Login with PeakVault",
  showSpinner = true,
}: PeakVaultLoginProps) {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const trimmedUsername = username.trim().toLowerCase();

      if (!trimmedUsername) {
        setError("Please enter your username");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Check if PeakVault is installed
        if (!hasPeakVault()) {
          throw new Error("PeakVault extension is not installed");
        }

        const message = `Login to app at ${Date.now()}`;

        window.peakvault!.requestSignBuffer(
          trimmedUsername,
          message,
          keyType,
          (response) => {
            setIsLoading(false);

            if (response.success) {
              onSuccess?.(trimmedUsername);
            } else {
              const err = new Error(response.message || "Login failed");
              setError(err.message);
              onError?.(err);
            }
          }
        );
      } catch (err) {
        setIsLoading(false);
        const error = err instanceof Error ? err : new Error("Login failed");
        setError(error.message);
        onError?.(error);
      }
    },
    [username, keyType, onSuccess, onError]
  );

  return (
    <form onSubmit={handleLogin} className={cn("space-y-4", className)}>
      {error && (
        <div className="text-sm text-red-500 bg-red-500/10 px-3 py-2 rounded">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="peakvault-username"
          className="block text-sm font-medium mb-1.5"
        >
          Hive Username
        </label>
        <input
          id="peakvault-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          disabled={isLoading}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-hive-red/50 disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-hive-red text-white font-medium transition-colors hover:bg-hive-red/90 disabled:opacity-50"
      >
        {isLoading && showSpinner ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Connecting...
          </>
        ) : (
          <>
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z" />
              <path d="M2 9v1c0 1.1.9 2 2 2h1" />
              <path d="M16 11h0" />
            </svg>
            {buttonText}
          </>
        )}
      </button>
    </form>
  );
}
