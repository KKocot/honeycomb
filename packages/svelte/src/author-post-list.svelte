<script lang="ts" module>
  import type { PostVariant, PostHideOption } from "./post-card.svelte";
  import type { AccountPost, RankedPost } from "@kkocot/honeycomb-core";

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

  // Adapter: AccountPost -> RankedPost-shaped (for reuse with PostItem).
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
</script>

<script lang="ts">
  import { useHiveAuthorPostList } from "./use-hive-author-post-list.svelte";
  import PostItem from "./post-list-items.svelte";
  import LoadingSkeleton from "./post-list-skeletons.svelte";
  import { cn } from "./utils";

  let {
    account,
    tag,
    limit,
    pinned_posts,
    variant = "compact",
    hide = [],
    linkTarget = DEFAULT_LINK_TARGET,
    class: class_name,
    api_endpoint,
  }: HiveAuthorPostListProps = $props();

  // Sanitize linkTarget to prevent javascript: scheme XSS in <a href>.
  const link_target = $derived(safe_link_target(linkTarget));

  const list = useHiveAuthorPostList(() => ({
    account,
    tag,
    limit,
    api_endpoint,
  }));

  const has_pinned = $derived(
    pinned_posts !== undefined && pinned_posts.length > 0,
  );

  // Memoize to_ranked() — without this, each render iterates 3 branches
  // (compact/grid/card) calling to_ranked() per post, recomputing hashes.
  const ranked_posts = $derived(list.posts.map(to_ranked));
  const ranked_pinned = $derived(pinned_posts?.map(to_ranked) ?? []);
</script>

{#snippet pagination_controls()}
  <div class="flex items-center justify-between mt-6">
    <button
      type="button"
      onclick={list.prev_page}
      disabled={!list.has_prev}
      class={cn(
        "rounded-lg border border-hive-border px-4 py-2 text-sm font-medium hover:bg-hive-muted transition-colors",
        !list.has_prev &&
          "opacity-50 cursor-not-allowed hover:bg-transparent",
      )}
    >
      Prev Page
    </button>
    <span class="text-sm text-hive-muted-foreground">
      Page {list.page}
    </span>
    <button
      type="button"
      onclick={list.next_page}
      disabled={!list.has_next}
      class={cn(
        "rounded-lg border border-hive-border px-4 py-2 text-sm font-medium hover:bg-hive-muted transition-colors",
        !list.has_next &&
          "opacity-50 cursor-not-allowed hover:bg-transparent",
      )}
    >
      Next Page
    </button>
  </div>
{/snippet}

<div class={cn("w-full", class_name)}>
  {#if has_pinned && pinned_posts}
    <div class="mb-4 pb-4 border-b border-hive-border">
      <p
        class="text-xs font-medium text-hive-muted-foreground uppercase tracking-wide mb-2"
      >
        Pinned
      </p>
      <div
        class={cn(
          "flex flex-col",
          variant === "compact" ? "gap-2" : "gap-4",
        )}
      >
        {#each ranked_pinned as pin (pin.post_id)}
          <PostItem
            post={pin}
            {variant}
            {hide}
            {link_target}
            is_pinned
          />
        {/each}
      </div>
    </div>
  {/if}

  {#if list.is_loading}
    <LoadingSkeleton {variant} count={4} />
  {/if}

  {#if !list.is_loading && list.error}
    <div class="rounded-lg border border-hive-border p-4">
      <p class="text-sm text-hive-muted-foreground">
        {list.error.message}
      </p>
    </div>
  {/if}

  {#if !list.is_loading && !list.error && list.posts.length === 0}
    <p
      class="text-sm text-hive-muted-foreground py-8 text-center"
    >
      No posts found
    </p>
  {/if}

  {#if !list.is_loading && !list.error && list.posts.length > 0}
    {#if variant === "grid"}
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {#each ranked_posts as post (post.post_id)}
          <PostItem
            {post}
            {variant}
            {hide}
            {link_target}
          />
        {/each}
      </div>
    {:else}
      <div
        class={cn(
          "flex flex-col",
          variant === "compact" ? "gap-2" : "gap-4",
        )}
      >
        {#each ranked_posts as post (post.post_id)}
          <PostItem
            {post}
            {variant}
            {hide}
            {link_target}
          />
        {/each}
      </div>
    {/if}
    {@render pagination_controls()}
  {/if}
</div>
