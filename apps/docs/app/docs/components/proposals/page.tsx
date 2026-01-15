import Link from "next/link";
import { ArrowRight, Info, FileText, ThumbsUp, ThumbsDown, Clock, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  component: `"use client";

import { useState } from "react";
import { FileText, ThumbsUp, ThumbsDown, Clock, ExternalLink, Loader2, Check } from "lucide-react";

interface Proposal {
  id: number;
  proposal_id: number;
  creator: string;
  receiver: string;
  subject: string;
  permlink: string;
  start_date: string;
  end_date: string;
  daily_pay: string;
  total_votes: string;
  status: "active" | "inactive" | "expired" | "votable";
  is_voted?: boolean;
}

interface ProposalsProps {
  proposals: Proposal[];
  votedProposals: number[];
  returnProposal?: Proposal;
  onVote?: (proposalId: number) => Promise<void>;
  onUnvote?: (proposalId: number) => Promise<void>;
  filter?: "all" | "active" | "votable" | "expired";
  className?: string;
}

export function Proposals({
  proposals,
  votedProposals,
  returnProposal,
  onVote,
  onUnvote,
  filter = "all",
  className = "",
}: ProposalsProps) {
  const [voting, setVoting] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState(filter);

  const filteredProposals = proposals.filter((p) => {
    if (activeFilter === "all") return true;
    return p.status === activeFilter;
  });

  async function handleVote(proposalId: number, isVoted: boolean) {
    setVoting(proposalId);
    try {
      if (isVoted) {
        await onUnvote?.(proposalId);
      } else {
        await onVote?.(proposalId);
      }
    } catch (error) {
      console.error("Vote failed:", error);
    } finally {
      setVoting(null);
    }
  }

  function formatVotes(votes: string): string {
    const num = parseFloat(votes) / 1e12;
    if (num >= 1e6) return \`\${(num / 1e6).toFixed(1)}M\`;
    if (num >= 1e3) return \`\${(num / 1e3).toFixed(1)}K\`;
    return num.toFixed(0);
  }

  function formatDailyPay(pay: string): string {
    const amount = pay.split(" ")[0];
    return \`\${parseFloat(amount).toFixed(0)} HBD/day\`;
  }

  function getDaysRemaining(endDate: string): number {
    const end = new Date(endDate);
    const now = new Date();
    return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">DHF Proposals</h3>
            <p className="text-sm text-muted-foreground">
              {votedProposals.length} proposals supported
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {(["all", "active", "votable", "expired"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={\`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap \${
              activeFilter === f
                ? "bg-hive-red text-white"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }\`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Return proposal threshold */}
      {returnProposal && (
        <div className="mb-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-500">Return Proposal Threshold</p>
              <p className="text-xs text-muted-foreground">
                Proposals need more votes than this to be funded
              </p>
            </div>
            <span className="font-bold text-orange-500">
              {formatVotes(returnProposal.total_votes)} MVests
            </span>
          </div>
        </div>
      )}

      {/* Proposals list */}
      <div className="space-y-4">
        {filteredProposals.map((proposal) => {
          const isVoted = votedProposals.includes(proposal.proposal_id);
          const daysRemaining = getDaysRemaining(proposal.end_date);
          const isAboveThreshold = returnProposal
            ? parseFloat(proposal.total_votes) > parseFloat(returnProposal.total_votes)
            : true;

          return (
            <div
              key={proposal.proposal_id}
              className={\`rounded-xl border bg-card p-4 \${
                isAboveThreshold ? "border-green-500/30" : "border-border"
              }\`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-muted-foreground">
                      #{proposal.proposal_id}
                    </span>
                    {isAboveThreshold && (
                      <span className="px-2 py-0.5 rounded text-xs bg-green-500/10 text-green-500">
                        Funded
                      </span>
                    )}
                    {proposal.status === "active" && (
                      <span className="px-2 py-0.5 rounded text-xs bg-blue-500/10 text-blue-500">
                        Active
                      </span>
                    )}
                  </div>

                  <h4 className="font-semibold mt-1">{proposal.subject}</h4>

                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>by @{proposal.creator}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {daysRemaining}d remaining
                    </span>
                    <span>{formatDailyPay(proposal.daily_pay)}</span>
                    <a
                      href={\`https://peakd.com/@\${proposal.creator}/\${proposal.permlink}\`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-hive-red"
                    >
                      Details <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <ThumbsUp className="h-4 w-4 text-green-500" />
                    <span className="font-bold">{formatVotes(proposal.total_votes)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">MVests</p>

                  <button
                    onClick={() => handleVote(proposal.proposal_id, isVoted)}
                    disabled={voting === proposal.proposal_id}
                    className={\`mt-2 px-4 py-1.5 rounded-lg text-sm font-medium \${
                      isVoted
                        ? "bg-green-500/10 text-green-500 hover:bg-red-500/10 hover:text-red-500"
                        : "bg-hive-red text-white hover:bg-hive-red/90"
                    }\`}
                  >
                    {voting === proposal.proposal_id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isVoted ? (
                      <>
                        <Check className="h-4 w-4 inline mr-1" />
                        Supported
                      </>
                    ) : (
                      <>
                        <ThumbsUp className="h-4 w-4 inline mr-1" />
                        Support
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}`,
  basicUsage: `"use client";

import { Proposals } from "@/components/hive/proposals";
import { useProposals } from "@/hooks/use-proposals";
import { useProposalVote } from "@/hooks/use-proposal-vote";

export function ProposalsPage() {
  const { proposals, votedProposals, returnProposal, isLoading } = useProposals();
  const { vote, unvote } = useProposalVote();

  if (isLoading) return <div>Loading...</div>;

  return (
    <Proposals
      proposals={proposals}
      votedProposals={votedProposals}
      returnProposal={returnProposal}
      onVote={vote}
      onUnvote={unvote}
    />
  );
}`,
  hook: `"use client";

import { useCallback } from "react";
import { useHiveChain } from "@/hooks/use-hive-chain";
import { useHiveAuth } from "@/hooks/use-hive-auth";

export function useProposalVote() {
  const { chain } = useHiveChain();
  const { user, signTransaction } = useHiveAuth();

  const vote = useCallback(async (proposalIds: number | number[]) => {
    if (!user || !chain) return;

    const ids = Array.isArray(proposalIds) ? proposalIds : [proposalIds];

    const tx = chain.createTransaction();
    tx.pushOperation({
      update_proposal_votes: {
        voter: user.username,
        proposal_ids: ids,
        approve: true,
        extensions: [],
      },
    });

    await signTransaction(tx);
  }, [user, chain, signTransaction]);

  const unvote = useCallback(async (proposalIds: number | number[]) => {
    if (!user || !chain) return;

    const ids = Array.isArray(proposalIds) ? proposalIds : [proposalIds];

    const tx = chain.createTransaction();
    tx.pushOperation({
      update_proposal_votes: {
        voter: user.username,
        proposal_ids: ids,
        approve: false,
        extensions: [],
      },
    });

    await signTransaction(tx);
  }, [user, chain, signTransaction]);

  return { vote, unvote };
}`,
};

export default async function ProposalsPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Proposals</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Vote on Decentralized Hive Fund (DHF) proposals.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">DHF Proposals</p>
            <p className="mt-1 text-sm text-muted-foreground">
              The Decentralized Hive Fund allocates HBD to approved proposals.
              Proposals must have more votes than the &quot;return proposal&quot; to receive funding.
              Your vote weight is based on your HP.
            </p>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="space-y-4">
          {/* Proposal card */}
          <div className="rounded-xl border border-green-500/30 bg-card p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-muted-foreground">#245</span>
                  <span className="px-2 py-0.5 rounded text-xs bg-green-500/10 text-green-500">
                    Funded
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs bg-blue-500/10 text-blue-500">
                    Active
                  </span>
                </div>
                <h4 className="font-semibold mt-1">HiveSQL Maintenance and Development</h4>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>by @arcange</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> 180d remaining
                  </span>
                  <span>500 HBD/day</span>
                  <span className="flex items-center gap-1 hover:text-hive-red cursor-pointer">
                    Details <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  <ThumbsUp className="h-4 w-4 text-green-500" />
                  <span className="font-bold">89.5M</span>
                </div>
                <p className="text-xs text-muted-foreground">MVests</p>
                <button className="mt-2 px-4 py-1.5 rounded-lg text-sm font-medium bg-green-500/10 text-green-500">
                  <ThumbsUp className="h-4 w-4 inline mr-1" /> Supported
                </button>
              </div>
            </div>
          </div>

          {/* Return proposal */}
          <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-500">Return Proposal Threshold</p>
                <p className="text-xs text-muted-foreground">
                  Proposals need more votes than this to be funded
                </p>
              </div>
              <span className="font-bold text-orange-500">45.2M MVests</span>
            </div>
          </div>
        </div>
      </section>

      {/* Component Code */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Component</h2>
        <CodeBlock
          filename="components/hive/proposals.tsx"
          code={CODE.component}
          language="typescript"
        />
      </section>

      {/* Basic Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Basic Usage</h2>
        <CodeBlock code={CODE.basicUsage} language="typescript" />
      </section>

      {/* Hook */}
      <section>
        <h2 className="text-xl font-semibold mb-4">useProposalVote Hook</h2>
        <CodeBlock
          filename="hooks/use-proposal-vote.ts"
          code={CODE.hook}
          language="typescript"
        />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Next</h2>
        <div className="flex gap-4">
          <Link
            href="/docs/components/authorities"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            Authorities
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
