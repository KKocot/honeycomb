"use client";

import { useState, useEffect } from "react";
import { Key, Check, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    hive_keychain?: {
      requestSignBuffer: (
        username: string,
        message: string,
        keyType: "Posting" | "Active" | "Memo",
        callback: (response: { success: boolean; result?: string; message?: string }) => void
      ) => void;
    };
  }
}

interface KeychainLoginProps {
  onSuccess?: (user: { username: string }) => void;
  onError?: (error: Error) => void;
  keyType?: "posting" | "active";
  className?: string;
}

export function HiveKeychainLogin({
  onSuccess,
  onError,
  keyType = "posting",
  className,
}: KeychainLoginProps) {
  const [username, setUsername] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkKeychain = () => {
      setIsAvailable(!!window.hive_keychain);
    };
    checkKeychain();
    const timer = setTimeout(checkKeychain, 500);
    return () => clearTimeout(timer);
  }, []);

  async function handleLogin() {
    if (!window.hive_keychain) {
      setError("Keychain extension not found");
      onError?.(new Error("Keychain extension not found"));
      return;
    }

    if (!username.trim()) {
      setError("Please enter your username");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const challenge = `Login to demo at ${Date.now()}`;

      await new Promise<void>((resolve, reject) => {
        window.hive_keychain!.requestSignBuffer(
          username,
          challenge,
          keyType === "active" ? "Active" : "Posting",
          (response) => {
            if (response.success) {
              resolve();
            } else {
              reject(new Error(response.message || "Keychain signing failed"));
            }
          }
        );
      });

      onSuccess?.({ username });
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Login failed");
      setError(error.message);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }

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

  if (isAvailable === null) {
    return (
      <div className={cn("w-full max-w-sm flex justify-center py-8", className)}>
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
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
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            placeholder="Enter your username"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-hive-red/50"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={isLoading || !username.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-hive-red text-white font-medium hover:bg-hive-red/90 disabled:opacity-50"
        >
          {isLoading ? (
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
