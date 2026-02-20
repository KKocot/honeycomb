import { Show, For, type Component } from "solid-js";
import {
  useHivePostList,
  type UseHivePostListOptions,
} from "./use-hive-post-list";
import { cn } from "./utils";
import type { PostVariant, PostHideOption } from "./post-card";
import type { SortType } from "@kkocot/honeycomb-core";
import { PostItem, PinnedPostItem } from "./post-list-items";
import { LoadingSkeleton } from "./post-list-skeletons";
import { SortControls, PaginationControls } from "./post-list-controls";

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

export const HivePostList: Component<HivePostListProps> = (props) => {
  const variant = () => props.variant ?? "compact";
  const hide = () => props.hide ?? [];
  const link_target = () =>
    props.linkTarget ?? "https://blog.openhive.network";

  const hook_options: UseHivePostListOptions = {
    get sort() {
      return props.sort;
    },
    get tag() {
      return props.tag;
    },
    get limit() {
      return props.limit;
    },
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
