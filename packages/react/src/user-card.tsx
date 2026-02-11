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
 * Parse profile metadata from account JSON
 */
function parse_metadata(
  account: { posting_json_metadata?: string; json_metadata?: string } | null,
): ProfileMetadata | null {
  if (!account) return null;

  try {
    if (account.posting_json_metadata) {
      const parsed: unknown = JSON.parse(account.posting_json_metadata);
      if (
        typeof parsed === "object" &&
        parsed !== null &&
        "profile" in parsed
      ) {
        return (parsed as { profile: ProfileMetadata }).profile;
      }
    }
    if (account.json_metadata) {
      const parsed: unknown = JSON.parse(account.json_metadata);
      if (
        typeof parsed === "object" &&
        parsed !== null &&
        "profile" in parsed
      ) {
        return (parsed as { profile: ProfileMetadata }).profile;
      }
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
    () => parse_metadata(account),
    [account]
  );

  // Loading state
  if (is_loading) {
    return (
      <div
        className={cn(
          "rounded-lg border border-hive-border bg-hive-card p-4 animate-pulse",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-hive-muted" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-hive-muted rounded" />
            <div className="h-3 w-32 bg-hive-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !account) {
    return (
      <div className={cn("rounded-lg border border-hive-border bg-hive-card p-4", className)}>
        <p className="text-sm text-hive-muted-foreground">
          {error?.message || "User not found"}
        </p>
      </div>
    );
  }

  // Reputation already formatted by useHiveAccount hook
  const reputation = account.reputation;

  // Compact variant
  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <HiveAvatar username={username} size="sm" />
        <div>
          <span className="font-medium">@{username}</span>
          <span className="text-hive-muted-foreground text-sm ml-1">
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
          "rounded-lg border border-hive-border bg-hive-card overflow-hidden",
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
              className={metadata?.cover_image ? "-mt-10 ring-4 ring-hive-card" : ""}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg truncate">
                {metadata?.name || `@${username}`}
              </h3>
              <p className="text-hive-muted-foreground text-sm">
                @{username} • Rep: {reputation}
              </p>
            </div>
          </div>

          {metadata?.about && (
            <p className="mt-3 text-sm text-hive-muted-foreground line-clamp-2">
              {metadata.about}
            </p>
          )}

          {showStats && (
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold">{account.post_count}</p>
                <p className="text-xs text-hive-muted-foreground">Posts</p>
              </div>
              <div>
                <p className="text-lg font-bold">
                  {account.hive_power.split(" ")[0]}
                </p>
                <p className="text-xs text-hive-muted-foreground">HP</p>
              </div>
              <div>
                <p className="text-lg font-bold">
                  {account.balance.split(" ")[0]}
                </p>
                <p className="text-xs text-hive-muted-foreground">HIVE</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn("rounded-lg border border-hive-border bg-hive-card p-4", className)}>
      <div className="flex items-center gap-3">
        <HiveAvatar username={username} size="lg" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">
            {metadata?.name || `@${username}`}
          </h3>
          <p className="text-sm text-hive-muted-foreground">
            @{username} • Rep: {reputation}
          </p>
        </div>
      </div>

      {showStats && (
        <div className="mt-3 flex gap-4 text-sm">
          <span>{account.post_count} posts</span>
          <span>{account.hive_power}</span>
        </div>
      )}
    </div>
  );
}
