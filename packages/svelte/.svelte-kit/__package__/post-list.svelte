<script lang="ts" module>
  import type { PostVariant, PostHideOption } from "./post-card.svelte";
  import type { SortType } from "@kkocot/honeycomb-core";

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
    class?: string;
  }
</script>

<script lang="ts">
  import { useHivePostList } from "./use-hive-post-list.svelte";
  import PinnedPostItem from "./PinnedPostItem.svelte";
  import PostItem from "./post-list-items.svelte";
  import LoadingSkeleton from "./post-list-skeletons.svelte";
  import { cn } from "./utils";

  let {
    sort: initial_sort,
    tag,
    limit,
    pinned_posts,
    show_sort_controls = false,
    variant = "compact",
    hide = [],
    linkTarget = "https://blog.openhive.network",
    class: class_name,
  }: HivePostListProps = $props();

  const list = useHivePostList(() => ({
    sort: initial_sort,
    tag,
    limit,
  }));

  const has_pinned = $derived(
    pinned_posts !== undefined && pinned_posts.length > 0,
  );
</script>

{#snippet sort_controls()}
  <div class="flex flex-wrap gap-2 mb-4">
    {#each SORT_OPTIONS as option (option)}
      <button
        type="button"
        onclick={() => list.set_sort(option)}
        class={cn(
          "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
          option === list.sort
            ? "bg-foreground text-background"
            : "bg-hive-muted text-hive-muted-foreground hover:text-hive-foreground",
        )}
      >
        {SORT_LABELS[option]}
      </button>
    {/each}
  </div>
{/snippet}

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
  {#if show_sort_controls}
    {@render sort_controls()}
  {/if}

  {#if has_pinned && pinned_posts}
    <div class="mb-4 pb-4 border-b border-hive-border">
      <p
        class="text-xs font-medium text-hive-muted-foreground uppercase tracking-wide mb-2"
      >
        Pinned
      </p>
      <div class="flex flex-col gap-2">
        {#each pinned_posts as pin (`${pin.author}/${pin.permlink}`)}
          <PinnedPostItem
            author={pin.author}
            permlink={pin.permlink}
            {variant}
            {hide}
            link_target={linkTarget}
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
        {#each list.posts as post (post.post_id)}
          <PostItem
            {post}
            {variant}
            {hide}
            link_target={linkTarget}
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
        {#each list.posts as post (post.post_id)}
          <PostItem
            {post}
            {variant}
            {hide}
            link_target={linkTarget}
          />
        {/each}
      </div>
    {/if}
    {@render pagination_controls()}
  {/if}
</div>
