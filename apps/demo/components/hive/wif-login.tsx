"use client";

import { useState } from "react";
import { FileKey, AlertCircle, Loader2, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WIFLoginProps {
  onSuccess?: (user: { username: string }) => void;
  onError?: (error: Error) => void;
  keyType?: "posting" | "active";
  className?: string;
}

export function WIFLogin({
  onSuccess,
  onError,
  keyType = "posting",
  className,
}: WIFLoginProps) {
  const [username, setUsername] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);

  function validateWIF(wif: string): boolean {
    return wif.startsWith("5") && wif.length === 51;
  }

  async function handleLogin() {
    if (!username.trim() || !privateKey.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (!validateWIF(privateKey)) {
      setError("Invalid WIF format. Private keys start with 5 and are 51 characters");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // In real implementation, validate key against account
      await new Promise((r) => setTimeout(r, 500));

      onSuccess?.({ username });
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Login failed");
      setError(error.message);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }

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
              Consider using Keychain or HiveAuth instead.
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
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            placeholder="Enter your username"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Private {keyType === "active" ? "Active" : "Posting"} Key (WIF)
          </label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              placeholder="5..."
              className="w-full px-3 py-2.5 pr-10 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-orange-500/50 font-mono text-sm"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showKey ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={isLoading || !username.trim() || !privateKey.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-orange-600 text-white font-medium hover:bg-orange-700 disabled:opacity-50"
        >
          {isLoading ? (
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
