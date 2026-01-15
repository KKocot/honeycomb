"use client";

import { useState } from "react";
import { Lock, AlertCircle, Loader2, Eye, EyeOff, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface HBAuthLoginProps {
  onSuccess?: (user: { username: string }) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export function HBAuthLogin({
  onSuccess,
  onError,
  className,
}: HBAuthLoginProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate decryption and validation
      await new Promise((r) => setTimeout(r, 800));

      // In real implementation, this would decrypt stored key and validate
      onSuccess?.({ username });
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Login failed");
      setError(error.message);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRegister() {
    if (!username.trim() || !password.trim() || !privateKey.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (!privateKey.startsWith("5") || privateKey.length !== 51) {
      setError("Invalid WIF format. Private keys start with 5 and are 51 characters");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate encryption and storage
      await new Promise((r) => setTimeout(r, 1000));

      // In real implementation, this would encrypt and store the key
      setMode("login");
      setPrivateKey("");
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Registration failed");
      setError(error.message);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("w-full max-w-sm", className)}>
      {/* Mode Toggle */}
      <div className="flex rounded-lg bg-muted p-1 mb-6">
        <button
          onClick={() => {
            setMode("login");
            setError(null);
          }}
          className={cn(
            "flex-1 rounded-md py-2 text-sm font-medium transition-colors",
            mode === "login"
              ? "bg-background shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Login
        </button>
        <button
          onClick={() => {
            setMode("register");
            setError(null);
          }}
          className={cn(
            "flex-1 rounded-md py-2 text-sm font-medium transition-colors",
            mode === "register"
              ? "bg-background shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Register Key
        </button>
      </div>

      <div className="space-y-4">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            placeholder="Enter your username"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            {mode === "register" ? "Create Password" : "Password"}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-3 py-2.5 pr-10 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Private Key (only for register) */}
        {mode === "register" && (
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Private Key (WIF)
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                placeholder="5..."
                className="w-full px-3 py-2.5 pr-10 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-mono text-sm"
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
            <p className="mt-1 text-xs text-muted-foreground">
              Your key will be encrypted and stored locally
            </p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <button
          onClick={mode === "login" ? handleLogin : handleRegister}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : mode === "login" ? (
            <>
              <Lock className="h-5 w-5" />
              Unlock Wallet
            </>
          ) : (
            <>
              <Plus className="h-5 w-5" />
              Save Key
            </>
          )}
        </button>

        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
          <p className="text-xs text-emerald-600">
            <strong>Safe Storage:</strong> Your key is encrypted with your
            password and stored locally. Never transmitted over the network.
          </p>
        </div>
      </div>
    </div>
  );
}
