"use client";

import { useState, useCallback, useRef } from "react";
import {
  HiveLoginResult,
  HiveAuthError,
  KeyType,
  createAuthError,
  mapErrorToAuthError,
} from "@/types/auth";

/**
 * HB-Auth modes
 */
export type HBAuthMode = "login" | "register";

/**
 * Return type for HB-Auth hook
 */
export interface UseHBAuthReturn {
  /** Current mode (login or register) */
  mode: HBAuthMode;
  /** Set the mode */
  setMode: (mode: HBAuthMode) => void;
  /** Whether we're checking if user is registered */
  isChecking: boolean;
  /** Whether user has registered keys */
  hasRegisteredKeys: boolean;
  /** Registered key types for current user */
  registeredKeyTypes: KeyType[];
  /** Whether auth is in progress */
  isAuthenticating: boolean;
  /** Current error if any */
  error: HiveAuthError | null;
  /** Check if user has keys in safe storage */
  checkUser: (username: string) => Promise<boolean>;
  /** Login with existing safe storage key */
  login: (username: string, password: string, keyType?: KeyType) => Promise<HiveLoginResult>;
  /** Register new key to safe storage */
  register: (username: string, password: string, wifKey: string, keyType?: KeyType) => Promise<HiveLoginResult>;
  /** Clear error state */
  clearError: () => void;
}

// HB-Auth service singleton
let hbAuthService: HBAuthServiceType | null = null;
let hbAuthInitAttempted = false;

interface HBAuthServiceType {
  getOnlineClient: () => Promise<HBAuthClient>;
}

interface HBAuthClient {
  getRegisteredUsers: () => Promise<Array<{ username: string; registeredKeyTypes: KeyType[] }>>;
  getRegisteredUserByUsername: (username: string) => Promise<{
    username: string;
    registeredKeyTypes: KeyType[];
    unlocked: boolean;
    loggedInKeyType?: KeyType;
  } | null>;
  authenticate: (username: string, password: string, keyType: KeyType) => Promise<{ ok: boolean }>;
  register: (username: string, password: string, wifKey: string, keyType: KeyType) => Promise<void>;
  logout: (username: string) => Promise<void>;
  sign: (username: string, digest: string, keyType: KeyType) => Promise<string>;
}

/**
 * Check if HB-Auth is available
 * Returns true if @hiveio/hb-auth package is installed
 */
export function isHBAuthAvailable(): boolean {
  return hbAuthService !== null;
}

/**
 * Initialize HB-Auth service
 * This should be called once at app startup
 *
 * Requires:
 * - @hiveio/hb-auth package installed
 * - worker.js copied to public/auth/worker.js
 */
export async function initHBAuth(): Promise<HBAuthServiceType | null> {
  if (hbAuthService) return hbAuthService;
  if (hbAuthInitAttempted) return null;

  hbAuthInitAttempted = true;

  try {
    // Dynamic import of @hiveio/hb-auth
    const { OnlineClient } = await import("@hiveio/hb-auth");

    console.log("[HB-Auth] Creating OnlineClient...");

    // Create and initialize online client
    // OnlineClient needs a node endpoint to verify keys against the blockchain
    const client = await new OnlineClient({
      workerUrl: "/auth/worker.js",
      node: "https://api.openhive.network",
      chainId: "beeab0de00000000000000000000000000000000000000000000000000000000",
    }).initialize();

    console.log("[HB-Auth] OnlineClient initialized");

    hbAuthService = {
      getOnlineClient: async () => client as unknown as HBAuthClient,
    };

    console.info("[HB-Auth] Service ready");
    return hbAuthService;
  } catch (err) {
    // HB-Auth is not available - this is expected if the package isn't installed
    console.error("[HB-Auth] Initialization failed:", err);
    return null;
  }
}

/**
 * Headless hook for HB-Auth (Safe Storage) authentication
 *
 * HB-Auth stores encrypted private keys locally in the browser.
 * Keys are encrypted with a user-provided password.
 *
 * Requires @hiveio/hb-auth package and worker.js in public/auth/
 *
 * @example
 * ```tsx
 * function HBAuthLogin() {
 *   const {
 *     mode, setMode,
 *     hasRegisteredKeys,
 *     login, register,
 *     error
 *   } = useHBAuthAuth();
 *
 *   if (mode === "register" || !hasRegisteredKeys) {
 *     return (
 *       <form onSubmit={() => register(username, password, wifKey)}>
 *         <input placeholder="Username" />
 *         <input type="password" placeholder="Create password" />
 *         <input type="password" placeholder="Your posting WIF key" />
 *         <button>Register Key</button>
 *       </form>
 *     );
 *   }
 *
 *   return (
 *     <form onSubmit={() => login(username, password)}>
 *       <input placeholder="Username" />
 *       <input type="password" placeholder="Password" />
 *       <button>Unlock Wallet</button>
 *     </form>
 *   );
 * }
 * ```
 */
export function useHBAuthAuth(): UseHBAuthReturn {
  const [mode, setMode] = useState<HBAuthMode>("login");
  const [isChecking, setIsChecking] = useState(false);
  const [hasRegisteredKeys, setHasRegisteredKeys] = useState(false);
  const [registeredKeyTypes, setRegisteredKeyTypes] = useState<KeyType[]>([]);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<HiveAuthError | null>(null);

  const currentUsernameRef = useRef<string>("");

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const checkUser = useCallback(async (username: string): Promise<boolean> => {
    if (!username.trim()) return false;

    console.log("[HB-Auth] Checking user:", username);
    setIsChecking(true);
    setError(null);
    currentUsernameRef.current = username.toLowerCase();

    try {
      const service = await initHBAuth();
      if (!service) {
        console.log("[HB-Auth] Service not available");
        setHasRegisteredKeys(false);
        setRegisteredKeyTypes([]);
        return false;
      }

      const client = await service.getOnlineClient();
      console.log("[HB-Auth] Got client, checking for registered user...");
      const user = await client.getRegisteredUserByUsername(username.toLowerCase());
      console.log("[HB-Auth] User lookup result:", user);

      if (user && user.registeredKeyTypes && user.registeredKeyTypes.length > 0) {
        console.log("[HB-Auth] User has keys:", user.registeredKeyTypes);
        setHasRegisteredKeys(true);
        setRegisteredKeyTypes(user.registeredKeyTypes as KeyType[]);
        return true;
      } else {
        console.log("[HB-Auth] No keys registered for user");
        setHasRegisteredKeys(false);
        setRegisteredKeyTypes([]);
        return false;
      }
    } catch (err) {
      console.error("[HB-Auth] Failed to check user:", err);
      setHasRegisteredKeys(false);
      setRegisteredKeyTypes([]);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, []);

  const login = useCallback(
    async (username: string, password: string, keyType: KeyType = "posting"): Promise<HiveLoginResult> => {
      if (!username.trim()) {
        const err = createAuthError("INVALID_USERNAME", "Username is required", undefined, true);
        setError(err);
        throw err;
      }

      if (!password.trim()) {
        const err = createAuthError("INVALID_KEY", "Password is required", undefined, true);
        setError(err);
        throw err;
      }

      setIsAuthenticating(true);
      setError(null);

      try {
        const service = await initHBAuth();
        if (!service) {
          throw new Error("HB-Auth service not available. Make sure @hiveio/hb-auth is installed and worker.js is in public/auth/");
        }

        const client = await service.getOnlineClient();

        // Check if user has registered keys
        const user = await client.getRegisteredUserByUsername(username.toLowerCase());
        if (!user || !user.registeredKeyTypes.includes(keyType)) {
          throw new Error(`No ${keyType} key found in safe storage. Please register your key first.`);
        }

        // Authenticate (unlock wallet)
        const authResult = await client.authenticate(username.toLowerCase(), password, keyType);

        if (!authResult.ok) {
          throw new Error("Failed to unlock wallet. Check your password.");
        }

        const result: HiveLoginResult = {
          username: username.toLowerCase(),
          loginMethod: "hbauth",
          keyType,
        };

        return result;
      } catch (err) {
        const authError = mapErrorToAuthError(err);
        setError(authError);
        throw authError;
      } finally {
        setIsAuthenticating(false);
      }
    },
    []
  );

  const register = useCallback(
    async (
      username: string,
      password: string,
      wifKey: string,
      keyType: KeyType = "posting"
    ): Promise<HiveLoginResult> => {
      if (!username.trim()) {
        const err = createAuthError("INVALID_USERNAME", "Username is required", undefined, true);
        setError(err);
        throw err;
      }

      if (!password.trim()) {
        const err = createAuthError("INVALID_KEY", "Password is required", undefined, true);
        setError(err);
        throw err;
      }

      if (!wifKey.trim()) {
        const err = createAuthError("INVALID_KEY", "Private key is required", undefined, true);
        setError(err);
        throw err;
      }

      if (!wifKey.startsWith("5") || wifKey.length !== 51) {
        const err = createAuthError(
          "INVALID_KEY",
          "Invalid WIF format. Private keys start with 5 and are 51 characters long.",
          undefined,
          true
        );
        setError(err);
        throw err;
      }

      setIsAuthenticating(true);
      setError(null);

      console.log("[HB-Auth] Starting registration for:", username, "keyType:", keyType);

      try {
        const service = await initHBAuth();
        if (!service) {
          throw new Error("HB-Auth service not available");
        }
        console.log("[HB-Auth] Service initialized");

        const client = await service.getOnlineClient();
        console.log("[HB-Auth] Got client, calling register...");

        // Register key (encrypts and stores in IndexedDB)
        // This also verifies the key against the blockchain
        const registerResult = await client.register(username.toLowerCase(), password, wifKey, keyType);
        console.log("[HB-Auth] Register result:", registerResult);

        // Authenticate after registration
        console.log("[HB-Auth] Registration successful, authenticating...");
        const authResult = await client.authenticate(username.toLowerCase(), password, keyType);
        console.log("[HB-Auth] Auth result:", authResult);

        // Update state
        setHasRegisteredKeys(true);
        setRegisteredKeyTypes((prev) =>
          prev.includes(keyType) ? prev : [...prev, keyType]
        );
        setMode("login");

        const result: HiveLoginResult = {
          username: username.toLowerCase(),
          loginMethod: "hbauth",
          keyType,
        };

        console.log("[HB-Auth] Registration complete, returning result");
        return result;
      } catch (err) {
        console.error("[HB-Auth] Registration error:", err);
        const authError = mapErrorToAuthError(err);
        setError(authError);
        throw authError;
      } finally {
        setIsAuthenticating(false);
      }
    },
    []
  );

  return {
    mode,
    setMode,
    isChecking,
    hasRegisteredKeys,
    registeredKeyTypes,
    isAuthenticating,
    error,
    checkUser,
    login,
    register,
    clearError,
  };
}
