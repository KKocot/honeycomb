import { defineComponent, h, type PropType, type VNode } from "vue";
import { useHivePost } from "./use-hive-post.js";
import type { PostVariant, PostHideOption } from "./post-card.js";
import type { SortType } from "@kkocot/honeycomb-core";

// Re-export render_post_item from renderers
export { render_post_item } from "./post-list-renderers.js";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const SORT_LABELS: Record<SortType, string> = {
  trending: "Trending",
  hot: "Hot",
  created: "New",
  payout: "Payout",
  muted: "Muted",
};

export const SORT_OPTIONS: SortType[] = [
  "trending",
  "hot",
  "created",
  "payout",
  "muted",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function should_hide(
  hide: PostHideOption[],
  option: PostHideOption,
): boolean {
  return hide.includes(option);
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
// Render helpers (shared by renderers and PinnedPostItem)
// ---------------------------------------------------------------------------

export function render_thumbnail_link(
  post_url: string,
  thumbnail: string | null,
  title: string,
  link_class: string,
  placeholder_text: string,
): VNode {
  return h(
    "a",
    {
      href: post_url,
      target: "_blank",
      rel: "noopener noreferrer",
      class: link_class,
    },
    [
      thumbnail
        ? h("img", {
            src: thumbnail,
            alt: title,
            class: "w-full h-full object-cover",
          })
        : h(
            "div",
            {
              class:
                "w-full h-full bg-hive-muted flex items-center justify-center text-hive-muted-foreground text-xs",
            },
            placeholder_text,
          ),
    ],
  );
}

export function render_stat_votes(votes: number): VNode {
  return h("span", { class: "flex items-center gap-1" }, [
    h("span", { "aria-hidden": "true" }, "^"),
    ` ${votes}`,
  ]);
}

export function render_stat_comments(comments: number): VNode {
  return h("span", { class: "flex items-center gap-1" }, [
    h("span", { "aria-hidden": "true" }, "#"),
    ` ${comments}`,
  ]);
}

// ---------------------------------------------------------------------------
// Skeletons
// ---------------------------------------------------------------------------

export function render_compact_skeleton(): VNode {
  return h(
    "div",
    {
      class:
        "flex gap-4 p-4 rounded-lg border border-hive-border bg-hive-card animate-pulse",
    },
    [
      h("div", { class: "w-20 h-20 rounded bg-hive-muted shrink-0" }),
      h("div", { class: "flex-1 space-y-2" }, [
        h("div", { class: "h-5 w-3/4 bg-hive-muted rounded" }),
        h("div", { class: "h-3 w-1/3 bg-hive-muted rounded" }),
        h("div", { class: "h-3 w-1/2 bg-hive-muted rounded" }),
      ]),
    ],
  );
}

function render_card_skeleton(): VNode {
  return h(
    "div",
    {
      class:
        "rounded-lg border border-hive-border bg-hive-card p-4 animate-pulse",
    },
    [
      h("div", { class: "flex items-center gap-3 mb-3" }, [
        h("div", { class: "h-10 w-10 rounded-full bg-hive-muted" }),
        h("div", { class: "space-y-2" }, [
          h("div", { class: "h-4 w-24 bg-hive-muted rounded" }),
          h("div", { class: "h-3 w-16 bg-hive-muted rounded" }),
        ]),
      ]),
      h("div", { class: "h-5 w-3/4 bg-hive-muted rounded mb-2" }),
      h("div", { class: "h-3 w-full bg-hive-muted rounded mb-1" }),
      h("div", { class: "h-3 w-2/3 bg-hive-muted rounded" }),
    ],
  );
}

function render_grid_skeleton(): VNode {
  return h(
    "div",
    {
      class:
        "rounded-lg border border-hive-border bg-hive-card overflow-hidden animate-pulse",
    },
    [
      h("div", { class: "aspect-video bg-hive-muted" }),
      h("div", { class: "p-4 space-y-2" }, [
        h("div", { class: "h-5 w-3/4 bg-hive-muted rounded" }),
        h("div", { class: "h-3 w-1/3 bg-hive-muted rounded" }),
      ]),
    ],
  );
}

export function render_loading_skeleton(
  variant: PostVariant,
  count: number,
): VNode {
  const items = Array.from({ length: count }, (_, i) => i);
  if (variant === "grid") {
    return h(
      "div",
      { class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" },
      items.map(() => render_grid_skeleton()),
    );
  }
  if (variant === "compact") {
    return h(
      "div",
      { class: "flex flex-col gap-2" },
      items.map(() => render_compact_skeleton()),
    );
  }
  return h(
    "div",
    { class: "flex flex-col gap-4" },
    items.map(() => render_card_skeleton()),
  );
}

// ---------------------------------------------------------------------------
// Pinned Post Item
// ---------------------------------------------------------------------------

export const PinnedPostItem = defineComponent({
  name: "PinnedPostItem",
  props: {
    author: { type: String, required: true },
    permlink: { type: String, required: true },
    hide: {
      type: Array as PropType<PostHideOption[]>,
      default: () => [],
    },
    linkTarget: {
      type: String,
      default: "https://blog.openhive.network",
    },
  },
  setup(props) {
    const { post, isLoading, error } = useHivePost(
      props.author,
      props.permlink,
    );

    return () => {
      if (isLoading.value) return render_compact_skeleton();

      if (error.value || !post.value) {
        return h(
          "div",
          {
            class:
              "rounded-lg border border-hive-border bg-hive-card p-4",
          },
          [
            h(
              "p",
              { class: "text-sm text-hive-muted-foreground" },
              error.value?.message ??
                `Could not load @${props.author}/${props.permlink}`,
            ),
          ],
        );
      }

      const current_post = post.value;
      const post_url = get_post_url(
        props.author,
        props.permlink,
        current_post.category,
        props.linkTarget,
      );

      const children = [];

      if (!should_hide(props.hide, "thumbnail")) {
        children.push(
          render_thumbnail_link(
            post_url,
            current_post.thumbnail,
            current_post.title,
            "w-20 h-20 rounded overflow-hidden shrink-0",
            "No img",
          ),
        );
      }

      const title_children = [
        h(
          "a",
          {
            href: post_url,
            target: "_blank",
            rel: "noopener noreferrer",
            class: "hover:text-hive-red transition-colors min-w-0",
          },
          [
            h(
              "h3",
              { class: "font-semibold truncate" },
              current_post.title,
            ),
          ],
        ),
        h(
          "span",
          {
            class:
              "shrink-0 rounded bg-hive-red px-2 py-0.5 text-xs text-white",
          },
          "Pinned",
        ),
      ];

      const content_children = [
        h("div", { class: "flex items-center gap-2" }, title_children),
      ];

      if (!should_hide(props.hide, "author")) {
        const author_text = should_hide(props.hide, "time")
          ? `@${props.author}`
          : `@${props.author} \u00B7 ${current_post.created}`;
        content_children.push(
          h(
            "p",
            { class: "text-sm text-hive-muted-foreground" },
            author_text,
          ),
        );
      }

      const stats = [];
      if (!should_hide(props.hide, "votes")) {
        stats.push(render_stat_votes(current_post.votes));
      }
      if (!should_hide(props.hide, "comments")) {
        stats.push(render_stat_comments(current_post.comments));
      }
      if (!should_hide(props.hide, "payout")) {
        stats.push(
          h(
            "span",
            { class: "text-hive-success" },
            current_post.payout,
          ),
        );
      }
      if (stats.length > 0) {
        content_children.push(
          h(
            "div",
            {
              class:
                "flex items-center gap-4 mt-2 text-sm text-hive-muted-foreground",
            },
            stats,
          ),
        );
      }

      children.push(
        h("div", { class: "flex-1 min-w-0" }, content_children),
      );

      return h(
        "div",
        {
          class:
            "flex gap-4 p-4 rounded-lg border border-hive-border bg-hive-card hover:border-hive-red/50 transition-colors",
        },
        children,
      );
    };
  },
});
