"use client";

import { useState } from "react";
import { Repeat, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReblogButtonProps {
  author: string;
  permlink: string;
  initialReblogged?: boolean;
  onReblog?: (reblogged: boolean) => void;
  className?: string;
}

export function HiveReblogButton({
  author,
  permlink,
  initialReblogged = false,
  onReblog,
  className,
}: ReblogButtonProps) {
  const [reblogged, setReblogged] = useState(initialReblogged);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (reblogged) return; // Can't un-reblog
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    setReblogged(true);
    onReblog?.(true);
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading || reblogged}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
        reblogged
          ? "bg-green-500/10 text-green-500"
          : "bg-muted text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Repeat className={cn("h-4 w-4", reblogged && "fill-current")} />
      )}
      {reblogged ? "Reblogged" : "Reblog"}
    </button>
  );
}
