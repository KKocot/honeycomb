"use client";

import { useState, useCallback } from "react";
import type { LoginProps } from "./types";
import { cn } from "./utils";

export interface KeychainLoginProps extends LoginProps {
  /** Key type to use for signing (default: "Posting") */
  keyType?: "Posting" | "Active";
  /** Custom button text */
  buttonText?: string;
  /** Show loading spinner */
  showSpinner?: boolean;
}

/**
 * Check if Hive Keychain extension is available
 */
export function hasKeychain(): boolean {
  if (typeof window === "undefined") return false;
  return !!window.hive_keychain?.requestSignBuffer;
}

/**
 * Keychain Login Component
 *
 * Provides authentication using the Hive Keychain browser extension.
 * SSR-compatible - renders safely on server, functionality activates on client.
 *
 * @example
 * ```tsx
 * <KeychainLogin
 *   onSuccess={(username) => console.log('Logged in:', username)}
 *   onError={(error) => console.error(error)}
 * />
 * ```
 */
export function KeychainLogin({
  onSuccess,
  onError,
  className,
  keyType = "Posting",
  buttonText = "Login with Keychain",
  showSpinner = true,
}: KeychainLoginProps) {
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
        // Check if Keychain is installed
        if (!hasKeychain()) {
          throw new Error("Hive Keychain extension is not installed");
        }

        const message = `Login to app at ${Date.now()}`;

        window.hive_keychain!.requestSignBuffer(
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
          htmlFor="keychain-username"
          className="block text-sm font-medium mb-1.5"
        >
          Hive Username
        </label>
        <input
          id="keychain-username"
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
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
            </svg>
            {buttonText}
          </>
        )}
      </button>
    </form>
  );
}
