import Link from "next/link";
import { ArrowRight, Info, Vote, Check, Server, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  component: `"use client";

import { useState } from "react";
import { Vote, Check, Server, ExternalLink, Loader2, X } from "lucide-react";

interface Witness {
  owner: string;
  votes: string;
  votes_count: number;
  signing_key: string;
  url: string;
  running_version: string;
  is_disabled: boolean;
  is_voted?: boolean;
  rank?: number;
}

interface WitnessVoteProps {
  witnesses: Witness[];
  votedWitnesses: string[];
  maxVotes?: number;
  onVote?: (witness: string) => Promise<void>;
  onUnvote?: (witness: string) => Promise<void>;
  showSearch?: boolean;
  className?: string;
}

export function WitnessVote({
  witnesses,
  votedWitnesses,
  maxVotes = 30,
  onVote,
  onUnvote,
  showSearch = true,
  className = "",
}: WitnessVoteProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [voting, setVoting] = useState<string | null>(null);

  const remainingVotes = maxVotes - votedWitnesses.length;

  const filteredWitnesses = witnesses.filter((w) =>
    w.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleVote(witness: string, isVoted: boolean) {
    setVoting(witness);
    try {
      if (isVoted) {
        await onUnvote?.(witness);
      } else {
        await onVote?.(witness);
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

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-hive-red/10 text-hive-red">
            <Vote className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">Witness Voting</h3>
            <p className="text-sm text-muted-foreground">
              {votedWitnesses.length}/{maxVotes} votes used
            </p>
          </div>
        </div>
        {remainingVotes > 0 && (
          <span className="px-3 py-1 rounded-full text-sm bg-green-500/10 text-green-500">
            {remainingVotes} votes remaining
          </span>
        )}
      </div>

      {/* Search */}
      {showSearch && (
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search witnesses..."
          className="w-full mb-4 px-4 py-2 rounded-lg bg-muted border border-border focus:border-hive-red focus:outline-none"
        />
      )}

      {/* Your votes */}
      {votedWitnesses.length > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-hive-red/5 border border-hive-red/20">
          <p className="text-sm font-medium mb-2">Your votes</p>
          <div className="flex flex-wrap gap-2">
            {votedWitnesses.map((w) => (
              <button
                key={w}
                onClick={() => handleVote(w, true)}
                disabled={voting === w}
                className="flex items-center gap-1 px-2 py-1 rounded bg-hive-red/10 text-hive-red text-sm hover:bg-hive-red hover:text-white"
              >
                {voting === w ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <X className="h-3 w-3" />
                )}
                @{w}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Witness list */}
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="py-3 px-4 text-left text-sm font-medium">#</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Witness</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Votes</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Version</th>
              <th className="py-3 px-4 text-right text-sm font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredWitnesses.map((witness, index) => {
              const isVoted = votedWitnesses.includes(witness.owner);
              const isDisabled = witness.is_disabled;

              return (
                <tr
                  key={witness.owner}
                  className={\`\${isDisabled ? "opacity-50" : ""} hover:bg-muted/30\`}
                >
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {witness.rank || index + 1}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={\`https://images.hive.blog/u/\${witness.owner}/avatar/small\`}
                        alt={witness.owner}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">@{witness.owner}</span>
                          {witness.url && (
                            <a
                              href={witness.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-hive-red"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                        {isDisabled && (
                          <span className="text-xs text-red-500">Disabled</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className="font-medium">{formatVotes(witness.votes)}</span>
                    <span className="text-muted-foreground ml-1">MVests</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {witness.running_version}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleVote(witness.owner, isVoted)}
                      disabled={voting === witness.owner || (remainingVotes === 0 && !isVoted)}
                      className={\`px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-50 \${
                        isVoted
                          ? "bg-green-500/10 text-green-500 hover:bg-red-500/10 hover:text-red-500"
                          : "bg-hive-red text-white hover:bg-hive-red/90"
                      }\`}
                    >
                      {voting === witness.owner ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isVoted ? (
                        <>
                          <Check className="h-4 w-4 inline mr-1" />
                          Voted
                        </>
                      ) : (
                        "Vote"
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}`,
  basicUsage: `"use client";

import { WitnessVote } from "@/components/hive/witness-vote";
import { useWitnesses } from "@/hooks/use-witnesses";
import { useWitnessVote } from "@/hooks/use-witness-vote";

export function WitnessesPage() {
  const { witnesses, votedWitnesses, isLoading } = useWitnesses();
  const { vote, unvote } = useWitnessVote();

  if (isLoading) return <div>Loading...</div>;

  return (
    <WitnessVote
      witnesses={witnesses}
      votedWitnesses={votedWitnesses}
      onVote={vote}
      onUnvote={unvote}
    />
  );
}`,
  hook: `"use client";

import { useCallback } from "react";
import { useHiveChain } from "@/hooks/use-hive-chain";
import { useHiveAuth } from "@/hooks/use-hive-auth";

export function useWitnessVote() {
  const { chain } = useHiveChain();
  const { user, signTransaction } = useHiveAuth();

  const vote = useCallback(async (witness: string) => {
    if (!user || !chain) return;

    const tx = chain.createTransaction();
    tx.pushOperation({
      account_witness_vote: {
        account: user.username,
        witness,
        approve: true,
      },
    });

    await signTransaction(tx);
  }, [user, chain, signTransaction]);

  const unvote = useCallback(async (witness: string) => {
    if (!user || !chain) return;

    const tx = chain.createTransaction();
    tx.pushOperation({
      account_witness_vote: {
        account: user.username,
        witness,
        approve: false,
      },
    });

    await signTransaction(tx);
  }, [user, chain, signTransaction]);

  return { vote, unvote };
}`,
};

export default async function WitnessVotePage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Witness Vote</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Vote for Hive blockchain witnesses who secure and govern the network.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-hive-red/20 bg-hive-red/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-hive-red shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-hive-red">Witness Voting</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Witnesses are block producers who run nodes and make consensus decisions.
              You can vote for up to 30 witnesses. Your HP determines your voting influence.
            </p>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="py-3 px-4 text-left text-sm font-medium">#</th>
                <th className="py-3 px-4 text-left text-sm font-medium">Witness</th>
                <th className="py-3 px-4 text-left text-sm font-medium">Votes</th>
                <th className="py-3 px-4 text-right text-sm font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4 text-sm text-muted-foreground">1</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-hive-red/20" />
                    <div className="flex items-center gap-1">
                      <span className="font-medium">@blocktrades</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm">
                  <span className="font-medium">145.2M</span>
                  <span className="text-muted-foreground ml-1">MVests</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="px-3 py-1.5 rounded-lg text-sm font-medium bg-green-500/10 text-green-500">
                    <Check className="h-4 w-4 inline mr-1" /> Voted
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm text-muted-foreground">2</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20" />
                    <span className="font-medium">@gtg</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm">
                  <span className="font-medium">132.8M</span>
                  <span className="text-muted-foreground ml-1">MVests</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="px-3 py-1.5 rounded-lg text-sm font-medium bg-hive-red text-white">
                    Vote
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Component Code */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Component</h2>
        <CodeBlock
          filename="components/hive/witness-vote.tsx"
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
        <h2 className="text-xl font-semibold mb-4">useWitnessVote Hook</h2>
        <CodeBlock
          filename="hooks/use-witness-vote.ts"
          code={CODE.hook}
          language="typescript"
        />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Next</h2>
        <div className="flex gap-4">
          <Link
            href="/docs/components/proposals"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            Proposals
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
