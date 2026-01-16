"use client";

import { useState } from "react";
import { VolumeX, Bell, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MuteButtonProps {
  username: string;
  initialMuted?: boolean;
  onMute?: (muted: boolean) => void;
  className?: string;
}

export function HiveMuteButton({
  username,
  initialMuted = false,
  onMute,
  className,
}: MuteButtonProps) {
  const [muted, setMuted] = useState(initialMuted);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    const newState = !muted;
    setMuted(newState);
    onMute?.(newState);
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
        muted
          ? "bg-orange-500/10 text-orange-500"
          : "bg-muted text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : muted ? (
        <>
          <VolumeX className="h-4 w-4" />
          Muted
        </>
      ) : (
        <>
          <Bell className="h-4 w-4" />
          Mute
        </>
      )}
    </button>
  );
}
