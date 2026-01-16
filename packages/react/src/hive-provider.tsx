"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { createHiveChain, type IHiveChainInterface } from "@hiveio/wax";

// ============== Types ==============

export interface HiveUser {
  username: string;
  loginMethod: string;
}

export interface HiveContextValue {
  /** Hive chain instance - null during SSR and initial load */
  chain: IHiveChainInterface | null;
  /** True while chain is initializing */
  isLoading: boolean;
  /** Error message if chain initialization failed */
  error: string | null;
  /** Currently logged in user */
  user: HiveUser | null;
  /** Login function */
  login: (username: string, method: string) => void;
  /** Logout function */
  logout: () => void;
  /** Check if running on client */
  isClient: boolean;
}

export interface HiveProviderProps {
  children: ReactNode;
  /** Storage key for persisting session */
  storageKey?: string;
  /** API endpoint for Hive node */
  apiEndpoint?: string;
  /** Called when user logs in */
  onLogin?: (user: HiveUser) => void;
  /** Called when user logs out */
  onLogout?: () => void;
}

// ============== Context ==============

const HiveContext = createContext<HiveContextValue | null>(null);

// ============== Provider ==============

export function HiveProvider({
  children,
  storageKey = "hive-ui-session",
  apiEndpoint,
  onLogin,
  onLogout,
}: HiveProviderProps) {
  const [chain, setChain] = useState<IHiveChainInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<HiveUser | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Detect client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Restore session from localStorage (client-side only)
  useEffect(() => {
    if (!isClient) return;

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.username && parsed.loginMethod) {
          setUser(parsed);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [isClient, storageKey]);

  // Initialize Hive chain (client-side only)
  useEffect(() => {
    if (!isClient) return;

    let cancelled = false;

    async function initChain() {
      try {
        const hiveChain = await createHiveChain({
          apiEndpoint,
        });
        if (!cancelled) {
          setChain(hiveChain);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to connect to Hive");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    initChain();

    return () => {
      cancelled = true;
    };
  }, [isClient, apiEndpoint]);

  // Login function
  const login = useCallback(
    (username: string, method: string) => {
      const userData: HiveUser = { username, loginMethod: method };
      setUser(userData);

      if (isClient) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(userData));
        } catch {
          // Ignore localStorage errors
        }
      }

      onLogin?.(userData);
    },
    [isClient, storageKey, onLogin]
  );

  // Logout function
  const logout = useCallback(() => {
    setUser(null);

    if (isClient) {
      try {
        localStorage.removeItem(storageKey);
      } catch {
        // Ignore localStorage errors
      }
    }

    onLogout?.();
  }, [isClient, storageKey, onLogout]);

  // Memoize context value
  const value = useMemo<HiveContextValue>(
    () => ({
      chain,
      isLoading,
      error,
      user,
      login,
      logout,
      isClient,
    }),
    [chain, isLoading, error, user, login, logout, isClient]
  );

  return <HiveContext.Provider value={value}>{children}</HiveContext.Provider>;
}

// ============== Hooks ==============

/**
 * Hook to access Hive context
 * @throws Error if used outside of HiveProvider
 */
export function useHive(): HiveContextValue {
  const context = useContext(HiveContext);
  if (!context) {
    throw new Error("useHive must be used within a HiveProvider");
  }
  return context;
}

/**
 * Hook to access Hive chain instance
 * Returns null during SSR
 */
export function useHiveChain(): IHiveChainInterface | null {
  const { chain } = useHive();
  return chain;
}

/**
 * Hook to access current user
 */
export function useHiveUser(): HiveUser | null {
  const { user } = useHive();
  return user;
}

/**
 * Hook to check if user is logged in
 */
export function useIsLoggedIn(): boolean {
  const { user } = useHive();
  return user !== null;
}

/**
 * Hook for auth actions
 */
export function useHiveAuth() {
  const { user, login, logout, isLoading } = useHive();
  return { user, login, logout, isLoading };
}
