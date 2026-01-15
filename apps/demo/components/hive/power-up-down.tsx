"use client";

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
        setSuccess(`Successfully powered up ${amount} HIVE!`);
      } else {
        onPowerDown?.(amount);
        setSuccess(`Power down initiated for ${amount} HP. Weekly payouts over 13 weeks.`);
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
          onClick={() => {
            setMode("up");
            setError(null);
            setSuccess(null);
          }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors",
            mode === "up" ? "bg-green-500 text-white shadow-sm" : "text-muted-foreground"
          )}
        >
          <TrendingUp className="h-4 w-4" />
          Power Up
        </button>
        <button
          onClick={() => {
            setMode("down");
            setError(null);
            setSuccess(null);
          }}
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
          <button
            onClick={() => setAmount(hiveBalance)}
            className="mt-1 text-xs text-hive-red hover:underline"
          >
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
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-center gap-2 text-sm text-green-500">
          <Zap className="h-4 w-4" />
          {success}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isLoading || !amount.trim()}
        className={cn(
          "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium disabled:opacity-50",
          mode === "up"
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-orange-500 text-white hover:bg-orange-600"
        )}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : mode === "up" ? (
          <>
            <TrendingUp className="h-5 w-5" />
            Power Up
          </>
        ) : (
          <>
            <TrendingDown className="h-5 w-5" />
            Start Power Down
          </>
        )}
      </button>
    </div>
  );
}
