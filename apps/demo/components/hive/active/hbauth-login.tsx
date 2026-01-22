"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Lock, AlertCircle, Loader2, Eye, EyeOff, Plus, Shield, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHiveAuthOptional } from "@/providers/hive-auth-provider";
import type { HiveHBAuthLoginProps, KeyType, HiveLoginResult } from "@/types/auth";
import { createAuthError } from "@/types/auth";
import * as hbAuthService from "@/services/hbauth-service";

type HBAuthStatus = "idle" | "initializing" | "ready" | "registering" | "authenticating" | "success" | "error";

/**
 * HB-Auth Login Component
 */
export function HiveHBAuthLogin({
  onSuccess,
  onError,
  onPending,
  defaultUsername = "",
  keyType = "posting",
  className,
}: HiveHBAuthLoginProps) {
  const [username, setUsername] = useState(defaultUsername);
  const [password, setPassword] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [mode, setMode] = useState<"register" | "login">("register");

  const [status, setStatus] = useState<HBAuthStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [hasRegisteredKeys, setHasRegisteredKeys] = useState(false);
  const [registeredKeyTypes, setRegisteredKeyTypes] = useState<KeyType[]>([]);
  const [debugLog, setDebugLog] = useState<string[]>([]);

  const authContext = useHiveAuthOptional();
  const checkedUsersRef = useRef<Set<string>>(new Set());
  const lastCheckedUserRef = useRef<string>("");

  // Add debug log entry
  const log = useCallback((message: string) => {
    console.log(`[HB-Auth Login] ${message}`);
    setDebugLog(prev => [...prev.slice(-29), `${new Date().toLocaleTimeString()}: ${message}`]);
  }, []);

  // Initialize HB-Auth client using singleton service
  const initClient = useCallback(async () => {
    setStatus("initializing");
    log("Getting singleton HB-Auth client...");

    try {
      const client = await hbAuthService.getOnlineClient();
      log("Client ready");
      setStatus("ready");
      return client;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      log(`Init failed: ${msg}`);
      throw err;
    }
  }, [log]);

  // Check if user has registered keys (only once per user)
  const checkUserKeys = useCallback(async (user: string) => {
    const normalizedUser = user.toLowerCase().trim();
    if (!normalizedUser || lastCheckedUserRef.current === normalizedUser) return;

    lastCheckedUserRef.current = normalizedUser;
    log(`Checking keys for @${normalizedUser}...`);

    try {
      // Use singleton service
      const result = await hbAuthService.getRegisteredUser(normalizedUser);
      const registeredTypes = result?.registeredKeyTypes;

      if (registeredTypes && registeredTypes.length > 0) {
        log(`Found keys: ${registeredTypes.join(", ")}`);
        setHasRegisteredKeys(true);
        setRegisteredKeyTypes(registeredTypes as KeyType[]);
        setMode("login");
      } else {
        log("No saved keys found");
        setHasRegisteredKeys(false);
        setRegisteredKeyTypes([]);
        setMode("register");
      }
    } catch (err) {
      // Silently fail - user can still register
      log(`Check failed: ${err instanceof Error ? err.message : String(err)}`);
      setHasRegisteredKeys(false);
      setRegisteredKeyTypes([]);
    }
  }, [log]);

  // Initialize on mount
  useEffect(() => {
    initClient().catch((err) => {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to initialize");
    });
  }, [initClient]);

  // Check user keys on blur (not on every keystroke)
  const handleUsernameBlur = useCallback(() => {
    if (username.trim() && status === "ready") {
      checkUserKeys(username);
    }
  }, [username, status, checkUserKeys]);

  // Notify parent of pending state
  useEffect(() => {
    const isPending = ["initializing", "registering", "authenticating"].includes(status);
    onPending?.(isPending);
  }, [status, onPending]);

  // Register new key
  const handleRegister = async () => {
    if (!username.trim() || !password.trim() || !privateKey.trim()) {
      setError("All fields are required");
      return;
    }

    if (!privateKey.startsWith("5") || privateKey.length !== 51) {
      setError("Invalid WIF format. Key must start with 5 and be 51 characters.");
      return;
    }

    setStatus("registering");
    setError(null);
    log(`Registering ${keyType} key for @${username}...`);

    try {
      // Use singleton service for registration
      const registerResult = await hbAuthService.registerKey(
        username.toLowerCase(),
        password,
        privateKey,
        keyType
      );
      log(`Register: ${registerResult.ok ? "OK" : "FAILED"}`);

      if (!registerResult.ok) {
        throw new Error(registerResult.error?.message || "Key verification failed");
      }

      log("Authenticating after registration...");
      // Use singleton service for authentication
      const authResult = await hbAuthService.authenticate(username.toLowerCase(), password, keyType);

      if (!authResult.ok) {
        throw new Error("Authentication failed after registration");
      }

      log("Success! Setting status to success...");
      console.log("[HB-Auth Login] Registration complete, setting status to success");
      setStatus("success");
      setHasRegisteredKeys(true);
      setRegisteredKeyTypes(prev => [...new Set([...prev, keyType])]);

      const result: HiveLoginResult = {
        username: username.toLowerCase(),
        loginMethod: "hbauth",
        keyType,
      };

      setPassword("");
      setPrivateKey("");

      console.log("[HB-Auth Login] Calling authContext.login and onSuccess");
      authContext?.login(result);
      onSuccess(result);
      console.log("[HB-Auth Login] onSuccess called successfully");

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      log(`Error: ${msg}`);

      let userMsg = msg;
      if (msg.includes("Beekeeper") || msg.includes("WASM")) {
        userMsg = "Browser not supported. Try Chrome or Firefox.";
      } else if (msg.includes("verify") || msg.includes("match") || msg.includes("authority")) {
        userMsg = `Key doesn't match @${username}'s ${keyType} key on blockchain.`;
      }

      setStatus("error");
      setError(userMsg);
      onError?.(createAuthError("UNKNOWN", userMsg, err instanceof Error ? err : undefined, true));
    }
  };

  // Login with existing key
  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required");
      return;
    }

    setStatus("authenticating");
    setError(null);
    log(`Unlocking @${username}...`);

    try {
      // Use singleton service for authentication
      const authResult = await hbAuthService.authenticate(username.toLowerCase(), password, keyType);

      if (!authResult.ok) {
        throw new Error("Wrong password");
      }

      log("Success!");
      setStatus("success");

      const result: HiveLoginResult = {
        username: username.toLowerCase(),
        loginMethod: "hbauth",
        keyType,
      };

      setPassword("");
      authContext?.login(result);
      onSuccess(result);

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      log(`Error: ${msg}`);
      setStatus("error");
      setError(msg);
      onError?.(createAuthError("UNKNOWN", msg, err instanceof Error ? err : undefined, true));
    }
  };

  const isLoading = ["initializing", "registering", "authenticating"].includes(status);
  const showRegisterMode = mode === "register";

  return (
    <div className={cn("w-full max-w-sm", className)}>
      {/* Header with status */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <div className={cn(
            "h-2 w-2 rounded-full",
            status === "error" ? "bg-red-500" :
            status === "success" ? "bg-green-500" :
            isLoading ? "bg-yellow-500 animate-pulse" :
            status === "ready" ? "bg-green-500" : "bg-gray-400"
          )} />
          <span className="text-muted-foreground">{status}</span>
        </div>
        <button
          type="button"
          onClick={() => setShowDebug(!showDebug)}
          className="text-xs text-muted-foreground hover:text-foreground underline"
        >
          {showDebug ? "Hide" : "Show"} logs
        </button>
      </div>

      {/* Debug panel */}
      {showDebug && (
        <pre className="mb-4 p-2 rounded border border-border bg-muted/50 text-[10px] max-h-32 overflow-auto">
          {debugLog.length === 0 ? "No logs yet" : debugLog.join("\n")}
        </pre>
      )}

      {/* Success */}
      {status === "success" && (
        <div className="text-center py-6">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
          <p className="font-medium text-green-500">Logged in as @{username}</p>
        </div>
      )}

      {/* Form */}
      {status !== "success" && (
        <div className="space-y-4">
          {/* Mode tabs */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => setMode("register")}
              disabled={isLoading}
              className={cn(
                "flex-1 py-2 text-sm font-medium transition-colors",
                showRegisterMode ? "bg-emerald-600 text-white" : "bg-background hover:bg-muted"
              )}
            >
              Register Key
            </button>
            <button
              type="button"
              onClick={() => setMode("login")}
              disabled={isLoading}
              className={cn(
                "flex-1 py-2 text-sm font-medium transition-colors",
                !showRegisterMode ? "bg-emerald-600 text-white" : "bg-background hover:bg-muted"
              )}
            >
              Unlock
            </button>
          </div>

          {hasRegisteredKeys && (
            <p className="text-xs text-emerald-500">
              Saved keys: {registeredKeyTypes.join(", ")}
            </p>
          )}

          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9.-]/g, ""))}
              onBlur={handleUsernameBlur}
              placeholder="your-username"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {showRegisterMode ? "Create Password" : "Password"}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={showRegisterMode ? "Create strong password" : "Your password"}
                className="w-full px-3 py-2 pr-10 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Private Key (register only) */}
          {showRegisterMode && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Private {keyType.charAt(0).toUpperCase() + keyType.slice(1)} Key (WIF)
              </label>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value.trim())}
                  placeholder="5..."
                  className="w-full px-3 py-2 pr-10 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-mono text-sm"
                  disabled={isLoading}
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  tabIndex={-1}
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 text-sm text-red-500 bg-red-500/10 rounded-lg p-3">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={showRegisterMode ? handleRegister : handleLogin}
            disabled={isLoading || !username.trim() || !password.trim() || (showRegisterMode && !privateKey.trim())}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {status === "initializing" && "Loading..."}
                {status === "registering" && "Saving..."}
                {status === "authenticating" && "Unlocking..."}
              </>
            ) : showRegisterMode ? (
              <>
                <Plus className="h-5 w-5" />
                Save Key
              </>
            ) : (
              <>
                <Lock className="h-5 w-5" />
                Unlock
              </>
            )}
          </button>

          {/* Info */}
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Shield className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>Key encrypted locally. Never sent to any server.</span>
          </div>
        </div>
      )}
    </div>
  );
}
