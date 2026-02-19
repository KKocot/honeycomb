import { h, type VNode } from "vue";
import { HiveAvatar } from "./avatar.js";
import type { PostVariant, PostHideOption } from "./post-card.js";
import {
  type RankedPost,
  format_payout,
  format_time_ago,
  extract_thumbnail,
} from "@kkocot/honeycomb-core";
import {
  should_hide,
  get_post_url,
  render_thumbnail_link,
  render_stat_votes,
  render_stat_comments,
} from "./post-list-helpers.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function strip_markdown(text: string): string {
  return text.replace(/[#*`>\[\]!]/g, "").substring(0, 150);
}

function get_thumbnail(post: RankedPost): string | null {
  return extract_thumbnail(post.json_metadata, post.body) ?? null;
}

// ---------------------------------------------------------------------------
// Compact variant
// ---------------------------------------------------------------------------

function render_compact_post(
  post: RankedPost,
  hide: PostHideOption[],
  link_target: string,
  is_pinned: boolean,
): VNode {
  const thumbnail = get_thumbnail(post);
  const post_url = get_post_url(
    post.author,
    post.permlink,
    post.category,
    link_target,
  );

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
        {
          class:
            "shrink-0 rounded bg-hive-red px-2 py-0.5 text-xs text-white",
        },
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
  if (!should_hide(hide, "votes"))
    stats.push(render_stat_votes(post.net_votes));
  if (!should_hide(hide, "comments"))
    stats.push(render_stat_comments(post.children));
  if (!should_hide(hide, "payout")) {
    stats.push(
      h(
        "span",
        { class: "text-hive-success" },
        format_payout(post.pending_payout_value),
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

// ---------------------------------------------------------------------------
// Card variant
// ---------------------------------------------------------------------------

function render_card_post(
  post: RankedPost,
  hide: PostHideOption[],
  link_target: string,
  is_pinned: boolean,
): VNode {
  const thumbnail = get_thumbnail(post);
  const post_url = get_post_url(
    post.author,
    post.permlink,
    post.category,
    link_target,
  );
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
            class:
              "w-full h-full object-cover hover:scale-105 transition-transform",
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
          {
            class:
              "ml-auto shrink-0 rounded bg-hive-red px-2 py-0.5 text-xs text-white",
          },
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
      class:
        "rounded-lg border border-hive-border bg-hive-card overflow-hidden hover:border-hive-red/50 transition-colors",
    },
    children,
  );
}

// ---------------------------------------------------------------------------
// Grid variant
// ---------------------------------------------------------------------------

function render_grid_post(
  post: RankedPost,
  hide: PostHideOption[],
  link_target: string,
  is_pinned: boolean,
): VNode {
  const thumbnail = get_thumbnail(post);
  const post_url = get_post_url(
    post.author,
    post.permlink,
    post.category,
    link_target,
  );
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
        {
          class:
            "shrink-0 rounded bg-hive-red px-2 py-0.5 text-xs text-white",
        },
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
      h(
        "p",
        { class: "mt-1 text-sm text-hive-muted-foreground" },
        author_text,
      ),
    );
  }

  const left_stats = [];
  if (!should_hide(hide, "votes"))
    left_stats.push(render_stat_votes(post.net_votes));
  if (!should_hide(hide, "comments"))
    left_stats.push(render_stat_comments(post.children));

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

// ---------------------------------------------------------------------------
// Dispatcher
// ---------------------------------------------------------------------------

export function render_post_item(
  post: RankedPost,
  variant: PostVariant,
  hide: PostHideOption[],
  link_target: string,
  is_pinned: boolean,
): VNode {
  if (variant === "compact")
    return render_compact_post(post, hide, link_target, is_pinned);
  if (variant === "grid")
    return render_grid_post(post, hide, link_target, is_pinned);
  return render_card_post(post, hide, link_target, is_pinned);
}
