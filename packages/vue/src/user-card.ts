import { defineComponent, computed, h, type PropType } from "vue";
import { useHiveAccount } from "./use-hive-account.js";
import { HiveAvatar } from "./avatar.js";
import { cn } from "./utils.js";

export type UserCardVariant = "compact" | "default" | "expanded";

export interface UserCardProps {
  username: string;
  variant?: UserCardVariant;
  showStats?: boolean;
  class?: string;
}

interface ProfileMetadata {
  name?: string;
  about?: string;
  location?: string;
  website?: string;
  profile_image?: string;
  cover_image?: string;
}

function parse_metadata(
  account: { posting_json_metadata?: string; json_metadata?: string } | null,
): ProfileMetadata | null {
  if (!account) return null;

  try {
    if (account.posting_json_metadata) {
      const parsed: unknown = JSON.parse(account.posting_json_metadata);
      if (
        typeof parsed === "object" &&
        parsed !== null &&
        "profile" in parsed
      ) {
        return (parsed as { profile: ProfileMetadata }).profile;
      }
    }
    if (account.json_metadata) {
      const parsed: unknown = JSON.parse(account.json_metadata);
      if (
        typeof parsed === "object" &&
        parsed !== null &&
        "profile" in parsed
      ) {
        return (parsed as { profile: ProfileMetadata }).profile;
      }
    }
  } catch {
    // Invalid JSON
  }
  return null;
}

function render_loading(class_name: string | undefined) {
  return h(
    "div",
    {
      class: cn(
        "rounded-lg border border-hive-border bg-hive-card p-4 animate-pulse",
        class_name
      ),
    },
    [
      h("div", { class: "flex items-center gap-3" }, [
        h("div", { class: "h-12 w-12 rounded-full bg-hive-muted" }),
        h("div", { class: "space-y-2" }, [
          h("div", { class: "h-4 w-24 bg-hive-muted rounded" }),
          h("div", { class: "h-3 w-32 bg-hive-muted rounded" }),
        ]),
      ]),
    ]
  );
}

function render_error(
  message: string | undefined,
  class_name: string | undefined
) {
  return h(
    "div",
    {
      class: cn(
        "rounded-lg border border-hive-border bg-hive-card p-4",
        class_name
      ),
    },
    [
      h(
        "p",
        { class: "text-sm text-hive-muted-foreground" },
        message || "User not found"
      ),
    ]
  );
}

function render_stats(post_count: number, hive_power: string, balance: string) {
  return h("div", { class: "mt-4 grid grid-cols-3 gap-4 text-center" }, [
    h("div", {}, [
      h("p", { class: "text-lg font-bold" }, String(post_count)),
      h("p", { class: "text-xs text-hive-muted-foreground" }, "Posts"),
    ]),
    h("div", {}, [
      h("p", { class: "text-lg font-bold" }, hive_power.split(" ")[0]),
      h("p", { class: "text-xs text-hive-muted-foreground" }, "HP"),
    ]),
    h("div", {}, [
      h("p", { class: "text-lg font-bold" }, balance.split(" ")[0]),
      h("p", { class: "text-xs text-hive-muted-foreground" }, "HIVE"),
    ]),
  ]);
}

export const UserCard = defineComponent({
  name: "UserCard",
  props: {
    username: {
      type: String,
      required: true,
    },
    variant: {
      type: String as PropType<UserCardVariant>,
      default: "default",
    },
    showStats: {
      type: Boolean,
      default: true,
    },
    class: {
      type: String,
      default: undefined,
    },
  },
  setup(props) {
    const { account, isLoading, error } = useHiveAccount(
      () => props.username
    );

    const metadata = computed(() => parse_metadata(account.value));
    // Reputation already formatted by useHiveAccount hook
    const reputation = computed(() => account.value?.reputation ?? 25);

    return () => {
      if (isLoading.value) {
        return render_loading(props.class);
      }

      if (error.value || !account.value) {
        return render_error(error.value?.message, props.class);
      }

      const acc = account.value;

      if (props.variant === "compact") {
        return h("div", { class: cn("flex items-center gap-2", props.class) }, [
          h(HiveAvatar, { username: props.username, size: "sm" }),
          h("div", {}, [
            h("span", { class: "font-medium" }, `@${props.username}`),
            h(
              "span",
              { class: "text-hive-muted-foreground text-sm ml-1" },
              `(${reputation.value})`
            ),
          ]),
        ]);
      }

      if (props.variant === "expanded") {
        const children = [];

        if (metadata.value?.cover_image) {
          children.push(
            h("img", {
              src: metadata.value.cover_image,
              alt: "Cover",
              class: "w-full h-32 object-cover",
            })
          );
        }

        const content_children = [
          h("div", { class: "flex items-start gap-4" }, [
            h(HiveAvatar, {
              username: props.username,
              size: "xl",
              class: metadata.value?.cover_image
                ? "-mt-10 ring-4 ring-hive-card"
                : "",
            }),
            h("div", { class: "flex-1 min-w-0" }, [
              h(
                "h3",
                { class: "font-bold text-lg truncate" },
                metadata.value?.name || `@${props.username}`
              ),
              h(
                "p",
                { class: "text-hive-muted-foreground text-sm" },
                `@${props.username} \u2022 Rep: ${reputation.value}`
              ),
            ]),
          ]),
        ];

        if (metadata.value?.about) {
          content_children.push(
            h(
              "p",
              { class: "mt-3 text-sm text-hive-muted-foreground line-clamp-2" },
              metadata.value.about
            )
          );
        }

        if (props.showStats) {
          content_children.push(
            render_stats(acc.post_count, acc.hive_power, acc.balance)
          );
        }

        children.push(h("div", { class: "p-4" }, content_children));

        return h(
          "div",
          {
            class: cn(
              "rounded-lg border border-hive-border bg-hive-card overflow-hidden",
              props.class
            ),
          },
          children
        );
      }

      // Default variant
      const default_children = [
        h("div", { class: "flex items-center gap-3" }, [
          h(HiveAvatar, { username: props.username, size: "lg" }),
          h("div", { class: "flex-1 min-w-0" }, [
            h(
              "h3",
              { class: "font-semibold truncate" },
              metadata.value?.name || `@${props.username}`
            ),
            h(
              "p",
              { class: "text-sm text-hive-muted-foreground" },
              `@${props.username} \u2022 Rep: ${reputation.value}`
            ),
          ]),
        ]),
      ];

      if (props.showStats) {
        default_children.push(
          h("div", { class: "mt-3 flex gap-4 text-sm" }, [
            h("span", {}, `${acc.post_count} posts`),
            h("span", {}, acc.hive_power),
          ])
        );
      }

      return h(
        "div",
        {
          class: cn(
            "rounded-lg border border-hive-border bg-hive-card p-4",
            props.class
          ),
        },
        default_children
      );
    };
  },
});
