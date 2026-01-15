import Link from "next/link";
import { ArrowRight, Info, TrendingUp, TrendingDown, ArrowUpDown } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  component: `"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Loader2, ArrowUpDown } from "lucide-react";

interface Order {
  price: string;
  hive: string;
  hbd: string;
  total: string;
}

interface TradeHiveProps {
  availableHive: string;
  availableHbd: string;
  lastPrice: string;
  buyOrders: Order[];
  sellOrders: Order[];
  onBuy?: (amount: string, price: string) => Promise<void>;
  onSell?: (amount: string, price: string) => Promise<void>;
  className?: string;
}

export function TradeHive({
  availableHive,
  availableHbd,
  lastPrice,
  buyOrders,
  sellOrders,
  onBuy,
  onSell,
  className = "",
}: TradeHiveProps) {
  const [mode, setMode] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState<"limit" | "market">("limit");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState(lastPrice);
  const [isLoading, setIsLoading] = useState(false);

  const total = amount && price
    ? (parseFloat(amount) * parseFloat(price)).toFixed(3)
    : "0.000";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount) return;

    setIsLoading(true);
    try {
      if (mode === "buy") {
        await onBuy?.(amount, price);
      } else {
        await onSell?.(amount, price);
      }
      setAmount("");
    } catch (error) {
      console.error("Trade failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={\`rounded-xl border border-border bg-card \${className}\`}>
      {/* Header with price */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h3 className="font-semibold">HIVE/HBD</h3>
          <p className="text-sm text-muted-foreground">Internal Market</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold">{lastPrice} HBD</p>
          <p className="text-sm text-green-500 flex items-center gap-1 justify-end">
            <TrendingUp className="h-3 w-3" /> +2.4%
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 p-4">
        {/* Order Book */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Order Book</h4>

          {/* Sell orders (asks) */}
          <div className="space-y-1">
            {sellOrders.slice(0, 5).reverse().map((order, i) => (
              <div
                key={i}
                className="flex justify-between text-xs py-1 px-2 rounded bg-red-500/5 hover:bg-red-500/10 cursor-pointer"
                onClick={() => setPrice(order.price)}
              >
                <span className="text-red-500">{order.price}</span>
                <span>{order.hive}</span>
                <span className="text-muted-foreground">{order.total}</span>
              </div>
            ))}
          </div>

          {/* Spread */}
          <div className="flex justify-between text-xs py-2 px-2 bg-muted rounded">
            <span>Spread</span>
            <span className="font-medium">{lastPrice} HBD</span>
          </div>

          {/* Buy orders (bids) */}
          <div className="space-y-1">
            {buyOrders.slice(0, 5).map((order, i) => (
              <div
                key={i}
                className="flex justify-between text-xs py-1 px-2 rounded bg-green-500/5 hover:bg-green-500/10 cursor-pointer"
                onClick={() => setPrice(order.price)}
              >
                <span className="text-green-500">{order.price}</span>
                <span>{order.hive}</span>
                <span className="text-muted-foreground">{order.total}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trade Form */}
        <div>
          {/* Buy/Sell tabs */}
          <div className="flex mb-4">
            <button
              onClick={() => setMode("buy")}
              className={\`flex-1 py-2 text-sm font-medium rounded-l-lg \${
                mode === "buy"
                  ? "bg-green-500 text-white"
                  : "bg-muted text-muted-foreground"
              }\`}
            >
              Buy HIVE
            </button>
            <button
              onClick={() => setMode("sell")}
              className={\`flex-1 py-2 text-sm font-medium rounded-r-lg \${
                mode === "sell"
                  ? "bg-red-500 text-white"
                  : "bg-muted text-muted-foreground"
              }\`}
            >
              Sell HIVE
            </button>
          </div>

          {/* Order type */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setOrderType("limit")}
              className={\`px-3 py-1 text-xs rounded \${
                orderType === "limit"
                  ? "bg-hive-red text-white"
                  : "bg-muted text-muted-foreground"
              }\`}
            >
              Limit
            </button>
            <button
              onClick={() => setOrderType("market")}
              className={\`px-3 py-1 text-xs rounded \${
                orderType === "market"
                  ? "bg-hive-red text-white"
                  : "bg-muted text-muted-foreground"
              }\`}
            >
              Market
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {orderType === "limit" && (
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Price (HBD)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  step="0.001"
                  className="w-full px-3 py-2 text-sm rounded-lg bg-muted border border-border focus:border-hive-red focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                Amount (HIVE)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.001"
                className="w-full px-3 py-2 text-sm rounded-lg bg-muted border border-border focus:border-hive-red focus:outline-none"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Available: {mode === "buy" ? availableHbd : availableHive}{" "}
                {mode === "buy" ? "HBD" : "HIVE"}
              </p>
            </div>

            <div className="flex justify-between py-2 px-3 rounded-lg bg-muted text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-medium">{total} HBD</span>
            </div>

            <button
              type="submit"
              disabled={isLoading || !amount}
              className={\`w-full py-3 rounded-lg font-medium text-white disabled:opacity-50 \${
                mode === "buy"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              }\`}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin inline" />
              ) : mode === "buy" ? (
                <>
                  <TrendingUp className="h-4 w-4 inline mr-2" />
                  Buy HIVE
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4 inline mr-2" />
                  Sell HIVE
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}`,
  basicUsage: `"use client";

import { TradeHive } from "@/components/hive/trade-hive";
import { useHiveAuth } from "@/hooks/use-hive-auth";
import { useOrderBook } from "@/hooks/use-order-book";
import { useTrade } from "@/hooks/use-trade";

export function MarketPage() {
  const { user } = useHiveAuth();
  const { buyOrders, sellOrders, lastPrice, account } = useOrderBook();
  const { buy, sell } = useTrade();

  return (
    <TradeHive
      availableHive={account?.balance || "0.000"}
      availableHbd={account?.hbd_balance || "0.000"}
      lastPrice={lastPrice}
      buyOrders={buyOrders}
      sellOrders={sellOrders}
      onBuy={buy}
      onSell={sell}
    />
  );
}`,
  hook: `"use client";

import { useCallback } from "react";
import { useHiveChain } from "@/hooks/use-hive-chain";
import { useHiveAuth } from "@/hooks/use-hive-auth";

export function useTrade() {
  const { chain } = useHiveChain();
  const { user, signTransaction } = useHiveAuth();

  // Buy HIVE with HBD
  const buy = useCallback(async (amount: string, price: string) => {
    if (!user || !chain) return;

    const hbdAmount = (parseFloat(amount) * parseFloat(price)).toFixed(3);

    const tx = chain.createTransaction();
    tx.pushOperation({
      limit_order_create: {
        owner: user.username,
        orderid: Date.now(),
        amount_to_sell: \`\${hbdAmount} HBD\`,
        min_to_receive: \`\${amount} HIVE\`,
        fill_or_kill: false,
        expiration: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19),
      },
    });

    await signTransaction(tx);
  }, [user, chain, signTransaction]);

  // Sell HIVE for HBD
  const sell = useCallback(async (amount: string, price: string) => {
    if (!user || !chain) return;

    const hbdAmount = (parseFloat(amount) * parseFloat(price)).toFixed(3);

    const tx = chain.createTransaction();
    tx.pushOperation({
      limit_order_create: {
        owner: user.username,
        orderid: Date.now(),
        amount_to_sell: \`\${amount} HIVE\`,
        min_to_receive: \`\${hbdAmount} HBD\`,
        fill_or_kill: false,
        expiration: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19),
      },
    });

    await signTransaction(tx);
  }, [user, chain, signTransaction]);

  return { buy, sell };
}`,
};

export default async function TradeHivePage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trade Hive</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Internal market interface for trading HIVE and HBD.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-green-500">Internal Market</p>
            <p className="mt-1 text-sm text-muted-foreground">
              The internal market allows trading HIVE and HBD directly on-chain.
              Orders can be limit or market type. No fees are charged for trading.
            </p>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="max-w-2xl mx-auto rounded-xl border border-border">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h3 className="font-semibold">HIVE/HBD</h3>
              <p className="text-sm text-muted-foreground">Internal Market</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold">0.425 HBD</p>
              <p className="text-sm text-green-500 flex items-center gap-1 justify-end">
                <TrendingUp className="h-3 w-3" /> +2.4%
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 p-4">
            {/* Order Book */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Order Book</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-xs py-1 px-2 rounded bg-red-500/5">
                  <span className="text-red-500">0.430</span>
                  <span>1,234</span>
                  <span className="text-muted-foreground">530.62</span>
                </div>
                <div className="flex justify-between text-xs py-1 px-2 rounded bg-red-500/5">
                  <span className="text-red-500">0.428</span>
                  <span>567</span>
                  <span className="text-muted-foreground">242.68</span>
                </div>
              </div>
              <div className="flex justify-between text-xs py-2 px-2 bg-muted rounded">
                <span>Spread</span>
                <span className="font-medium">0.425 HBD</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs py-1 px-2 rounded bg-green-500/5">
                  <span className="text-green-500">0.423</span>
                  <span>890</span>
                  <span className="text-muted-foreground">376.47</span>
                </div>
                <div className="flex justify-between text-xs py-1 px-2 rounded bg-green-500/5">
                  <span className="text-green-500">0.420</span>
                  <span>2,100</span>
                  <span className="text-muted-foreground">882.00</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <div>
              <div className="flex mb-4">
                <button className="flex-1 py-2 text-sm font-medium rounded-l-lg bg-green-500 text-white">
                  Buy HIVE
                </button>
                <button className="flex-1 py-2 text-sm font-medium rounded-r-lg bg-muted text-muted-foreground">
                  Sell HIVE
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Price (HBD)</label>
                  <div className="px-3 py-2 text-sm rounded-lg bg-muted border border-border">
                    0.425
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Amount (HIVE)</label>
                  <div className="px-3 py-2 text-sm rounded-lg bg-muted border border-border text-muted-foreground">
                    0.000
                  </div>
                </div>
                <div className="flex justify-between py-2 px-3 rounded-lg bg-muted text-sm">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-medium">0.000 HBD</span>
                </div>
                <button className="w-full py-3 rounded-lg bg-green-500 text-white font-medium flex items-center justify-center gap-2">
                  <TrendingUp className="h-4 w-4" /> Buy HIVE
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Component Code */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Component</h2>
        <CodeBlock
          filename="components/hive/trade-hive.tsx"
          code={CODE.component}
          language="typescript"
        />
      </section>

      {/* Basic Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Basic Usage</h2>
        <CodeBlock code={CODE.basicUsage} language="typescript" />
      </section>

      {/* Hook */}
      <section>
        <h2 className="text-xl font-semibold mb-4">useTrade Hook</h2>
        <CodeBlock
          filename="hooks/use-trade.ts"
          code={CODE.hook}
          language="typescript"
        />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Next</h2>
        <div className="flex gap-4">
          <Link
            href="/docs/components/communities-list"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            Communities List
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
