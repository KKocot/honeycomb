"use client";

import { cn } from "@/lib/utils";

interface Badge {
  name: string;
  color: string;
  icon?: string;
}

interface BadgeListProps {
  badges: Badge[];
  className?: string;
}

const defaultBadges: Badge[] = [
  { name: "Whale", color: "bg-blue-500", icon: "🐋" },
  { name: "Witness", color: "bg-purple-500", icon: "👁️" },
  { name: "Developer", color: "bg-green-500", icon: "💻" },
  { name: "Curator", color: "bg-orange-500", icon: "✨" },
];

export function BadgeList({ badges = defaultBadges, className }: BadgeListProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {badges.map((badge) => (
        <span
          key={badge.name}
          className={cn(
            "flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium text-white",
            badge.color
          )}
        >
          {badge.icon && <span>{badge.icon}</span>}
          {badge.name}
        </span>
      ))}
    </div>
  );
}
