"use client";

import { useHivePost } from "./use-hive-post";
import { HiveAvatar } from "./avatar";
import { cn } from "./utils";

export type PostVariant = "card" | "compact" | "grid";
export type PostHideOption =
  | "author"
  | "thumbnail"
  | "payout"
  | "votes"
  | "comments"
  | "time";

export interface HivePostCardProps {
  /** Hive post author username */
  author: string;
  /** Hive post permlink */
  permlink: string;
  /** Card display variant */
  variant?: PostVariant;
  /** Elements to hide */
  hide?: PostHideOption[];
  /** Base URL for post links */
  linkTarget?: string;
  /** Additional CSS classes */
  className?: string;
}

function should_hide(hide: PostHideOption[], option: PostHideOption): boolean {
  return hide.includes(option);
}

/**
 * Strip markdown syntax characters for plain text preview.
 */
function strip_markdown(text: string): string {
  return text.replace(/[#*`>\[\]!]/g, "").substring(0, 150);
}

/**
 * HivePostCard Component
 *
 * Display a Hive blockchain post with title, author, stats, and content preview.
 * Display-only - no vote/reblog actions. Fetches post data automatically.
 *
 * @example
 * ```tsx
 * <HivePostCard author="blocktrades" permlink="my-post" />
 * <HivePostCard author="barddev" permlink="update" variant="compact" />
 * <HivePostCard author="alice" permlink="intro" variant="grid" hide={["payout"]} />
 * ```
 */
export function HivePostCard({
  author,
  permlink,
  variant = "card",
  hide = [],
  linkTarget = "https://blog.openhive.network",
  className,
}: HivePostCardProps) {
  const { post, is_loading, error } = useHivePost(author, permlink);

  // Loading state
  if (is_loading) {
    return (
      <div
        className={cn(
          "rounded-lg border border-hive-border bg-hive-card p-4 animate-pulse",
          className,
        )}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-full bg-hive-muted" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-hive-muted rounded" />
            <div className="h-3 w-16 bg-hive-muted rounded" />
          </div>
        </div>
        <div className="h-5 w-3/4 bg-hive-muted rounded mb-2" />
        <div className="h-3 w-full bg-hive-muted rounded mb-1" />
        <div className="h-3 w-2/3 bg-hive-muted rounded" />
      </div>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <div
        className={cn(
          "rounded-lg border border-hive-border bg-hive-card p-4",
          className,
        )}
      >
        <p className="text-sm text-hive-muted-foreground">
          {error?.message || "Post not found"}
        </p>
      </div>
    );
  }

  const post_url = post.category
    ? `${linkTarget}/${post.category}/@${author}/${permlink}`
    : `${linkTarget}/@${author}/${permlink}`;

  // --- Compact variant ---
  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex gap-4 p-4 rounded-lg border border-hive-border bg-hive-card hover:border-hive-red/50 transition-colors",
          className,
        )}
      >
        {!should_hide(hide, "thumbnail") && (
          <a
            href={post_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-20 h-20 rounded overflow-hidden shrink-0"
          >
            {post.thumbnail ? (
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-hive-muted flex items-center justify-center text-hive-muted-foreground text-xs">
                No img
              </div>
            )}
          </a>
        )}
        <div className="flex-1 min-w-0">
          <a
            href={post_url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-hive-red transition-colors"
          >
            <h3 className="font-semibold truncate">{post.title}</h3>
          </a>
          {!should_hide(hide, "author") && (
            <p className="text-sm text-hive-muted-foreground">
              @{author}
              {!should_hide(hide, "time") && ` · ${post.created}`}
            </p>
          )}
          <div className="flex items-center gap-4 mt-2 text-sm text-hive-muted-foreground">
            {!should_hide(hide, "votes") && (
              <span className="flex items-center gap-1">
                <span aria-hidden="true">^</span> {post.votes}
              </span>
            )}
            {!should_hide(hide, "comments") && (
              <span className="flex items-center gap-1">
                <span aria-hidden="true">#</span> {post.comments}
              </span>
            )}
            {!should_hide(hide, "payout") && (
              <span className="text-hive-success">{post.payout}</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- Grid variant ---
  if (variant === "grid") {
    return (
      <div
        className={cn(
          "rounded-lg border border-hive-border bg-hive-card overflow-hidden hover:border-hive-red/50 transition-colors",
          className,
        )}
      >
        {!should_hide(hide, "thumbnail") && (
          <a
            href={post_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block aspect-video overflow-hidden"
          >
            {post.thumbnail ? (
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-full h-full bg-hive-muted flex items-center justify-center text-hive-muted-foreground text-sm">
                No image
              </div>
            )}
          </a>
        )}
        <div className="p-4">
          <a
            href={post_url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-hive-red transition-colors"
          >
            <h3 className="font-semibold line-clamp-2">{post.title}</h3>
          </a>
          {!should_hide(hide, "author") && (
            <p className="mt-1 text-sm text-hive-muted-foreground">
              @{author}
              {!should_hide(hide, "time") && ` · ${post.created}`}
            </p>
          )}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-hive-border text-sm">
            <div className="flex items-center gap-3 text-hive-muted-foreground">
              {!should_hide(hide, "votes") && (
                <span className="flex items-center gap-1">
                  <span aria-hidden="true">^</span> {post.votes}
                </span>
              )}
              {!should_hide(hide, "comments") && (
                <span className="flex items-center gap-1">
                  <span aria-hidden="true">#</span> {post.comments}
                </span>
              )}
            </div>
            {!should_hide(hide, "payout") && (
              <span className="font-medium text-hive-success">{post.payout}</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- Default card variant ---
  return (
    <div
      className={cn(
        "rounded-lg border border-hive-border bg-hive-card overflow-hidden hover:border-hive-red/50 transition-colors",
        className,
      )}
    >
      {!should_hide(hide, "thumbnail") && post.thumbnail && (
        <a
          href={post_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block aspect-video overflow-hidden"
        >
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        </a>
      )}
      <div className="p-4">
        {!should_hide(hide, "author") && (
          <div className="flex items-center gap-3 mb-3">
            <HiveAvatar username={author} size="sm" />
            <div>
              <p className="font-medium">@{author}</p>
              {!should_hide(hide, "time") && (
                <p className="text-sm text-hive-muted-foreground">
                  {post.created}
                </p>
              )}
            </div>
          </div>
        )}
        <a
          href={post_url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-hive-red transition-colors"
        >
          <h2 className="text-lg font-bold">{post.title}</h2>
        </a>
        <p className="mt-2 text-hive-muted-foreground text-sm line-clamp-2">
          {strip_markdown(post.body)}...
        </p>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-hive-border">
          <div className="flex items-center gap-4 text-hive-muted-foreground">
            {!should_hide(hide, "votes") && (
              <span className="flex items-center gap-1.5">
                <span aria-hidden="true">^</span> {post.votes}
              </span>
            )}
            {!should_hide(hide, "comments") && (
              <span className="flex items-center gap-1.5">
                <span aria-hidden="true">#</span> {post.comments}
              </span>
            )}
          </div>
          {!should_hide(hide, "payout") && (
            <span className="text-sm font-medium text-hive-success">
              {post.payout}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
