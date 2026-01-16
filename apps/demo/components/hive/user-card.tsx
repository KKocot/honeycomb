"use client";

import { useState, useEffect } from "react";
import { MapPin, Calendar, Loader2 } from "lucide-react";
import { useHive } from "@/contexts/hive-context";
import { HiveAvatar } from "./avatar";
import { HiveFollowButton } from "./follow-button";

interface UserCardProps {
  username: string;
  className?: string;
}

interface AccountData {
  name: string;
  posting_json_metadata: string;
  reputation: number;
  created: string;
}

export function HiveUserCard({ username, className = "" }: UserCardProps) {
  const { chain } = useHive();
  const [account, setAccount] = useState<AccountData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [metadata, setMetadata] = useState<any>(null);

  useEffect(() => {
    async function fetchAccount() {
      if (!chain) return;
      try {
        const response = await chain.api.database_api.find_accounts({
          accounts: [username],
        });
        if (response.accounts.length > 0) {
          const acc = response.accounts[0];
          setAccount(acc as unknown as AccountData);
          try {
            const meta = JSON.parse(acc.posting_json_metadata || "{}");
            setMetadata(meta.profile || {});
          } catch {
            setMetadata({});
          }
        }
      } catch (err) {
        console.error("Failed to fetch account:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAccount();
  }, [chain, username]);

  if (isLoading) {
    return (
      <div
        className={`w-full max-w-sm rounded-xl border border-border bg-card p-8 flex justify-center ${className}`}
      >
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!account) {
    return (
      <div
        className={`w-full max-w-sm rounded-xl border border-border bg-card p-4 text-center text-muted-foreground ${className}`}
      >
        User not found
      </div>
    );
  }

  const reputation = Math.floor(
    Math.log10(Math.abs(Number(account.reputation)) || 1) * 9 - 56
  );
  const joinDate = new Date(account.created).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className={`w-full max-w-sm rounded-xl border border-border bg-card overflow-hidden ${className}`}
    >
      {/* Cover */}
      <div
        className="h-20 bg-gradient-to-r from-hive-red to-orange-500"
        style={
          metadata?.cover_image
            ? {
                backgroundImage: `url(${metadata.cover_image})`,
                backgroundSize: "cover",
              }
            : {}
        }
      />

      {/* Profile */}
      <div className="relative px-4 pb-4">
        <div className="absolute -top-8 left-4">
          <HiveAvatar username={username} size="xl" showReputation reputation={reputation} />
        </div>
        <div className="pt-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold">{metadata?.name || username}</h3>
              <p className="text-sm text-muted-foreground">@{username}</p>
            </div>
            <HiveFollowButton username={username} />
          </div>

          {metadata?.about && (
            <p className="mt-2 text-sm line-clamp-2">{metadata.about}</p>
          )}

          <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
            {metadata?.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {metadata.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {joinDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
