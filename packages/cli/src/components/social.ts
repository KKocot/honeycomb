import type { ComponentDefinition } from "../registry.js";

export const userCard: ComponentDefinition = {
  name: "user-card",
  description: "Display Hive user profile card with metadata (passive - read-only)",
  category: "social",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils", "avatar", "hive-provider"],
  files: [
    {
      path: "components/hive/user-card.tsx",
      content: `"use client";

import { useState, useEffect } from "react";
import { MapPin, Calendar, Loader2 } from "lucide-react";
import { useHive } from "@/contexts/hive-context";
import { Avatar } from "./avatar";

interface UserCardProps {
  username: string;
  className?: string;
}

export function UserCard({ username, className = "" }: UserCardProps) {
  const { chain } = useHive();
  const [account, setAccount] = useState<any>(null);
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
          setAccount(acc);
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
      <div className={\`w-full max-w-sm rounded-xl border border-border bg-card p-8 flex justify-center \${className}\`}>
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className={\`w-full max-w-sm rounded-xl border border-border bg-card p-4 text-center text-muted-foreground \${className}\`}>
        User not found
      </div>
    );
  }

  const reputation = Math.floor(Math.log10(Math.abs(Number(account.reputation)) || 1) * 9 - 56);
  const joinDate = new Date(account.created).toLocaleDateString("en-US", { month: "short", year: "numeric" });

  return (
    <div className={\`w-full max-w-sm rounded-xl border border-border bg-card overflow-hidden \${className}\`}>
      <div
        className="h-20 bg-gradient-to-r from-hive-red to-orange-500"
        style={metadata?.cover_image ? { backgroundImage: \`url(\${metadata.cover_image})\`, backgroundSize: "cover" } : {}}
      />

      <div className="relative px-4 pb-4">
        <div className="absolute -top-8 left-4">
          <Avatar username={username} size="xl" showReputation reputation={reputation} />
        </div>
        <div className="pt-10">
          <div>
            <h3 className="font-bold">{metadata?.name || username}</h3>
            <p className="text-sm text-muted-foreground">@{username}</p>
          </div>

          {metadata?.about && <p className="mt-2 text-sm line-clamp-2">{metadata.about}</p>}

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
`,
    },
  ],
};

export const badgeList: ComponentDefinition = {
  name: "badge-list",
  description: "Display user badges/roles",
  category: "social",
  dependencies: [],
  registryDependencies: ["utils"],
  files: [
    {
      path: "components/hive/badge-list.tsx",
      content: `"use client";

import { cn } from "@/lib/utils";

interface Badge {
  name: string;
  color: string;
  icon?: string;
}

interface BadgeListProps {
  badges: Badge[];
  className?: string;
}

const defaultBadges: Badge[] = [
  { name: "Whale", color: "bg-blue-500", icon: "🐋" },
  { name: "Witness", color: "bg-purple-500", icon: "👁️" },
  { name: "Developer", color: "bg-green-500", icon: "💻" },
  { name: "Curator", color: "bg-orange-500", icon: "✨" },
];

export function BadgeList({ badges = defaultBadges, className }: BadgeListProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {badges.map((badge) => (
        <span
          key={badge.name}
          className={cn(
            "flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium text-white",
            badge.color
          )}
        >
          {badge.icon && <span>{badge.icon}</span>}
          {badge.name}
        </span>
      ))}
    </div>
  );
}
`,
    },
  ],
};
