"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useHive } from "@/contexts/hive-context";
import { Loader2 } from "lucide-react";

// ===========================================
// Types
// ===========================================

interface ManabarData {
  current: string;
  max: string;
  percentageValue: number;
  cooldown: number; // seconds until full
}

interface ManabarsData {
  upvote: ManabarData;
  downvote: ManabarData;
  rc: ManabarData;
}

type ManabarVariant = "full" | "compact" | "ring";

export interface HiveManabarProps {
  username: string;
  variant?: ManabarVariant;
  showLabels?: boolean;
  showValues?: boolean;
  showCooldown?: boolean;
  className?: string;
}

// ===========================================
// Utilities
// ===========================================

function formatNumber(num: string): string {
  const n = BigInt(num);
  if (n >= BigInt(1e12)) return (Number(n / BigInt(1e9)) / 1000).toFixed(1) + "T";
  if (n >= BigInt(1e9)) return (Number(n / BigInt(1e6)) / 1000).toFixed(1) + "B";
  if (n >= BigInt(1e6)) return (Number(n / BigInt(1e3)) / 1000).toFixed(1) + "M";
  if (n >= BigInt(1e3)) return (Number(n) / 1000).toFixed(1) + "K";
  return num;
}

function formatCooldown(seconds: number): string {
  if (seconds <= 0) return "Full";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

// Calculate manabar from raw blockchain data
const MANA_REGENERATION_SECONDS = 432000; // 5 days in seconds

function calculateManabar(
  currentMana: string,
  maxMana: string,
  lastUpdateTime: number
): { current: string; max: string; percent: number; cooldown: number } {
  const now = Math.floor(Date.now() / 1000);
  const elapsed = now - lastUpdateTime;

  const maxManaNum = BigInt(maxMana);
  let currentManaNum = BigInt(currentMana);

  // Regenerate mana based on time elapsed
  const regenerated = (maxManaNum * BigInt(elapsed)) / BigInt(MANA_REGENERATION_SECONDS);
  currentManaNum = currentManaNum + regenerated;

  // Cap at max
  if (currentManaNum > maxManaNum) {
    currentManaNum = maxManaNum;
  }

  const percent = maxManaNum > BigInt(0)
    ? Number((currentManaNum * BigInt(10000)) / maxManaNum) / 100
    : 0;

  // Calculate cooldown (seconds until full)
  const remaining = maxManaNum - currentManaNum;
  const cooldown = remaining > BigInt(0)
    ? Number((remaining * BigInt(MANA_REGENERATION_SECONDS)) / maxManaNum)
    : 0;

  return {
    current: currentManaNum.toString(),
    max: maxManaNum.toString(),
    percent: Math.min(100, Math.max(0, percent)),
    cooldown,
  };
}

// ===========================================
// Ring Component (SVG circular progress)
// ===========================================

function ManaRing({
  percentage,
  color,
  size = 60,
  strokeWidth = 6,
  children,
}: {
  percentage: number;
  color: string;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
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

// ===========================================
// Single Manabar Display
// ===========================================

function SingleManabar({
  title,
  data,
  color,
  showValues,
  showCooldown,
}: {
  title: string;
  data: ManabarData;
  color: string;
  showValues?: boolean;
  showCooldown?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm font-medium">{title}</span>
      <ManaRing percentage={data.percentageValue} color={color} size={70}>
        <span className="text-sm font-bold">{Math.round(data.percentageValue)}%</span>
      </ManaRing>
      {showValues && (
        <div className="text-xs text-muted-foreground text-center">
          <div>{formatNumber(data.current)} / {formatNumber(data.max)}</div>
        </div>
      )}
      {showCooldown && data.percentageValue < 100 && (
        <div className="text-xs text-muted-foreground">
          Full in: {formatCooldown(data.cooldown)}
        </div>
      )}
    </div>
  );
}

// ===========================================
// Main Component
// ===========================================

export function HiveManabar({
  username,
  variant = "full",
  showLabels = true,
  showValues = false,
  showCooldown = true,
  className,
}: HiveManabarProps) {
  const { chain } = useHive();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ManabarsData | null>(null);

  useEffect(() => {
    async function fetchManabars() {
      if (!chain || !username) return;
      setIsLoading(true);

      try {
        // Fetch account data and RC account data
        const [accountResponse, rcResponse] = await Promise.all([
          chain.api.database_api.find_accounts({ accounts: [username] }),
          chain.api.rc_api.find_rc_accounts({ accounts: [username] }),
        ]);

        if (accountResponse.accounts.length > 0 && rcResponse.rc_accounts.length > 0) {
          const acc = accountResponse.accounts[0];
          const rcAcc = rcResponse.rc_accounts[0];

          // Calculate voting mana (upvote)
          const upvoteMana = calculateManabar(
            acc.voting_manabar.current_mana.toString(),
            acc.post_voting_power.amount.toString(),
            acc.voting_manabar.last_update_time
          );

          // Calculate downvote mana (25% of voting power)
          const downvoteMax = (BigInt(acc.post_voting_power.amount) / BigInt(4)).toString();
          const downvoteMana = calculateManabar(
            acc.downvote_manabar.current_mana.toString(),
            downvoteMax,
            acc.downvote_manabar.last_update_time
          );

          // Calculate RC
          const rcMana = calculateManabar(
            rcAcc.rc_manabar.current_mana.toString(),
            rcAcc.max_rc.toString(),
            rcAcc.rc_manabar.last_update_time
          );

          setData({
            upvote: {
              current: upvoteMana.current,
              max: upvoteMana.max,
              percentageValue: upvoteMana.percent,
              cooldown: upvoteMana.cooldown,
            },
            downvote: {
              current: downvoteMana.current,
              max: downvoteMana.max,
              percentageValue: downvoteMana.percent,
              cooldown: downvoteMana.cooldown,
            },
            rc: {
              current: rcMana.current,
              max: rcMana.max,
              percentageValue: rcMana.percent,
              cooldown: rcMana.cooldown,
            },
          });
        }
      } catch (err) {
        console.error("Failed to fetch manabars:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchManabars();
    // Refresh every minute
    const interval = setInterval(fetchManabars, 60000);
    return () => clearInterval(interval);
  }, [chain, username]);

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center p-4", className)}>
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className={cn("text-sm text-muted-foreground p-4", className)}>
        Failed to load manabars
      </div>
    );
  }

  // Compact variant - just rings in a row
  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <ManaRing percentage={data.upvote.percentageValue} color="#00C040" size={40} strokeWidth={4}>
          <span className="text-[10px] font-bold text-green-500">
            {Math.round(data.upvote.percentageValue)}
          </span>
        </ManaRing>
        <ManaRing percentage={data.downvote.percentageValue} color="#C01000" size={40} strokeWidth={4}>
          <span className="text-[10px] font-bold text-red-500">
            {Math.round(data.downvote.percentageValue)}
          </span>
        </ManaRing>
        <ManaRing percentage={data.rc.percentageValue} color="#0088FE" size={40} strokeWidth={4}>
          <span className="text-[10px] font-bold text-blue-500">
            {Math.round(data.rc.percentageValue)}
          </span>
        </ManaRing>
      </div>
    );
  }

  // Ring variant - single combined ring (shows RC only)
  if (variant === "ring") {
    return (
      <div className={cn("relative", className)}>
        <ManaRing percentage={data.rc.percentageValue} color="#0088FE" size={50} strokeWidth={5}>
          <span className="text-xs font-bold">{Math.round(data.rc.percentageValue)}%</span>
        </ManaRing>
      </div>
    );
  }

  // Full variant - detailed view
  return (
    <div className={cn("flex flex-wrap justify-center gap-6", className)}>
      <SingleManabar
        title={showLabels ? "Voting Power" : ""}
        data={data.upvote}
        color="#00C040"
        showValues={showValues}
        showCooldown={showCooldown}
      />
      <SingleManabar
        title={showLabels ? "Downvote" : ""}
        data={data.downvote}
        color="#C01000"
        showValues={showValues}
        showCooldown={showCooldown}
      />
      <SingleManabar
        title={showLabels ? "Resource Credits" : ""}
        data={data.rc}
        color="#0088FE"
        showValues={showValues}
        showCooldown={showCooldown}
      />
    </div>
  );
}
