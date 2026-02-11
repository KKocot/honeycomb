/**
 * HivePostCard Component
 *
 * Display a Hive blockchain post with title, author, stats, and content preview.
 * Display-only - no vote/reblog actions. Fetches post data automatically.
 * Vue 3 port of the React HivePostCard component.
 */

import { defineComponent, h, type PropType } from "vue";
import { useHivePost } from "./use-hive-post.js";
import { HiveAvatar } from "./avatar.js";
import { cn } from "./utils.js";

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

function should_hide(
  hide: PostHideOption[],
  option: PostHideOption,
): boolean {
  return hide.includes(option);
}

/**
 * Strip markdown syntax characters for plain text preview.
 */
function strip_markdown(text: string): string {
  return text.replace(/[#*`>\[\]!]/g, "").substring(0, 150);
}

function render_loading(class_name: string | undefined) {
  return h(
    "div",
    {
      class: cn(
        "rounded-lg border border-hive-border bg-hive-card p-4 animate-pulse",
        class_name,
      ),
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

function render_error(
  message: string | undefined,
  class_name: string | undefined,
) {
  return h(
    "div",
    {
      class: cn(
        "rounded-lg border border-hive-border bg-hive-card p-4",
        class_name,
      ),
    },
    [
      h(
        "p",
        { class: "text-sm text-hive-muted-foreground" },
        message || "Post not found",
      ),
    ],
  );
}

function render_thumbnail_link(
  post_url: string,
  thumbnail: string | null,
  title: string,
  class_name: string,
  placeholder_text: string,
) {
  return h(
    "a",
    {
      href: post_url,
      target: "_blank",
      rel: "noopener noreferrer",
      class: class_name,
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

function render_title_link(
  post_url: string,
  title: string,
  extra_class: string,
) {
  return h(
    "a",
    {
      href: post_url,
      target: "_blank",
      rel: "noopener noreferrer",
      class: "hover:text-hive-red transition-colors",
    },
    [h("h3", { class: extra_class }, title)],
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

function render_compact(
  post_url: string,
  author: string,
  post: {
    title: string;
    thumbnail: string | null;
    created: string;
    votes: number;
    comments: number;
    payout: string;
  },
  hide: PostHideOption[],
  class_name: string | undefined,
) {
  const children = [];

  if (!should_hide(hide, "thumbnail")) {
    children.push(
      render_thumbnail_link(
        post_url,
        post.thumbnail,
        post.title,
        "w-20 h-20 rounded overflow-hidden shrink-0",
        "No img",
      ),
    );
  }

  const content_children = [
    render_title_link(post_url, post.title, "font-semibold truncate"),
  ];

  if (!should_hide(hide, "author")) {
    const author_text = should_hide(hide, "time")
      ? `@${author}`
      : `@${author} \u00B7 ${post.created}`;
    content_children.push(
      h(
        "p",
        { class: "text-sm text-hive-muted-foreground" },
        author_text,
      ),
    );
  }

  const stats = [];
  if (!should_hide(hide, "votes")) {
    stats.push(render_stat_votes(post.votes));
  }
  if (!should_hide(hide, "comments")) {
    stats.push(render_stat_comments(post.comments));
  }
  if (!should_hide(hide, "payout")) {
    stats.push(
      h("span", { class: "text-hive-success" }, post.payout),
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
      class: cn(
        "flex gap-4 p-4 rounded-lg border border-hive-border bg-hive-card hover:border-hive-red/50 transition-colors",
        class_name,
      ),
    },
    children,
  );
}

function render_grid(
  post_url: string,
  author: string,
  post: {
    title: string;
    thumbnail: string | null;
    created: string;
    votes: number;
    comments: number;
    payout: string;
  },
  hide: PostHideOption[],
  class_name: string | undefined,
) {
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
          post.thumbnail
            ? h("img", {
                src: post.thumbnail,
                alt: post.title,
                class:
                  "w-full h-full object-cover hover:scale-105 transition-transform",
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

  const content_children = [
    render_title_link(post_url, post.title, "font-semibold line-clamp-2"),
  ];

  if (!should_hide(hide, "author")) {
    const author_text = should_hide(hide, "time")
      ? `@${author}`
      : `@${author} \u00B7 ${post.created}`;
    content_children.push(
      h(
        "p",
        { class: "mt-1 text-sm text-hive-muted-foreground" },
        author_text,
      ),
    );
  }

  const left_stats = [];
  if (!should_hide(hide, "votes")) {
    left_stats.push(render_stat_votes(post.votes));
  }
  if (!should_hide(hide, "comments")) {
    left_stats.push(render_stat_comments(post.comments));
  }

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
        post.payout,
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
      class: cn(
        "rounded-lg border border-hive-border bg-hive-card overflow-hidden hover:border-hive-red/50 transition-colors",
        class_name,
      ),
    },
    children,
  );
}

function render_default_card(
  post_url: string,
  author: string,
  post: {
    title: string;
    body: string;
    thumbnail: string | null;
    created: string;
    votes: number;
    comments: number;
    payout: string;
  },
  hide: PostHideOption[],
  class_name: string | undefined,
) {
  const children = [];

  if (!should_hide(hide, "thumbnail") && post.thumbnail) {
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
            src: post.thumbnail,
            alt: post.title,
            class:
              "w-full h-full object-cover hover:scale-105 transition-transform",
          }),
        ],
      ),
    );
  }

  const content_children = [];

  if (!should_hide(hide, "author")) {
    const author_info = [
      h(HiveAvatar, { username: author, size: "sm" }),
      h("div", {}, [
        h("p", { class: "font-medium" }, `@${author}`),
        ...(should_hide(hide, "time")
          ? []
          : [
              h(
                "p",
                { class: "text-sm text-hive-muted-foreground" },
                post.created,
              ),
            ]),
      ]),
    ];
    content_children.push(
      h("div", { class: "flex items-center gap-3 mb-3" }, author_info),
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
        ` ${post.votes}`,
      ]),
    );
  }
  if (!should_hide(hide, "comments")) {
    left_stats.push(
      h("span", { class: "flex items-center gap-1.5" }, [
        h("span", { "aria-hidden": "true" }, "#"),
        ` ${post.comments}`,
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
        post.payout,
      ),
    );
  }

  content_children.push(
    h(
      "div",
      {
        class:
          "flex items-center justify-between mt-4 pt-3 border-t border-hive-border",
      },
      footer_children,
    ),
  );

  children.push(h("div", { class: "p-4" }, content_children));

  return h(
    "div",
    {
      class: cn(
        "rounded-lg border border-hive-border bg-hive-card overflow-hidden hover:border-hive-red/50 transition-colors",
        class_name,
      ),
    },
    children,
  );
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
    const { post, is_loading, error } = useHivePost(
      props.author,
      props.permlink,
    );

    return () => {
      if (is_loading.value) {
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
