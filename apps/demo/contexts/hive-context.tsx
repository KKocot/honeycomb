"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { createHiveChain, IHiveChainInterface } from "@hiveio/wax";

// Default user for demo
export const DEFAULT_USER = "barddev";

// Storage key for session persistence
const STORAGE_KEY = "hive-ui-demo-session";

interface HiveUser {
  username: string;
  loginMethod: string;
}

interface HiveContextType {
  chain: IHiveChainInterface | null;
  isLoading: boolean;
  error: string | null;
  user: HiveUser | null;
  login: (username: string, method: string) => void;
  logout: () => void;
}

const HiveContext = createContext<HiveContextType | null>(null);

export function HiveProvider({ children }: { children: ReactNode }) {
  const [chain, setChain] = useState<IHiveChainInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<HiveUser | null>(null);

  // Load saved session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.username && parsed.loginMethod) {
          setUser(parsed);
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

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

  const login = (username: string, method: string) => {
    const userData = { username, loginMethod: method };
    setUser(userData);
    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } catch {
      // Ignore storage errors
    }
  };

  const logout = () => {
    setUser(null);
    // Clear from localStorage
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <HiveContext.Provider
      value={{ chain, isLoading, error, user, login, logout }}
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
