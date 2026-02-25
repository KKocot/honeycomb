<script lang="ts" module>
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
    class?: string;
  }

</script>

<script lang="ts">
  import { useHivePost } from "./use-hive-post.svelte";
  import HiveAvatar from "./avatar.svelte";
  import { cn, should_hide, strip_markdown } from "./utils";

  let {
    author,
    permlink,
    variant = "card",
    hide = [],
    linkTarget = "https://blog.openhive.network",
    class: class_name,
  }: HivePostCardProps = $props();

  const { post, is_loading, error } = useHivePost(
    () => author,
    () => permlink,
  );

  const post_url = $derived(
    post?.category
      ? `${linkTarget}/${post.category}/@${author}/${permlink}`
      : `${linkTarget}/@${author}/${permlink}`,
  );
</script>

{#if is_loading}
  <div
    class={cn(
      "rounded-lg border border-hive-border bg-hive-card p-4 animate-pulse",
      class_name,
    )}
  >
    <div class="flex items-center gap-3 mb-3">
      <div class="h-10 w-10 rounded-full bg-hive-muted"></div>
      <div class="space-y-2">
        <div class="h-4 w-24 bg-hive-muted rounded"></div>
        <div class="h-3 w-16 bg-hive-muted rounded"></div>
      </div>
    </div>
    <div class="h-5 w-3/4 bg-hive-muted rounded mb-2"></div>
    <div class="h-3 w-full bg-hive-muted rounded mb-1"></div>
    <div class="h-3 w-2/3 bg-hive-muted rounded"></div>
  </div>
{:else if error || !post}
  <div
    class={cn(
      "rounded-lg border border-hive-border bg-hive-card p-4",
      class_name,
    )}
  >
    <p class="text-sm text-hive-muted-foreground">
      {error?.message || "Post not found"}
    </p>
  </div>
{:else if variant === "compact"}
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
        {#if post.thumbnail}
          <img
            src={post.thumbnail}
            alt={post.title}
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
      <a
        href={post_url}
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-hive-red transition-colors"
      >
        <h3 class="font-semibold truncate">{post.title}</h3>
      </a>
      {#if !should_hide(hide, "author")}
        <p class="text-sm text-hive-muted-foreground">
          @{author}{#if !should_hide(hide, "time")}{" "}&middot; {post.created}{/if}
        </p>
      {/if}
      <div
        class="flex items-center gap-4 mt-2 text-sm text-hive-muted-foreground"
      >
        {#if !should_hide(hide, "votes")}
          <span class="flex items-center gap-1">
            <span aria-hidden="true">^</span>
            {post.votes}
          </span>
        {/if}
        {#if !should_hide(hide, "comments")}
          <span class="flex items-center gap-1">
            <span aria-hidden="true">#</span>
            {post.comments}
          </span>
        {/if}
        {#if !should_hide(hide, "payout")}
          <span class="text-hive-success">{post.payout}</span>
        {/if}
      </div>
    </div>
  </div>
{:else if variant === "grid"}
  <div
    class={cn(
      "rounded-lg border border-hive-border bg-hive-card overflow-hidden hover:border-hive-red/50 transition-colors",
      class_name,
    )}
  >
    {#if !should_hide(hide, "thumbnail")}
      <a
        href={post_url}
        target="_blank"
        rel="noopener noreferrer"
        class="block aspect-video overflow-hidden"
      >
        {#if post.thumbnail}
          <img
            src={post.thumbnail}
            alt={post.title}
            class="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        {:else}
          <div
            class="w-full h-full bg-hive-muted flex items-center justify-center text-hive-muted-foreground text-sm"
          >
            No image
          </div>
        {/if}
      </a>
    {/if}
    <div class="p-4">
      <a
        href={post_url}
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-hive-red transition-colors"
      >
        <h3 class="font-semibold line-clamp-2">{post.title}</h3>
      </a>
      {#if !should_hide(hide, "author")}
        <p class="mt-1 text-sm text-hive-muted-foreground">
          @{author}{#if !should_hide(hide, "time")}{" "}&middot; {post.created}{/if}
        </p>
      {/if}
      <div
        class="flex items-center justify-between mt-3 pt-3 border-t border-hive-border text-sm"
      >
        <div class="flex items-center gap-3 text-hive-muted-foreground">
          {#if !should_hide(hide, "votes")}
            <span class="flex items-center gap-1">
              <span aria-hidden="true">^</span>
              {post.votes}
            </span>
          {/if}
          {#if !should_hide(hide, "comments")}
            <span class="flex items-center gap-1">
              <span aria-hidden="true">#</span>
              {post.comments}
            </span>
          {/if}
        </div>
        {#if !should_hide(hide, "payout")}
          <span class="font-medium text-hive-success">{post.payout}</span>
        {/if}
      </div>
    </div>
  </div>
{:else}
  <!-- Default card variant -->
  <div
    class={cn(
      "rounded-lg border border-hive-border bg-hive-card overflow-hidden hover:border-hive-red/50 transition-colors",
      class_name,
    )}
  >
    {#if !should_hide(hide, "thumbnail") && post.thumbnail}
      <a
        href={post_url}
        target="_blank"
        rel="noopener noreferrer"
        class="block aspect-video overflow-hidden"
      >
        <img
          src={post.thumbnail}
          alt={post.title}
          class="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </a>
    {/if}
    <div class="p-4">
      {#if !should_hide(hide, "author")}
        <div class="flex items-center gap-3 mb-3">
          <HiveAvatar username={author} size="sm" />
          <div>
            <p class="font-medium">@{author}</p>
            {#if !should_hide(hide, "time")}
              <p class="text-sm text-hive-muted-foreground">
                {post.created}
              </p>
            {/if}
          </div>
        </div>
      {/if}
      <a
        href={post_url}
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-hive-red transition-colors"
      >
        <h2 class="text-lg font-bold">{post.title}</h2>
      </a>
      <p class="mt-2 text-hive-muted-foreground text-sm line-clamp-2">
        {strip_markdown(post.body)}...
      </p>
      <div
        class="flex items-center justify-between mt-4 pt-3 border-t border-hive-border"
      >
        <div class="flex items-center gap-4 text-hive-muted-foreground">
          {#if !should_hide(hide, "votes")}
            <span class="flex items-center gap-1.5">
              <span aria-hidden="true">^</span>
              {post.votes}
            </span>
          {/if}
          {#if !should_hide(hide, "comments")}
            <span class="flex items-center gap-1.5">
              <span aria-hidden="true">#</span>
              {post.comments}
            </span>
          {/if}
        </div>
        {#if !should_hide(hide, "payout")}
          <span class="text-sm font-medium text-hive-success">
            {post.payout}
          </span>
        {/if}
      </div>
    </div>
  </div>
{/if}
