"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useHive } from "./hive-provider";
import { cn } from "./utils";
import {
  calculate_manabar,
  format_mana_number,
  format_cooldown,
  type ManabarData,
} from "@kkocot/honeycomb-core";

export type ManabarVariant = "full" | "compact" | "ring";

export interface HiveManabarProps {
  username: string;
  variant?: ManabarVariant;
  showLabels?: boolean;
  showValues?: boolean;
  showCooldown?: boolean;
  className?: string;
}

interface ManabarsState {
  upvote: ManabarData;
  downvote: ManabarData;
  rc: ManabarData;
}

const MANA_COLORS = {
  upvote: "#00C040",
  downvote: "#C01000",
  rc: "#0088FE",
};

function ManaRing({
  percentage,
  color,
  size = 60,
  stroke_width = 6,
  children,
}: {
  percentage: number;
  color: string;
  size?: number;
  stroke_width?: number;
  children?: ReactNode;
}) {
  const radius = (size - stroke_width) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke_width}
          className="text-hive-muted/30"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke_width}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

function SingleManabar({
  title,
  data,
  color,
  show_values,
  show_cooldown,
}: {
  title: string;
  data: ManabarData;
  color: string;
  show_values?: boolean;
  show_cooldown?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      {title && (
        <span className="text-sm font-medium text-hive-foreground">
          {title}
        </span>
      )}
      <ManaRing percentage={data.percentage} color={color} size={70}>
        <span className="text-sm font-bold text-hive-foreground">
          {Math.round(data.percentage)}%
        </span>
      </ManaRing>
      {show_values && (
        <div className="text-xs text-hive-muted-foreground text-center">
          {format_mana_number(data.current)} /{" "}
          {format_mana_number(data.max)}
        </div>
      )}
      {show_cooldown && data.percentage < 100 && (
        <div className="text-xs text-hive-muted-foreground">
          Full in: {format_cooldown(data.cooldown)}
        </div>
      )}
    </div>
  );
}

export function HiveManabar({
  username,
  variant = "full",
  showLabels = true,
  showValues = false,
  showCooldown = true,
  className,
}: HiveManabarProps) {
  const { chain } = useHive();
  const [is_loading, set_is_loading] = useState(true);
  const [data, set_data] = useState<ManabarsState | null>(null);
  const [error, set_error] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetch_manabars() {
      if (!chain || !username) return;

      try {
        const [account_response, rc_response] = await Promise.all([
          chain.api.database_api.find_accounts({ accounts: [username.toLowerCase()] }),
          chain.api.rc_api.find_rc_accounts({ accounts: [username.toLowerCase()] }),
        ]);

        if (cancelled) return;

        if (
          account_response.accounts.length === 0 ||
          rc_response.rc_accounts.length === 0
        ) {
          set_error(new Error("User not found"));
          set_is_loading(false);
          return;
        }

        const acc = account_response.accounts[0];
        const rc_acc = rc_response.rc_accounts[0];

        const upvote = calculate_manabar(
          acc.voting_manabar.current_mana.toString(),
          acc.post_voting_power.amount.toString(),
          acc.voting_manabar.last_update_time,
        );

        const downvote_max = (
          BigInt(acc.post_voting_power.amount) / BigInt(4)
        ).toString();
        const downvote = calculate_manabar(
          acc.downvote_manabar.current_mana.toString(),
          downvote_max,
          acc.downvote_manabar.last_update_time,
        );

        const rc = calculate_manabar(
          rc_acc.rc_manabar.current_mana.toString(),
          rc_acc.max_rc.toString(),
          rc_acc.rc_manabar.last_update_time,
        );

        set_data({ upvote, downvote, rc });
        set_error(null);
      } catch {
        if (!cancelled) {
          set_error(new Error("Failed to load manabars"));
        }
      } finally {
        if (!cancelled) {
          set_is_loading(false);
        }
      }
    }

    set_is_loading(true);
    fetch_manabars();

    const interval = setInterval(fetch_manabars, 60000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [chain, username]);

  if (is_loading) {
    return (
      <div
        className={cn(
          "rounded-lg border border-hive-border bg-hive-card p-4 animate-pulse",
          className,
        )}
      >
        <div className="flex justify-center gap-6">
          <div className="h-[70px] w-[70px] rounded-full bg-hive-muted" />
          <div className="h-[70px] w-[70px] rounded-full bg-hive-muted" />
          <div className="h-[70px] w-[70px] rounded-full bg-hive-muted" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div
        className={cn(
          "rounded-lg border border-hive-border bg-hive-card p-4",
          className,
        )}
      >
        <p className="text-sm text-hive-muted-foreground">
          {error?.message ?? "Failed to load manabars"}
        </p>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <ManaRing
          percentage={data.upvote.percentage}
          color={MANA_COLORS.upvote}
          size={40}
          stroke_width={4}
        >
          <span className="text-[10px] font-bold" style={{ color: MANA_COLORS.upvote }}>
            {Math.round(data.upvote.percentage)}
          </span>
        </ManaRing>
        <ManaRing
          percentage={data.downvote.percentage}
          color={MANA_COLORS.downvote}
          size={40}
          stroke_width={4}
        >
          <span className="text-[10px] font-bold" style={{ color: MANA_COLORS.downvote }}>
            {Math.round(data.downvote.percentage)}
          </span>
        </ManaRing>
        <ManaRing
          percentage={data.rc.percentage}
          color={MANA_COLORS.rc}
          size={40}
          stroke_width={4}
        >
          <span className="text-[10px] font-bold" style={{ color: MANA_COLORS.rc }}>
            {Math.round(data.rc.percentage)}
          </span>
        </ManaRing>
      </div>
    );
  }

  if (variant === "ring") {
    return (
      <div className={cn("relative", className)}>
        <ManaRing
          percentage={data.rc.percentage}
          color={MANA_COLORS.rc}
          size={50}
          stroke_width={5}
        >
          <span className="text-xs font-bold text-hive-foreground">
            {Math.round(data.rc.percentage)}%
          </span>
        </ManaRing>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap justify-center gap-6", className)}>
      <SingleManabar
        title={showLabels ? "Voting Power" : ""}
        data={data.upvote}
        color={MANA_COLORS.upvote}
        show_values={showValues}
        show_cooldown={showCooldown}
      />
      <SingleManabar
        title={showLabels ? "Downvote" : ""}
        data={data.downvote}
        color={MANA_COLORS.downvote}
        show_values={showValues}
        show_cooldown={showCooldown}
      />
      <SingleManabar
        title={showLabels ? "Resource Credits" : ""}
        data={data.rc}
        color={MANA_COLORS.rc}
        show_values={showValues}
        show_cooldown={showCooldown}
      />
    </div>
  );
}
