"use client";

import { useState } from "react";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  username: string;
  initialFollowing?: boolean;
  onFollow?: (following: boolean) => void;
  className?: string;
}

export function HiveFollowButton({
  username,
  initialFollowing = false,
  onFollow,
  className,
}: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 500));
    const newState = !following;
    setFollowing(newState);
    onFollow?.(newState);
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
        following
          ? "bg-muted text-foreground hover:bg-red-500/10 hover:text-red-500"
          : "bg-hive-red text-white hover:bg-hive-red/90",
        className
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : following ? (
        <>
          <UserMinus className="h-4 w-4" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          Follow
        </>
      )}
    </button>
  );
}
