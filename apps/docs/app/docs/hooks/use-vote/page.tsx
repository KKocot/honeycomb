import Link from "next/link";
import { ArrowRight, Info, AlertTriangle } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  hook: `"use client";

import { useHiveChain } from "@/components/hive/hive-provider";
import { useHiveAuth } from "@/hooks/use-hive-auth";
import { useState, useCallback } from "react";

interface VoteParams {
  author: string;
  permlink: string;
  weight: number; // -10000 to 10000 (100% = 10000)
}

interface UseVoteReturn {
  vote: (params: VoteParams) => Promise<void>;
  isVoting: boolean;
  error: Error | null;
}

export function useVote(): UseVoteReturn {
  const { chain, isReady } = useHiveChain();
  const { user, isAuthenticated } = useHiveAuth();
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const vote = useCallback(
    async ({ author, permlink, weight }: VoteParams) => {
      if (!isReady || !chain) {
        throw new Error("Chain not ready");
      }

      if (!isAuthenticated || !user) {
        throw new Error("User not authenticated");
      }

      // Validate weight
      if (weight < -10000 || weight > 10000) {
        throw new Error("Vote weight must be between -10000 and 10000");
      }

      setIsVoting(true);
      setError(null);

      try {
        // Check if Keychain is available
        if (typeof window === "undefined" || !window.hive_keychain) {
          throw new Error("Hive Keychain is required for voting");
        }

        return new Promise<void>((resolve, reject) => {
          window.hive_keychain.requestVote(
            user.username,
            permlink,
            author,
            weight,
            (response: any) => {
              if (response.success) {
                resolve();
              } else {
                reject(new Error(response.message || "Vote failed"));
              }
              setIsVoting(false);
            }
          );
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Vote failed");
        setError(error);
        setIsVoting(false);
        throw error;
      }
    },
    [chain, isReady, user, isAuthenticated]
  );

  return {
    vote,
    isVoting,
    error,
  };
}`,
  basicUsage: `"use client";

import { useVote } from "@/hooks/use-vote";
import { ThumbsUp } from "lucide-react";

interface UpvoteButtonProps {
  author: string;
  permlink: string;
}

export function UpvoteButton({ author, permlink }: UpvoteButtonProps) {
  const { vote, isVoting, error } = useVote();

  async function handleVote() {
    try {
      await vote({
        author,
        permlink,
        weight: 10000, // 100% upvote
      });
    } catch (err) {
      // Error handled by hook
    }
  }

  return (
    <div>
      <button
        onClick={handleVote}
        disabled={isVoting}
        className="flex items-center gap-2 px-4 py-2 rounded bg-hive-red text-white disabled:opacity-50"
      >
        <ThumbsUp className="h-4 w-4" />
        {isVoting ? "Voting..." : "Upvote"}
      </button>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}`,
  withWeight: `"use client";

import { useVote } from "@/hooks/use-vote";
import { useState } from "react";

interface VoteSliderProps {
  author: string;
  permlink: string;
}

export function VoteSlider({ author, permlink }: VoteSliderProps) {
  const { vote, isVoting } = useVote();
  const [weight, setWeight] = useState(100); // Percentage (1-100)

  async function handleVote() {
    try {
      // Convert percentage to weight (100% = 10000)
      await vote({
        author,
        permlink,
        weight: weight * 100,
      });
    } catch (err) {
      console.error("Vote failed:", err);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={1}
          max={100}
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          className="flex-1"
        />
        <span className="w-12 text-right font-mono">{weight}%</span>
      </div>

      <button
        onClick={handleVote}
        disabled={isVoting}
        className="w-full px-4 py-2 rounded bg-hive-red text-white disabled:opacity-50"
      >
        {isVoting ? "Voting..." : \`Vote \${weight}%\`}
      </button>
    </div>
  );
}`,
  downvote: `"use client";

import { useVote } from "@/hooks/use-vote";
import { ThumbsDown } from "lucide-react";

interface DownvoteButtonProps {
  author: string;
  permlink: string;
}

export function DownvoteButton({ author, permlink }: DownvoteButtonProps) {
  const { vote, isVoting } = useVote();

  async function handleDownvote() {
    // Negative weight = downvote
    await vote({
      author,
      permlink,
      weight: -10000, // 100% downvote
    });
  }

  return (
    <button
      onClick={handleDownvote}
      disabled={isVoting}
      className="flex items-center gap-2 px-4 py-2 rounded bg-muted hover:bg-red-500 hover:text-white"
    >
      <ThumbsDown className="h-4 w-4" />
      {isVoting ? "..." : "Downvote"}
    </button>
  );
}`,
  voteBar: `"use client";

import { useVote } from "@/hooks/use-vote";
import { useHiveAuth } from "@/hooks/use-hive-auth";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useState } from "react";

interface VoteBarProps {
  author: string;
  permlink: string;
  initialVotes?: number;
  initialPayout?: string;
}

export function VoteBar({
  author,
  permlink,
  initialVotes = 0,
  initialPayout = "$0.00",
}: VoteBarProps) {
  const { vote, isVoting } = useVote();
  const { isAuthenticated } = useHiveAuth();
  const [hasVoted, setHasVoted] = useState(false);
  const [showSlider, setShowSlider] = useState(false);
  const [weight, setWeight] = useState(100);

  async function handleVote(isUpvote: boolean) {
    try {
      await vote({
        author,
        permlink,
        weight: isUpvote ? weight * 100 : -weight * 100,
      });
      setHasVoted(true);
      setShowSlider(false);
    } catch (err) {
      console.error("Vote failed:", err);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-3 text-muted-foreground">
        <ThumbsUp className="h-4 w-4" />
        <span>{initialVotes}</span>
        <span className="text-sm">{initialPayout}</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowSlider(!showSlider)}
          disabled={isVoting || hasVoted}
          className={\`p-2 rounded hover:bg-muted \${hasVoted ? "text-hive-red" : ""}\`}
        >
          <ThumbsUp className="h-4 w-4" />
        </button>
        <span>{initialVotes + (hasVoted ? 1 : 0)}</span>
        <span className="text-sm text-muted-foreground">{initialPayout}</span>
        <button
          onClick={() => handleVote(false)}
          disabled={isVoting || hasVoted}
          className="p-2 rounded hover:bg-muted ml-auto"
        >
          <ThumbsDown className="h-4 w-4" />
        </button>
      </div>

      {showSlider && (
        <div className="flex items-center gap-3 p-3 rounded bg-muted">
          <input
            type="range"
            min={1}
            max={100}
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="flex-1"
          />
          <span className="w-12 text-right font-mono">{weight}%</span>
          <button
            onClick={() => handleVote(true)}
            disabled={isVoting}
            className="px-3 py-1 rounded bg-hive-red text-white text-sm"
          >
            Vote
          </button>
        </div>
      )}
    </div>
  );
}`,
};

export default async function UseVotePage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">useVote</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Vote on Hive posts and comments with customizable weight.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Voting on Hive</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Votes on Hive use a weight from -10000 to 10000, where 10000 is 100% upvote
              and -10000 is 100% downvote. Voting consumes Voting Power (VP) which
              regenerates at ~20% per day.
            </p>
          </div>
        </div>
      </section>

      {/* Warning */}
      <section className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-500">Resource Usage</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Each vote consumes Voting Power proportional to the vote weight. A 100% vote
              uses 2% of your VP. Votes at lower percentages use proportionally less VP.
            </p>
          </div>
        </div>
      </section>

      {/* Hook Definition */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Hook Definition</h2>
        <p className="text-muted-foreground mb-4">
          Copy this hook into your project:
        </p>
        <CodeBlock filename="hooks/use-vote.ts" code={CODE.hook} language="typescript" />
      </section>

      {/* Return Values */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Return Values</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Property</th>
                <th className="py-3 px-4 text-left font-semibold">Type</th>
                <th className="py-3 px-4 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4"><code>vote</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>(params: VoteParams) =&gt; Promise&lt;void&gt;</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Execute a vote transaction
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>isVoting</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>boolean</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  True while vote is being processed
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>error</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>Error | null</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Error if vote failed
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Vote Params */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Vote Parameters</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Parameter</th>
                <th className="py-3 px-4 text-left font-semibold">Type</th>
                <th className="py-3 px-4 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4"><code>author</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Username of the post author
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>permlink</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Unique identifier of the post/comment
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>weight</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>number</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Vote weight: -10000 to 10000 (100% = 10000)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Basic Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Basic Usage</h2>
        <p className="text-muted-foreground mb-4">
          Simple upvote button with 100% weight:
        </p>
        <CodeBlock code={CODE.basicUsage} language="typescript" />
      </section>

      {/* With Weight Slider */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Vote Weight Slider</h2>
        <p className="text-muted-foreground mb-4">
          Let users choose their vote percentage:
        </p>
        <CodeBlock code={CODE.withWeight} language="typescript" />
      </section>

      {/* Downvote */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Downvoting</h2>
        <p className="text-muted-foreground mb-4">
          Use negative weight for downvotes:
        </p>
        <CodeBlock code={CODE.downvote} language="typescript" />
      </section>

      {/* Complete Vote Bar */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Complete Vote Bar</h2>
        <p className="text-muted-foreground mb-4">
          Full-featured vote component with slider, upvote/downvote, and payout display:
        </p>
        <CodeBlock code={CODE.voteBar} language="typescript" />
      </section>

      {/* Best Practices */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Best Practices</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-hive-red mt-1">•</span>
            <span>
              <strong>Check authentication:</strong> Always ensure the user is logged in
              before allowing votes.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-hive-red mt-1">•</span>
            <span>
              <strong>Show vote status:</strong> Indicate if the user has already voted
              on a post.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-hive-red mt-1">•</span>
            <span>
              <strong>Display voting power:</strong> Help users understand their current
              VP to make informed decisions.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-hive-red mt-1">•</span>
            <span>
              <strong>Prevent double votes:</strong> Disable the vote button after a
              successful vote.
            </span>
          </li>
        </ul>
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Related</h2>
        <div className="flex gap-4">
          <Link
            href="/docs/hooks/use-hive-account"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            useHiveAccount
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
