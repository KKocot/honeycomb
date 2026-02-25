<script lang="ts" module>
  import type { PostVariant, PostHideOption } from "./post-card.svelte";
  import type { RankedPost } from "@kkocot/honeycomb-core";

  export interface PostItemProps {
    post: RankedPost;
    variant: PostVariant;
    hide: PostHideOption[];
    link_target: string;
    is_pinned?: boolean;
  }

  export function get_thumbnail(post: RankedPost): string | null {
    return extract_thumbnail(post.json_metadata, post.body) ?? null;
  }

  export { should_hide, get_post_url } from "./utils";

  import {
    format_payout,
    format_time_ago,
    extract_thumbnail,
  } from "@kkocot/honeycomb-core";
</script>

<script lang="ts">
  import HiveAvatar from "./avatar.svelte";
  import { cn, should_hide, strip_markdown, get_post_url } from "./utils";

  let {
    post,
    variant,
    hide,
    link_target,
    is_pinned = false,
  }: PostItemProps = $props();

  const thumbnail = $derived(get_thumbnail(post));
  const post_url = $derived(
    get_post_url(post.author, post.permlink, post.category, link_target),
  );
</script>

{#if variant === "compact"}
  <div
    class="flex gap-4 p-4 rounded-lg border border-hive-border bg-hive-card hover:border-hive-red/50 transition-colors"
  >
    {#if !should_hide(hide, "thumbnail")}
      <a
        href={post_url}
        target="_blank"
        rel="noopener noreferrer"
        class="w-20 h-20 rounded overflow-hidden shrink-0"
      >
        {#if thumbnail}
          <img
            src={thumbnail}
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
      <div class="flex items-center gap-2">
        <a
          href={post_url}
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-hive-red transition-colors min-w-0"
        >
          <h3 class="font-semibold truncate">{post.title}</h3>
        </a>
        {#if is_pinned}
          <span
            class="shrink-0 rounded bg-hive-red px-2 py-0.5 text-xs text-white"
          >
            Pinned
          </span>
        {/if}
      </div>
      {#if !should_hide(hide, "author")}
        <p class="text-sm text-hive-muted-foreground">
          @{post.author}{#if !should_hide(hide, "time")}{" "}&middot; {format_time_ago(post.created)}{/if}
        </p>
      {/if}
      <div
        class="flex items-center gap-4 mt-2 text-sm text-hive-muted-foreground"
      >
        {#if !should_hide(hide, "votes")}
          <span class="flex items-center gap-1">
            <span aria-hidden="true">^</span>
            {post.net_votes}
          </span>
        {/if}
        {#if !should_hide(hide, "comments")}
          <span class="flex items-center gap-1">
            <span aria-hidden="true">#</span>
            {post.children}
          </span>
        {/if}
        {#if !should_hide(hide, "payout")}
          <span class="text-hive-success">
            {format_payout(post.pending_payout_value)}
          </span>
        {/if}
      </div>
    </div>
  </div>
{:else if variant === "grid"}
  <div
    class="rounded-lg border border-hive-border bg-hive-card overflow-hidden hover:border-hive-red/50 transition-colors"
  >
    {#if !should_hide(hide, "thumbnail")}
      <a
        href={post_url}
        target="_blank"
        rel="noopener noreferrer"
        class="block aspect-video overflow-hidden"
      >
        {#if thumbnail}
          <img
            src={thumbnail}
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
      <div class="flex items-center gap-2">
        <a
          href={post_url}
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-hive-red transition-colors min-w-0"
        >
          <h3 class="font-semibold line-clamp-2">{post.title}</h3>
        </a>
        {#if is_pinned}
          <span
            class="shrink-0 rounded bg-hive-red px-2 py-0.5 text-xs text-white"
          >
            Pinned
          </span>
        {/if}
      </div>
      {#if !should_hide(hide, "author")}
        <p class="mt-1 text-sm text-hive-muted-foreground">
          @{post.author}{#if !should_hide(hide, "time")}{" "}&middot; {format_time_ago(post.created)}{/if}
        </p>
      {/if}
      <div
        class="flex items-center justify-between mt-3 pt-3 border-t border-hive-border text-sm"
      >
        <div class="flex items-center gap-3 text-hive-muted-foreground">
          {#if !should_hide(hide, "votes")}
            <span class="flex items-center gap-1">
              <span aria-hidden="true">^</span>
              {post.net_votes}
            </span>
          {/if}
          {#if !should_hide(hide, "comments")}
            <span class="flex items-center gap-1">
              <span aria-hidden="true">#</span>
              {post.children}
            </span>
          {/if}
        </div>
        {#if !should_hide(hide, "payout")}
          <span class="font-medium text-hive-success">
            {format_payout(post.pending_payout_value)}
          </span>
        {/if}
      </div>
    </div>
  </div>
{:else}
  <!-- Card variant -->
  <div
    class="rounded-lg border border-hive-border bg-hive-card overflow-hidden hover:border-hive-red/50 transition-colors"
  >
    {#if !should_hide(hide, "thumbnail") && thumbnail}
      <a
        href={post_url}
        target="_blank"
        rel="noopener noreferrer"
        class="block aspect-video overflow-hidden"
      >
        <img
          src={thumbnail}
          alt={post.title}
          class="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </a>
    {/if}
    <div class="p-4">
      {#if !should_hide(hide, "author")}
        <div class="flex items-center gap-3 mb-3">
          <HiveAvatar username={post.author} size="sm" />
          <div>
            <p class="font-medium">@{post.author}</p>
            {#if !should_hide(hide, "time")}
              <p class="text-sm text-hive-muted-foreground">
                {format_time_ago(post.created)}
              </p>
            {/if}
          </div>
          {#if is_pinned}
            <span
              class="ml-auto shrink-0 rounded bg-hive-red px-2 py-0.5 text-xs text-white"
            >
              Pinned
            </span>
          {/if}
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
              {post.net_votes}
            </span>
          {/if}
          {#if !should_hide(hide, "comments")}
            <span class="flex items-center gap-1.5">
              <span aria-hidden="true">#</span>
              {post.children}
            </span>
          {/if}
        </div>
        {#if !should_hide(hide, "payout")}
          <span class="text-sm font-medium text-hive-success">
            {format_payout(post.pending_payout_value)}
          </span>
        {/if}
      </div>
    </div>
  </div>
{/if}
