"use client";

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

export function HiveTradeCard({
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

  // Mock market data
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

    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (isNaN(numPrice) || numPrice <= 0) {
      setError("Please enter a valid price");
      return;
    }

    // Check balance
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
      setSuccess(
        `Order placed: ${mode === "buy" ? "Buy" : "Sell"} ${amount} HIVE at ${price} HBD`
      );
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
        {/* Header with Market Info */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-5 w-5 text-yellow-500" />
              <h3 className="font-semibold">HIVE/HBD</h3>
            </div>
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                change24h >= 0 ? "text-green-500" : "text-red-500"
              )}
            >
              {change24h >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {change24h >= 0 ? "+" : ""}
              {change24h}%
            </div>
          </div>
          <div className="text-2xl font-bold">{marketPrice.toFixed(4)} HBD</div>
          <p className="text-xs text-muted-foreground">Current market price</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex p-1 m-4 mb-0 rounded-lg bg-muted">
          <button
            onClick={() => {
              setMode("buy");
              setError(null);
            }}
            className={cn(
              "flex-1 py-2 rounded-md text-sm font-medium transition-colors",
              mode === "buy"
                ? "bg-green-500 text-white shadow-sm"
                : "text-muted-foreground"
            )}
          >
            Buy HIVE
          </button>
          <button
            onClick={() => {
              setMode("sell");
              setError(null);
            }}
            className={cn(
              "flex-1 py-2 rounded-md text-sm font-medium transition-colors",
              mode === "sell"
                ? "bg-red-500 text-white shadow-sm"
                : "text-muted-foreground"
            )}
          >
            Sell HIVE
          </button>
        </div>

        {/* Form */}
        <div className="p-4 space-y-4">
          {/* Balance */}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Available</span>
            <span>
              {mode === "buy" ? (
                <>{hbdBalance} HBD</>
              ) : (
                <>{hiveBalance} HIVE</>
              )}
            </span>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Amount</label>
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
                HIVE
              </span>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Price per HIVE
            </label>
            <div className="relative">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.000"
                step="0.001"
                min="0"
                className="w-full px-3 py-2.5 pr-14 rounded-lg border border-border bg-background"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                HBD
              </span>
            </div>
            <button
              onClick={() => setPrice(marketPrice.toFixed(4))}
              className="mt-1 text-xs text-yellow-500 hover:underline"
            >
              Use market price
            </button>
          </div>

          {/* Total */}
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-bold">
                {isNaN(total) ? "0.000" : total.toFixed(3)} HBD
              </span>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-500">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 text-sm text-green-500">
              <TrendingUp className="h-4 w-4" />
              {success}
            </div>
          )}

          <button
            onClick={handleTrade}
            disabled={isLoading || !amount.trim() || !price.trim()}
            className={cn(
              "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium disabled:opacity-50",
              mode === "buy"
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-red-500 text-white hover:bg-red-600"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <ArrowUpDown className="h-5 w-5" />
                {mode === "buy" ? "Place Buy Order" : "Place Sell Order"}
              </>
            )}
          </button>
        </div>

        {/* Info */}
        <div className="p-4 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground">
            Orders are placed on the internal Hive market. Trades execute when
            matching orders are found.
          </p>
        </div>
      </div>
    </div>
  );
}
