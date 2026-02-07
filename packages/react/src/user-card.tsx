"use client";

import { useMemo } from "react";
import { useHiveAccount } from "./use-hive-account";
import { HiveAvatar } from "./avatar";
import { cn } from "./utils";

export type UserCardVariant = "compact" | "default" | "expanded";

export interface UserCardProps {
  /** Hive username */
  username: string;
  /** Card display style */
  variant?: UserCardVariant;
  /** Show post count and balances */
  showStats?: boolean;
  /** Additional CSS classes */
  className?: string;
}

interface ProfileMetadata {
  name?: string;
  about?: string;
  location?: string;
  website?: string;
  profile_image?: string;
  cover_image?: string;
}

/**
 * Format reputation score to human-readable number
 */
function formatReputation(rep: number): number {
  if (rep === 0) return 25;
  const neg = rep < 0;
  const repLevel = Math.log10(Math.abs(rep));
  let reputationLevel = Math.max(repLevel - 9, 0);
  if (repLevel < 0) reputationLevel = 0;
  if (neg) reputationLevel *= -1;
  return Math.floor(reputationLevel * 9 + 25);
}

/**
 * Parse profile metadata from account JSON
 */
function parseMetadata(account: { posting_json_metadata?: string; json_metadata?: string } | null): ProfileMetadata | null {
  if (!account) return null;

  try {
    if (account.posting_json_metadata) {
      const parsed = JSON.parse(account.posting_json_metadata);
      if (parsed.profile) return parsed.profile;
    }
    if (account.json_metadata) {
      const parsed = JSON.parse(account.json_metadata);
      if (parsed.profile) return parsed.profile;
    }
  } catch {
    // Invalid JSON
  }
  return null;
}

/**
 * UserCard Component
 *
 * Display Hive user profile information in various formats.
 * SSR-compatible - renders loading skeleton on server, fetches data on client.
 *
 * @example
 * ```tsx
 * <UserCard username="blocktrades" variant="default" />
 * ```
 */
export function UserCard({
  username,
  variant = "default",
  showStats = true,
  className,
}: UserCardProps) {
  const { account, is_loading, error } = useHiveAccount(username);

  const metadata = useMemo<ProfileMetadata | null>(
    () => parseMetadata(account),
    [account]
  );

  // Loading state
  if (is_loading) {
    return (
      <div
        className={cn(
          "rounded-lg border border-border bg-card p-4 animate-pulse",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-3 w-32 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !account) {
    return (
      <div className={cn("rounded-lg border border-border bg-card p-4", className)}>
        <p className="text-sm text-muted-foreground">
          {error?.message || "User not found"}
        </p>
      </div>
    );
  }

  const reputation = formatReputation(account.reputation);

  // Compact variant
  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <HiveAvatar username={username} size="sm" />
        <div>
          <span className="font-medium">@{username}</span>
          <span className="text-muted-foreground text-sm ml-1">
            ({reputation})
          </span>
        </div>
      </div>
    );
  }

  // Expanded variant
  if (variant === "expanded") {
    return (
      <div
        className={cn(
          "rounded-lg border border-border bg-card overflow-hidden",
          className
        )}
      >
        {metadata?.cover_image && (
          <img
            src={metadata.cover_image}
            alt="Cover"
            className="w-full h-32 object-cover"
          />
        )}
        <div className="p-4">
          <div className="flex items-start gap-4">
            <HiveAvatar
              username={username}
              size="xl"
              className={metadata?.cover_image ? "-mt-10 ring-4 ring-card" : ""}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg truncate">
                {metadata?.name || `@${username}`}
              </h3>
              <p className="text-muted-foreground text-sm">
                @{username} • Rep: {reputation}
              </p>
            </div>
          </div>

          {metadata?.about && (
            <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
              {metadata.about}
            </p>
          )}

          {showStats && (
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold">{account.post_count}</p>
                <p className="text-xs text-muted-foreground">Posts</p>
              </div>
              <div>
                <p className="text-lg font-bold">
                  {account.balance.split(" ")[0]}
                </p>
                <p className="text-xs text-muted-foreground">HIVE</p>
              </div>
              <div>
                <p className="text-lg font-bold">
                  {account.hbd_balance.split(" ")[0]}
                </p>
                <p className="text-xs text-muted-foreground">HBD</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn("rounded-lg border border-border bg-card p-4", className)}>
      <div className="flex items-center gap-3">
        <HiveAvatar username={username} size="lg" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">
            {metadata?.name || `@${username}`}
          </h3>
          <p className="text-sm text-muted-foreground">
            @{username} • Rep: {reputation}
          </p>
        </div>
      </div>

      {showStats && (
        <div className="mt-3 flex gap-4 text-sm">
          <span>{account.post_count} posts</span>
          <span>{account.balance}</span>
        </div>
      )}
    </div>
  );
}
