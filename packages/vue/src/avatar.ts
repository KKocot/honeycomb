import { defineComponent, ref, h, type PropType } from "vue";
import { cn } from "./utils.js";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface HiveAvatarProps {
  username: string;
  size?: AvatarSize;
  class?: string;
  showBorder?: boolean;
  fallbackColor?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: "h-6 w-6",
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

const textSizeClasses: Record<AvatarSize, string> = {
  xs: "text-[10px]",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};

function generate_color_from_username(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 50%)`;
}

export const HiveAvatar = defineComponent({
  name: "HiveAvatar",
  props: {
    username: {
      type: String,
      required: true,
    },
    size: {
      type: String as PropType<AvatarSize>,
      default: "md",
    },
    class: {
      type: String,
      default: undefined,
    },
    showBorder: {
      type: Boolean,
      default: false,
    },
    fallbackColor: {
      type: String,
      default: undefined,
    },
  },
  setup(props) {
    const has_error = ref(false);

    return () => {
      const safe_username = props.username || "?";
      const initials = safe_username.slice(0, 2).toUpperCase();
      const image_url = `https://images.hive.blog/u/${safe_username}/avatar`;
      const background_color =
        props.fallbackColor || generate_color_from_username(safe_username);

      const base_classes = cn(
        sizeClasses[props.size],
        "rounded-full",
        props.showBorder && "ring-2 ring-border",
        props.class
      );

      if (has_error.value) {
        return h(
          "div",
          {
            class: cn(
              base_classes,
              "flex items-center justify-center text-white font-medium"
            ),
            style: { backgroundColor: background_color },
            title: `@${safe_username}`,
            role: "img",
            "aria-label": `Avatar of @${safe_username}`,
          },
          [h("span", { class: textSizeClasses[props.size] }, initials)]
        );
      }

      return h("img", {
        src: image_url,
        alt: `@${safe_username}`,
        title: `@${safe_username}`,
        onError: () => {
          has_error.value = true;
        },
        class: cn(base_classes, "object-cover"),
      });
    };
  },
});
