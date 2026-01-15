"use client";

import { useState } from "react";
import { Globe, Users, Bell, BellOff, Loader2, Search, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Community {
  name: string;
  title: string;
  about: string;
  subscribers: number;
  num_pending: number;
  num_authors: number;
  avatar_url?: string;
}

interface CommunitiesListProps {
  username: string;
  onSubscribe?: (community: string, subscribed: boolean) => void;
  className?: string;
}

const mockCommunities: Community[] = [
  {
    name: "hive-167922",
    title: "LeoFinance",
    about: "Pair crypto & finance content creators with a token-powered community.",
    subscribers: 12500,
    num_pending: 150,
    num_authors: 890,
  },
  {
    name: "hive-174578",
    title: "OCD",
    about: "Original Content & Curation on Hive",
    subscribers: 10200,
    num_pending: 200,
    num_authors: 750,
  },
  {
    name: "hive-140217",
    title: "Hive Gaming",
    about: "Community for gamers on Hive blockchain",
    subscribers: 8900,
    num_pending: 180,
    num_authors: 620,
  },
  {
    name: "hive-148441",
    title: "Pinmapple",
    about: "Travel community. Share your adventures!",
    subscribers: 7500,
    num_pending: 120,
    num_authors: 450,
  },
  {
    name: "hive-163772",
    title: "Photography Lovers",
    about: "A community for photography enthusiasts",
    subscribers: 6800,
    num_pending: 95,
    num_authors: 380,
  },
];

export function CommunitiesList({ username, onSubscribe, className }: CommunitiesListProps) {
  const [communities] = useState<Community[]>(mockCommunities);
  const [subscribed, setSubscribed] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSubscribe = async (communityName: string) => {
    const isSubscribed = subscribed.includes(communityName);
    setIsLoading(communityName);

    try {
      await new Promise((r) => setTimeout(r, 600));

      if (isSubscribed) {
        setSubscribed((prev) => prev.filter((c) => c !== communityName));
      } else {
        setSubscribed((prev) => [...prev, communityName]);
      }

      onSubscribe?.(communityName, !isSubscribed);
    } finally {
      setIsLoading(null);
    }
  };

  const filteredCommunities = communities.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.about.toLowerCase().includes(search.toLowerCase())
  );

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className={cn("w-full max-w-lg", className)}>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">Communities</h3>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search communities..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-sm"
            />
          </div>
        </div>

        {/* Communities List */}
        <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
          {filteredCommunities.map((community) => {
            const isSubscribed = subscribed.includes(community.name);
            const isLoadingThis = isLoading === community.name;

            return (
              <div key={community.name} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                    {community.title.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-medium truncate">{community.title}</h4>
                      <button
                        onClick={() => handleSubscribe(community.name)}
                        disabled={isLoadingThis}
                        className={cn(
                          "flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium shrink-0",
                          isSubscribed
                            ? "bg-muted text-foreground"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        )}
                      >
                        {isLoadingThis ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : isSubscribed ? (
                          <>
                            <BellOff className="h-4 w-4" />
                            Joined
                          </>
                        ) : (
                          <>
                            <Bell className="h-4 w-4" />
                            Join
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {community.about}
                    </p>

                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {formatNumber(community.subscribers)}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {community.num_pending} pending
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30 text-center">
          <p className="text-xs text-muted-foreground">
            Join communities to see their posts in your feed
          </p>
        </div>
      </div>
    </div>
  );
}
