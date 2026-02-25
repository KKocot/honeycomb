<script lang="ts" module>
  import type { PostVariant, PostHideOption } from "./post-card.svelte";

  export interface PinnedPostItemProps {
    author: string;
    permlink: string;
    variant: PostVariant;
    hide: PostHideOption[];
    link_target: string;
    class?: string;
  }
</script>

<script lang="ts">
  import { useHivePost } from "./use-hive-post.svelte";
  import { cn } from "./utils";
  import { should_hide, get_post_url } from "./utils";

  let {
    author,
    permlink,
    variant,
    hide,
    link_target,
    class: class_name,
  }: PinnedPostItemProps = $props();

  const result = useHivePost(
    () => author,
    () => permlink,
  );
</script>

{#if result.is_loading}
  <div
    class="flex gap-4 p-4 rounded-lg border border-hive-border bg-hive-card animate-pulse"
  >
    <div class="w-20 h-20 rounded bg-hive-muted shrink-0"></div>
    <div class="flex-1 space-y-2">
      <div class="h-5 w-3/4 bg-hive-muted rounded"></div>
      <div class="h-3 w-1/3 bg-hive-muted rounded"></div>
      <div class="h-3 w-1/2 bg-hive-muted rounded"></div>
    </div>
  </div>
{:else if result.error || !result.post}
  <div class="rounded-lg border border-hive-border bg-hive-card p-4">
    <p class="text-sm text-hive-muted-foreground">
      {result.error?.message ??
        `Could not load @${author}/${permlink}`}
    </p>
  </div>
{:else}
  {@const post_url = get_post_url(
    author,
    permlink,
    result.post.category,
    link_target,
  )}
  <div
    class={cn(
      "flex gap-4 p-4 rounded-lg border border-hive-border bg-hive-card hover:border-hive-red/50 transition-colors",
      class_name,
    )}
  >
    {#if !should_hide(hide, "thumbnail")}
      <a
        href={post_url}
        target="_blank"
        rel="noopener noreferrer"
        class="w-20 h-20 rounded overflow-hidden shrink-0"
      >
        {#if result.post.thumbnail}
          <img
            src={result.post.thumbnail}
            alt={result.post.title}
            class="w-full h-full object-cover"
          />
        {:else}
          <div
            class="w-full h-full bg-hive-muted flex items-center justify-center text-hive-muted-foreground text-xs"
          >
            No img
          </div>
        {/if}
      </a>
    {/if}
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <a
          href={post_url}
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-hive-red transition-colors min-w-0"
        >
          <h3 class="font-semibold truncate">{result.post.title}</h3>
        </a>
        <span
          class="shrink-0 rounded bg-hive-red px-2 py-0.5 text-xs text-white"
        >
          Pinned
        </span>
      </div>
      {#if !should_hide(hide, "author")}
        <p class="text-sm text-hive-muted-foreground">
          @{author}{#if !should_hide(hide, "time")}{" "}&middot; {result.post.created}{/if}
        </p>
      {/if}
      <div
        class="flex items-center gap-4 mt-2 text-sm text-hive-muted-foreground"
      >
        {#if !should_hide(hide, "votes")}
          <span class="flex items-center gap-1">
            <span aria-hidden="true">^</span>
            {result.post.votes}
          </span>
        {/if}
        {#if !should_hide(hide, "comments")}
          <span class="flex items-center gap-1">
            <span aria-hidden="true">#</span>
            {result.post.comments}
          </span>
        {/if}
        {#if !should_hide(hide, "payout")}
          <span class="text-hive-success">{result.post.payout}</span>
        {/if}
      </div>
    </div>
  </div>
{/if}
