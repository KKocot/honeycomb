"use client";

import { useHiveAccount } from "./use-hive-account";
import { cn } from "./utils";

export type BalanceCardVariant = "compact" | "default" | "expanded";

export interface BalanceCardProps {
  username: string;
  variant?: BalanceCardVariant;
  className?: string;
}

function split_value(formatted: string): { amount: string; symbol: string } {
  const parts = formatted.split(" ");
  return { amount: parts[0] ?? "0", symbol: parts.slice(1).join(" ") };
}

export function BalanceCard({
  username,
  variant = "default",
  className,
}: BalanceCardProps) {
  const { account, is_loading, error } = useHiveAccount(username);

  if (is_loading) {
    return (
      <div
        className={cn(
          "rounded-lg border border-hive-border bg-hive-card p-4 animate-pulse",
          className,
        )}
      >
        <div className="h-4 w-32 bg-hive-muted rounded mb-3" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-hive-muted rounded" />
          <div className="h-4 w-full bg-hive-muted rounded" />
          <div className="h-4 w-3/4 bg-hive-muted rounded" />
        </div>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div
        className={cn(
          "rounded-lg border border-hive-border bg-hive-card p-4",
          className,
        )}
      >
        <p className="text-sm text-hive-muted-foreground">
          {error?.message || "User not found"}
        </p>
      </div>
    );
  }

  const hive = split_value(account.balance);
  const hbd = split_value(account.hbd_balance);

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-3 text-sm", className)}>
        <span>
          <span className="font-medium">{hive.amount}</span>{" "}
          <span className="text-hive-muted-foreground">{hive.symbol}</span>
        </span>
        <span className="text-hive-muted-foreground">&#183;</span>
        <span>
          <span className="font-medium">{hbd.amount}</span>{" "}
          <span className="text-hive-muted-foreground">{hbd.symbol}</span>
        </span>
        <span className="text-hive-muted-foreground">&#183;</span>
        <span>
          <span className="font-medium">
            {split_value(account.hive_power).amount}
          </span>{" "}
          <span className="text-hive-muted-foreground">HP</span>
        </span>
      </div>
    );
  }

  if (variant === "expanded") {
    const own_hp = split_value(account.hive_power);
    const received = split_value(account.received_hp);
    const delegated = split_value(account.delegated_hp);
    const effective = split_value(account.effective_hp);
    const savings_hive = split_value(account.savings_balance);
    const savings_hbd = split_value(account.savings_hbd_balance);

    return (
      <div
        className={cn(
          "rounded-lg border border-hive-border bg-hive-card p-4",
          className,
        )}
      >
        <h3 className="text-sm font-semibold mb-3">@{username} Wallet</h3>

        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-sm text-hive-muted-foreground">HIVE</span>
            <span className="font-medium">{hive.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-hive-muted-foreground">HBD</span>
            <span className="font-medium">{hbd.amount}</span>
          </div>
        </div>

        <div className="pt-3 mt-3 border-t border-hive-border space-y-1">
          <p className="text-sm font-semibold mb-1">Hive Power</p>
          <div className="flex justify-between">
            <span className="text-sm text-hive-muted-foreground pl-2">
              Own HP
            </span>
            <span className="font-medium">{own_hp.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-green-500 pl-2">+ Received</span>
            <span className="font-medium text-green-500">
              {received.amount}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-red-500 pl-2">- Delegated</span>
            <span className="font-medium text-red-500">
              {delegated.amount}
            </span>
          </div>
          <div className="flex justify-between pt-1 border-t border-hive-border">
            <span className="text-sm font-bold text-hive-red pl-2">
              Effective
            </span>
            <span className="font-bold text-hive-red">{effective.amount}</span>
          </div>
        </div>

        <div className="pt-3 mt-3 border-t border-hive-border space-y-1">
          <p className="text-sm font-semibold mb-1">Savings</p>
          <div className="flex justify-between">
            <span className="text-sm text-hive-muted-foreground pl-2">
              HIVE
            </span>
            <span className="font-medium">{savings_hive.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-hive-muted-foreground pl-2">
              HBD
            </span>
            <span className="font-medium">{savings_hbd.amount}</span>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={cn(
        "rounded-lg border border-hive-border bg-hive-card p-4",
        className,
      )}
    >
      <h3 className="text-sm font-semibold mb-3">@{username} Wallet</h3>

      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-sm text-hive-muted-foreground">HIVE</span>
          <span className="font-medium">{hive.amount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-hive-muted-foreground">HBD</span>
          <span className="font-medium">{hbd.amount}</span>
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-hive-border">
        <div className="flex justify-between">
          <span className="text-sm text-hive-muted-foreground">Hive Power</span>
          <span className="font-medium">
            {split_value(account.hive_power).amount}
          </span>
        </div>
      </div>
    </div>
  );
}
