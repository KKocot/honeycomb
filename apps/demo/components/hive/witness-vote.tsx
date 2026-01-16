"use client";

import { useState, useEffect } from "react";
import { Eye, Check, Loader2, Search, ExternalLink } from "lucide-react";
import { useHive } from "@/contexts/hive-context";
import { cn } from "@/lib/utils";

interface Witness {
  owner: string;
  votes: string;
  running_version: string;
  url: string;
  is_disabled: boolean;
}

interface WitnessVoteProps {
  username: string;
  onVote?: (witness: string, approve: boolean) => void;
  className?: string;
}

const mockWitnesses: Witness[] = [
  { owner: "blocktrades", votes: "120000000000", running_version: "1.27.5", url: "https://blocktrades.us", is_disabled: false },
  { owner: "gtg", votes: "115000000000", running_version: "1.27.5", url: "https://gtg.openhive.network", is_disabled: false },
  { owner: "arcange", votes: "110000000000", running_version: "1.27.5", url: "https://arcange.eu", is_disabled: false },
  { owner: "good-karma", votes: "105000000000", running_version: "1.27.5", url: "https://ecency.com", is_disabled: false },
  { owner: "roelandp", votes: "100000000000", running_version: "1.27.5", url: "https://roelandp.nl/witness", is_disabled: false },
];

export function HiveWitnessVote({ username, onVote, className }: WitnessVoteProps) {
  const { chain } = useHive();
  const [witnesses, setWitnesses] = useState<Witness[]>(mockWitnesses);
  const [votedWitnesses, setVotedWitnesses] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const filteredWitnesses = witnesses.filter((w) =>
    w.owner.toLowerCase().includes(search.toLowerCase())
  );

  const handleVote = async (witness: string) => {
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
          {filteredWitnesses.map((witness, index) => {
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
                    #{index + 1}
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
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{formatVotes(witness.votes)} VESTS</span>
                      <span>v{witness.running_version}</span>
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
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground">
            Witnesses secure the Hive blockchain. Vote for trusted node operators.
            You can vote for up to 30 witnesses.
          </p>
        </div>
      </div>
    </div>
  );
}
