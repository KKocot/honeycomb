import { Show, type Component } from "solid-js";
import { useHivePost } from "./use-hive-post";
import { HiveAvatar } from "./avatar";
import { cn } from "./utils";

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

function should_hide(hide: PostHideOption[], option: PostHideOption): boolean {
  return hide.includes(option);
}

/**
 * Strip markdown syntax characters for plain text preview.
 */
function strip_markdown(text: string): string {
  return text.replace(/[#*`>\[\]!]/g, "").substring(0, 150);
}

/**
 * HivePostCard Component
 *
 * Display a Hive blockchain post with title, author, stats, and content preview.
 * Display-only - no vote/reblog actions. Fetches post data automatically.
 *
 * @example
 * ```tsx
 * <HivePostCard author="blocktrades" permlink="my-post" />
 * <HivePostCard author="barddev" permlink="update" variant="compact" />
 * <HivePostCard author="alice" permlink="intro" variant="grid" hide={["payout"]} />
 * ```
 */
export const HivePostCard: Component<HivePostCardProps> = (props) => {
  const { post, is_loading, error } = useHivePost(props.author, props.permlink);

  const variant = () => props.variant ?? "card";
  const hide = () => props.hide ?? [];
  const link_target = () =>
    props.linkTarget ?? "https://blog.openhive.network";

  const post_url = () => {
    const p = post();
    if (!p) return "#";
    return p.category
      ? `${link_target()}/${p.category}/@${props.author}/${props.permlink}`
      : `${link_target()}/@${props.author}/${props.permlink}`;
  };

  return (
    <Show
      when={!is_loading()}
      fallback={
        <div
          class={cn(
            "rounded-lg border border-hive-border bg-hive-card p-4 animate-pulse",
            props.class,
          )}
        >
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
      }
    >
      <Show
        when={!error() && post()}
        fallback={
          <div
            class={cn(
              "rounded-lg border border-hive-border bg-hive-card p-4",
              props.class,
            )}
          >
            <p class="text-sm text-hive-muted-foreground">
              {error()?.message || "Post not found"}
            </p>
          </div>
        }
      >
        {/* Compact variant */}
        <Show when={variant() === "compact"}>
          <div
            class={cn(
              "flex gap-4 p-4 rounded-lg border border-hive-border bg-hive-card hover:border-hive-red/50 transition-colors",
              props.class,
            )}
          >
            <Show when={!should_hide(hide(), "thumbnail")}>
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
              <a
                href={post_url()}
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-hive-red transition-colors"
              >
                <h3 class="font-semibold truncate">{post()?.title}</h3>
              </a>
              <Show when={!should_hide(hide(), "author")}>
                <p class="text-sm text-hive-muted-foreground">
                  @{props.author}
                  <Show when={!should_hide(hide(), "time")}>
                    {` · ${post()?.created}`}
                  </Show>
                </p>
              </Show>
              <div class="flex items-center gap-4 mt-2 text-sm text-hive-muted-foreground">
                <Show when={!should_hide(hide(), "votes")}>
                  <span class="flex items-center gap-1">
                    <span aria-hidden="true">^</span> {post()?.votes}
                  </span>
                </Show>
                <Show when={!should_hide(hide(), "comments")}>
                  <span class="flex items-center gap-1">
                    <span aria-hidden="true">#</span> {post()?.comments}
                  </span>
                </Show>
                <Show when={!should_hide(hide(), "payout")}>
                  <span class="text-hive-success">{post()?.payout}</span>
                </Show>
              </div>
            </div>
          </div>
        </Show>

        {/* Grid variant */}
        <Show when={variant() === "grid"}>
          <div
            class={cn(
              "rounded-lg border border-hive-border bg-hive-card overflow-hidden hover:border-hive-red/50 transition-colors",
              props.class,
            )}
          >
            <Show when={!should_hide(hide(), "thumbnail")}>
              <a
                href={post_url()}
                target="_blank"
                rel="noopener noreferrer"
                class="block aspect-video overflow-hidden"
              >
                <Show
                  when={post()?.thumbnail}
                  fallback={
                    <div class="w-full h-full bg-hive-muted flex items-center justify-center text-hive-muted-foreground text-sm">
                      No image
                    </div>
                  }
                >
                  <img
                    src={post()?.thumbnail ?? ""}
                    alt={post()?.title ?? ""}
                    class="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </Show>
              </a>
            </Show>
            <div class="p-4">
              <a
                href={post_url()}
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-hive-red transition-colors"
              >
                <h3 class="font-semibold line-clamp-2">{post()?.title}</h3>
              </a>
              <Show when={!should_hide(hide(), "author")}>
                <p class="mt-1 text-sm text-hive-muted-foreground">
                  @{props.author}
                  <Show when={!should_hide(hide(), "time")}>
                    {` · ${post()?.created}`}
                  </Show>
                </p>
              </Show>
              <div class="flex items-center justify-between mt-3 pt-3 border-t border-hive-border text-sm">
                <div class="flex items-center gap-3 text-hive-muted-foreground">
                  <Show when={!should_hide(hide(), "votes")}>
                    <span class="flex items-center gap-1">
                      <span aria-hidden="true">^</span> {post()?.votes}
                    </span>
                  </Show>
                  <Show when={!should_hide(hide(), "comments")}>
                    <span class="flex items-center gap-1">
                      <span aria-hidden="true">#</span> {post()?.comments}
                    </span>
                  </Show>
                </div>
                <Show when={!should_hide(hide(), "payout")}>
                  <span class="font-medium text-hive-success">
                    {post()?.payout}
                  </span>
                </Show>
              </div>
            </div>
          </div>
        </Show>

        {/* Default card variant */}
        <Show when={variant() === "card"}>
          <div
            class={cn(
              "rounded-lg border border-hive-border bg-hive-card overflow-hidden hover:border-hive-red/50 transition-colors",
              props.class,
            )}
          >
            <Show when={!should_hide(hide(), "thumbnail") && post()?.thumbnail}>
              <a
                href={post_url()}
                target="_blank"
                rel="noopener noreferrer"
                class="block aspect-video overflow-hidden"
              >
                <img
                  src={post()?.thumbnail ?? ""}
                  alt={post()?.title ?? ""}
                  class="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </a>
            </Show>
            <div class="p-4">
              <Show when={!should_hide(hide(), "author")}>
                <div class="flex items-center gap-3 mb-3">
                  <HiveAvatar username={props.author} size="sm" />
                  <div>
                    <p class="font-medium">@{props.author}</p>
                    <Show when={!should_hide(hide(), "time")}>
                      <p class="text-sm text-hive-muted-foreground">
                        {post()?.created}
                      </p>
                    </Show>
                  </div>
                </div>
              </Show>
              <a
                href={post_url()}
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-hive-red transition-colors"
              >
                <h2 class="text-lg font-bold">{post()?.title}</h2>
              </a>
              <p class="mt-2 text-hive-muted-foreground text-sm line-clamp-2">
                {strip_markdown(post()?.body ?? "")}...
              </p>
              <div class="flex items-center justify-between mt-4 pt-3 border-t border-hive-border">
                <div class="flex items-center gap-4 text-hive-muted-foreground">
                  <Show when={!should_hide(hide(), "votes")}>
                    <span class="flex items-center gap-1.5">
                      <span aria-hidden="true">^</span> {post()?.votes}
                    </span>
                  </Show>
                  <Show when={!should_hide(hide(), "comments")}>
                    <span class="flex items-center gap-1.5">
                      <span aria-hidden="true">#</span> {post()?.comments}
                    </span>
                  </Show>
                </div>
                <Show when={!should_hide(hide(), "payout")}>
                  <span class="text-sm font-medium text-hive-success">
                    {post()?.payout}
                  </span>
                </Show>
              </div>
            </div>
          </div>
        </Show>
      </Show>
    </Show>
  );
};
