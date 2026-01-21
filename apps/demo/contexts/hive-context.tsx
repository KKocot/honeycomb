"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { createHiveChain, IHiveChainInterface } from "@hiveio/wax";
import type { HiveLoginResult, KeyType, LoginMethod } from "@/types/auth";

// Default user for demo
export const DEFAULT_USER = "barddev";

// Re-export types for convenience
export type { KeyType, LoginMethod } from "@/types/auth";

// Storage key for session persistence
const STORAGE_KEY = "hive-ui-demo-session";
const STORED_KEYS_PREFIX = "hive-ui-keys-";

/**
 * User state in context - extends HiveLoginResult with additional demo fields
 */
export interface HiveUser extends HiveLoginResult {
  // Additional fields can be added here
}

// Key escalation request
export interface KeyEscalationRequest {
  requiredKeyType: KeyType;
  reason: string;
  onSuccess: () => void;
  onCancel: () => void;
  allowSave?: boolean;
}

interface HiveContextType {
  // Chain connection
  chain: IHiveChainInterface | null;
  isLoading: boolean;
  error: string | null;

  // Authentication
  user: HiveUser | null;
  login: (result: HiveLoginResult) => void;
  loginLegacy: (username: string, method: string, keyType?: KeyType) => void;
  logout: () => void;

  // Key management
  currentKeyType: KeyType | null;
  hasStoredKey: (keyType: KeyType) => boolean;
  canUseKeyType: (requiredKeyType: KeyType) => boolean;

  // Key escalation
  requestKeyEscalation: (request: KeyEscalationRequest) => void;
  escalationRequest: KeyEscalationRequest | null;
  resolveEscalation: (success: boolean, saveKey?: boolean) => void;
}

const HiveContext = createContext<HiveContextType | null>(null);

// Key privilege levels
const KEY_LEVELS: Record<KeyType, number> = {
  posting: 1,
  active: 2,
  owner: 3,
};

export function HiveProvider({ children }: { children: ReactNode }) {
  const [chain, setChain] = useState<IHiveChainInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<HiveUser | null>(null);
  const [storedKeys, setStoredKeys] = useState<Record<KeyType, boolean>>({
    posting: false,
    active: false,
    owner: false,
  });
  const [escalationRequest, setEscalationRequest] = useState<KeyEscalationRequest | null>(null);

  // Load saved session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.username && parsed.loginMethod) {
          const userKeyType: KeyType = parsed.keyType || "posting";

          setUser({
            username: parsed.username,
            loginMethod: parsed.loginMethod,
            keyType: userKeyType,
            publicKey: parsed.publicKey,
          });

          // Check for stored keys
          const username = parsed.username;
          const keys: Record<KeyType, boolean> = {
            posting: !!localStorage.getItem(`${STORED_KEYS_PREFIX}${username}-posting`),
            active: !!localStorage.getItem(`${STORED_KEYS_PREFIX}${username}-active`),
            owner: !!localStorage.getItem(`${STORED_KEYS_PREFIX}${username}-owner`),
          };
          keys[userKeyType] = true;
          setStoredKeys(keys);
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Initialize chain connection
  useEffect(() => {
    async function initChain() {
      try {
        const hiveChain = await createHiveChain();
        setChain(hiveChain);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to connect");
      } finally {
        setIsLoading(false);
      }
    }
    initChain();
  }, []);

  /**
   * Login with HiveLoginResult (from new auth components)
   */
  const login = useCallback((result: HiveLoginResult) => {
    const userData: HiveUser = {
      username: result.username,
      loginMethod: result.loginMethod,
      keyType: result.keyType,
      publicKey: result.publicKey,
    };
    setUser(userData);

    // Update stored keys
    const keys: Record<KeyType, boolean> = {
      posting: !!localStorage.getItem(`${STORED_KEYS_PREFIX}${result.username}-posting`),
      active: !!localStorage.getItem(`${STORED_KEYS_PREFIX}${result.username}-active`),
      owner: !!localStorage.getItem(`${STORED_KEYS_PREFIX}${result.username}-owner`),
    };
    keys[result.keyType] = true;
    setStoredKeys(keys);

    // Persist session
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } catch {
      // Ignore storage errors
    }
  }, []);

  /**
   * Legacy login method (for backwards compatibility)
   * @deprecated Use login(result: HiveLoginResult) instead
   */
  const loginLegacy = useCallback((username: string, method: string, keyType: KeyType = "posting") => {
    login({
      username,
      loginMethod: method as LoginMethod,
      keyType,
    });
  }, [login]);

  const logout = useCallback(() => {
    setUser(null);
    setStoredKeys({ posting: false, active: false, owner: false });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const hasStoredKey = useCallback((keyType: KeyType): boolean => {
    return storedKeys[keyType];
  }, [storedKeys]);

  const canUseKeyType = useCallback((requiredKeyType: KeyType): boolean => {
    if (!user) return false;
    if (storedKeys[requiredKeyType]) return true;
    return KEY_LEVELS[user.keyType] >= KEY_LEVELS[requiredKeyType];
  }, [user, storedKeys]);

  const requestKeyEscalation = useCallback((request: KeyEscalationRequest) => {
    setEscalationRequest(request);
  }, []);

  const resolveEscalation = useCallback((success: boolean, saveKey?: boolean) => {
    if (escalationRequest) {
      if (success) {
        if (saveKey && user) {
          const newStoredKeys = { ...storedKeys };
          newStoredKeys[escalationRequest.requiredKeyType] = true;
          setStoredKeys(newStoredKeys);

          try {
            localStorage.setItem(
              `${STORED_KEYS_PREFIX}${user.username}-${escalationRequest.requiredKeyType}`,
              "true"
            );
          } catch {
            // Ignore storage errors
          }
        }
        escalationRequest.onSuccess();
      } else {
        escalationRequest.onCancel();
      }
    }
    setEscalationRequest(null);
  }, [escalationRequest, user, storedKeys]);

  return (
    <HiveContext.Provider
      value={{
        chain,
        isLoading,
        error,
        user,
        login,
        loginLegacy,
        logout,
        currentKeyType: user?.keyType || null,
        hasStoredKey,
        requestKeyEscalation,
        escalationRequest,
        resolveEscalation,
        canUseKeyType,
      }}
    >
      {children}
    </HiveContext.Provider>
  );
}

export function useHive() {
  const context = useContext(HiveContext);
  if (!context) {
    throw new Error("useHive must be used within HiveProvider");
  }
  return context;
}
