"use client";

import { useState } from "react";
import { FileText, ThumbsUp, ThumbsDown, Loader2, ExternalLink, Calendar, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

interface Proposal {
  id: number;
  creator: string;
  subject: string;
  daily_pay: string;
  total_votes: string;
  status: "active" | "inactive" | "expired";
  start_date: string;
  end_date: string;
}

interface ProposalsProps {
  username: string;
  onVote?: (proposalId: number, approve: boolean) => void;
  className?: string;
}

const mockProposals: Proposal[] = [
  {
    id: 245,
    creator: "hiveio",
    subject: "Core Development - Q1 2024",
    daily_pay: "500.000 HBD",
    total_votes: "85000000000",
    status: "active",
    start_date: "2024-01-01",
    end_date: "2024-03-31",
  },
  {
    id: 244,
    creator: "ecency",
    subject: "Ecency Development & Infrastructure",
    daily_pay: "350.000 HBD",
    total_votes: "75000000000",
    status: "active",
    start_date: "2024-01-01",
    end_date: "2024-06-30",
  },
  {
    id: 243,
    creator: "peakd",
    subject: "PeakD Frontend Development",
    daily_pay: "300.000 HBD",
    total_votes: "70000000000",
    status: "active",
    start_date: "2024-01-01",
    end_date: "2024-12-31",
  },
  {
    id: 242,
    creator: "hivewatchers",
    subject: "Anti-Abuse Operations",
    daily_pay: "200.000 HBD",
    total_votes: "60000000000",
    status: "active",
    start_date: "2024-01-01",
    end_date: "2024-06-30",
  },
];

export function Proposals({ username, onVote, className }: ProposalsProps) {
  const [proposals] = useState<Proposal[]>(mockProposals);
  const [votedProposals, setVotedProposals] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "voted" | "unvoted">("all");

  const handleVote = async (proposalId: number, approve: boolean) => {
    setIsLoading(proposalId);

    try {
      await new Promise((r) => setTimeout(r, 800));

      setVotedProposals((prev) => ({
        ...prev,
        [proposalId]: approve,
      }));

      onVote?.(proposalId, approve);
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

  const filteredProposals = proposals.filter((p) => {
    if (filter === "voted") return votedProposals[p.id] !== undefined;
    if (filter === "unvoted") return votedProposals[p.id] === undefined;
    return true;
  });

  return (
    <div className={cn("w-full max-w-2xl", className)}>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-500" />
              <h3 className="font-semibold">DHF Proposals</h3>
            </div>
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            {(["all", "voted", "unvoted"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium capitalize",
                  filter === f ? "bg-orange-500 text-white" : "bg-muted"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Proposals List */}
        <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
          {filteredProposals.map((proposal) => {
            const voted = votedProposals[proposal.id];
            const isLoadingThis = isLoading === proposal.id;

            return (
              <div key={proposal.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground">
                        #{proposal.id}
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-xs font-medium",
                          proposal.status === "active"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {proposal.status}
                      </span>
                    </div>

                    <h4 className="font-medium mb-1">{proposal.subject}</h4>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <img
                        src={`https://images.hive.blog/u/${proposal.creator}/avatar/small`}
                        alt={proposal.creator}
                        className="w-4 h-4 rounded-full"
                      />
                      <span>@{proposal.creator}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Coins className="h-3 w-3" />
                        {proposal.daily_pay}/day
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {formatVotes(proposal.total_votes)} VESTS
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {proposal.start_date} → {proposal.end_date}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVote(proposal.id, true)}
                      disabled={isLoadingThis}
                      className={cn(
                        "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium",
                        voted === true
                          ? "bg-green-500 text-white"
                          : "bg-muted hover:bg-green-500/10 hover:text-green-500"
                      )}
                    >
                      {isLoadingThis ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ThumbsUp className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleVote(proposal.id, false)}
                      disabled={isLoadingThis}
                      className={cn(
                        "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium",
                        voted === false
                          ? "bg-red-500 text-white"
                          : "bg-muted hover:bg-red-500/10 hover:text-red-500"
                      )}
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground">
            The Decentralized Hive Fund (DHF) funds community proposals.
            Vote for proposals you believe benefit the ecosystem.
          </p>
        </div>
      </div>
    </div>
  );
}
