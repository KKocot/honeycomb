"use client";

import { useState, useEffect } from "react";
import { Eye, Check, Loader2, Search, ExternalLink } from "lucide-react";
import { useHive } from "@/contexts/hive-context";
import { cn } from "@/lib/utils";
import { LoginPromptDialog } from "./login-prompt-dialog";

interface Witness {
  owner: string;
  votes: string;
  running_version: string;
  url: string;
  is_disabled: boolean;
  rank: number;
}

interface WitnessVoteProps {
  username: string;
  onVote?: (witness: string, approve: boolean) => void;
  className?: string;
}

export function HiveWitnessVote({ username, onVote, className }: WitnessVoteProps) {
  const { user } = useHive();
  const [witnesses, setWitnesses] = useState<Witness[]>([]);
  const [votedWitnesses, setVotedWitnesses] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  // Fetch witnesses and user's votes
  useEffect(() => {
    async function fetchData() {
      setLoadingData(true);
      try {
        // Fetch top witnesses by vote
        const witnessesRes = await fetch("https://api.hive.blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "condenser_api.get_witnesses_by_vote",
            params: ["", 50],
            id: 1,
          }),
        });

        const witnessesData = await witnessesRes.json();
        if (witnessesData.result) {
          setWitnesses(witnessesData.result.map((w: any, index: number) => ({
            owner: w.owner,
            votes: w.votes,
            running_version: w.running_version,
            url: w.url,
            is_disabled: w.signing_key === "STM1111111111111111111111111111111114T1Anm",
            rank: index + 1,
          })));
        }

        // Fetch user's witness votes if username is provided
        if (username) {
          const accountRes = await fetch("https://api.hive.blog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              method: "condenser_api.get_accounts",
              params: [[username]],
              id: 2,
            }),
          });

          const accountData = await accountRes.json();
          if (accountData.result?.[0]) {
            const account = accountData.result[0];
            setVotedWitnesses(account.witness_votes || []);
          }
        }
      } catch (err) {
        console.error("Failed to fetch witnesses:", err);
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, [username]);

  const filteredWitnesses = witnesses.filter((w) =>
    w.owner.toLowerCase().includes(search.toLowerCase())
  );

  const handleVote = async (witness: string) => {
    // Check if user is logged in
    if (!user) {
      setPendingAction(witness);
      setShowLoginDialog(true);
      return;
    }

    const isVoted = votedWitnesses.includes(witness);
    setIsLoading(witness);

    try {
      await new Promise((r) => setTimeout(r, 800));

      if (isVoted) {
        setVotedWitnesses((prev) => prev.filter((w) => w !== witness));
      } else {
        if (votedWitnesses.length >= 30) {
          alert("You can only vote for 30 witnesses");
          return;
        }
        setVotedWitnesses((prev) => [...prev, witness]);
      }

      onVote?.(witness, !isVoted);
    } finally {
      setIsLoading(null);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginDialog(false);
    if (pendingAction) {
      handleVote(pendingAction);
      setPendingAction(null);
    }
  };

  const formatVotes = (votes: string) => {
    const num = parseInt(votes) / 1000000;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}T`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}B`;
    return `${num.toFixed(1)}M`;
  };

  return (
    <div className={cn("w-full max-w-lg", className)}>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-purple-500" />
              <h3 className="font-semibold">Witness Votes</h3>
              {loadingData && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
            <span className="text-sm text-muted-foreground">
              {votedWitnesses.length}/30 votes
            </span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search witnesses..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-sm"
            />
          </div>
        </div>

        {/* Witness List */}
        <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
          {loadingData ? (
            <div className="p-8 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Loading witnesses...</p>
            </div>
          ) : filteredWitnesses.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No witnesses found
            </div>
          ) : (
            filteredWitnesses.map((witness) => {
              const isVoted = votedWitnesses.includes(witness.owner);
              const isLoadingThis = isLoading === witness.owner;

              return (
                <div
                  key={witness.owner}
                  className={cn(
                    "flex items-center justify-between p-4",
                    witness.is_disabled && "opacity-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-6">
                      #{witness.rank}
                    </span>
                    <img
                      src={`https://images.hive.blog/u/${witness.owner}/avatar/small`}
                      alt={witness.owner}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">@{witness.owner}</span>
                        {witness.url && (
                          <a
                            href={witness.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {isVoted && (
                          <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-purple-500/10 text-purple-500">
                            Voted
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{formatVotes(witness.votes)} VESTS</span>
                        <span>v{witness.running_version}</span>
                        {witness.is_disabled && (
                          <span className="text-red-500">Disabled</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleVote(witness.owner)}
                    disabled={isLoadingThis || witness.is_disabled}
                    className={cn(
                      "flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                      isVoted
                        ? "bg-green-500 text-white"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {isLoadingThis ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isVoted ? (
                      <>
                        <Check className="h-4 w-4" />
                        Voted
                      </>
                    ) : (
                      "Vote"
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground">
            {user ? (
              <>You have voted for {votedWitnesses.length} of 30 witnesses</>
            ) : (
              <>Login to vote for trusted witnesses who secure the Hive blockchain</>
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
        description="You need to be logged in to vote for witnesses."
      />
    </div>
  );
}
