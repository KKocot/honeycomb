<script lang="ts" module>
  export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

  export interface HiveAvatarProps {
    /** Hive username */
    username: string;
    /** Avatar size */
    size?: AvatarSize;
    /** Additional CSS classes */
    class?: string;
    /** Show ring border */
    showBorder?: boolean;
    /** Custom fallback background color */
    fallbackColor?: string;
  }

  const SIZE_CLASSES: Record<AvatarSize, string> = {
    xs: "h-6 w-6",
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const TEXT_SIZE_CLASSES: Record<AvatarSize, string> = {
    xs: "text-[10px]",
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  /**
   * Generate a consistent color from username
   */
  function generate_color_from_username(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 50%)`;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";

  let {
    username,
    size = "md",
    class: class_name,
    showBorder = false,
    fallbackColor,
  }: HiveAvatarProps = $props();

  let has_error = $state(false);

  const safe_username = $derived(username || "?");
  const initials = $derived(safe_username.slice(0, 2).toUpperCase());
  const image_url = $derived(
    `https://images.hive.blog/u/${safe_username}/avatar`,
  );
  const background_color = $derived(
    fallbackColor || generate_color_from_username(safe_username),
  );

  const base_classes = $derived(
    cn(
      SIZE_CLASSES[size],
      "rounded-full",
      showBorder && "ring-2 ring-border",
      class_name,
    ),
  );
</script>

{#if has_error}
  <div
    class={cn(
      base_classes,
      "flex items-center justify-center text-white font-medium",
    )}
    style:background-color={background_color}
    title={`@${safe_username}`}
    role="img"
    aria-label={`Avatar of @${safe_username}`}
  >
    <span class={TEXT_SIZE_CLASSES[size]}>{initials}</span>
  </div>
{:else}
  <img
    src={image_url}
    alt={`@${safe_username}`}
    title={`@${safe_username}`}
    onerror={() => (has_error = true)}
    class={cn(base_classes, "object-cover")}
  />
{/if}
