import { Show, Switch, Match, type Component } from "solid-js";
import { useHivePost } from "./use-hive-post";
import { HiveAvatar } from "./avatar";
import { should_hide, strip_markdown } from "./utils";
import type { PostVariant, PostHideOption } from "./post-card";
import {
  type RankedPost,
  format_payout,
  format_time_ago,
  extract_thumbnail,
} from "@kkocot/honeycomb-core";
import { CompactSkeleton } from "./post-list-skeletons";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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
// Shared props for inline post renderers
// ---------------------------------------------------------------------------

export interface InlinePostProps {
  post: RankedPost;
  hide: PostHideOption[];
  link_target: string;
  is_pinned?: boolean;
}

// ---------------------------------------------------------------------------
// CompactPost
// ---------------------------------------------------------------------------

export const CompactPost: Component<InlinePostProps> = (props) => {
  const thumbnail = () => get_thumbnail(props.post);
  const post_url = () =>
    get_post_url(
      props.post.author,
      props.post.permlink,
      props.post.category,
      props.link_target,
    );

  return (
    <div class="flex gap-4 p-4 rounded-lg border border-hive-border bg-hive-card hover:border-hive-red/50 transition-colors">
      <Show when={!should_hide(props.hide, "thumbnail")}>
        <a
          href={post_url()}
          target="_blank"
          rel="noopener noreferrer"
          class="w-20 h-20 rounded overflow-hidden shrink-0"
        >
          <Show
            when={thumbnail()}
            fallback={
              <div class="w-full h-full bg-hive-muted flex items-center justify-center text-hive-muted-foreground text-xs">
                No img
              </div>
            }
          >
            <img
              src={thumbnail() ?? ""}
              alt={props.post.title}
              class="w-full h-full object-cover"
            />
          </Show>
        </a>
      </Show>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <a
            href={post_url()}
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-hive-red transition-colors min-w-0"
          >
            <h3 class="font-semibold truncate">{props.post.title}</h3>
          </a>
          <Show when={props.is_pinned}>
            <span class="shrink-0 rounded bg-hive-red px-2 py-0.5 text-xs text-white">
              Pinned
            </span>
          </Show>
        </div>
        <Show when={!should_hide(props.hide, "author")}>
          <p class="text-sm text-hive-muted-foreground">
            @{props.post.author}
            <Show when={!should_hide(props.hide, "time")}>
              {` \u00B7 ${format_time_ago(props.post.created)}`}
            </Show>
          </p>
        </Show>
        <div class="flex items-center gap-4 mt-2 text-sm text-hive-muted-foreground">
          <Show when={!should_hide(props.hide, "votes")}>
            <span class="flex items-center gap-1">
              <span aria-hidden="true">^</span> {props.post.net_votes}
            </span>
          </Show>
          <Show when={!should_hide(props.hide, "comments")}>
            <span class="flex items-center gap-1">
              <span aria-hidden="true">#</span> {props.post.children}
            </span>
          </Show>
          <Show when={!should_hide(props.hide, "payout")}>
            <span class="text-hive-success">
              {format_payout(props.post.pending_payout_value)}
            </span>
          </Show>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// CardPost
// ---------------------------------------------------------------------------

export const CardPost: Component<InlinePostProps> = (props) => {
  const thumbnail = () => get_thumbnail(props.post);
  const post_url = () =>
    get_post_url(
      props.post.author,
      props.post.permlink,
      props.post.category,
      props.link_target,
    );

  return (
    <div class="rounded-lg border border-hive-border bg-hive-card overflow-hidden hover:border-hive-red/50 transition-colors">
      <Show when={!should_hide(props.hide, "thumbnail") && thumbnail()}>
        <a
          href={post_url()}
          target="_blank"
          rel="noopener noreferrer"
          class="block aspect-video overflow-hidden"
        >
          <img
            src={thumbnail() ?? ""}
            alt={props.post.title}
            class="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        </a>
      </Show>
      <div class="p-4">
        <Show when={!should_hide(props.hide, "author")}>
          <div class="flex items-center gap-3 mb-3">
            <HiveAvatar username={props.post.author} size="sm" />
            <div>
              <p class="font-medium">@{props.post.author}</p>
              <Show when={!should_hide(props.hide, "time")}>
                <p class="text-sm text-hive-muted-foreground">
                  {format_time_ago(props.post.created)}
                </p>
              </Show>
            </div>
            <Show when={props.is_pinned}>
              <span class="ml-auto shrink-0 rounded bg-hive-red px-2 py-0.5 text-xs text-white">
                Pinned
              </span>
            </Show>
          </div>
        </Show>
        <a
          href={post_url()}
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-hive-red transition-colors"
        >
          <h2 class="text-lg font-bold">{props.post.title}</h2>
        </a>
        <p class="mt-2 text-hive-muted-foreground text-sm line-clamp-2">
          {strip_markdown(props.post.body)}...
        </p>
        <div class="flex items-center justify-between mt-4 pt-3 border-t border-hive-border">
          <div class="flex items-center gap-4 text-hive-muted-foreground">
            <Show when={!should_hide(props.hide, "votes")}>
              <span class="flex items-center gap-1.5">
                <span aria-hidden="true">^</span> {props.post.net_votes}
              </span>
            </Show>
            <Show when={!should_hide(props.hide, "comments")}>
              <span class="flex items-center gap-1.5">
                <span aria-hidden="true">#</span> {props.post.children}
              </span>
            </Show>
          </div>
          <Show when={!should_hide(props.hide, "payout")}>
            <span class="text-sm font-medium text-hive-success">
              {format_payout(props.post.pending_payout_value)}
            </span>
          </Show>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// GridPost
// ---------------------------------------------------------------------------

export const GridPost: Component<InlinePostProps> = (props) => {
  const thumbnail = () => get_thumbnail(props.post);
  const post_url = () =>
    get_post_url(
      props.post.author,
      props.post.permlink,
      props.post.category,
      props.link_target,
    );

  return (
    <div class="rounded-lg border border-hive-border bg-hive-card overflow-hidden hover:border-hive-red/50 transition-colors">
      <Show when={!should_hide(props.hide, "thumbnail")}>
        <a
          href={post_url()}
          target="_blank"
          rel="noopener noreferrer"
          class="block aspect-video overflow-hidden"
        >
          <Show
            when={thumbnail()}
            fallback={
              <div class="w-full h-full bg-hive-muted flex items-center justify-center text-hive-muted-foreground text-sm">
                No image
              </div>
            }
          >
            <img
              src={thumbnail() ?? ""}
              alt={props.post.title}
              class="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </Show>
        </a>
      </Show>
      <div class="p-4">
        <div class="flex items-center gap-2">
          <a
            href={post_url()}
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-hive-red transition-colors min-w-0"
          >
            <h3 class="font-semibold line-clamp-2">{props.post.title}</h3>
          </a>
          <Show when={props.is_pinned}>
            <span class="shrink-0 rounded bg-hive-red px-2 py-0.5 text-xs text-white">
              Pinned
            </span>
          </Show>
        </div>
        <Show when={!should_hide(props.hide, "author")}>
          <p class="mt-1 text-sm text-hive-muted-foreground">
            @{props.post.author}
            <Show when={!should_hide(props.hide, "time")}>
              {` \u00B7 ${format_time_ago(props.post.created)}`}
            </Show>
          </p>
        </Show>
        <div class="flex items-center justify-between mt-3 pt-3 border-t border-hive-border text-sm">
          <div class="flex items-center gap-3 text-hive-muted-foreground">
            <Show when={!should_hide(props.hide, "votes")}>
              <span class="flex items-center gap-1">
                <span aria-hidden="true">^</span> {props.post.net_votes}
              </span>
            </Show>
            <Show when={!should_hide(props.hide, "comments")}>
              <span class="flex items-center gap-1">
                <span aria-hidden="true">#</span> {props.post.children}
              </span>
            </Show>
          </div>
          <Show when={!should_hide(props.hide, "payout")}>
            <span class="font-medium text-hive-success">
              {format_payout(props.post.pending_payout_value)}
            </span>
          </Show>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// PostItem (variant dispatcher)
// ---------------------------------------------------------------------------

export function PostItem(
  props: InlinePostProps & { variant: PostVariant },
) {
  return (
    <Switch fallback={null}>
      <Match when={props.variant === "compact"}>
        <CompactPost
          post={props.post}
          hide={props.hide}
          link_target={props.link_target}
          is_pinned={props.is_pinned}
        />
      </Match>
      <Match when={props.variant === "grid"}>
        <GridPost
          post={props.post}
          hide={props.hide}
          link_target={props.link_target}
          is_pinned={props.is_pinned}
        />
      </Match>
      <Match when={props.variant === "card"}>
        <CardPost
          post={props.post}
          hide={props.hide}
          link_target={props.link_target}
          is_pinned={props.is_pinned}
        />
      </Match>
    </Switch>
  );
}

// ---------------------------------------------------------------------------
// PinnedPostItem
// ---------------------------------------------------------------------------

export const PinnedPostItem: Component<{
  author: string;
  permlink: string;
  hide: PostHideOption[];
  link_target: string;
}> = (props) => {
  const { post, is_loading, error } = useHivePost(
    props.author,
    props.permlink,
  );

  const post_url = () => {
    const p = post();
    if (!p) return "#";
    return get_post_url(
      props.author,
      props.permlink,
      p.category,
      props.link_target,
    );
  };

  return (
    <Show when={!is_loading()} fallback={<CompactSkeleton />}>
      <Show
        when={!error() && post()}
        fallback={
          <div class="rounded-lg border border-hive-border bg-hive-card p-4">
            <p class="text-sm text-hive-muted-foreground">
              {error()?.message ??
                `Could not load @${props.author}/${props.permlink}`}
            </p>
          </div>
        }
      >
        <div class="flex gap-4 p-4 rounded-lg border border-hive-border bg-hive-card hover:border-hive-red/50 transition-colors">
          <Show when={!should_hide(props.hide, "thumbnail")}>
            <a
              href={post_url()}
              target="_blank"
              rel="noopener noreferrer"
              class="w-20 h-20 rounded overflow-hidden shrink-0"
            >
              <Show
                when={post()?.thumbnail}
                fallback={
                  <div class="w-full h-full bg-hive-muted flex items-center justify-center text-hive-muted-foreground text-xs">
                    No img
                  </div>
                }
              >
                <img
                  src={post()?.thumbnail ?? ""}
                  alt={post()?.title ?? ""}
                  class="w-full h-full object-cover"
                />
              </Show>
            </a>
          </Show>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <a
                href={post_url()}
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-hive-red transition-colors min-w-0"
              >
                <h3 class="font-semibold truncate">{post()?.title}</h3>
              </a>
              <span class="shrink-0 rounded bg-hive-red px-2 py-0.5 text-xs text-white">
                Pinned
              </span>
            </div>
            <Show when={!should_hide(props.hide, "author")}>
              <p class="text-sm text-hive-muted-foreground">
                @{props.author}
                <Show when={!should_hide(props.hide, "time")}>
                  {` \u00B7 ${post()?.created}`}
                </Show>
              </p>
            </Show>
            <div class="flex items-center gap-4 mt-2 text-sm text-hive-muted-foreground">
              <Show when={!should_hide(props.hide, "votes")}>
                <span class="flex items-center gap-1">
                  <span aria-hidden="true">^</span> {post()?.votes}
                </span>
              </Show>
              <Show when={!should_hide(props.hide, "comments")}>
                <span class="flex items-center gap-1">
                  <span aria-hidden="true">#</span> {post()?.comments}
                </span>
              </Show>
              <Show when={!should_hide(props.hide, "payout")}>
                <span class="text-hive-success">{post()?.payout}</span>
              </Show>
            </div>
          </div>
        </div>
      </Show>
    </Show>
  );
};
