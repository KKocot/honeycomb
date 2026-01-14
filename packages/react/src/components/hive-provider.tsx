"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { createHiveChain, type IHiveChainInterface } from "@hiveio/wax";

// Types
interface HiveContextValue {
  chain: IHiveChainInterface | null;
  isReady: boolean;
  error: Error | null;
  apiEndpoint: string;
  switchEndpoint: (endpoint: string) => Promise<void>;
}

interface HiveProviderProps {
  children: ReactNode;
  apiEndpoint?: string;
  fallbackEndpoints?: string[];
}

// Default API nodes
const DEFAULT_ENDPOINTS = [
  "https://api.hive.blog",
  "https://api.deathwing.me",
  "https://anyx.io",
  "https://api.openhive.network",
];

// Context
const HiveContext = createContext<HiveContextValue | null>(null);

// Provider Component
export function HiveProvider({
  children,
  apiEndpoint = "https://api.hive.blog",
  fallbackEndpoints = DEFAULT_ENDPOINTS,
}: HiveProviderProps) {
  const [chain, setChain] = useState<IHiveChainInterface | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentEndpoint, setCurrentEndpoint] = useState(apiEndpoint);

  // Initialize chain
  const initChain = useCallback(async (endpoint: string) => {
    setIsReady(false);
    setError(null);

    try {
      const hiveChain = await createHiveChain({ apiEndpoint: endpoint });
      setChain(hiveChain);
      setCurrentEndpoint(endpoint);
      setIsReady(true);
      return true;
    } catch (err) {
      console.error(`Failed to connect to ${endpoint}:`, err);
      return false;
    }
  }, []);

  // Try endpoints with fallback
  useEffect(() => {
    let mounted = true;

    async function tryEndpoints() {
      // Try primary endpoint first
      const endpoints = [apiEndpoint, ...fallbackEndpoints.filter(e => e !== apiEndpoint)];

      for (const endpoint of endpoints) {
        if (!mounted) return;

        const success = await initChain(endpoint);
        if (success) return;
      }

      // All endpoints failed
      if (mounted) {
        setError(new Error("Failed to connect to any Hive API node"));
      }
    }

    tryEndpoints();

    return () => {
      mounted = false;
    };
  }, [apiEndpoint, fallbackEndpoints, initChain]);

  // Switch endpoint manually
  const switchEndpoint = useCallback(async (endpoint: string) => {
    const success = await initChain(endpoint);
    if (!success) {
      throw new Error(`Failed to connect to ${endpoint}`);
    }
  }, [initChain]);

  return (
    <HiveContext.Provider
      value={{
        chain,
        isReady,
        error,
        apiEndpoint: currentEndpoint,
        switchEndpoint,
      }}
    >
      {children}
    </HiveContext.Provider>
  );
}

// Hook to access Hive context
export function useHiveChain() {
  const context = useContext(HiveContext);
  if (!context) {
    throw new Error("useHiveChain must be used within a HiveProvider");
  }
  return context;
}

// Export types
export type { HiveContextValue, HiveProviderProps };
