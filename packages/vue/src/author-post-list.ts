import { defineComponent, h, computed, type PropType } from "vue";
import {
  useHiveAuthorPostList,
  type UseHiveAuthorPostListOptions,
} from "./use-hive-author-post-list.js";
import { cn } from "./utils.js";
import type { PostVariant, PostHideOption } from "./post-card.js";
import type { AccountPost, RankedPost } from "@kkocot/honeycomb-core";
import {
  render_post_item,
  render_loading_skeleton,
} from "./post-list-helpers.js";

const DEFAULT_LINK_TARGET = "https://blog.openhive.network";

// Prevent javascript:/data: scheme XSS — only allow absolute http(s) URLs
// or root-relative paths. Falls back to default if invalid.
function safe_link_target(t: string): string {
  if (/^https?:\/\//i.test(t)) return t;
  if (t.startsWith("/") && !t.startsWith("//")) return t;
  return DEFAULT_LINK_TARGET;
}

// Synthetic stable post_id derived from author+permlink, used because
// AccountPost has no native post_id (RankedPost shim for render_post_item reuse).
function hash_id(author: string, permlink: string): number {
  let h_val = 0;
  const s = `${author}/${permlink}`;
  for (let i = 0; i < s.length; i++) {
    h_val = (h_val << 5) - h_val + s.charCodeAt(i);
    h_val |= 0; // 32-bit int
  }
  return Math.abs(h_val);
}

// Adapter: AccountPost -> RankedPost-shaped (for reuse with render_post_item).
function to_ranked(post: AccountPost): RankedPost {
  return {
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
  pinnedPosts?: AccountPost[];
  /** Card variant for post items */
  variant?: PostVariant;
  /** Elements to hide on post cards */
  hide?: PostHideOption[];
  /** Base URL for post links */
  linkTarget?: string;
  /** Override API endpoint */
  apiEndpoint?: string;
  /** Additional CSS classes */
  class?: string;
}

export const HiveAuthorPostList = defineComponent({
  name: "HiveAuthorPostList",
  props: {
    account: { type: String, required: true },
    tag: { type: String, default: undefined },
    limit: { type: Number, default: undefined },
    pinnedPosts: {
      type: Array as PropType<AccountPost[]>,
      default: undefined,
    },
    variant: { type: String as PropType<PostVariant>, default: "compact" },
    hide: { type: Array as PropType<PostHideOption[]>, default: () => [] },
    linkTarget: { type: String, default: DEFAULT_LINK_TARGET },
    apiEndpoint: { type: String, default: undefined },
    class: { type: String, default: undefined },
  },
  setup(props) {
    // Sanitize linkTarget to prevent javascript: scheme XSS in <a href>.
    const link_target = computed(() => safe_link_target(props.linkTarget));

    // Pass getters (not snapshot values) so the composable reacts to
    // prop changes — destructuring props would lose reactivity.
    const hook_options: UseHiveAuthorPostListOptions = {
      account: () => props.account,
      tag: () => props.tag,
      limit: () => props.limit,
      apiEndpoint: () => props.apiEndpoint,
    };

    const {
      posts,
      isLoading,
      error,
      hasNext,
      hasPrev,
      nextPage,
      prevPage,
      page,
    } = useHiveAuthorPostList(hook_options);

    return () => {
      const children = [];
      const current_variant = props.variant;
      const current_hide = props.hide;
      const current_link_target = link_target.value;
      const has_pinned =
        props.pinnedPosts !== undefined && props.pinnedPosts.length > 0;

      // Pinned posts (rendered directly from full AccountPost objects, no refetch).
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
              {
                class: cn(
                  "flex flex-col",
                  current_variant === "compact" ? "gap-2" : "gap-4",
                ),
              },
              props.pinnedPosts!.map((pin) => {
                const vnode = render_post_item(
                  to_ranked(pin),
                  current_variant,
                  current_hide,
                  current_link_target,
                  true,
                );
                // Stable key from author/permlink — render_post_item returns
                // a plain VNode without a key, so we set it here to give Vue
                // proper diff identity across re-renders / pagination.
                vnode.key = `pinned:${pin.author}/${pin.permlink}`;
                return vnode;
              }),
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
        const post_items = posts.value.map((post) => {
          const vnode = render_post_item(
            to_ranked(post),
            current_variant,
            current_hide,
            current_link_target,
            false,
          );
          // Stable key from author/permlink — Vue needs this to diff items
          // correctly across pagination, otherwise thumbnails / DOM nodes
          // can stick to stale data.
          vnode.key = `${post.author}/${post.permlink}`;
          return vnode;
        });

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
