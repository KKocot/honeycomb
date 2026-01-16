"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoteButtonProps {
  initialVotes?: number;
  initialVote?: "up" | "down" | null;
  onVote?: (vote: "up" | "down" | null, weight: number) => void;
  className?: string;
}

export function HiveVoteButton({
  initialVotes = 0,
  initialVote = null,
  onVote,
  className,
}: VoteButtonProps) {
  const [votes, setVotes] = useState(initialVotes);
  const [voted, setVoted] = useState<"up" | "down" | null>(initialVote);
  const [showSlider, setShowSlider] = useState(false);
  const [weight, setWeight] = useState(100);
  const [loading, setLoading] = useState(false);

  const handleVote = async (type: "up" | "down") => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));

    if (voted === type) {
      setVoted(null);
      setVotes((v) => (type === "up" ? v - 1 : v + 1));
      onVote?.(null, 0);
    } else {
      const diff = voted === null ? 1 : 2;
      setVotes((v) => (type === "up" ? v + diff : v - diff));
      setVoted(type);
      onVote?.(type, weight);
    }
    setLoading(false);
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleVote("up")}
          onContextMenu={(e) => {
            e.preventDefault();
            setShowSlider(!showSlider);
          }}
          disabled={loading}
          className={cn(
            "flex items-center gap-1 rounded-lg px-3 py-2 transition-colors",
            voted === "up"
              ? "bg-green-500 text-white"
              : "bg-muted hover:bg-muted/80"
          )}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ThumbsUp className="h-4 w-4" />
          )}
          <span className="font-medium">{votes}</span>
        </button>

        <button
          onClick={() => handleVote("down")}
          disabled={loading}
          className={cn(
            "rounded-lg p-2 transition-colors",
            voted === "down"
              ? "bg-red-500 text-white"
              : "bg-muted hover:bg-muted/80"
          )}
        >
          <ThumbsDown className="h-4 w-4" />
        </button>
      </div>

      {showSlider && (
        <div className="flex items-center gap-2 rounded-lg bg-muted p-2">
          <input
            type="range"
            min="1"
            max="100"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="w-32"
          />
          <span className="w-12 text-sm font-medium">{weight}%</span>
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Right-click to adjust vote weight
      </p>
    </div>
  );
}
