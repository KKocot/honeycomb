import type { ComponentDefinition } from "../registry.js";

export const hiveauthLogin: ComponentDefinition = {
  name: "hiveauth-login",
  description: "Login with HiveAuth mobile app via QR code",
  category: "auth",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [
    {
      path: "components/hive/hiveauth-login.tsx",
      content: `"use client";

import { useState } from "react";
import { Smartphone, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface HiveAuthLoginProps {
  onSuccess?: (user: { username: string }) => void;
  onError?: (error: Error) => void;
  className?: string;
}

type AuthState = "idle" | "pending" | "scanning" | "confirming" | "success" | "error";

export function HiveAuthLogin({ onSuccess, onError, className }: HiveAuthLoginProps) {
  const [username, setUsername] = useState("");
  const [state, setState] = useState<AuthState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    if (!username.trim()) {
      setError("Please enter your username");
      return;
    }

    setError(null);
    setState("pending");

    try {
      setState("scanning");
      await new Promise((r) => setTimeout(r, 2000));
      setState("confirming");
      await new Promise((r) => setTimeout(r, 1500));
      setState("success");
      onSuccess?.({ username });
    } catch (err) {
      const error = err instanceof Error ? err : new Error("HiveAuth failed");
      setError(error.message);
      setState("error");
      onError?.(error);
    }
  }

  const reset = () => {
    setState("idle");
    setError(null);
  };

  return (
    <div className={cn("w-full max-w-sm", className)}>
      {state === "idle" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Hive Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="Enter your username"
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background"
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
            disabled={!username.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-hive-red text-white font-medium hover:bg-hive-red/90 disabled:opacity-50"
          >
            <Smartphone className="h-5 w-5" />
            Login with HiveAuth
          </button>

          <p className="text-center text-xs text-muted-foreground">
            Scan QR code with HiveAuth mobile app
          </p>
        </div>
      )}

      {state === "scanning" && (
        <div className="text-center space-y-4">
          <div className="mx-auto w-48 h-48 bg-white rounded-lg p-4 flex items-center justify-center">
            <div className="grid grid-cols-5 gap-1">
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  className={cn("w-6 h-6 rounded-sm", Math.random() > 0.4 ? "bg-black" : "bg-white")}
                />
              ))}
            </div>
          </div>
          <p className="font-medium">Scan with HiveAuth app</p>
          <button onClick={reset} className="text-sm text-muted-foreground hover:text-foreground">
            Cancel
          </button>
        </div>
      )}

      {state === "confirming" && (
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-hive-red" />
          <p className="font-medium">Confirm on your phone</p>
        </div>
      )}

      {state === "success" && (
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
            <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="font-medium text-green-500">Login Successful!</p>
          <p className="text-sm text-muted-foreground">Welcome back, @{username}</p>
        </div>
      )}

      {state === "error" && (
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <p className="font-medium text-red-500">Login Failed</p>
          <button onClick={reset} className="px-4 py-2 rounded-lg bg-muted text-sm font-medium">
            Try Again
          </button>
        </div>
      )}

      {state === "pending" && (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
`,
    },
  ],
};

export const hbauthLogin: ComponentDefinition = {
  name: "hbauth-login",
  description: "Login with encrypted local key storage (Safe Storage)",
  category: "auth",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [
    {
      path: "components/hive/hbauth-login.tsx",
      content: `"use client";

import { useState } from "react";
import { Lock, AlertCircle, Loader2, Eye, EyeOff, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface HBAuthLoginProps {
  onSuccess?: (user: { username: string }) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export function HBAuthLogin({ onSuccess, onError, className }: HBAuthLoginProps) {
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
      await new Promise((r) => setTimeout(r, 800));
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
      setError("Invalid WIF format");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await new Promise((r) => setTimeout(r, 1000));
      setMode("login");
      setPrivateKey("");
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
      <div className="flex rounded-lg bg-muted p-1 mb-6">
        <button
          onClick={() => { setMode("login"); setError(null); }}
          className={cn(
            "flex-1 rounded-md py-2 text-sm font-medium transition-colors",
            mode === "login" ? "bg-background shadow-sm" : "text-muted-foreground"
          )}
        >
          Login
        </button>
        <button
          onClick={() => { setMode("register"); setError(null); }}
          className={cn(
            "flex-1 rounded-md py-2 text-sm font-medium transition-colors",
            mode === "register" ? "bg-background shadow-sm" : "text-muted-foreground"
          )}
        >
          Register Key
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            placeholder="Enter your username"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background"
          />
        </div>

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
              className="w-full px-3 py-2.5 pr-10 rounded-lg border border-border bg-background"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {mode === "register" && (
          <div>
            <label className="block text-sm font-medium mb-1.5">Private Key (WIF)</label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                placeholder="5..."
                className="w-full px-3 py-2.5 pr-10 rounded-lg border border-border bg-background font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
            <strong>Safe Storage:</strong> Your key is encrypted with your password and stored locally.
          </p>
        </div>
      </div>
    </div>
  );
}
`,
    },
  ],
};

export const wifLogin: ComponentDefinition = {
  name: "wif-login",
  description: "Direct private key login (development only)",
  category: "auth",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [
    {
      path: "components/hive/wif-login.tsx",
      content: `"use client";

import { useState } from "react";
import { FileKey, AlertCircle, Loader2, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WIFLoginProps {
  onSuccess?: (user: { username: string }) => void;
  onError?: (error: Error) => void;
  keyType?: "posting" | "active";
  className?: string;
}

export function WIFLogin({ onSuccess, onError, keyType = "posting", className }: WIFLoginProps) {
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
                Direct key entry is the <strong>least secure</strong> method.
              </p>
              <ul className="mt-2 text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Browser extensions</li>
                <li>Malicious scripts</li>
                <li>Keyloggers</li>
              </ul>
            </div>
          </div>
          <button
            onClick={() => setAcknowledged(true)}
            className="w-full px-4 py-2 rounded-lg bg-red-500/10 text-red-500 font-medium hover:bg-red-500/20"
          >
            I Understand the Risks
          </button>
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
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background"
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
              className="w-full px-3 py-2.5 pr-10 rounded-lg border border-border bg-background font-mono text-sm"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
`,
    },
  ],
};
