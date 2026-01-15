import type { ComponentDefinition } from "../registry.js";

export const powerUpDown: ComponentDefinition = {
  name: "power-up-down",
  description: "Power up or power down HIVE to/from Hive Power",
  category: "wallet",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [
    {
      path: "components/hive/power-up-down.tsx",
      content: `"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Loader2, AlertCircle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface PowerUpDownProps {
  username: string;
  hiveBalance?: string;
  vestingShares?: string;
  onPowerUp?: (amount: string) => void;
  onPowerDown?: (amount: string) => void;
  className?: string;
}

export function PowerUpDown({
  username,
  hiveBalance = "0",
  vestingShares = "0",
  onPowerUp,
  onPowerDown,
  className,
}: PowerUpDownProps) {
  const [mode, setMode] = useState<"up" | "down">("up");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!amount.trim()) {
      setError("Please enter an amount");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await new Promise((r) => setTimeout(r, 1500));

      if (mode === "up") {
        onPowerUp?.(amount);
        setSuccess(\`Successfully powered up \${amount} HIVE!\`);
      } else {
        onPowerDown?.(amount);
        setSuccess(\`Power down initiated for \${amount} HP. Weekly payouts over 13 weeks.\`);
      }

      setAmount("");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full max-w-sm rounded-xl border border-border bg-card p-4", className)}>
      {/* Mode Toggle */}
      <div className="flex rounded-lg bg-muted p-1 mb-4">
        <button
          onClick={() => { setMode("up"); setError(null); setSuccess(null); }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors",
            mode === "up" ? "bg-green-500 text-white shadow-sm" : "text-muted-foreground"
          )}
        >
          <TrendingUp className="h-4 w-4" />
          Power Up
        </button>
        <button
          onClick={() => { setMode("down"); setError(null); setSuccess(null); }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors",
            mode === "down" ? "bg-orange-500 text-white shadow-sm" : "text-muted-foreground"
          )}
        >
          <TrendingDown className="h-4 w-4" />
          Power Down
        </button>
      </div>

      {/* Balance Info */}
      <div className="mb-4 p-3 rounded-lg bg-muted/50">
        {mode === "up" ? (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Available HIVE</span>
            <span className="font-bold">{hiveBalance} HIVE</span>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Staked HP</span>
            <span className="font-bold">{vestingShares} VESTS</span>
          </div>
        )}
      </div>

      {/* Amount Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1.5">
          Amount to {mode === "up" ? "stake" : "unstake"}
        </label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.000"
            step="0.001"
            min="0"
            className="w-full px-3 py-2.5 pr-16 rounded-lg border border-border bg-background"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {mode === "up" ? "HIVE" : "HP"}
          </span>
        </div>
        {mode === "up" && (
          <button onClick={() => setAmount(hiveBalance)} className="mt-1 text-xs text-hive-red hover:underline">
            Use max
          </button>
        )}
      </div>

      {/* Info Box */}
      {mode === "up" ? (
        <div className="mb-4 p-3 rounded-lg border border-green-500/20 bg-green-500/5">
          <p className="text-xs text-green-600">
            <strong>Power Up</strong> converts liquid HIVE to Hive Power (HP),
            increasing your influence on the network and earning curation rewards.
          </p>
        </div>
      ) : (
        <div className="mb-4 p-3 rounded-lg border border-orange-500/20 bg-orange-500/5">
          <p className="text-xs text-orange-600">
            <strong>Power Down</strong> converts HP back to liquid HIVE over 13 weeks.
            You'll receive weekly payments of 1/13 of the total amount.
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />{error}
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-center gap-2 text-sm text-green-500">
          <Zap className="h-4 w-4" />{success}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isLoading || !amount.trim()}
        className={cn(
          "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium disabled:opacity-50",
          mode === "up" ? "bg-green-500 text-white hover:bg-green-600" : "bg-orange-500 text-white hover:bg-orange-600"
        )}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : mode === "up" ? (
          <><TrendingUp className="h-5 w-5" />Power Up</>
        ) : (
          <><TrendingDown className="h-5 w-5" />Start Power Down</>
        )}
      </button>
    </div>
  );
}
`,
    },
  ],
};

export const delegationCard: ComponentDefinition = {
  name: "delegation-card",
  description: "Manage HP delegations to other users",
  category: "wallet",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [
    {
      path: "components/hive/delegation-card.tsx",
      content: `"use client";

import { useState } from "react";
import { Users, Plus, Minus, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Delegation {
  delegatee: string;
  vesting_shares: string;
}

interface DelegationCardProps {
  username: string;
  delegations?: Delegation[];
  availableHP?: string;
  onDelegate?: (to: string, amount: string) => void;
  onUndelegate?: (to: string) => void;
  className?: string;
}

const mockDelegations: Delegation[] = [
  { delegatee: "actifit", vesting_shares: "100000.000000 VESTS" },
  { delegatee: "ecency", vesting_shares: "50000.000000 VESTS" },
];

export function DelegationCard({
  username,
  delegations = mockDelegations,
  availableHP = "1000",
  onDelegate,
  onUndelegate,
  className,
}: DelegationCardProps) {
  const [showForm, setShowForm] = useState(false);
  const [delegatee, setDelegatee] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelegate = async () => {
    if (!delegatee.trim() || !amount.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await new Promise((r) => setTimeout(r, 1000));
      onDelegate?.(delegatee, amount);
      setShowForm(false);
      setDelegatee("");
      setAmount("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delegation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUndelegate = async (to: string) => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      onUndelegate?.(to);
    } finally {
      setIsLoading(false);
    }
  };

  const formatVests = (vests: string) => {
    const num = parseFloat(vests.split(" ")[0]);
    if (num >= 1000000) return \`\${(num / 1000000).toFixed(2)}M\`;
    if (num >= 1000) return \`\${(num / 1000).toFixed(2)}K\`;
    return num.toFixed(2);
  };

  return (
    <div className={cn("w-full max-w-md rounded-xl border border-border bg-card", className)}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">Delegations</h3>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600"
          >
            <Plus className="h-4 w-4" />New
          </button>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Available HP: <strong>{availableHP}</strong></p>
      </div>

      {/* New Delegation Form */}
      {showForm && (
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Delegate to</label>
              <input type="text" value={delegatee} onChange={(e) => setDelegatee(e.target.value.toLowerCase())}
                placeholder="Username" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount (HP)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                placeholder="0.000" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />{error}
              </div>
            )}

            <div className="flex gap-2">
              <button onClick={handleDelegate} disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 disabled:opacity-50">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delegate"}
              </button>
              <button onClick={() => { setShowForm(false); setError(null); }}
                className="px-3 py-2 rounded-lg bg-muted text-sm font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delegations List */}
      <div className="divide-y divide-border">
        {delegations.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">No active delegations</div>
        ) : (
          delegations.map((d) => (
            <div key={d.delegatee} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <img src={\`https://images.hive.blog/u/\${d.delegatee}/avatar/small\`} alt={d.delegatee} className="w-8 h-8 rounded-full" />
                <div>
                  <p className="font-medium">@{d.delegatee}</p>
                  <p className="text-xs text-muted-foreground">{formatVests(d.vesting_shares)} VESTS</p>
                </div>
              </div>
              <button onClick={() => handleUndelegate(d.delegatee)} disabled={isLoading}
                className="p-2 rounded-lg hover:bg-red-500/10 text-red-500" title="Remove delegation">
                <Minus className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
`,
    },
  ],
};

export const tradeHive: ComponentDefinition = {
  name: "trade-hive",
  description: "Trade HIVE/HBD on internal market",
  category: "wallet",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [
    {
      path: "components/hive/trade-hive.tsx",
      content: `"use client";

import { useState } from "react";
import { ArrowUpDown, Loader2, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TradeHiveProps {
  username: string;
  hiveBalance?: string;
  hbdBalance?: string;
  onTrade?: (data: { type: "buy" | "sell"; amount: string; price: string }) => void;
  className?: string;
}

export function TradeHive({
  username,
  hiveBalance = "1000.000",
  hbdBalance = "500.000",
  onTrade,
  className,
}: TradeHiveProps) {
  const [mode, setMode] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("0.40");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const marketPrice = 0.398;
  const change24h = 2.5;
  const total = parseFloat(amount || "0") * parseFloat(price || "0");

  const handleTrade = async () => {
    if (!amount.trim() || !price.trim()) {
      setError("Please fill in all fields");
      return;
    }

    const numAmount = parseFloat(amount);
    const numPrice = parseFloat(price);

    if (isNaN(numAmount) || numAmount <= 0 || isNaN(numPrice) || numPrice <= 0) {
      setError("Please enter valid values");
      return;
    }

    if (mode === "buy" && total > parseFloat(hbdBalance)) {
      setError("Insufficient HBD balance");
      return;
    }
    if (mode === "sell" && numAmount > parseFloat(hiveBalance)) {
      setError("Insufficient HIVE balance");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await new Promise((r) => setTimeout(r, 1000));
      onTrade?.({ type: mode, amount, price });
      setSuccess(\`Order placed: \${mode === "buy" ? "Buy" : "Sell"} \${amount} HIVE at \${price} HBD\`);
      setAmount("");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Trade failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full max-w-sm", className)}>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-5 w-5 text-yellow-500" />
              <h3 className="font-semibold">HIVE/HBD</h3>
            </div>
            <div className={cn("flex items-center gap-1 text-sm font-medium", change24h >= 0 ? "text-green-500" : "text-red-500")}>
              {change24h >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {change24h >= 0 ? "+" : ""}{change24h}%
            </div>
          </div>
          <div className="text-2xl font-bold">{marketPrice.toFixed(4)} HBD</div>
          <p className="text-xs text-muted-foreground">Current market price</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex p-1 m-4 mb-0 rounded-lg bg-muted">
          <button onClick={() => { setMode("buy"); setError(null); }}
            className={cn("flex-1 py-2 rounded-md text-sm font-medium transition-colors",
              mode === "buy" ? "bg-green-500 text-white shadow-sm" : "text-muted-foreground")}>
            Buy HIVE
          </button>
          <button onClick={() => { setMode("sell"); setError(null); }}
            className={cn("flex-1 py-2 rounded-md text-sm font-medium transition-colors",
              mode === "sell" ? "bg-red-500 text-white shadow-sm" : "text-muted-foreground")}>
            Sell HIVE
          </button>
        </div>

        {/* Form */}
        <div className="p-4 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Available</span>
            <span>{mode === "buy" ? <>{hbdBalance} HBD</> : <>{hiveBalance} HIVE</>}</span>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Amount</label>
            <div className="relative">
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                placeholder="0.000" step="0.001" min="0"
                className="w-full px-3 py-2.5 pr-16 rounded-lg border border-border bg-background" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">HIVE</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Price per HIVE</label>
            <div className="relative">
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                placeholder="0.000" step="0.001" min="0"
                className="w-full px-3 py-2.5 pr-14 rounded-lg border border-border bg-background" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">HBD</span>
            </div>
            <button onClick={() => setPrice(marketPrice.toFixed(4))} className="mt-1 text-xs text-yellow-500 hover:underline">
              Use market price
            </button>
          </div>

          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-bold">{isNaN(total) ? "0.000" : total.toFixed(3)} HBD</span>
            </div>
          </div>

          {error && <div className="flex items-center gap-2 text-sm text-red-500"><AlertCircle className="h-4 w-4" />{error}</div>}
          {success && <div className="flex items-center gap-2 text-sm text-green-500"><TrendingUp className="h-4 w-4" />{success}</div>}

          <button onClick={handleTrade} disabled={isLoading || !amount.trim() || !price.trim()}
            className={cn("w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium disabled:opacity-50",
              mode === "buy" ? "bg-green-500 text-white hover:bg-green-600" : "bg-red-500 text-white hover:bg-red-600")}>
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><ArrowUpDown className="h-5 w-5" />{mode === "buy" ? "Place Buy Order" : "Place Sell Order"}</>}
          </button>
        </div>

        <div className="p-4 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground">
            Orders are placed on the internal Hive market. Trades execute when matching orders are found.
          </p>
        </div>
      </div>
    </div>
  );
}
`,
    },
  ],
};
