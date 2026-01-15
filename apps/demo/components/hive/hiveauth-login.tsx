"use client";

import { useState } from "react";
import { Smartphone, Loader2, AlertCircle, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

interface HiveAuthLoginProps {
  onSuccess?: (user: { username: string }) => void;
  onError?: (error: Error) => void;
  className?: string;
}

type AuthState = "idle" | "pending" | "scanning" | "confirming" | "success" | "error";

export function HiveAuthLogin({
  onSuccess,
  onError,
  className,
}: HiveAuthLoginProps) {
  const [username, setUsername] = useState("");
  const [state, setState] = useState<AuthState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [qrData, setQrData] = useState<string | null>(null);

  async function handleLogin() {
    if (!username.trim()) {
      setError("Please enter your username");
      return;
    }

    setError(null);
    setState("pending");

    try {
      // Generate a unique challenge
      const challenge = `hiveauth://${username}/${Date.now()}`;
      setQrData(challenge);
      setState("scanning");

      // In real implementation, this would connect to HiveAuth WebSocket
      // For demo, we simulate the flow
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
    setQrData(null);
    setError(null);
  };

  return (
    <div className={cn("w-full max-w-sm", className)}>
      {state === "idle" && (
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
            {/* QR Code placeholder - in real app use qrcode library */}
            <div className="grid grid-cols-5 gap-1">
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-6 h-6 rounded-sm",
                    Math.random() > 0.4 ? "bg-black" : "bg-white"
                  )}
                />
              ))}
            </div>
          </div>
          <p className="font-medium">Scan with HiveAuth app</p>
          <p className="text-sm text-muted-foreground">
            Open HiveAuth on your phone and scan this QR code
          </p>
          <button
            onClick={reset}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      )}

      {state === "confirming" && (
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-hive-red" />
          <p className="font-medium">Confirm on your phone</p>
          <p className="text-sm text-muted-foreground">
            Check your HiveAuth app and approve the login request
          </p>
        </div>
      )}

      {state === "success" && (
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
      )}

      {state === "error" && (
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <p className="font-medium text-red-500">Login Failed</p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-muted text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {state === "pending" && (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Generating QR code...</p>
        </div>
      )}
    </div>
  );
}
