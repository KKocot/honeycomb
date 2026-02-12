import { defineComponent, h, type PropType } from "vue";
import {
  useHivePostList,
  type UseHivePostListOptions,
} from "./use-hive-post-list.js";
import { useHivePost } from "./use-hive-post.js";
import { HiveAvatar } from "./avatar.js";
import { cn } from "./utils.js";
import type { PostVariant, PostHideOption } from "./post-card.js";
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
// Render helpers
// ---------------------------------------------------------------------------

function render_thumbnail_link(
  post_url: string,
  thumbnail: string | null,
  title: string,
  link_class: string,
  placeholder_text: string,
) {
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

function render_stat_votes(votes: number) {
  return h("span", { class: "flex items-center gap-1" }, [
    h("span", { "aria-hidden": "true" }, "^"),
    ` ${votes}`,
  ]);
}

function render_stat_comments(comments: number) {
  return h("span", { class: "flex items-center gap-1" }, [
    h("span", { "aria-hidden": "true" }, "#"),
    ` ${comments}`,
  ]);
}

// ---------------------------------------------------------------------------
// Inline Post Renderers
// ---------------------------------------------------------------------------

function render_compact_post(
  post: RankedPost,
  hide: PostHideOption[],
  link_target: string,
  is_pinned: boolean,
) {
  const thumbnail = get_thumbnail(post);
  const post_url = get_post_url(post.author, post.permlink, post.category, link_target);

  const children = [];

  if (!should_hide(hide, "thumbnail")) {
    children.push(
      render_thumbnail_link(
        post_url,
        thumbnail,
        post.title,
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
      [h("h3", { class: "font-semibold truncate" }, post.title)],
    ),
  ];

  if (is_pinned) {
    title_children.push(
      h(
        "span",
        { class: "shrink-0 rounded bg-hive-red px-2 py-0.5 text-xs text-white" },
        "Pinned",
      ),
    );
  }

  const content_children = [
    h("div", { class: "flex items-center gap-2" }, title_children),
  ];

  if (!should_hide(hide, "author")) {
    const author_text = should_hide(hide, "time")
      ? `@${post.author}`
      : `@${post.author} \u00B7 ${format_time_ago(post.created)}`;
    content_children.push(
      h("p", { class: "text-sm text-hive-muted-foreground" }, author_text),
    );
  }

  const stats = [];
  if (!should_hide(hide, "votes")) stats.push(render_stat_votes(post.net_votes));
  if (!should_hide(hide, "comments")) stats.push(render_stat_comments(post.children));
  if (!should_hide(hide, "payout")) {
    stats.push(
      h("span", { class: "text-hive-success" }, format_payout(post.pending_payout_value)),
    );
  }
  if (stats.length > 0) {
    content_children.push(
      h(
        "div",
        { class: "flex items-center gap-4 mt-2 text-sm text-hive-muted-foreground" },
        stats,
      ),
    );
  }

  children.push(h("div", { class: "flex-1 min-w-0" }, content_children));

  return h(
    "div",
    {
      class:
        "flex gap-4 p-4 rounded-lg border border-hive-border bg-hive-card hover:border-hive-red/50 transition-colors",
    },
    children,
  );
}

function render_card_post(
  post: RankedPost,
  hide: PostHideOption[],
  link_target: string,
  is_pinned: boolean,
) {
  const thumbnail = get_thumbnail(post);
  const post_url = get_post_url(post.author, post.permlink, post.category, link_target);
  const children = [];

  if (!should_hide(hide, "thumbnail") && thumbnail) {
    children.push(
      h(
        "a",
        {
          href: post_url,
          target: "_blank",
          rel: "noopener noreferrer",
          class: "block aspect-video overflow-hidden",
        },
        [
          h("img", {
            src: thumbnail,
            alt: post.title,
            class: "w-full h-full object-cover hover:scale-105 transition-transform",
          }),
        ],
      ),
    );
  }

  const content_children = [];

  if (!should_hide(hide, "author")) {
    const author_row = [
      h(HiveAvatar, { username: post.author, size: "sm" }),
      h("div", {}, [
        h("p", { class: "font-medium" }, `@${post.author}`),
        ...(should_hide(hide, "time")
          ? []
          : [
              h(
                "p",
                { class: "text-sm text-hive-muted-foreground" },
                format_time_ago(post.created),
              ),
            ]),
      ]),
    ];
    if (is_pinned) {
      author_row.push(
        h(
          "span",
          { class: "ml-auto shrink-0 rounded bg-hive-red px-2 py-0.5 text-xs text-white" },
          "Pinned",
        ),
      );
    }
    content_children.push(
      h("div", { class: "flex items-center gap-3 mb-3" }, author_row),
    );
  }

  content_children.push(
    h(
      "a",
      {
        href: post_url,
        target: "_blank",
        rel: "noopener noreferrer",
        class: "hover:text-hive-red transition-colors",
      },
      [h("h2", { class: "text-lg font-bold" }, post.title)],
    ),
  );

  content_children.push(
    h(
      "p",
      { class: "mt-2 text-hive-muted-foreground text-sm line-clamp-2" },
      `${strip_markdown(post.body)}...`,
    ),
  );

  const left_stats = [];
  if (!should_hide(hide, "votes")) {
    left_stats.push(
      h("span", { class: "flex items-center gap-1.5" }, [
        h("span", { "aria-hidden": "true" }, "^"),
        ` ${post.net_votes}`,
      ]),
    );
  }
  if (!should_hide(hide, "comments")) {
    left_stats.push(
      h("span", { class: "flex items-center gap-1.5" }, [
        h("span", { "aria-hidden": "true" }, "#"),
        ` ${post.children}`,
      ]),
    );
  }

  const footer_children = [
    h(
      "div",
      { class: "flex items-center gap-4 text-hive-muted-foreground" },
      left_stats,
    ),
  ];

  if (!should_hide(hide, "payout")) {
    footer_children.push(
      h(
        "span",
        { class: "text-sm font-medium text-hive-success" },
        format_payout(post.pending_payout_value),
      ),
    );
  }

  content_children.push(
    h(
      "div",
      { class: "flex items-center justify-between mt-4 pt-3 border-t border-hive-border" },
      footer_children,
    ),
  );

  children.push(h("div", { class: "p-4" }, content_children));

  return h(
    "div",
    {
      class:
        "rounded-lg border border-hive-border bg-hive-card overflow-hidden hover:border-hive-red/50 transition-colors",
    },
    children,
  );
}

function render_grid_post(
  post: RankedPost,
  hide: PostHideOption[],
  link_target: string,
  is_pinned: boolean,
) {
  const thumbnail = get_thumbnail(post);
  const post_url = get_post_url(post.author, post.permlink, post.category, link_target);
  const children = [];

  if (!should_hide(hide, "thumbnail")) {
    children.push(
      h(
        "a",
        {
          href: post_url,
          target: "_blank",
          rel: "noopener noreferrer",
          class: "block aspect-video overflow-hidden",
        },
        [
          thumbnail
            ? h("img", {
                src: thumbnail,
                alt: post.title,
                class: "w-full h-full object-cover hover:scale-105 transition-transform",
              })
            : h(
                "div",
                {
                  class:
                    "w-full h-full bg-hive-muted flex items-center justify-center text-hive-muted-foreground text-sm",
                },
                "No image",
              ),
        ],
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
      [h("h3", { class: "font-semibold line-clamp-2" }, post.title)],
    ),
  ];

  if (is_pinned) {
    title_children.push(
      h(
        "span",
        { class: "shrink-0 rounded bg-hive-red px-2 py-0.5 text-xs text-white" },
        "Pinned",
      ),
    );
  }

  const content_children = [
    h("div", { class: "flex items-center gap-2" }, title_children),
  ];

  if (!should_hide(hide, "author")) {
    const author_text = should_hide(hide, "time")
      ? `@${post.author}`
      : `@${post.author} \u00B7 ${format_time_ago(post.created)}`;
    content_children.push(
      h("p", { class: "mt-1 text-sm text-hive-muted-foreground" }, author_text),
    );
  }

  const left_stats = [];
  if (!should_hide(hide, "votes")) left_stats.push(render_stat_votes(post.net_votes));
  if (!should_hide(hide, "comments")) left_stats.push(render_stat_comments(post.children));

  const footer_children = [
    h(
      "div",
      { class: "flex items-center gap-3 text-hive-muted-foreground" },
      left_stats,
    ),
  ];

  if (!should_hide(hide, "payout")) {
    footer_children.push(
      h(
        "span",
        { class: "font-medium text-hive-success" },
        format_payout(post.pending_payout_value),
      ),
    );
  }

  content_children.push(
    h(
      "div",
      {
        class:
          "flex items-center justify-between mt-3 pt-3 border-t border-hive-border text-sm",
      },
      footer_children,
    ),
  );

  children.push(h("div", { class: "p-4" }, content_children));

  return h(
    "div",
    {
      class:
        "rounded-lg border border-hive-border bg-hive-card overflow-hidden hover:border-hive-red/50 transition-colors",
    },
    children,
  );
}

function render_post_item(
  post: RankedPost,
  variant: PostVariant,
  hide: PostHideOption[],
  link_target: string,
  is_pinned: boolean,
) {
  if (variant === "compact") return render_compact_post(post, hide, link_target, is_pinned);
  if (variant === "grid") return render_grid_post(post, hide, link_target, is_pinned);
  return render_card_post(post, hide, link_target, is_pinned);
}

// ---------------------------------------------------------------------------
// Skeletons
// ---------------------------------------------------------------------------

function render_compact_skeleton() {
  return h(
    "div",
    { class: "flex gap-4 p-4 rounded-lg border border-hive-border bg-hive-card animate-pulse" },
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

function render_card_skeleton() {
  return h(
    "div",
    { class: "rounded-lg border border-hive-border bg-hive-card p-4 animate-pulse" },
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

function render_grid_skeleton() {
  return h(
    "div",
    { class: "rounded-lg border border-hive-border bg-hive-card overflow-hidden animate-pulse" },
    [
      h("div", { class: "aspect-video bg-hive-muted" }),
      h("div", { class: "p-4 space-y-2" }, [
        h("div", { class: "h-5 w-3/4 bg-hive-muted rounded" }),
        h("div", { class: "h-3 w-1/3 bg-hive-muted rounded" }),
      ]),
    ],
  );
}

function render_loading_skeleton(variant: PostVariant, count: number) {
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

const PinnedPostItem = defineComponent({
  name: "PinnedPostItem",
  props: {
    author: { type: String, required: true },
    permlink: { type: String, required: true },
    hide: { type: Array as PropType<PostHideOption[]>, default: () => [] },
    linkTarget: { type: String, default: "https://blog.openhive.network" },
  },
  setup(props) {
    const { post, is_loading, error } = useHivePost(props.author, props.permlink);

    return () => {
      if (is_loading.value) return render_compact_skeleton();

      if (error.value || !post.value) {
        return h(
          "div",
          { class: "rounded-lg border border-hive-border bg-hive-card p-4" },
          [
            h(
              "p",
              { class: "text-sm text-hive-muted-foreground" },
              error.value?.message ?? `Could not load @${props.author}/${props.permlink}`,
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
          [h("h3", { class: "font-semibold truncate" }, current_post.title)],
        ),
        h(
          "span",
          { class: "shrink-0 rounded bg-hive-red px-2 py-0.5 text-xs text-white" },
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
          h("p", { class: "text-sm text-hive-muted-foreground" }, author_text),
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
          h("span", { class: "text-hive-success" }, current_post.payout),
        );
      }
      if (stats.length > 0) {
        content_children.push(
          h(
            "div",
            { class: "flex items-center gap-4 mt-2 text-sm text-hive-muted-foreground" },
            stats,
          ),
        );
      }

      children.push(h("div", { class: "flex-1 min-w-0" }, content_children));

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

// ---------------------------------------------------------------------------
// HivePostList
// ---------------------------------------------------------------------------

export const HivePostList = defineComponent({
  name: "HivePostList",
  props: {
    sort: { type: String as PropType<SortType>, default: undefined },
    tag: { type: String, default: undefined },
    limit: { type: Number, default: undefined },
    pinned_posts: {
      type: Array as PropType<Array<{ author: string; permlink: string }>>,
      default: undefined,
    },
    show_sort_controls: { type: Boolean, default: false },
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

    return () => {
      const children = [];
      const current_variant = props.variant;
      const current_hide = props.hide;
      const current_link_target = props.linkTarget;
      const has_pinned =
        props.pinned_posts !== undefined && props.pinned_posts.length > 0;

      // Sort controls
      if (props.show_sort_controls) {
        children.push(
          h(
            "div",
            { class: "flex flex-wrap gap-2 mb-4" },
            SORT_OPTIONS.map((option) =>
              h(
                "button",
                {
                  type: "button",
                  onClick: () => set_sort(option),
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
              props.pinned_posts!.map((pin) =>
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
      if (is_loading.value) {
        children.push(render_loading_skeleton(current_variant, 4));
      }

      // Error
      if (!is_loading.value && error.value) {
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
      if (!is_loading.value && !error.value && posts.value.length === 0) {
        children.push(
          h(
            "p",
            { class: "text-sm text-hive-muted-foreground py-8 text-center" },
            "No posts found",
          ),
        );
      }

      // Posts
      if (!is_loading.value && !error.value && posts.value.length > 0) {
        const post_items = posts.value.map((post) =>
          render_post_item(post, current_variant, current_hide, current_link_target, false),
        );

        if (current_variant === "grid") {
          children.push(
            h(
              "div",
              { class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" },
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
                onClick: prev_page,
                disabled: !has_prev.value,
                class: cn(
                  "rounded-lg border border-hive-border px-4 py-2 text-sm font-medium hover:bg-hive-muted transition-colors",
                  !has_prev.value &&
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
                onClick: next_page,
                disabled: !has_next.value,
                class: cn(
                  "rounded-lg border border-hive-border px-4 py-2 text-sm font-medium hover:bg-hive-muted transition-colors",
                  !has_next.value &&
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
