"use client";

import { HiveAvatar } from "./avatar";
import { cn } from "./utils";
import type { PostVariant, PostHideOption } from "./post-card";
import {
  type RankedPost,
  format_payout,
  format_time_ago,
  extract_thumbnail,
} from "@kkocot/honeycomb-core";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function should_hide(
  hide: PostHideOption[],
  option: PostHideOption,
): boolean {
  return hide.includes(option);
}

function strip_markdown(text: string): string {
  return text.replace(/[#*`>\[\]!]/g, "").substring(0, 150);
}

export function get_thumbnail(post: RankedPost): string | null {
  return extract_thumbnail(post.json_metadata, post.body) ?? null;
}

export function get_post_url(
  author: string,
  permlink: string,
  category: string,
  link_target: string,
): string {
  return category
    ? `${link_target}/${category}/@${author}/${permlink}`
    : `${link_target}/@${author}/${permlink}`;
}

// ---------------------------------------------------------------------------
// Inline Post Renderers (avoid N+1 fetches that HivePostCard would cause)
// ---------------------------------------------------------------------------

export interface InlinePostProps {
  post: RankedPost;
  hide: PostHideOption[];
  link_target: string;
  is_pinned?: boolean;
}

function CompactPost({ post, hide, link_target, is_pinned }: InlinePostProps) {
  const thumbnail = get_thumbnail(post);
  const post_url = get_post_url(
    post.author,
    post.permlink,
    post.category,
    link_target,
  );

  return (
    <div className="flex gap-4 p-4 rounded-lg border border-hive-border bg-hive-card hover:border-hive-red/50 transition-colors">
      {!should_hide(hide, "thumbnail") && (
        <a
          href={post_url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-20 h-20 rounded overflow-hidden shrink-0"
        >
          {thumbnail ? (
            <img
              src={thumbnail}
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
          {is_pinned && (
            <span className="shrink-0 rounded bg-hive-red px-2 py-0.5 text-xs text-white">
              Pinned
            </span>
          )}
        </div>
        {!should_hide(hide, "author") && (
          <p className="text-sm text-hive-muted-foreground">
            @{post.author}
            {!should_hide(hide, "time") &&
              ` \u00B7 ${format_time_ago(post.created)}`}
          </p>
        )}
        <div className="flex items-center gap-4 mt-2 text-sm text-hive-muted-foreground">
          {!should_hide(hide, "votes") && (
            <span className="flex items-center gap-1">
              <span aria-hidden="true">^</span> {post.net_votes}
            </span>
          )}
          {!should_hide(hide, "comments") && (
            <span className="flex items-center gap-1">
              <span aria-hidden="true">#</span> {post.children}
            </span>
          )}
          {!should_hide(hide, "payout") && (
            <span className="text-hive-success">
              {format_payout(post.pending_payout_value)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function CardPost({ post, hide, link_target, is_pinned }: InlinePostProps) {
  const thumbnail = get_thumbnail(post);
  const post_url = get_post_url(
    post.author,
    post.permlink,
    post.category,
    link_target,
  );

  return (
    <div className="rounded-lg border border-hive-border bg-hive-card overflow-hidden hover:border-hive-red/50 transition-colors">
      {!should_hide(hide, "thumbnail") && thumbnail && (
        <a
          href={post_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block aspect-video overflow-hidden"
        >
          <img
            src={thumbnail}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        </a>
      )}
      <div className="p-4">
        {!should_hide(hide, "author") && (
          <div className="flex items-center gap-3 mb-3">
            <HiveAvatar username={post.author} size="sm" />
            <div>
              <p className="font-medium">@{post.author}</p>
              {!should_hide(hide, "time") && (
                <p className="text-sm text-hive-muted-foreground">
                  {format_time_ago(post.created)}
                </p>
              )}
            </div>
            {is_pinned && (
              <span className="ml-auto shrink-0 rounded bg-hive-red px-2 py-0.5 text-xs text-white">
                Pinned
              </span>
            )}
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
                <span aria-hidden="true">^</span> {post.net_votes}
              </span>
            )}
            {!should_hide(hide, "comments") && (
              <span className="flex items-center gap-1.5">
                <span aria-hidden="true">#</span> {post.children}
              </span>
            )}
          </div>
          {!should_hide(hide, "payout") && (
            <span className="text-sm font-medium text-hive-success">
              {format_payout(post.pending_payout_value)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function GridPost({ post, hide, link_target, is_pinned }: InlinePostProps) {
  const thumbnail = get_thumbnail(post);
  const post_url = get_post_url(
    post.author,
    post.permlink,
    post.category,
    link_target,
  );

  return (
    <div className="rounded-lg border border-hive-border bg-hive-card overflow-hidden hover:border-hive-red/50 transition-colors">
      {!should_hide(hide, "thumbnail") && (
        <a
          href={post_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block aspect-video overflow-hidden"
        >
          {thumbnail ? (
            <img
              src={thumbnail}
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
        <div className="flex items-center gap-2">
          <a
            href={post_url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-hive-red transition-colors min-w-0"
          >
            <h3 className="font-semibold line-clamp-2">{post.title}</h3>
          </a>
          {is_pinned && (
            <span className="shrink-0 rounded bg-hive-red px-2 py-0.5 text-xs text-white">
              Pinned
            </span>
          )}
        </div>
        {!should_hide(hide, "author") && (
          <p className="mt-1 text-sm text-hive-muted-foreground">
            @{post.author}
            {!should_hide(hide, "time") &&
              ` \u00B7 ${format_time_ago(post.created)}`}
          </p>
        )}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-hive-border text-sm">
          <div className="flex items-center gap-3 text-hive-muted-foreground">
            {!should_hide(hide, "votes") && (
              <span className="flex items-center gap-1">
                <span aria-hidden="true">^</span> {post.net_votes}
              </span>
            )}
            {!should_hide(hide, "comments") && (
              <span className="flex items-center gap-1">
                <span aria-hidden="true">#</span> {post.children}
              </span>
            )}
          </div>
          {!should_hide(hide, "payout") && (
            <span className="font-medium text-hive-success">
              {format_payout(post.pending_payout_value)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function PostItem({
  post,
  variant,
  hide,
  link_target,
  is_pinned,
}: InlinePostProps & { variant: PostVariant }) {
  const props: InlinePostProps = { post, hide, link_target, is_pinned };
  if (variant === "compact") return <CompactPost {...props} />;
  if (variant === "grid") return <GridPost {...props} />;
  return <CardPost {...props} />;
}

// ---------------------------------------------------------------------------
// Skeleton loaders
// ---------------------------------------------------------------------------

export function CompactSkeleton() {
  return (
    <div className="flex gap-4 p-4 rounded-lg border border-hive-border bg-hive-card animate-pulse">
      <div className="w-20 h-20 rounded bg-hive-muted shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-5 w-3/4 bg-hive-muted rounded" />
        <div className="h-3 w-1/3 bg-hive-muted rounded" />
        <div className="h-3 w-1/2 bg-hive-muted rounded" />
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-lg border border-hive-border bg-hive-card p-4 animate-pulse">
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

function GridSkeleton() {
  return (
    <div className="rounded-lg border border-hive-border bg-hive-card overflow-hidden animate-pulse">
      <div className="aspect-video bg-hive-muted" />
      <div className="p-4 space-y-2">
        <div className="h-5 w-3/4 bg-hive-muted rounded" />
        <div className="h-3 w-1/3 bg-hive-muted rounded" />
      </div>
    </div>
  );
}

export function LoadingSkeleton({
  variant,
  count,
}: {
  variant: PostVariant;
  count: number;
}) {
  const items = Array.from({ length: count }, (_, i) => i);
  if (variant === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((i) => (
          <GridSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (variant === "compact") {
    return (
      <div className="flex flex-col gap-2">
        {items.map((i) => (
          <CompactSkeleton key={i} />
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {items.map((i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
