"use client";

import { cn } from "@/lib/utils";

interface AvatarProps {
  username: string;
  size?: "sm" | "md" | "lg" | "xl";
  showReputation?: boolean;
  reputation?: number;
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
};

export function Avatar({
  username,
  size = "md",
  showReputation = false,
  reputation,
  className,
}: AvatarProps) {
  return (
    <div className={cn("relative inline-block", className)}>
      <img
        src={`https://images.hive.blog/u/${username}/avatar`}
        alt={username}
        className={cn(
          sizeClasses[size],
          "rounded-full object-cover ring-2 ring-border"
        )}
      />
      {showReputation && reputation !== undefined && (
        <div className="absolute -bottom-1 -right-1 rounded-full bg-hive-red px-1.5 py-0.5 text-[10px] font-bold text-white">
          {reputation}
        </div>
      )}
    </div>
  );
}
