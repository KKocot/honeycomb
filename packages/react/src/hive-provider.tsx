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

// ============== Constants ==============

export const DEFAULT_API_ENDPOINTS = [
  "https://api.syncad.com",
  "https://api.openhive.network",
  "https://api.hive.blog",
];

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
  /** Currently connected API endpoint */
  apiEndpoint: string | null;
}

export interface HiveProviderProps {
  children: ReactNode;
  /** Storage key for persisting session */
  storageKey?: string;
  /**
   * List of API endpoints to try. Provider will test each endpoint
   * and connect to the fastest responding one.
   * @default ["https://api.syncad.com", "https://api.openhive.network", "https://api.hive.blog"]
   */
  apiEndpoints?: string[];
  /** Called when user logs in */
  onLogin?: (user: HiveUser) => void;
  /** Called when user logs out */
  onLogout?: () => void;
}

// ============== Helpers ==============

interface EndpointHealth {
  endpoint: string;
  latency: number;
}

/**
 * Test endpoint latency by making a simple API call
 */
async function testEndpoint(endpoint: string, timeout = 5000): Promise<EndpointHealth | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const start = performance.now();

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "condenser_api.get_version",
        params: [],
        id: 1,
      }),
      signal: controller.signal,
    });

    if (!response.ok) return null;

    await response.json();
    const latency = performance.now() - start;

    return { endpoint, latency };
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Find the fastest responding endpoint from a list
 */
async function findFastestEndpoint(endpoints: string[]): Promise<string | null> {
  const results = await Promise.all(endpoints.map((ep) => testEndpoint(ep)));
  const validResults = results.filter((r): r is EndpointHealth => r !== null);

  if (validResults.length === 0) return null;

  // Sort by latency and return fastest
  validResults.sort((a, b) => a.latency - b.latency);
  return validResults[0].endpoint;
}

// ============== Context ==============

const HiveContext = createContext<HiveContextValue | null>(null);

// ============== Provider ==============

export function HiveProvider({
  children,
  storageKey = "hive-ui-session",
  apiEndpoints = DEFAULT_API_ENDPOINTS,
  onLogin,
  onLogout,
}: HiveProviderProps) {
  const [chain, setChain] = useState<IHiveChainInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<HiveUser | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [connectedEndpoint, setConnectedEndpoint] = useState<string | null>(null);

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

  // Initialize Hive chain with fastest endpoint (client-side only)
  useEffect(() => {
    if (!isClient) return;

    let cancelled = false;

    async function initChain() {
      try {
        // Find fastest endpoint
        const fastestEndpoint = await findFastestEndpoint(apiEndpoints);

        if (cancelled) return;

        if (!fastestEndpoint) {
          setError("All API endpoints are unavailable");
          setIsLoading(false);
          return;
        }

        // Connect to fastest endpoint
        const hiveChain = await createHiveChain({
          apiEndpoint: fastestEndpoint,
        });

        if (!cancelled) {
          setChain(hiveChain);
          setConnectedEndpoint(fastestEndpoint);
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
  }, [isClient, apiEndpoints]);

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
      apiEndpoint: connectedEndpoint,
    }),
    [chain, isLoading, error, user, login, logout, isClient, connectedEndpoint]
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

/**
 * Hook to get current API endpoint
 */
export function useApiEndpoint(): string | null {
  const { apiEndpoint } = useHive();
  return apiEndpoint;
}
