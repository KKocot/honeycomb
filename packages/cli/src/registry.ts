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
import { hiveauthLogin, hbauthLogin, wifLogin } from "./components/auth.js";
import { userCard, muteButton, badgeList } from "./components/social.js";
import { powerUpDown, delegationCard, tradeHive } from "./components/wallet.js";
import { commentForm, postEditor } from "./components/content.js";
import { witnessVote, proposals, communitiesList, accountSettings } from "./components/community.js";

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
    description: "React context provider for Hive blockchain connection",
    category: "core",
    dependencies: ["@hiveio/wax"],
    registryDependencies: [],
    files: [
      {
        path: "contexts/hive-context.tsx",
        content: `"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createHiveChain, IHiveChainInterface } from "@hiveio/wax";

const STORAGE_KEY = "hive-ui-session";

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

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.username && parsed.loginMethod) {
          setUser(parsed);
        }
      }
    } catch {}
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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } catch {}
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  return (
    <HiveContext.Provider value={{ chain, isLoading, error, user, login, logout }}>
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

  // ==================== AUTH ====================
  "keychain-login": {
    name: "keychain-login",
    description: "Login with Hive Keychain browser extension",
    category: "auth",
    dependencies: ["lucide-react"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "components/hive/keychain-login.tsx",
        content: `"use client";

import { useState, useEffect } from "react";
import { Key, Check, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    hive_keychain?: {
      requestSignBuffer: (
        username: string,
        message: string,
        keyType: "Posting" | "Active" | "Memo",
        callback: (response: { success: boolean; result?: string; message?: string }) => void
      ) => void;
    };
  }
}

interface KeychainLoginProps {
  onSuccess?: (user: { username: string }) => void;
  onError?: (error: Error) => void;
  keyType?: "posting" | "active";
  className?: string;
}

export function KeychainLogin({ onSuccess, onError, keyType = "posting", className }: KeychainLoginProps) {
  const [username, setUsername] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkKeychain = () => setIsAvailable(!!window.hive_keychain);
    checkKeychain();
    const timer = setTimeout(checkKeychain, 500);
    return () => clearTimeout(timer);
  }, []);

  async function handleLogin() {
    if (!window.hive_keychain) {
      setError("Keychain extension not found");
      onError?.(new Error("Keychain extension not found"));
      return;
    }
    if (!username.trim()) {
      setError("Please enter your username");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const challenge = \`Login at \${Date.now()}\`;
      await new Promise<void>((resolve, reject) => {
        window.hive_keychain!.requestSignBuffer(
          username,
          challenge,
          keyType === "active" ? "Active" : "Posting",
          (response) => {
            if (response.success) resolve();
            else reject(new Error(response.message || "Keychain signing failed"));
          }
        );
      });
      onSuccess?.({ username });
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Login failed");
      setError(error.message);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isAvailable === false) {
    return (
      <div className={cn("w-full max-w-sm", className)}>
        <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-orange-500">Keychain Not Detected</p>
              <p className="mt-1 text-sm text-muted-foreground">Install the Hive Keychain browser extension.</p>
              <a href="https://hive-keychain.com" target="_blank" rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm text-orange-500 hover:underline">
                Get Hive Keychain <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isAvailable === null) {
    return (
      <div className={cn("w-full max-w-sm flex justify-center py-8", className)}>
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-sm", className)}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Hive Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            placeholder="Enter your username"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />{error}
          </div>
        )}
        <button
          onClick={handleLogin}
          disabled={isLoading || !username.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-hive-red text-white font-medium hover:bg-hive-red/90 disabled:opacity-50"
        >
          {isLoading ? <><Loader2 className="h-5 w-5 animate-spin" />Connecting...</> : <><Key className="h-5 w-5" />Login with Keychain</>}
        </button>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Check className="h-3 w-3 text-green-500" />Keychain detected
        </div>
      </div>
    </div>
  );
}
`,
      },
    ],
  },

  "peakvault-login": {
    name: "peakvault-login",
    description: "Login with PeakVault browser extension",
    category: "auth",
    dependencies: ["lucide-react"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "components/hive/peakvault-login.tsx",
        content: `"use client";

import { useState, useEffect } from "react";
import { Wallet, Check, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    peakvault?: {
      requestSignBuffer: (
        username: string,
        message: string,
        keyType: "Posting" | "Active" | "Memo",
        callback: (response: { success: boolean; result?: string; message?: string }) => void
      ) => void;
    };
  }
}

interface PeakVaultLoginProps {
  onSuccess?: (user: { username: string }) => void;
  onError?: (error: Error) => void;
  keyType?: "posting" | "active";
  className?: string;
}

export function PeakVaultLogin({ onSuccess, onError, keyType = "posting", className }: PeakVaultLoginProps) {
  const [username, setUsername] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const check = () => setIsAvailable(!!window.peakvault);
    check();
    const timer = setTimeout(check, 500);
    return () => clearTimeout(timer);
  }, []);

  async function handleLogin() {
    if (!window.peakvault) {
      setError("PeakVault extension not found");
      onError?.(new Error("PeakVault extension not found"));
      return;
    }
    if (!username.trim()) {
      setError("Please enter your username");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const challenge = \`Login at \${Date.now()}\`;
      await new Promise<void>((resolve, reject) => {
        window.peakvault!.requestSignBuffer(username, challenge, keyType === "active" ? "Active" : "Posting", (response) => {
          if (response.success) resolve();
          else reject(new Error(response.message || "PeakVault signing failed"));
        });
      });
      onSuccess?.({ username });
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Login failed");
      setError(error.message);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isAvailable === false) {
    return (
      <div className={cn("w-full max-w-sm", className)}>
        <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-orange-500">PeakVault Not Detected</p>
              <a href="https://peakd.com/me/wallet?vault=true" target="_blank" rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm text-orange-500 hover:underline">
                Get PeakVault <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isAvailable === null) {
    return <div className={cn("w-full max-w-sm flex justify-center py-8", className)}><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className={cn("w-full max-w-sm", className)}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Hive Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())}
            placeholder="Enter your username" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
        </div>
        {error && <div className="flex items-center gap-2 text-sm text-red-500"><AlertCircle className="h-4 w-4" />{error}</div>}
        <button onClick={handleLogin} disabled={isLoading || !username.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50">
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Wallet className="h-5 w-5" />Login with PeakVault</>}
        </button>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground"><Check className="h-3 w-3 text-green-500" />PeakVault detected</div>
      </div>
    </div>
  );
}
`,
      },
    ],
  },

  // Import remaining auth components
  "hiveauth-login": hiveauthLogin,
  "hbauth-login": hbauthLogin,
  "wif-login": wifLogin,

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

  "follow-button": {
    name: "follow-button",
    description: "Follow/unfollow button for Hive users",
    category: "social",
    dependencies: ["lucide-react"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "components/hive/follow-button.tsx",
        content: `"use client";

import { useState } from "react";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  username: string;
  initialFollowing?: boolean;
  onFollow?: (following: boolean) => void;
  className?: string;
}

export function FollowButton({ username, initialFollowing = false, onFollow, className }: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const newState = !following;
    setFollowing(newState);
    onFollow?.(newState);
    setLoading(false);
  };

  return (
    <button onClick={handleClick} disabled={loading}
      className={cn("flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
        following ? "bg-muted text-foreground hover:bg-red-500/10 hover:text-red-500" : "bg-hive-red text-white hover:bg-hive-red/90", className)}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : following ? <><UserMinus className="h-4 w-4" />Unfollow</> : <><UserPlus className="h-4 w-4" />Follow</>}
    </button>
  );
}
`,
      },
    ],
  },

  "user-card": userCard,
  "mute-button": muteButton,
  "badge-list": badgeList,

  // ==================== CONTENT ====================
  "comment-form": commentForm,
  "post-editor": postEditor,
  "vote-button": {
    name: "vote-button",
    description: "Upvote/downvote button with weight slider",
    category: "content",
    dependencies: ["lucide-react"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "components/hive/vote-button.tsx",
        content: `"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoteButtonProps {
  initialVotes?: number;
  initialVote?: "up" | "down" | null;
  onVote?: (vote: "up" | "down" | null, weight: number) => void;
  className?: string;
}

export function VoteButton({ initialVotes = 0, initialVote = null, onVote, className }: VoteButtonProps) {
  const [votes, setVotes] = useState(initialVotes);
  const [voted, setVoted] = useState<"up" | "down" | null>(initialVote);
  const [showSlider, setShowSlider] = useState(false);
  const [weight, setWeight] = useState(100);
  const [loading, setLoading] = useState(false);

  const handleVote = async (type: "up" | "down") => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    if (voted === type) {
      setVoted(null);
      setVotes((v) => (type === "up" ? v - 1 : v + 1));
      onVote?.(null, 0);
    } else {
      const diff = voted === null ? 1 : 2;
      setVotes((v) => (type === "up" ? v + diff : v - diff));
      setVoted(type);
      onVote?.(type, weight);
    }
    setLoading(false);
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="flex items-center gap-2">
        <button onClick={() => handleVote("up")} onContextMenu={(e) => { e.preventDefault(); setShowSlider(!showSlider); }} disabled={loading}
          className={cn("flex items-center gap-1 rounded-lg px-3 py-2 transition-colors", voted === "up" ? "bg-green-500 text-white" : "bg-muted hover:bg-muted/80")}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsUp className="h-4 w-4" />}
          <span className="font-medium">{votes}</span>
        </button>
        <button onClick={() => handleVote("down")} disabled={loading}
          className={cn("rounded-lg p-2 transition-colors", voted === "down" ? "bg-red-500 text-white" : "bg-muted hover:bg-muted/80")}>
          <ThumbsDown className="h-4 w-4" />
        </button>
      </div>
      {showSlider && (
        <div className="flex items-center gap-2 rounded-lg bg-muted p-2">
          <input type="range" min="1" max="100" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-32" />
          <span className="w-12 text-sm font-medium">{weight}%</span>
        </div>
      )}
      <p className="text-xs text-muted-foreground">Right-click to adjust vote weight</p>
    </div>
  );
}
`,
      },
    ],
  },

  "reblog-button": {
    name: "reblog-button",
    description: "Reblog/share post button",
    category: "content",
    dependencies: ["lucide-react"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "components/hive/reblog-button.tsx",
        content: `"use client";

import { useState } from "react";
import { Repeat, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReblogButtonProps {
  author: string;
  permlink: string;
  initialReblogged?: boolean;
  onReblog?: (reblogged: boolean) => void;
  className?: string;
}

export function ReblogButton({ author, permlink, initialReblogged = false, onReblog, className }: ReblogButtonProps) {
  const [reblogged, setReblogged] = useState(initialReblogged);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (reblogged) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    setReblogged(true);
    onReblog?.(true);
    setLoading(false);
  };

  return (
    <button onClick={handleClick} disabled={loading || reblogged}
      className={cn("flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
        reblogged ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground hover:text-foreground", className)}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Repeat className={cn("h-4 w-4", reblogged && "fill-current")} />}
      {reblogged ? "Reblogged" : "Reblog"}
    </button>
  );
}
`,
      },
    ],
  },

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

  "transfer-dialog": {
    name: "transfer-dialog",
    description: "Transfer HIVE/HBD dialog",
    category: "wallet",
    dependencies: ["lucide-react"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "components/hive/transfer-dialog.tsx",
        content: `"use client";

import { useState } from "react";
import { Send, Loader2, AlertCircle, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransferDialogProps {
  username: string;
  onTransfer?: (data: { to: string; amount: string; currency: "HIVE" | "HBD"; memo: string }) => void;
  className?: string;
}

export function TransferDialog({ username, onTransfer, className }: TransferDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<"HIVE" | "HBD">("HIVE");
  const [memo, setMemo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleTransfer = async () => {
    if (!to.trim() || !amount.trim()) { setError("Please fill in recipient and amount"); return; }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) { setError("Please enter a valid amount"); return; }

    setIsLoading(true);
    setError(null);

    try {
      await new Promise((r) => setTimeout(r, 1500));
      onTransfer?.({ to, amount, currency, memo });
      setSuccess(true);
      setTimeout(() => { setIsOpen(false); setSuccess(false); setTo(""); setAmount(""); setMemo(""); }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transfer failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}
        className={cn("flex items-center gap-2 px-4 py-2 rounded-lg bg-hive-red text-white font-medium hover:bg-hive-red/90", className)}>
        <Send className="h-4 w-4" />Transfer
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Transfer {currency}</h2>
              <button onClick={() => setIsOpen(false)} className="p-1 rounded hover:bg-muted"><X className="h-5 w-5" /></button>
            </div>
            {success ? (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <p className="font-medium text-green-500">Transfer Successful!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                  <span>From: <strong className="text-foreground">@{username}</strong></span>
                  <ArrowRight className="h-4 w-4" />
                  <span>To: <strong className="text-foreground">{to || "..."}</strong></span>
                </div>
                <div><label className="block text-sm font-medium mb-1.5">Recipient</label>
                  <input type="text" value={to} onChange={(e) => setTo(e.target.value.toLowerCase())} placeholder="Enter username" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background" /></div>
                <div><label className="block text-sm font-medium mb-1.5">Amount</label>
                  <div className="flex gap-2">
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.000" className="flex-1 px-3 py-2.5 rounded-lg border border-border bg-background" />
                    <div className="flex rounded-lg border border-border overflow-hidden">
                      <button onClick={() => setCurrency("HIVE")} className={cn("px-3 py-2.5 text-sm font-medium", currency === "HIVE" ? "bg-hive-red text-white" : "bg-background")}>HIVE</button>
                      <button onClick={() => setCurrency("HBD")} className={cn("px-3 py-2.5 text-sm font-medium", currency === "HBD" ? "bg-green-500 text-white" : "bg-background")}>HBD</button>
                    </div>
                  </div>
                </div>
                <div><label className="block text-sm font-medium mb-1.5">Memo (optional)</label>
                  <input type="text" value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="Add a memo..." className="w-full px-3 py-2.5 rounded-lg border border-border bg-background" /></div>
                {error && <div className="flex items-center gap-2 text-sm text-red-500"><AlertCircle className="h-4 w-4" />{error}</div>}
                <button onClick={handleTransfer} disabled={isLoading || !to.trim() || !amount.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-hive-red text-white font-medium hover:bg-hive-red/90 disabled:opacity-50">
                  {isLoading ? <><Loader2 className="h-5 w-5 animate-spin" />Sending...</> : <><Send className="h-5 w-5" />Send {currency}</>}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
`,
      },
    ],
  },

  // Imported wallet components
  "power-up-down": powerUpDown,
  "delegation-card": delegationCard,
  "trade-hive": tradeHive,

  // ==================== COMMUNITY ====================
  "witness-vote": witnessVote,
  "proposals": proposals,
  "communities-list": communitiesList,
  "account-settings": accountSettings,
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
