"use client";

import {
  useHiveAuthorPostList,
  type UseHiveAuthorPostListOptions,
} from "./use-hive-author-post-list";
import { cn } from "./utils";
import type { PostVariant, PostHideOption } from "./post-card";
import type { AccountPost, RankedPost } from "@kkocot/honeycomb-core";
import { PostItem } from "./post-list-items";
import { LoadingSkeleton } from "./post-list-skeletons";

const DEFAULT_LINK_TARGET = "https://blog.openhive.network";

// Prevent javascript:/data: scheme XSS — only allow absolute http(s) URLs
// or root-relative paths. Falls back to default if invalid.
function safe_link_target(t: string): string {
  if (/^https?:\/\//i.test(t)) return t;
  if (t.startsWith("/") && !t.startsWith("//")) return t;
  return DEFAULT_LINK_TARGET;
}

// Synthetic stable post_id derived from author+permlink, used because
// AccountPost has no native post_id (RankedPost shim for PostItem reuse).
function hash_id(author: string, permlink: string): number {
  let h = 0;
  const s = `${author}/${permlink}`;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0; // 32-bit int
  }
  return Math.abs(h);
}

export interface HiveAuthorPostListProps {
  /** Hive account name (required) */
  account: string;
  /** Optional client-side tag filter */
  tag?: string;
  /** Posts per page */
  limit?: number;
  /**
   * Pinned posts to display above the list.
   * Note: Unlike HivePostList (which accepts {author, permlink} and refetches),
   * this expects full AccountPost objects to avoid N+1 fetches — pinned posts
   * are rendered directly from this data without an extra API call.
   */
  pinned_posts?: AccountPost[];
  /** Card variant for post items */
  variant?: PostVariant;
  /** Elements to hide on post cards */
  hide?: PostHideOption[];
  /** Base URL for post links */
  linkTarget?: string;
  /** Additional CSS classes */
  className?: string;
  /** Override API endpoint */
  api_endpoint?: string;
}

// ---------------------------------------------------------------------------
// Adapter: AccountPost -> RankedPost-shaped (for reuse with PostItem)
// ---------------------------------------------------------------------------

function to_ranked(post: AccountPost): RankedPost {
  return {
    // Synthetic id from author/permlink (RankedPost shim — AccountPost has none).
    post_id: hash_id(post.author, post.permlink),
    author: post.author,
    permlink: post.permlink,
    title: post.title,
    body: post.body,
    category: post.category,
    children: post.children,
    net_votes: post.net_votes,
    pending_payout_value: post.pending_payout_value,
    total_payout_value: post.total_payout_value,
    curator_payout_value: post.curator_payout_value,
    created: post.created,
    json_metadata: post.json_metadata,
  };
}

// ---------------------------------------------------------------------------
// Pinned Posts Section
// ---------------------------------------------------------------------------

function PinnedSection({
  pinned_posts,
  hide,
  link_target,
  variant,
}: {
  pinned_posts: AccountPost[];
  hide: PostHideOption[];
  link_target: string;
  variant: PostVariant;
}) {
  return (
    <div className="mb-4 pb-4 border-b border-hive-border">
      <p className="text-xs font-medium text-hive-muted-foreground uppercase tracking-wide mb-2">
        Pinned
      </p>
      <div
        className={cn(
          "flex flex-col",
          variant === "compact" ? "gap-2" : "gap-4",
        )}
      >
        {pinned_posts.map((pin) => (
          <PostItem
            key={`${pin.author}/${pin.permlink}`}
            post={to_ranked(pin)}
            variant={variant}
            hide={hide}
            link_target={link_target}
            is_pinned
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pagination Controls
// ---------------------------------------------------------------------------

function PaginationControls({
  page,
  has_prev,
  has_next,
  on_prev,
  on_next,
}: {
  page: number;
  has_prev: boolean;
  has_next: boolean;
  on_prev: () => void;
  on_next: () => void;
}) {
  return (
    <div className="flex items-center justify-between mt-6">
      <button
        type="button"
        onClick={on_prev}
        disabled={!has_prev}
        className={cn(
          "rounded-lg border border-hive-border px-4 py-2 text-sm font-medium hover:bg-hive-muted transition-colors",
          !has_prev && "opacity-50 cursor-not-allowed hover:bg-transparent",
        )}
      >
        Prev Page
      </button>
      <span className="text-sm text-hive-muted-foreground">Page {page}</span>
      <button
        type="button"
        onClick={on_next}
        disabled={!has_next}
        className={cn(
          "rounded-lg border border-hive-border px-4 py-2 text-sm font-medium hover:bg-hive-muted transition-colors",
          !has_next && "opacity-50 cursor-not-allowed hover:bg-transparent",
        )}
      >
        Next Page
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// HiveAuthorPostList
// ---------------------------------------------------------------------------

export function HiveAuthorPostList({
  account,
  tag,
  limit,
  pinned_posts,
  variant = "compact",
  hide = [],
  linkTarget = DEFAULT_LINK_TARGET,
  className,
  api_endpoint,
}: HiveAuthorPostListProps) {
  // Sanitize linkTarget to prevent javascript: scheme XSS in <a href>.
  const link_target = safe_link_target(linkTarget);

  const hook_options: UseHiveAuthorPostListOptions = {
    account,
    tag,
    limit,
    api_endpoint,
  };

  const {
    posts,
    is_loading,
    error,
    has_next,
    has_prev,
    next_page,
    prev_page,
    page,
  } = useHiveAuthorPostList(hook_options);

  const has_pinned = pinned_posts !== undefined && pinned_posts.length > 0;

  return (
    <div className={cn("w-full", className)}>
      {has_pinned && (
        <PinnedSection
          pinned_posts={pinned_posts}
          hide={hide}
          link_target={link_target}
          variant={variant}
        />
      )}

      {is_loading && <LoadingSkeleton variant={variant} count={4} />}

      {!is_loading && error && (
        <div className="rounded-lg border border-hive-border p-4">
          <p className="text-sm text-hive-muted-foreground">{error.message}</p>
        </div>
      )}

      {!is_loading && !error && posts.length === 0 && (
        <p className="text-sm text-hive-muted-foreground py-8 text-center">
          No posts found
        </p>
      )}

      {!is_loading && !error && posts.length > 0 && (
        <>
          {variant === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((post) => (
                <PostItem
                  key={`${post.author}/${post.permlink}`}
                  post={to_ranked(post)}
                  variant={variant}
                  hide={hide}
                  link_target={link_target}
                />
              ))}
            </div>
          ) : (
            <div
              className={cn(
                "flex flex-col",
                variant === "compact" ? "gap-2" : "gap-4",
              )}
            >
              {posts.map((post) => (
                <PostItem
                  key={`${post.author}/${post.permlink}`}
                  post={to_ranked(post)}
                  variant={variant}
                  hide={hide}
                  link_target={link_target}
                />
              ))}
            </div>
          )}
          <PaginationControls
            page={page}
            has_prev={has_prev}
            has_next={has_next}
            on_prev={prev_page}
            on_next={next_page}
          />
        </>
      )}
    </div>
  );
}
