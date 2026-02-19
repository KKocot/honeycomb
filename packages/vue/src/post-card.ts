/**
 * HivePostCard Component
 *
 * Display a Hive blockchain post with title, author, stats, and content preview.
 * Display-only - no vote/reblog actions. Fetches post data automatically.
 * Vue 3 port of the React HivePostCard component.
 */

import { defineComponent, type PropType } from "vue";
import { useHivePost } from "./use-hive-post.js";
import {
  render_loading,
  render_error,
  render_compact,
  render_grid,
  render_default_card,
} from "./post-card-helpers.js";

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

export const HivePostCard = defineComponent({
  name: "HivePostCard",
  props: {
    author: {
      type: String,
      required: true,
    },
    permlink: {
      type: String,
      required: true,
    },
    variant: {
      type: String as PropType<PostVariant>,
      default: "card",
    },
    hide: {
      type: Array as PropType<PostHideOption[]>,
      default: () => [],
    },
    linkTarget: {
      type: String,
      default: "https://blog.openhive.network",
    },
    class: {
      type: String,
      default: undefined,
    },
  },
  setup(props) {
    const { post, isLoading, error } = useHivePost(
      props.author,
      props.permlink,
    );

    return () => {
      if (isLoading.value) {
        return render_loading(props.class);
      }

      if (error.value || !post.value) {
        return render_error(error.value?.message, props.class);
      }

      const current_post = post.value;
      const post_url = current_post.category
        ? `${props.linkTarget}/${current_post.category}/@${props.author}/${props.permlink}`
        : `${props.linkTarget}/@${props.author}/${props.permlink}`;

      if (props.variant === "compact") {
        return render_compact(
          post_url,
          props.author,
          current_post,
          props.hide,
          props.class,
        );
      }

      if (props.variant === "grid") {
        return render_grid(
          post_url,
          props.author,
          current_post,
          props.hide,
          props.class,
        );
      }

      return render_default_card(
        post_url,
        props.author,
        current_post,
        props.hide,
        props.class,
      );
    };
  },
});
