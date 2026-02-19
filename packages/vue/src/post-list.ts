import { defineComponent, h, type PropType } from "vue";
import {
  useHivePostList,
  type UseHivePostListOptions,
} from "./use-hive-post-list.js";
import { cn } from "./utils.js";
import type { PostVariant, PostHideOption } from "./post-card.js";
import type { SortType } from "@kkocot/honeycomb-core";
import {
  SORT_LABELS,
  SORT_OPTIONS,
  render_post_item,
  render_loading_skeleton,
  PinnedPostItem,
} from "./post-list-helpers.js";

export interface HivePostListProps {
  sort?: SortType;
  tag?: string;
  limit?: number;
  pinnedPosts?: Array<{ author: string; permlink: string }>;
  showSortControls?: boolean;
  variant?: PostVariant;
  hide?: PostHideOption[];
  linkTarget?: string;
  class?: string;
}

export const HivePostList = defineComponent({
  name: "HivePostList",
  props: {
    sort: { type: String as PropType<SortType>, default: undefined },
    tag: { type: String, default: undefined },
    limit: { type: Number, default: undefined },
    pinnedPosts: {
      type: Array as PropType<Array<{ author: string; permlink: string }>>,
      default: undefined,
    },
    showSortControls: { type: Boolean, default: false },
    variant: { type: String as PropType<PostVariant>, default: "compact" },
    hide: { type: Array as PropType<PostHideOption[]>, default: () => [] },
    linkTarget: { type: String, default: "https://blog.openhive.network" },
    class: { type: String, default: undefined },
  },
  setup(props) {
    const hook_options: UseHivePostListOptions = {
      sort: props.sort,
      tag: props.tag,
      limit: props.limit,
    };

    const {
      posts,
      isLoading,
      error,
      sort,
      setSort,
      hasNext,
      hasPrev,
      nextPage,
      prevPage,
      page,
    } = useHivePostList(hook_options);

    return () => {
      const children = [];
      const current_variant = props.variant;
      const current_hide = props.hide;
      const current_link_target = props.linkTarget;
      const has_pinned =
        props.pinnedPosts !== undefined && props.pinnedPosts.length > 0;

      // Sort controls
      if (props.showSortControls) {
        children.push(
          h(
            "div",
            { class: "flex flex-wrap gap-2 mb-4" },
            SORT_OPTIONS.map((option) =>
              h(
                "button",
                {
                  type: "button",
                  onClick: () => setSort(option),
                  class: cn(
                    "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                    option === sort.value
                      ? "bg-foreground text-background"
                      : "bg-hive-muted text-hive-muted-foreground hover:text-hive-foreground",
                  ),
                },
                SORT_LABELS[option],
              ),
            ),
          ),
        );
      }

      // Pinned posts
      if (has_pinned) {
        children.push(
          h("div", { class: "mb-4 pb-4 border-b border-hive-border" }, [
            h(
              "p",
              {
                class:
                  "text-xs font-medium text-hive-muted-foreground uppercase tracking-wide mb-2",
              },
              "Pinned",
            ),
            h(
              "div",
              { class: "flex flex-col gap-2" },
              props.pinnedPosts!.map((pin) =>
                h(PinnedPostItem, {
                  key: `${pin.author}/${pin.permlink}`,
                  author: pin.author,
                  permlink: pin.permlink,
                  hide: current_hide,
                  linkTarget: current_link_target,
                }),
              ),
            ),
          ]),
        );
      }

      // Loading
      if (isLoading.value) {
        children.push(render_loading_skeleton(current_variant, 4));
      }

      // Error
      if (!isLoading.value && error.value) {
        children.push(
          h("div", { class: "rounded-lg border border-hive-border p-4" }, [
            h(
              "p",
              { class: "text-sm text-hive-muted-foreground" },
              error.value.message,
            ),
          ]),
        );
      }

      // Empty
      if (!isLoading.value && !error.value && posts.value.length === 0) {
        children.push(
          h(
            "p",
            {
              class:
                "text-sm text-hive-muted-foreground py-8 text-center",
            },
            "No posts found",
          ),
        );
      }

      // Posts
      if (!isLoading.value && !error.value && posts.value.length > 0) {
        const post_items = posts.value.map((post) =>
          render_post_item(
            post,
            current_variant,
            current_hide,
            current_link_target,
            false,
          ),
        );

        if (current_variant === "grid") {
          children.push(
            h(
              "div",
              {
                class:
                  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
              },
              post_items,
            ),
          );
        } else {
          children.push(
            h(
              "div",
              {
                class: cn(
                  "flex flex-col",
                  current_variant === "compact" ? "gap-2" : "gap-4",
                ),
              },
              post_items,
            ),
          );
        }

        // Pagination
        children.push(
          h("div", { class: "flex items-center justify-between mt-6" }, [
            h(
              "button",
              {
                type: "button",
                onClick: prevPage,
                disabled: !hasPrev.value,
                class: cn(
                  "rounded-lg border border-hive-border px-4 py-2 text-sm font-medium hover:bg-hive-muted transition-colors",
                  !hasPrev.value &&
                    "opacity-50 cursor-not-allowed hover:bg-transparent",
                ),
              },
              "Prev Page",
            ),
            h(
              "span",
              { class: "text-sm text-hive-muted-foreground" },
              `Page ${page.value}`,
            ),
            h(
              "button",
              {
                type: "button",
                onClick: nextPage,
                disabled: !hasNext.value,
                class: cn(
                  "rounded-lg border border-hive-border px-4 py-2 text-sm font-medium hover:bg-hive-muted transition-colors",
                  !hasNext.value &&
                    "opacity-50 cursor-not-allowed hover:bg-transparent",
                ),
              },
              "Next Page",
            ),
          ]),
        );
      }

      return h("div", { class: cn("w-full", props.class) }, children);
    };
  },
});
