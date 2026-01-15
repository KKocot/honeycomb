import Link from "next/link";
import { ArrowRight, Info, Repeat, Loader2 } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  component: `"use client";

import { useState } from "react";
import { Repeat, Loader2, Check } from "lucide-react";

interface ReblogButtonProps {
  author: string;
  permlink: string;
  reblogger?: string;
  initialReblogged?: boolean;
  onReblog?: (author: string, permlink: string) => Promise<void>;
  variant?: "default" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  showConfirmation?: boolean;
  className?: string;
}

export function ReblogButton({
  author,
  permlink,
  reblogger,
  initialReblogged = false,
  onReblog,
  variant = "ghost",
  size = "md",
  showLabel = false,
  showConfirmation = true,
  className = "",
}: ReblogButtonProps) {
  const [isReblogged, setIsReblogged] = useState(initialReblogged);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleReblog() {
    if (!reblogger || isReblogged) return;

    if (showConfirmation && !showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsLoading(true);
    setShowConfirm(false);

    try {
      await onReblog?.(author, permlink);
      setIsReblogged(true);
    } catch (error) {
      console.error("Reblog failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const sizeClasses = {
    sm: showLabel ? "px-2 py-1 text-xs gap-1" : "p-1",
    md: showLabel ? "px-3 py-1.5 text-sm gap-1.5" : "p-1.5",
    lg: showLabel ? "px-4 py-2 text-base gap-2" : "p-2",
  };

  const variantClasses = {
    default: isReblogged
      ? "bg-green-500/10 text-green-500"
      : "bg-muted hover:bg-green-500/10 hover:text-green-500",
    ghost: isReblogged
      ? "text-green-500"
      : "text-muted-foreground hover:text-green-500",
    outline: isReblogged
      ? "border border-green-500 text-green-500"
      : "border border-border hover:border-green-500 hover:text-green-500",
  };

  const iconSize = size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-5 w-5" : "h-4 w-4";

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Reblog this post?</span>
        <button
          onClick={handleReblog}
          className="px-2 py-1 text-xs rounded bg-green-500 text-white hover:bg-green-600"
        >
          Yes
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="px-2 py-1 text-xs rounded bg-muted hover:bg-muted/80"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleReblog}
      disabled={isLoading || isReblogged || !reblogger}
      title={isReblogged ? "Reblogged" : "Reblog"}
      className={\`inline-flex items-center justify-center rounded-lg transition-colors disabled:opacity-50 \${sizeClasses[size]} \${variantClasses[variant]} \${className}\`}
    >
      {isLoading ? (
        <Loader2 className={\`\${iconSize} animate-spin\`} />
      ) : isReblogged ? (
        <Check className={iconSize} />
      ) : (
        <Repeat className={iconSize} />
      )}
      {showLabel && (isReblogged ? "Reblogged" : "Reblog")}
    </button>
  );
}`,
  basicUsage: `"use client";

import { ReblogButton } from "@/components/hive/reblog-button";
import { useHiveAuth } from "@/hooks/use-hive-auth";
import { useReblog } from "@/hooks/use-reblog";

interface PostActionsProps {
  author: string;
  permlink: string;
  isReblogged: boolean;
}

export function PostActions({ author, permlink, isReblogged }: PostActionsProps) {
  const { user } = useHiveAuth();
  const { reblog } = useReblog();

  return (
    <ReblogButton
      author={author}
      permlink={permlink}
      reblogger={user?.username}
      initialReblogged={isReblogged}
      onReblog={reblog}
    />
  );
}`,
  withLabel: `<ReblogButton
  author={author}
  permlink={permlink}
  reblogger={user?.username}
  showLabel
  variant="outline"
  onReblog={reblog}
/>`,
  inPostFooter: `"use client";

import { VoteButton } from "@/components/hive/vote-button";
import { ReblogButton } from "@/components/hive/reblog-button";
import { MessageCircle, Share } from "lucide-react";

interface PostFooterProps {
  author: string;
  permlink: string;
  voteCount: number;
  commentCount: number;
  isReblogged: boolean;
}

export function PostFooter({
  author,
  permlink,
  voteCount,
  commentCount,
  isReblogged,
}: PostFooterProps) {
  return (
    <div className="flex items-center gap-4 pt-3 border-t border-border">
      <VoteButton
        author={author}
        permlink={permlink}
        initialVoteCount={voteCount}
      />

      <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
        <MessageCircle className="h-4 w-4" />
        <span className="text-sm">{commentCount}</span>
      </button>

      <ReblogButton
        author={author}
        permlink={permlink}
        initialReblogged={isReblogged}
      />

      <button className="p-1.5 text-muted-foreground hover:text-foreground ml-auto">
        <Share className="h-4 w-4" />
      </button>
    </div>
  );
}`,
  hook: `"use client";

import { useCallback } from "react";
import { useHiveChain } from "@/hooks/use-hive-chain";
import { useHiveAuth } from "@/hooks/use-hive-auth";

export function useReblog() {
  const { chain } = useHiveChain();
  const { user, signTransaction } = useHiveAuth();

  const reblog = useCallback(async (author: string, permlink: string) => {
    if (!user || !chain) return;

    const tx = chain.createTransaction();
    tx.pushOperation({
      custom_json: {
        required_auths: [],
        required_posting_auths: [user.username],
        id: "reblog",
        json: JSON.stringify([
          "reblog",
          {
            account: user.username,
            author,
            permlink,
          },
        ]),
      },
    });

    await signTransaction(tx);
  }, [user, chain, signTransaction]);

  return { reblog };
}`,
};

export default async function ReblogButtonPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reblog Button</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Share posts to your blog feed with a reblog action.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-green-500">Reblogging on Hive</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Reblog uses custom_json with &quot;reblog&quot; id. Once reblogged, a post cannot
              be un-reblogged. It appears on your blog feed with the original author credited.
            </p>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="flex flex-wrap items-center gap-6">
          {/* Ghost (default) */}
          <button className="p-1.5 rounded-lg text-muted-foreground hover:text-green-500">
            <Repeat className="h-4 w-4" />
          </button>

          {/* Reblogged */}
          <button className="p-1.5 rounded-lg text-green-500">
            <Repeat className="h-4 w-4" />
          </button>

          {/* With label */}
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-border text-muted-foreground hover:border-green-500 hover:text-green-500">
            <Repeat className="h-4 w-4" />
            Reblog
          </button>

          {/* Loading */}
          <button className="p-1.5 rounded-lg text-muted-foreground" disabled>
            <Loader2 className="h-4 w-4 animate-spin" />
          </button>

          {/* Confirmation */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Reblog this post?</span>
            <button className="px-2 py-1 text-xs rounded bg-green-500 text-white">
              Yes
            </button>
            <button className="px-2 py-1 text-xs rounded bg-muted">
              No
            </button>
          </div>
        </div>
      </section>

      {/* Component Code */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Component</h2>
        <CodeBlock
          filename="components/hive/reblog-button.tsx"
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
                <td className="py-3 px-4 text-muted-foreground">Post author</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>permlink</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">required</td>
                <td className="py-3 px-4 text-muted-foreground">Post permlink</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>showConfirmation</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>true</code></td>
                <td className="py-3 px-4 text-muted-foreground">Show confirmation dialog</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>showLabel</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>false</code></td>
                <td className="py-3 px-4 text-muted-foreground">Show text label</td>
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

      {/* With Label */}
      <section>
        <h2 className="text-xl font-semibold mb-4">With Label</h2>
        <CodeBlock code={CODE.withLabel} language="tsx" />
      </section>

      {/* In Post Footer */}
      <section>
        <h2 className="text-xl font-semibold mb-4">In Post Footer</h2>
        <CodeBlock code={CODE.inPostFooter} language="typescript" />
      </section>

      {/* Hook */}
      <section>
        <h2 className="text-xl font-semibold mb-4">useReblog Hook</h2>
        <CodeBlock
          filename="hooks/use-reblog.ts"
          code={CODE.hook}
          language="typescript"
        />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Next</h2>
        <div className="flex gap-4">
          <Link
            href="/docs/components/transfer-dialog"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            Transfer Dialog
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
