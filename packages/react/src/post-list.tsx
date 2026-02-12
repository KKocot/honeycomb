"use client";

import {
  useHivePostList,
  type UseHivePostListOptions,
} from "./use-hive-post-list";
import { useHivePost } from "./use-hive-post";
import { cn } from "./utils";
import type { PostVariant, PostHideOption } from "./post-card";
import type { SortType } from "@kkocot/honeycomb-core";
import { PostItem, get_post_url } from "./post-list-items";
import { CompactSkeleton, LoadingSkeleton } from "./post-list-skeletons";

const SORT_LABELS: Record<SortType, string> = {
  trending: "Trending",
  hot: "Hot",
  created: "New",
  payout: "Payout",
  muted: "Muted",
};

const SORT_OPTIONS: SortType[] = [
  "trending",
  "hot",
  "created",
  "payout",
  "muted",
];

export interface HivePostListProps {
  /** Initial sort order */
  sort?: SortType;
  /** Community or tag filter */
  tag?: string;
  /** Posts per page */
  limit?: number;
  /** Pinned posts displayed at the top (fetched separately) */
  pinned_posts?: Array<{ author: string; permlink: string }>;
  /** Show sort control buttons */
  show_sort_controls?: boolean;
  /** Card variant for post items */
  variant?: PostVariant;
  /** Elements to hide on post cards */
  hide?: PostHideOption[];
  /** Base URL for post links */
  linkTarget?: string;
  /** Additional CSS classes */
  className?: string;
}

// ---------------------------------------------------------------------------
// Sort Controls
// ---------------------------------------------------------------------------

function SortControls({
  sort,
  on_change,
}: {
  sort: SortType;
  on_change: (s: SortType) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {SORT_OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => on_change(option)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            option === sort
              ? "bg-foreground text-background"
              : "bg-hive-muted text-hive-muted-foreground hover:text-hive-foreground",
          )}
        >
          {SORT_LABELS[option]}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pinned Posts Section
// ---------------------------------------------------------------------------

function PinnedPostItem({
  author,
  permlink,
  hide,
  link_target,
}: {
  author: string;
  permlink: string;
  hide: PostHideOption[];
  link_target: string;
}) {
  const { post, is_loading, error } = useHivePost(author, permlink);

  if (is_loading) return <CompactSkeleton />;

  if (error || !post) {
    return (
      <div className="rounded-lg border border-hive-border bg-hive-card p-4">
        <p className="text-sm text-hive-muted-foreground">
          {error?.message ?? `Could not load @${author}/${permlink}`}
        </p>
      </div>
    );
  }

  const post_url = get_post_url(author, permlink, post.category, link_target);

  return (
    <div className="flex gap-4 p-4 rounded-lg border border-hive-border bg-hive-card hover:border-hive-red/50 transition-colors">
      {!hide.includes("thumbnail") && (
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
        <div className="flex items-center gap-2">
          <a
            href={post_url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-hive-red transition-colors min-w-0"
          >
            <h3 className="font-semibold truncate">{post.title}</h3>
          </a>
          <span className="shrink-0 rounded bg-hive-red px-2 py-0.5 text-xs text-white">
            Pinned
          </span>
        </div>
        {!hide.includes("author") && (
          <p className="text-sm text-hive-muted-foreground">
            @{author}
            {!hide.includes("time") && ` \u00B7 ${post.created}`}
          </p>
        )}
        <div className="flex items-center gap-4 mt-2 text-sm text-hive-muted-foreground">
          {!hide.includes("votes") && (
            <span className="flex items-center gap-1">
              <span aria-hidden="true">^</span> {post.votes}
            </span>
          )}
          {!hide.includes("comments") && (
            <span className="flex items-center gap-1">
              <span aria-hidden="true">#</span> {post.comments}
            </span>
          )}
          {!hide.includes("payout") && (
            <span className="text-hive-success">{post.payout}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function PinnedSection({
  pinned_posts,
  hide,
  link_target,
}: {
  pinned_posts: Array<{ author: string; permlink: string }>;
  hide: PostHideOption[];
  link_target: string;
}) {
  return (
    <div className="mb-4 pb-4 border-b border-hive-border">
      <p className="text-xs font-medium text-hive-muted-foreground uppercase tracking-wide mb-2">
        Pinned
      </p>
      <div className="flex flex-col gap-2">
        {pinned_posts.map((pin) => (
          <PinnedPostItem
            key={`${pin.author}/${pin.permlink}`}
            author={pin.author}
            permlink={pin.permlink}
            hide={hide}
            link_target={link_target}
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
// HivePostList
// ---------------------------------------------------------------------------

export function HivePostList({
  sort: initial_sort,
  tag,
  limit,
  pinned_posts,
  show_sort_controls = false,
  variant = "compact",
  hide = [],
  linkTarget = "https://blog.openhive.network",
  className,
}: HivePostListProps) {
  const hook_options: UseHivePostListOptions = {
    sort: initial_sort,
    tag,
    limit,
  };

  const {
    posts,
    is_loading,
    error,
    sort,
    set_sort,
    has_next,
    has_prev,
    next_page,
    prev_page,
    page,
  } = useHivePostList(hook_options);

  const has_pinned = pinned_posts !== undefined && pinned_posts.length > 0;

  return (
    <div className={cn("w-full", className)}>
      {show_sort_controls && (
        <SortControls sort={sort} on_change={set_sort} />
      )}

      {has_pinned && (
        <PinnedSection
          pinned_posts={pinned_posts}
          hide={hide}
          link_target={linkTarget}
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
                  key={post.post_id}
                  post={post}
                  variant={variant}
                  hide={hide}
                  link_target={linkTarget}
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
                  key={post.post_id}
                  post={post}
                  variant={variant}
                  hide={hide}
                  link_target={linkTarget}
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
