"use client";

import { useState, useEffect } from "react";
import { Zap, Wallet, TrendingUp, Loader2, RefreshCw } from "lucide-react";
import { useHive } from "@/contexts/hive-context";
import { cn } from "@/lib/utils";
import type { NaiAsset } from "@hiveio/wax";

interface BalanceCardProps {
  username: string;
  className?: string;
}

interface Balances {
  hive: string;
  hbd: string;
  hp: string;
  savingsHive: string;
  savingsHbd: string;
}

// NAI symbol mapping
const NAI_SYMBOLS: Record<string, string> = {
  "@@000000021": "HIVE",
  "@@000000013": "HBD",
  "@@000000037": "VESTS",
};

// Format NaiAsset to human-readable string
function formatNaiAsset(asset: NaiAsset, overrideSymbol?: string): string {
  const amount = Number(asset.amount) / Math.pow(10, asset.precision);
  const symbol = overrideSymbol || NAI_SYMBOLS[asset.nai] || "";
  return `${amount.toFixed(asset.precision)} ${symbol}`.trim();
}

// Convert VESTS to HP using dynamic global properties
function convertVestsToHP(
  vests: NaiAsset,
  totalVestingShares: NaiAsset,
  totalVestingFundHive: NaiAsset
): string {
  const userVests = Number(vests.amount) / Math.pow(10, vests.precision);
  const totalVests = Number(totalVestingShares.amount) / Math.pow(10, totalVestingShares.precision);
  const totalHive = Number(totalVestingFundHive.amount) / Math.pow(10, totalVestingFundHive.precision);

  const hp = (userVests / totalVests) * totalHive;
  return `${hp.toFixed(3)} HP`;
}

export function HiveBalanceCard({ username, className }: BalanceCardProps) {
  const { chain } = useHive();
  const [balances, setBalances] = useState<Balances | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBalances = async () => {
    if (!chain) return;
    setIsLoading(true);
    try {
      // Fetch account data and dynamic global properties in parallel
      const [accountResponse, dynamicProps] = await Promise.all([
        chain.api.database_api.find_accounts({ accounts: [username] }),
        chain.api.database_api.get_dynamic_global_properties({}),
      ]);

      if (accountResponse.accounts.length > 0) {
        const acc = accountResponse.accounts[0];

        setBalances({
          hive: formatNaiAsset(acc.balance),
          hbd: formatNaiAsset(acc.hbd_balance),
          hp: convertVestsToHP(
            acc.vesting_shares,
            dynamicProps.total_vesting_shares,
            dynamicProps.total_vesting_fund_hive
          ),
          savingsHive: formatNaiAsset(acc.savings_balance),
          savingsHbd: formatNaiAsset(acc.savings_hbd_balance),
        });
      }
    } catch (err) {
      console.error("Failed to fetch balances:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, [chain, username]);

  if (isLoading) {
    return (
      <div
        className={cn(
          "w-full max-w-sm rounded-xl border border-border bg-card p-8 flex justify-center",
          className
        )}
      >
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full max-w-sm rounded-xl border border-border bg-card p-4",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Wallet</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">@{username}</span>
          <button
            onClick={fetchBalances}
            className="p-1 rounded hover:bg-muted"
          >
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-hive-red/10 p-2">
              <Zap className="h-4 w-4 text-hive-red" />
            </div>
            <span className="font-medium">HIVE</span>
          </div>
          <span className="font-bold">{balances?.hive || "0"}</span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-green-500/10 p-2">
              <Wallet className="h-4 w-4 text-green-500" />
            </div>
            <span className="font-medium">HBD</span>
          </div>
          <span className="font-bold">{balances?.hbd || "0"}</span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-blue-500/10 p-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
            <span className="font-medium">Hive Power</span>
          </div>
          <span className="font-bold">{balances?.hp || "0"}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground mb-2">Savings</p>
        <div className="flex gap-4 text-sm">
          <span className="font-medium">{balances?.savingsHive || "0 HIVE"}</span>
          <span className="font-medium">{balances?.savingsHbd || "0 HBD"}</span>
        </div>
      </div>
    </div>
  );
}
