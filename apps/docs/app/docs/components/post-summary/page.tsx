import Link from "next/link";
import { ArrowRight, Info, MessageCircle, ThumbsUp, Clock, Share } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  component: `"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, ThumbsUp, Clock, Share, Eye, EyeOff } from "lucide-react";

interface PostSummaryProps {
  author: string;
  permlink: string;
  title: string;
  body: string;
  thumbnail?: string;
  createdAt: string;
  voteCount: number;
  commentCount: number;
  pendingPayout: string;
  isNsfw?: boolean;
  onVote?: () => void;
  onShare?: () => void;
  variant?: "card" | "compact" | "grid";
  className?: string;
}

export function PostSummary({
  author,
  permlink,
  title,
  body,
  thumbnail,
  createdAt,
  voteCount,
  commentCount,
  pendingPayout,
  isNsfw = false,
  onVote,
  onShare,
  variant = "card",
  className = "",
}: PostSummaryProps) {
  const [showNsfw, setShowNsfw] = useState(false);
  const postUrl = \`/@\${author}/\${permlink}\`;

  // Extract first 160 chars as summary
  const summary = body.replace(/!?\\[.*?\\]\\(.*?\\)/g, "").slice(0, 160) + "...";

  // Format relative time
  const timeAgo = formatTimeAgo(new Date(createdAt));

  if (variant === "compact") {
    return (
      <article className={\`flex gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors \${className}\`}>
        {thumbnail && (
          <div className="relative w-20 h-20 rounded overflow-hidden shrink-0">
            {isNsfw && !showNsfw ? (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <button onClick={() => setShowNsfw(true)} className="text-xs">
                  NSFW
                </button>
              </div>
            ) : (
              <img src={thumbnail} alt="" className="w-full h-full object-cover" />
            )}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <Link href={postUrl} className="hover:text-hive-red">
            <h3 className="font-semibold truncate">{title}</h3>
          </Link>
          <p className="text-sm text-muted-foreground">
            @{author} · {timeAgo}
          </p>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3.5 w-3.5" /> {voteCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" /> {commentCount}
            </span>
            <span className="text-green-500">{pendingPayout}</span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === "grid") {
    return (
      <article className={\`rounded-lg border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow \${className}\`}>
        {/* Thumbnail */}
        <div className="relative aspect-video bg-muted">
          {isNsfw && !showNsfw ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <EyeOff className="h-8 w-8 text-muted-foreground" />
              <button
                onClick={() => setShowNsfw(true)}
                className="px-3 py-1 text-xs bg-muted-foreground/20 rounded"
              >
                Show NSFW
              </button>
            </div>
          ) : thumbnail ? (
            <img src={thumbnail} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              📝
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <Link href={postUrl}>
            <h3 className="font-semibold line-clamp-2 hover:text-hive-red">{title}</h3>
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">
            @{author} · {timeAgo}
          </p>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border text-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              <button onClick={onVote} className="flex items-center gap-1 hover:text-hive-red">
                <ThumbsUp className="h-4 w-4" /> {voteCount}
              </button>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" /> {commentCount}
              </span>
            </div>
            <span className="font-medium text-green-500">{pendingPayout}</span>
          </div>
        </div>
      </article>
    );
  }

  // Default card variant
  return (
    <article className={\`rounded-lg border border-border bg-card p-4 hover:bg-muted/50 transition-colors \${className}\`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={\`https://images.hive.blog/u/\${author}/avatar/small\`}
          alt={author}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <Link href={\`/@\${author}\`} className="font-medium hover:text-hive-red">
            @{author}
          </Link>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" /> {timeAgo}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          <Link href={postUrl}>
            <h2 className="text-lg font-bold hover:text-hive-red line-clamp-2">
              {title}
            </h2>
          </Link>
          <p className="mt-2 text-muted-foreground line-clamp-3">{summary}</p>
        </div>

        {thumbnail && (
          <div className="relative w-24 h-24 rounded overflow-hidden shrink-0">
            {isNsfw && !showNsfw ? (
              <button
                onClick={() => setShowNsfw(true)}
                className="w-full h-full bg-muted flex items-center justify-center"
              >
                <EyeOff className="h-6 w-6 text-muted-foreground" />
              </button>
            ) : (
              <img src={thumbnail} alt="" className="w-full h-full object-cover" />
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <div className="flex items-center gap-4">
          <button
            onClick={onVote}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-hive-red"
          >
            <ThumbsUp className="h-4 w-4" />
            <span className="text-sm">{voteCount}</span>
          </button>
          <Link
            href={\`\${postUrl}#comments\`}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm">{commentCount}</span>
          </Link>
          <button
            onClick={onShare}
            className="p-1 text-muted-foreground hover:text-foreground"
          >
            <Share className="h-4 w-4" />
          </button>
        </div>
        <span className="text-sm font-medium text-green-500">{pendingPayout}</span>
      </div>
    </article>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return \`\${Math.floor(seconds / 60)}m ago\`;
  if (seconds < 86400) return \`\${Math.floor(seconds / 3600)}h ago\`;
  if (seconds < 604800) return \`\${Math.floor(seconds / 86400)}d ago\`;

  return date.toLocaleDateString();
}`,
  basicUsage: `"use client";

import { PostSummary } from "@/components/hive/post-summary";

interface Post {
  author: string;
  permlink: string;
  title: string;
  body: string;
  json_metadata: string;
  created: string;
  active_votes: any[];
  children: number;
  pending_payout_value: string;
}

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const metadata = JSON.parse(post.json_metadata || "{}");

        return (
          <PostSummary
            key={\`\${post.author}/\${post.permlink}\`}
            author={post.author}
            permlink={post.permlink}
            title={post.title}
            body={post.body}
            thumbnail={metadata.image?.[0]}
            createdAt={post.created}
            voteCount={post.active_votes.length}
            commentCount={post.children}
            pendingPayout={post.pending_payout_value}
            isNsfw={metadata.tags?.includes("nsfw")}
          />
        );
      })}
    </div>
  );
}`,
  gridLayout: `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {posts.map((post) => (
    <PostSummary
      key={\`\${post.author}/\${post.permlink}\`}
      variant="grid"
      {...post}
    />
  ))}
</div>`,
  compactList: `<div className="divide-y divide-border">
  {posts.map((post) => (
    <PostSummary
      key={\`\${post.author}/\${post.permlink}\`}
      variant="compact"
      {...post}
    />
  ))}
</div>`,
};

export default async function PostSummaryPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Post Summary</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Display post previews with thumbnail, stats, and NSFW handling.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Post Metadata</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Thumbnails are extracted from json_metadata.image array. NSFW detection
              uses the &quot;nsfw&quot; tag. Payout is shown in HBD until the 7-day window closes.
            </p>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="space-y-4">
          {/* Card variant */}
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-hive-red/20" />
              <div>
                <p className="font-medium">@hiveio</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> 2h ago
                </p>
              </div>
            </div>
            <h2 className="text-lg font-bold">Welcome to Hive Blockchain</h2>
            <p className="mt-2 text-muted-foreground text-sm line-clamp-2">
              Hive is a decentralized social blockchain that enables fast, free, and censorship-resistant content publishing...
            </p>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <ThumbsUp className="h-4 w-4" /> 142
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageCircle className="h-4 w-4" /> 28
                </span>
                <Share className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-green-500">$12.45</span>
            </div>
          </div>

          {/* Compact variant */}
          <div className="flex gap-4 p-4 rounded-lg border border-border">
            <div className="w-20 h-20 rounded bg-muted shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">Quick Update on Development Progress</h3>
              <p className="text-sm text-muted-foreground">@developer · 5h ago</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-3.5 w-3.5" /> 56
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-3.5 w-3.5" /> 12
                </span>
                <span className="text-green-500">$3.21</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Component Code */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Component</h2>
        <CodeBlock
          filename="components/hive/post-summary.tsx"
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
                <td className="py-3 px-4"><code>variant</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>&quot;card&quot; | &quot;compact&quot; | &quot;grid&quot;</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>&quot;card&quot;</code></td>
                <td className="py-3 px-4 text-muted-foreground">Display variant</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>isNsfw</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>false</code></td>
                <td className="py-3 px-4 text-muted-foreground">Blur thumbnail if NSFW</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>thumbnail</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
                <td className="py-3 px-4 text-muted-foreground">Thumbnail image URL</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>pendingPayout</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">required</td>
                <td className="py-3 px-4 text-muted-foreground">Formatted payout amount</td>
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

      {/* Grid Layout */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Grid Layout</h2>
        <CodeBlock code={CODE.gridLayout} language="tsx" />
      </section>

      {/* Compact List */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Compact List</h2>
        <CodeBlock code={CODE.compactList} language="tsx" />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Next</h2>
        <div className="flex gap-4">
          <Link
            href="/docs/components/reblog-button"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            Reblog Button
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
