import Link from "next/link";
import { ArrowRight, Info, ThumbsUp, ThumbsDown } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  component: `"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";

interface VoteButtonProps {
  author: string;
  permlink: string;
  voter?: string;
  initialVoted?: boolean;
  initialVoteCount?: number;
  onVote?: (weight: number) => Promise<void>;
  showDownvote?: boolean;
  showSlider?: boolean;
  className?: string;
}

export function VoteButton({
  author,
  permlink,
  voter,
  initialVoted = false,
  initialVoteCount = 0,
  onVote,
  showDownvote = false,
  showSlider = false,
  className = "",
}: VoteButtonProps) {
  const [hasVoted, setHasVoted] = useState(initialVoted);
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [isVoting, setIsVoting] = useState(false);
  const [weight, setWeight] = useState(100);
  const [showWeightSlider, setShowWeightSlider] = useState(false);

  async function handleVote(isUpvote: boolean) {
    if (!voter || !onVote || isVoting) return;

    setIsVoting(true);

    try {
      const voteWeight = isUpvote ? weight * 100 : -weight * 100;
      await onVote(voteWeight);

      setHasVoted(true);
      setVoteCount((prev) => prev + (isUpvote ? 1 : 0));
      setShowWeightSlider(false);
    } catch (error) {
      console.error("Vote failed:", error);
    } finally {
      setIsVoting(false);
    }
  }

  function handleUpvoteClick() {
    if (showSlider && !hasVoted) {
      setShowWeightSlider(!showWeightSlider);
    } else {
      handleVote(true);
    }
  }

  return (
    <div className={\`\${className}\`}>
      <div className="flex items-center gap-2">
        <button
          onClick={handleUpvoteClick}
          disabled={isVoting || hasVoted}
          className={\`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors \${
            hasVoted
              ? "bg-hive-red/10 text-hive-red"
              : "hover:bg-muted"
          } disabled:opacity-50\`}
        >
          {isVoting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ThumbsUp className={\`h-4 w-4 \${hasVoted ? "fill-current" : ""}\`} />
          )}
          <span className="text-sm font-medium">{voteCount}</span>
        </button>

        {showDownvote && !hasVoted && (
          <button
            onClick={() => handleVote(false)}
            disabled={isVoting}
            className="p-1.5 rounded-lg hover:bg-muted hover:text-red-500 transition-colors disabled:opacity-50"
          >
            <ThumbsDown className="h-4 w-4" />
          </button>
        )}
      </div>

      {showWeightSlider && !hasVoted && (
        <div className="mt-2 p-3 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={100}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="flex-1 accent-hive-red"
            />
            <span className="w-12 text-right text-sm font-mono">{weight}%</span>
          </div>
          <button
            onClick={() => handleVote(true)}
            disabled={isVoting}
            className="mt-2 w-full px-3 py-1.5 rounded bg-hive-red text-white text-sm font-medium hover:bg-hive-red/90 disabled:opacity-50"
          >
            {isVoting ? "Voting..." : "Vote"}
          </button>
        </div>
      )}
    </div>
  );
}`,
  basicUsage: `"use client";

import { VoteButton } from "@/components/hive/vote-button";
import { useVote } from "@/hooks/use-vote";
import { useHiveAuth } from "@/hooks/use-hive-auth";

interface PostFooterProps {
  author: string;
  permlink: string;
  voteCount: number;
}

export function PostFooter({ author, permlink, voteCount }: PostFooterProps) {
  const { vote } = useVote();
  const { user } = useHiveAuth();

  async function handleVote(weight: number) {
    await vote({ author, permlink, weight });
  }

  return (
    <VoteButton
      author={author}
      permlink={permlink}
      voter={user?.username}
      initialVoteCount={voteCount}
      onVote={handleVote}
    />
  );
}`,
  withSlider: `"use client";

import { VoteButton } from "@/components/hive/vote-button";
import { useVote } from "@/hooks/use-vote";
import { useHiveAuth } from "@/hooks/use-hive-auth";

export function VoteWithSlider({ author, permlink }: { author: string; permlink: string }) {
  const { vote } = useVote();
  const { user } = useHiveAuth();

  return (
    <VoteButton
      author={author}
      permlink={permlink}
      voter={user?.username}
      onVote={(weight) => vote({ author, permlink, weight })}
      showSlider
      showDownvote
    />
  );
}`,
  withPayout: `"use client";

import { VoteButton } from "@/components/hive/vote-button";
import { useVote } from "@/hooks/use-vote";
import { useHiveAuth } from "@/hooks/use-hive-auth";

interface VoteWithPayoutProps {
  author: string;
  permlink: string;
  voteCount: number;
  pendingPayout: string;
}

export function VoteWithPayout({
  author,
  permlink,
  voteCount,
  pendingPayout,
}: VoteWithPayoutProps) {
  const { vote } = useVote();
  const { user } = useHiveAuth();

  return (
    <div className="flex items-center gap-4">
      <VoteButton
        author={author}
        permlink={permlink}
        voter={user?.username}
        initialVoteCount={voteCount}
        onVote={(weight) => vote({ author, permlink, weight })}
        showSlider
      />
      <span className="text-sm font-medium text-green-500">
        {pendingPayout}
      </span>
    </div>
  );
}`,
  postCard: `"use client";

import { VoteButton } from "@/components/hive/vote-button";
import { HiveAvatar } from "@/components/hive/avatar";
import { useVote } from "@/hooks/use-vote";
import { useHiveAuth } from "@/hooks/use-hive-auth";
import { MessageCircle, Share } from "lucide-react";

interface PostCardProps {
  author: string;
  permlink: string;
  title: string;
  body: string;
  voteCount: number;
  commentCount: number;
  pendingPayout: string;
}

export function PostCard({
  author,
  permlink,
  title,
  body,
  voteCount,
  commentCount,
  pendingPayout,
}: PostCardProps) {
  const { vote } = useVote();
  const { user } = useHiveAuth();

  return (
    <article className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-3 mb-3">
        <HiveAvatar username={author} size="md" />
        <span className="font-medium">@{author}</span>
      </div>

      <h2 className="text-lg font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground line-clamp-3 mb-4">{body}</p>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-4">
          <VoteButton
            author={author}
            permlink={permlink}
            voter={user?.username}
            initialVoteCount={voteCount}
            onVote={(weight) => vote({ author, permlink, weight })}
            showSlider
            showDownvote
          />

          <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm">{commentCount}</span>
          </button>

          <button className="p-1.5 text-muted-foreground hover:text-foreground">
            <Share className="h-4 w-4" />
          </button>
        </div>

        <span className="text-sm font-medium text-green-500">{pendingPayout}</span>
      </div>
    </article>
  );
}`,
};

export default async function VoteButtonPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vote Button</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Upvote and downvote Hive content with optional weight slider.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Voting on Hive</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Votes consume Voting Power (VP) which regenerates at ~20% per day.
              The vote weight determines how much VP is used and how much the vote
              affects rewards.
            </p>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="space-y-4">
          {/* Basic */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted">
              <ThumbsUp className="h-4 w-4" />
              <span className="text-sm font-medium">42</span>
            </button>
          </div>

          {/* Voted state */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-hive-red/10 text-hive-red">
              <ThumbsUp className="h-4 w-4 fill-current" />
              <span className="text-sm font-medium">43</span>
            </button>
          </div>

          {/* With downvote */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted">
              <ThumbsUp className="h-4 w-4" />
              <span className="text-sm font-medium">42</span>
            </button>
            <button className="p-1.5 rounded-lg hover:bg-muted">
              <ThumbsDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Component Code */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Component</h2>
        <p className="text-muted-foreground mb-4">
          Copy this component into your project:
        </p>
        <CodeBlock
          filename="components/hive/vote-button.tsx"
          code={CODE.component}
          language="typescript"
        />
      </section>

      {/* Props */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Props</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Prop</th>
                <th className="py-3 px-4 text-left font-semibold">Type</th>
                <th className="py-3 px-4 text-left font-semibold">Default</th>
                <th className="py-3 px-4 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4"><code>author</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">required</td>
                <td className="py-3 px-4 text-muted-foreground">Post author username</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>permlink</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">required</td>
                <td className="py-3 px-4 text-muted-foreground">Post permlink</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>voter</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
                <td className="py-3 px-4 text-muted-foreground">Current user username</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>initialVoted</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>false</code></td>
                <td className="py-3 px-4 text-muted-foreground">Has user already voted</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>initialVoteCount</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>number</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>0</code></td>
                <td className="py-3 px-4 text-muted-foreground">Initial vote count</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onVote</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>(weight: number) =&gt; Promise&lt;void&gt;</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
                <td className="py-3 px-4 text-muted-foreground">Vote handler function</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>showDownvote</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>false</code></td>
                <td className="py-3 px-4 text-muted-foreground">Show downvote button</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>showSlider</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>false</code></td>
                <td className="py-3 px-4 text-muted-foreground">Show vote weight slider</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Basic Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Basic Usage</h2>
        <CodeBlock code={CODE.basicUsage} language="typescript" />
      </section>

      {/* With Slider */}
      <section>
        <h2 className="text-xl font-semibold mb-4">With Weight Slider</h2>
        <p className="text-muted-foreground mb-4">
          Allow users to choose their vote percentage:
        </p>
        <CodeBlock code={CODE.withSlider} language="typescript" />
      </section>

      {/* With Payout */}
      <section>
        <h2 className="text-xl font-semibold mb-4">With Payout Display</h2>
        <p className="text-muted-foreground mb-4">
          Show pending payout alongside votes:
        </p>
        <CodeBlock code={CODE.withPayout} language="typescript" />
      </section>

      {/* Post Card */}
      <section>
        <h2 className="text-xl font-semibold mb-4">In Post Card</h2>
        <p className="text-muted-foreground mb-4">
          Complete example with post content and actions:
        </p>
        <CodeBlock code={CODE.postCard} language="typescript" />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Next</h2>
        <div className="flex gap-4">
          <Link
            href="/docs/components/balance-card"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            Balance Card
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
