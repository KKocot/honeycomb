import { Show, For, Switch, Match, type Component } from "solid-js";
import {
  useHivePostList,
  type UseHivePostListOptions,
} from "./use-hive-post-list";
import { useHivePost } from "./use-hive-post";
import { HiveAvatar } from "./avatar";
import { cn } from "./utils";
import type { PostVariant, PostHideOption } from "./post-card";
import {
  type SortType,
  type RankedPost,
  format_payout,
  format_time_ago,
  extract_thumbnail,
} from "@kkocot/honeycomb-core";

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
  sort?: SortType;
  tag?: string;
  limit?: number;
  pinned_posts?: Array<{ author: string; permlink: string }>;
  show_sort_controls?: boolean;
  variant?: PostVariant;
  hide?: PostHideOption[];
  linkTarget?: string;
  class?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function should_hide(hide: PostHideOption[], option: PostHideOption): boolean {
  return hide.includes(option);
}

function strip_markdown(text: string): string {
  return text.replace(/[#*`>\[\]!]/g, "").substring(0, 150);
}

function get_thumbnail(post: RankedPost): string | null {
  return extract_thumbnail(post.json_metadata, post.body) ?? null;
}

function get_post_url(
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
// Sort Controls
// ---------------------------------------------------------------------------

const SortControls: Component<{
  sort: SortType;
  on_change: (s: SortType) => void;
}> = (props) => {
  return (
    <div class="flex flex-wrap gap-2 mb-4">
      <For each={SORT_OPTIONS}>
        {(option) => (
          <button
            type="button"
            onClick={() => props.on_change(option)}
            class={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              option === props.sort
                ? "bg-foreground text-background"
                : "bg-hive-muted text-hive-muted-foreground hover:text-hive-foreground",
            )}
          >
            {SORT_LABELS[option]}
          </button>
        )}
      </For>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Inline Post Renderers
// ---------------------------------------------------------------------------

interface InlinePostProps {
  post: RankedPost;
  hide: PostHideOption[];
  link_target: string;
  is_pinned?: boolean;
}

const CompactPost: Component<InlinePostProps> = (props) => {
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

const CardPost: Component<InlinePostProps> = (props) => {
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

const GridPost: Component<InlinePostProps> = (props) => {
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

function PostItem(props: InlinePostProps & { variant: PostVariant }) {
  return (
    <Switch>
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
// Skeletons
// ---------------------------------------------------------------------------

function CompactSkeleton() {
  return (
    <div class="flex gap-4 p-4 rounded-lg border border-hive-border bg-hive-card animate-pulse">
      <div class="w-20 h-20 rounded bg-hive-muted shrink-0" />
      <div class="flex-1 space-y-2">
        <div class="h-5 w-3/4 bg-hive-muted rounded" />
        <div class="h-3 w-1/3 bg-hive-muted rounded" />
        <div class="h-3 w-1/2 bg-hive-muted rounded" />
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div class="rounded-lg border border-hive-border bg-hive-card p-4 animate-pulse">
      <div class="flex items-center gap-3 mb-3">
        <div class="h-10 w-10 rounded-full bg-hive-muted" />
        <div class="space-y-2">
          <div class="h-4 w-24 bg-hive-muted rounded" />
          <div class="h-3 w-16 bg-hive-muted rounded" />
        </div>
      </div>
      <div class="h-5 w-3/4 bg-hive-muted rounded mb-2" />
      <div class="h-3 w-full bg-hive-muted rounded mb-1" />
      <div class="h-3 w-2/3 bg-hive-muted rounded" />
    </div>
  );
}

function GridSkeleton() {
  return (
    <div class="rounded-lg border border-hive-border bg-hive-card overflow-hidden animate-pulse">
      <div class="aspect-video bg-hive-muted" />
      <div class="p-4 space-y-2">
        <div class="h-5 w-3/4 bg-hive-muted rounded" />
        <div class="h-3 w-1/3 bg-hive-muted rounded" />
      </div>
    </div>
  );
}

function LoadingSkeleton(props: { variant: PostVariant; count: number }) {
  const items = () =>
    Array.from({ length: props.count }, (_, i) => i);

  return (
    <Switch>
      <Match when={props.variant === "grid"}>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <For each={items()}>{() => <GridSkeleton />}</For>
        </div>
      </Match>
      <Match when={props.variant === "compact"}>
        <div class="flex flex-col gap-2">
          <For each={items()}>{() => <CompactSkeleton />}</For>
        </div>
      </Match>
      <Match when={props.variant === "card"}>
        <div class="flex flex-col gap-4">
          <For each={items()}>{() => <CardSkeleton />}</For>
        </div>
      </Match>
    </Switch>
  );
}

// ---------------------------------------------------------------------------
// Pinned Posts
// ---------------------------------------------------------------------------

const PinnedPostItem: Component<{
  author: string;
  permlink: string;
  hide: PostHideOption[];
  link_target: string;
}> = (props) => {
  const { post, is_loading, error } = useHivePost(props.author, props.permlink);

  const post_url = () => {
    const p = post();
    if (!p) return "#";
    return get_post_url(props.author, props.permlink, p.category, props.link_target);
  };

  return (
    <Show when={!is_loading()} fallback={<CompactSkeleton />}>
      <Show
        when={!error() && post()}
        fallback={
          <div class="rounded-lg border border-hive-border bg-hive-card p-4">
            <p class="text-sm text-hive-muted-foreground">
              {error()?.message ?? `Could not load @${props.author}/${props.permlink}`}
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

// ---------------------------------------------------------------------------
// Pagination Controls
// ---------------------------------------------------------------------------

const PaginationControls: Component<{
  page: number;
  has_prev: boolean;
  has_next: boolean;
  on_prev: () => void;
  on_next: () => void;
}> = (props) => {
  return (
    <div class="flex items-center justify-between mt-6">
      <button
        type="button"
        onClick={props.on_prev}
        disabled={!props.has_prev}
        class={cn(
          "rounded-lg border border-hive-border px-4 py-2 text-sm font-medium hover:bg-hive-muted transition-colors",
          !props.has_prev &&
            "opacity-50 cursor-not-allowed hover:bg-transparent",
        )}
      >
        Prev Page
      </button>
      <span class="text-sm text-hive-muted-foreground">
        Page {props.page}
      </span>
      <button
        type="button"
        onClick={props.on_next}
        disabled={!props.has_next}
        class={cn(
          "rounded-lg border border-hive-border px-4 py-2 text-sm font-medium hover:bg-hive-muted transition-colors",
          !props.has_next &&
            "opacity-50 cursor-not-allowed hover:bg-transparent",
        )}
      >
        Next Page
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------------
// HivePostList
// ---------------------------------------------------------------------------

export const HivePostList: Component<HivePostListProps> = (props) => {
  const variant = () => props.variant ?? "compact";
  const hide = () => props.hide ?? [];
  const link_target = () =>
    props.linkTarget ?? "https://blog.openhive.network";

  const hook_options: UseHivePostListOptions = {
    sort: props.sort,
    tag: props.tag,
    limit: props.limit,
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

  const has_pinned = () =>
    props.pinned_posts !== undefined && props.pinned_posts.length > 0;

  return (
    <div class={cn("w-full", props.class)}>
      <Show when={props.show_sort_controls}>
        <SortControls sort={sort()} on_change={set_sort} />
      </Show>

      <Show when={has_pinned()}>
        <div class="mb-4 pb-4 border-b border-hive-border">
          <p class="text-xs font-medium text-hive-muted-foreground uppercase tracking-wide mb-2">
            Pinned
          </p>
          <div class="flex flex-col gap-2">
            <For each={props.pinned_posts ?? []}>
              {(pin) => (
                <PinnedPostItem
                  author={pin.author}
                  permlink={pin.permlink}
                  hide={hide()}
                  link_target={link_target()}
                />
              )}
            </For>
          </div>
        </div>
      </Show>

      <Show when={is_loading()}>
        <LoadingSkeleton variant={variant()} count={4} />
      </Show>

      <Show when={!is_loading() && error()}>
        <div class="rounded-lg border border-hive-border p-4">
          <p class="text-sm text-hive-muted-foreground">
            {error()?.message}
          </p>
        </div>
      </Show>

      <Show when={!is_loading() && !error() && posts().length === 0}>
        <p class="text-sm text-hive-muted-foreground py-8 text-center">
          No posts found
        </p>
      </Show>

      <Show when={!is_loading() && !error() && posts().length > 0}>
        <Show
          when={variant() !== "grid"}
          fallback={
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <For each={posts()}>
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
            <For each={posts()}>
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
          page={page()}
          has_prev={has_prev()}
          has_next={has_next()}
          on_prev={prev_page}
          on_next={next_page}
        />
      </Show>
    </div>
  );
};
