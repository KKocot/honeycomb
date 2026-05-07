import { Show, For, createMemo, type Component } from "solid-js";
import {
  useHiveAuthorPostList,
  type UseHiveAuthorPostListOptions,
} from "./use-hive-author-post-list";
import { cn } from "./utils";
import type { PostVariant, PostHideOption } from "./post-card";
import type { AccountPost, RankedPost } from "@kkocot/honeycomb-core";
import { PostItem } from "./post-list-items";
import { LoadingSkeleton } from "./post-list-skeletons";
import { PaginationControls } from "./post-list-controls";

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

// Adapter: AccountPost -> RankedPost-shaped (for reuse with PostItem)
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
  class?: string;
  /** Override API endpoint */
  api_endpoint?: string;
}

export const HiveAuthorPostList: Component<HiveAuthorPostListProps> = (
  props,
) => {
  const variant = () => props.variant ?? "compact";
  const hide = () => props.hide ?? [];
  // Sanitize linkTarget to prevent javascript: scheme XSS in <a href>.
  const link_target = () =>
    safe_link_target(props.linkTarget ?? DEFAULT_LINK_TARGET);

  const hook_options: UseHiveAuthorPostListOptions = {
    get account() {
      return props.account;
    },
    get tag() {
      return props.tag;
    },
    get limit() {
      return props.limit;
    },
    get api_endpoint() {
      return props.api_endpoint;
    },
  };

  const list = useHiveAuthorPostList(hook_options);

  const ranked_posts = createMemo(() => list.posts().map(to_ranked));

  const has_pinned = () =>
    props.pinned_posts !== undefined && props.pinned_posts.length > 0;

  return (
    <div class={cn("w-full", props.class)}>
      <Show when={has_pinned()}>
        <div class="mb-4 pb-4 border-b border-hive-border">
          <p class="text-xs font-medium text-hive-muted-foreground uppercase tracking-wide mb-2">
            Pinned
          </p>
          <div
            class={cn(
              "flex flex-col",
              variant() === "compact" ? "gap-2" : "gap-4",
            )}
          >
            <For each={props.pinned_posts ?? []}>
              {(pin) => (
                <PostItem
                  post={to_ranked(pin)}
                  variant={variant()}
                  hide={hide()}
                  link_target={link_target()}
                  is_pinned
                />
              )}
            </For>
          </div>
        </div>
      </Show>

      <Show when={list.is_loading()}>
        <LoadingSkeleton variant={variant()} count={4} />
      </Show>

      <Show when={!list.is_loading() && list.error()}>
        <div class="rounded-lg border border-hive-border p-4">
          <p class="text-sm text-hive-muted-foreground">
            {list.error()?.message}
          </p>
        </div>
      </Show>

      <Show
        when={!list.is_loading() && !list.error() && list.posts().length === 0}
      >
        <p class="text-sm text-hive-muted-foreground py-8 text-center">
          No posts found
        </p>
      </Show>

      <Show
        when={!list.is_loading() && !list.error() && list.posts().length > 0}
      >
        <Show
          when={variant() !== "grid"}
          fallback={
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <For each={ranked_posts()}>
                {(post) => (
                  <PostItem
                    post={post}
                    variant={variant()}
                    hide={hide()}
                    link_target={link_target()}
                  />
                )}
              </For>
            </div>
          }
        >
          <div
            class={cn(
              "flex flex-col",
              variant() === "compact" ? "gap-2" : "gap-4",
            )}
          >
            <For each={ranked_posts()}>
              {(post) => (
                <PostItem
                  post={post}
                  variant={variant()}
                  hide={hide()}
                  link_target={link_target()}
                />
              )}
            </For>
          </div>
        </Show>
        <PaginationControls
          page={list.page()}
          has_prev={list.has_prev()}
          has_next={list.has_next()}
          on_prev={list.prev_page}
          on_next={list.next_page}
        />
      </Show>
    </div>
  );
};
