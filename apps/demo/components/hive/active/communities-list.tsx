"use client";

import { useState, useEffect } from "react";
import { Globe, Users, Bell, BellOff, Loader2, Search, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHive } from "@/contexts/hive-context";
import { LoginPromptDialog } from "./login-prompt-dialog";

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

export function HiveCommunitiesList({ username, onSubscribe, className }: CommunitiesListProps) {
  const { user } = useHive();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [subscribed, setSubscribed] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  // Fetch communities and user subscriptions
  useEffect(() => {
    async function fetchData() {
      setLoadingData(true);
      try {
        // Fetch ranked communities
        const communitiesRes = await fetch("https://api.hive.blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "bridge.list_communities",
            params: { sort: "rank", limit: 20 },
            id: 1,
          }),
        });

        const communitiesData = await communitiesRes.json();
        if (communitiesData.result) {
          setCommunities(communitiesData.result.map((c: any) => ({
            name: c.name,
            title: c.title,
            about: c.about || "",
            subscribers: c.subscribers || 0,
            num_pending: c.num_pending || 0,
            num_authors: c.num_authors || 0,
            avatar_url: c.avatar_url,
          })));
        }

        // Fetch user subscriptions if username is provided
        if (username) {
          const subsRes = await fetch("https://api.hive.blog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              method: "bridge.list_all_subscriptions",
              params: { account: username },
              id: 2,
            }),
          });

          const subsData = await subsRes.json();
          if (subsData.result) {
            // Result is array of [community_name, title] pairs
            setSubscribed(subsData.result.map((s: [string, string]) => s[0]));
          }
        }
      } catch (err) {
        console.error("Failed to fetch communities:", err);
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, [username]);

  const handleSubscribe = async (communityName: string) => {
    // Check if user is logged in
    if (!user) {
      setPendingAction(communityName);
      setShowLoginDialog(true);
      return;
    }

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

  const handleLoginSuccess = () => {
    setShowLoginDialog(false);
    if (pendingAction) {
      handleSubscribe(pendingAction);
      setPendingAction(null);
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
            {loadingData && <Loader2 className="h-4 w-4 animate-spin ml-auto" />}
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
          {loadingData ? (
            <div className="p-8 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Loading communities...</p>
            </div>
          ) : filteredCommunities.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No communities found
            </div>
          ) : (
            filteredCommunities.map((community) => {
              const isSubscribed = subscribed.includes(community.name);
              const isLoadingThis = isLoading === community.name;

              return (
                <div key={community.name} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                      {community.avatar_url ? (
                        <img
                          src={community.avatar_url}
                          alt={community.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        community.title.charAt(0)
                      )}
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
                        {community.about || "No description"}
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
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30 text-center">
          <p className="text-xs text-muted-foreground">
            {user ? (
              <>You are subscribed to {subscribed.length} communities</>
            ) : (
              <>Login to join communities and see their posts in your feed</>
            )}
          </p>
        </div>
      </div>

      {/* Login Dialog */}
      <LoginPromptDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onSuccess={handleLoginSuccess}
        title="Login Required"
        description="You need to be logged in to join communities."
      />
    </div>
  );
}
