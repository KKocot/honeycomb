"use client";

import { useState } from "react";
import { cn } from "./utils";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface HiveAvatarProps {
  /** Hive username */
  username: string;
  /** Avatar size */
  size?: AvatarSize;
  /** Additional CSS classes */
  className?: string;
  /** Show ring border */
  showBorder?: boolean;
  /** Custom fallback background color */
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

/**
 * Generate a consistent color from username
 */
function generateColorFromUsername(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 50%)`;
}

/**
 * HiveAvatar Component
 *
 * Display Hive user profile pictures with automatic fallback to initials.
 * SSR-compatible - renders safely on server.
 *
 * @example
 * ```tsx
 * <HiveAvatar username="blocktrades" size="lg" />
 * ```
 */
export function HiveAvatar({
  username,
  size = "md",
  className,
  showBorder = false,
  fallbackColor,
}: HiveAvatarProps) {
  const safe_username = username || "?";
  const [hasError, setHasError] = useState(false);

  const initials = safe_username.slice(0, 2).toUpperCase();
  const imageUrl = `https://images.hive.blog/u/${safe_username}/avatar`;
  const backgroundColor = fallbackColor || generateColorFromUsername(safe_username);

  const baseClasses = cn(
    sizeClasses[size],
    "rounded-full",
    showBorder && "ring-2 ring-border",
    className
  );

  if (hasError) {
    return (
      <div
        className={cn(
          baseClasses,
          "flex items-center justify-center text-white font-medium"
        )}
        style={{ backgroundColor }}
        title={`@${safe_username}`}
        role="img"
        aria-label={`Avatar of @${safe_username}`}
      >
        <span className={textSizeClasses[size]}>{initials}</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={`@${safe_username}`}
      title={`@${safe_username}`}
      onError={() => setHasError(true)}
      className={cn(baseClasses, "object-cover")}
    />
  );
}
