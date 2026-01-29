"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { createHiveChain, IHiveChainInterface } from "@hiveio/wax";

// Default user for demo (for passive components to fetch data)
export const DEFAULT_USER = "barddev";

interface HiveContextType {
  // Chain connection
  chain: IHiveChainInterface | null;
  isLoading: boolean;
  error: string | null;
}

const HiveContext = createContext<HiveContextType | null>(null);

/**
 * HiveProvider - Simplified for Passive components
 *
 * Provides only chain connection for fetching blockchain data.
 * No authentication or broadcasting capabilities.
 */
export function HiveProvider({ children }: { children: ReactNode }) {
  const [chain, setChain] = useState<IHiveChainInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <HiveContext.Provider
      value={{
        chain,
        isLoading,
        error,
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
