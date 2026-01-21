"use client";

import { useState, useEffect } from "react";
import { FileText, ThumbsUp, ThumbsDown, Loader2, Calendar, Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHive } from "@/contexts/hive-context";
import { LoginPromptDialog } from "./login-prompt-dialog";

interface Proposal {
  id: number;
  creator: string;
  subject: string;
  daily_pay: string;
  total_votes: string;
  status: string;
  start_date: string;
  end_date: string;
}

interface ProposalsProps {
  username: string;
  onVote?: (proposalId: number, approve: boolean) => void;
  className?: string;
}

export function HiveProposals({ username, onVote, className }: ProposalsProps) {
  const { user } = useHive();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [votedProposals, setVotedProposals] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<number | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [filter, setFilter] = useState<"all" | "voted" | "unvoted">("all");
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ id: number; approve: boolean } | null>(null);

  // Fetch proposals and user votes
  useEffect(() => {
    async function fetchData() {
      setLoadingData(true);
      try {
        // Fetch active proposals
        const proposalsRes = await fetch("https://api.hive.blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "condenser_api.list_proposals",
            params: [[-1], 20, "by_total_votes", "descending", "active"],
            id: 1,
          }),
        });

        const proposalsData = await proposalsRes.json();
        if (proposalsData.result) {
          setProposals(proposalsData.result.map((p: any) => ({
            id: p.id || p.proposal_id,
            creator: p.creator,
            subject: p.subject,
            daily_pay: p.daily_pay,
            total_votes: p.total_votes,
            status: p.status,
            start_date: p.start_date?.split("T")[0] || "",
            end_date: p.end_date?.split("T")[0] || "",
          })));
        }

        // Fetch user's voted proposals
        if (username) {
          const votesRes = await fetch("https://api.hive.blog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              method: "condenser_api.list_proposal_votes",
              params: [[username], 1000, "by_voter_proposal", "ascending", "active"],
              id: 2,
            }),
          });

          const votesData = await votesRes.json();
          if (votesData.result) {
            // Filter only this user's votes
            const userVotes = votesData.result
              .filter((v: any) => v.voter === username)
              .map((v: any) => v.proposal?.id || v.proposal?.proposal_id || v.proposal_id);
            setVotedProposals(userVotes);
          }
        }
      } catch (err) {
        console.error("Failed to fetch proposals:", err);
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, [username]);

  const handleVote = async (proposalId: number, approve: boolean) => {
    // Check if user is logged in
    if (!user) {
      setPendingAction({ id: proposalId, approve });
      setShowLoginDialog(true);
      return;
    }

    setIsLoading(proposalId);

    try {
      await new Promise((r) => setTimeout(r, 800));

      if (approve) {
        if (!votedProposals.includes(proposalId)) {
          setVotedProposals((prev) => [...prev, proposalId]);
        }
      } else {
        setVotedProposals((prev) => prev.filter((id) => id !== proposalId));
      }

      onVote?.(proposalId, approve);
    } finally {
      setIsLoading(null);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginDialog(false);
    if (pendingAction) {
      handleVote(pendingAction.id, pendingAction.approve);
      setPendingAction(null);
    }
  };

  const formatVotes = (votes: string) => {
    const num = parseInt(votes) / 1000000;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}T`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}B`;
    return `${num.toFixed(1)}M`;
  };

  const filteredProposals = proposals.filter((p) => {
    if (filter === "voted") return votedProposals.includes(p.id);
    if (filter === "unvoted") return !votedProposals.includes(p.id);
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
              {loadingData && <Loader2 className="h-4 w-4 animate-spin" />}
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
          {loadingData ? (
            <div className="p-8 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Loading proposals...</p>
            </div>
          ) : filteredProposals.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No proposals found
            </div>
          ) : (
            filteredProposals.map((proposal) => {
              const isVoted = votedProposals.includes(proposal.id);
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
                        {isVoted && (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-orange-500/10 text-orange-500">
                            Voted
                          </span>
                        )}
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
                          isVoted
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
                        disabled={isLoadingThis || !isVoted}
                        className={cn(
                          "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium",
                          !isVoted
                            ? "bg-muted opacity-50 cursor-not-allowed"
                            : "bg-muted hover:bg-red-500/10 hover:text-red-500"
                        )}
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground">
            {user ? (
              <>You have voted for {votedProposals.length} proposals</>
            ) : (
              <>Login to vote on DHF proposals that benefit the Hive ecosystem</>
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
        description="You need to be logged in to vote on proposals."
      />
    </div>
  );
}
