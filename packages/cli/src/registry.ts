export interface ComponentDefinition {
  name: string;
  description: string;
  category: "auth" | "social" | "content" | "wallet" | "community" | "core";
  dependencies: string[];
  devDependencies?: string[];
  registryDependencies: string[];
  files: {
    path: string;
    content: string;
  }[];
}

// Import component definitions
import { userCard, badgeList } from "./components/social.js";

export const components: Record<string, ComponentDefinition> = {
  // ==================== CORE ====================
  utils: {
    name: "utils",
    description: "Utility functions (cn helper)",
    category: "core",
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
    files: [
      {
        path: "lib/utils.ts",
        content: `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`,
      },
    ],
  },

  "hive-provider": {
    name: "hive-provider",
    description: "React context provider for Hive blockchain connection (passive mode)",
    category: "core",
    dependencies: ["@hiveio/wax"],
    registryDependencies: [],
    files: [
      {
        path: "contexts/hive-context.tsx",
        content: `"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createHiveChain, IHiveChainInterface } from "@hiveio/wax";

interface HiveContextType {
  chain: IHiveChainInterface | null;
  isLoading: boolean;
  error: string | null;
}

const HiveContext = createContext<HiveContextType | null>(null);

export function HiveProvider({ children }: { children: ReactNode }) {
  const [chain, setChain] = useState<IHiveChainInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <HiveContext.Provider value={{ chain, isLoading, error }}>
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
`,
      },
    ],
  },


  // ==================== SOCIAL ====================
  avatar: {
    name: "avatar",
    description: "Display Hive user profile pictures with fallback",
    category: "social",
    dependencies: [],
    registryDependencies: ["utils"],
    files: [
      {
        path: "components/hive/avatar.tsx",
        content: `"use client";

import { cn } from "@/lib/utils";

interface AvatarProps {
  username: string;
  size?: "sm" | "md" | "lg" | "xl";
  showReputation?: boolean;
  reputation?: number;
  className?: string;
}

const sizeClasses = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-12 h-12", xl: "w-16 h-16" };

export function Avatar({ username, size = "md", showReputation = false, reputation, className }: AvatarProps) {
  return (
    <div className={cn("relative inline-block", className)}>
      <img src={\`https://images.hive.blog/u/\${username}/avatar\`} alt={username}
        className={cn(sizeClasses[size], "rounded-full object-cover ring-2 ring-border")} />
      {showReputation && reputation !== undefined && (
        <div className="absolute -bottom-1 -right-1 rounded-full bg-hive-red px-1.5 py-0.5 text-[10px] font-bold text-white">
          {reputation}
        </div>
      )}
    </div>
  );
}
`,
      },
    ],
  },

  "user-card": userCard,
  "badge-list": badgeList,


  // ==================== WALLET ====================
  "balance-card": {
    name: "balance-card",
    description: "Display user wallet balances (HIVE, HBD, HP)",
    category: "wallet",
    dependencies: ["lucide-react"],
    registryDependencies: ["utils", "hive-provider"],
    files: [
      {
        path: "components/hive/balance-card.tsx",
        content: `"use client";

import { useState, useEffect } from "react";
import { Zap, Wallet, TrendingUp, Loader2, RefreshCw } from "lucide-react";
import { useHive } from "@/contexts/hive-context";
import { cn } from "@/lib/utils";

interface BalanceCardProps {
  username: string;
  className?: string;
}

export function BalanceCard({ username, className }: BalanceCardProps) {
  const { chain } = useHive();
  const [balances, setBalances] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBalances = async () => {
    if (!chain) return;
    setIsLoading(true);
    try {
      const response = await chain.api.database_api.find_accounts({ accounts: [username] });
      if (response.accounts.length > 0) {
        const acc = response.accounts[0];
        setBalances({
          hive: String(acc.balance).replace(" HIVE", ""),
          hbd: String(acc.hbd_balance).replace(" HBD", ""),
          hp: String(acc.vesting_shares).split(" ")[0],
          savingsHive: String(acc.savings_balance).replace(" HIVE", ""),
          savingsHbd: String(acc.savings_hbd_balance).replace(" HBD", ""),
        });
      }
    } catch (err) {
      console.error("Failed to fetch balances:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchBalances(); }, [chain, username]);

  if (isLoading) {
    return <div className={cn("w-full max-w-sm rounded-xl border border-border bg-card p-8 flex justify-center", className)}><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className={cn("w-full max-w-sm rounded-xl border border-border bg-card p-4", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Wallet</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">@{username}</span>
          <button onClick={fetchBalances} className="p-1 rounded hover:bg-muted"><RefreshCw className="h-4 w-4 text-muted-foreground" /></button>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-2"><div className="rounded-full bg-hive-red/10 p-2"><Zap className="h-4 w-4 text-hive-red" /></div><span className="font-medium">HIVE</span></div>
          <span className="font-bold">{balances?.hive || "0"}</span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-2"><div className="rounded-full bg-green-500/10 p-2"><Wallet className="h-4 w-4 text-green-500" /></div><span className="font-medium">HBD</span></div>
          <span className="font-bold">{balances?.hbd || "0"}</span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-2"><div className="rounded-full bg-blue-500/10 p-2"><TrendingUp className="h-4 w-4 text-blue-500" /></div><span className="font-medium">VESTS</span></div>
          <span className="font-bold text-sm">{balances?.hp || "0"}</span>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground mb-2">Savings</p>
        <div className="flex gap-4 text-sm"><span><strong>{balances?.savingsHive}</strong> HIVE</span><span><strong>{balances?.savingsHbd}</strong> HBD</span></div>
      </div>
    </div>
  );
}
`,
      },
    ],
  },


};

export const allComponents = Object.keys(components);

export const componentsByCategory = {
  core: allComponents.filter((c) => components[c].category === "core"),
  auth: allComponents.filter((c) => components[c].category === "auth"),
  social: allComponents.filter((c) => components[c].category === "social"),
  content: allComponents.filter((c) => components[c].category === "content"),
  wallet: allComponents.filter((c) => components[c].category === "wallet"),
  community: allComponents.filter((c) => components[c].category === "community"),
};
