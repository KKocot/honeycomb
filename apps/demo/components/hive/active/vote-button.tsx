"use client";

import { useState, useEffect, useCallback } from "react";
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHive } from "@/contexts/hive-context";
import { useToast } from "@/components/ui/toast";
import { useBroadcast } from "@/hooks/use-broadcast";
import { LoginPromptDialog } from "./login-prompt-dialog";
import { ConfirmActionDialog } from "./confirm-action-dialog";
import { WifKeyDialog } from "./wif-key-dialog";
import { HBAuthPasswordDialog } from "./hbauth-password-dialog";

interface VoteButtonProps {
  author: string;
  permlink: string;
  onVote?: (vote: "up" | "down" | null, weight: number) => void;
  className?: string;
}

export function HiveVoteButton({
  author,
  permlink,
  onVote,
  className,
}: VoteButtonProps) {
  const { chain, user } = useHive();
  const toast = useToast();
  const {
    broadcast,
    isLoading: isBroadcasting,
    needsWifKey,
    setWifKey,
    confirmWithWifKey,
    cancelWifKeyPrompt,
    needsHBAuthPassword,
    setHBAuthPassword,
    confirmWithHBAuthPassword,
    cancelHBAuthPasswordPrompt,
  } = useBroadcast({ keyType: "posting", observe: true });

  const [votes, setVotes] = useState(0);
  const [payout, setPayout] = useState("0.00");
  const [voted, setVoted] = useState<"up" | "down" | null>(null);
  const [showSlider, setShowSlider] = useState(false);
  const [weight, setWeight] = useState(100);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showConfirmUpvote, setShowConfirmUpvote] = useState(false);
  const [showConfirmDownvote, setShowConfirmDownvote] = useState(false);

  // Fetch post data and check vote status
  const fetchPostData = useCallback(async () => {
    if (!chain) return;

    console.log("[HiveVoteButton] Fetching post data for:", author, permlink);
    setCheckingStatus(true);
    try {
      const response = await fetch("https://api.openhive.network", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "condenser_api.get_content",
          params: [author, permlink],
          id: 1,
        }),
      });

      const data = await response.json();
      const content = data.result;

      if (content && content.author) {
        setVotes(content.net_votes || 0);

        const pendingPayout = parseFloat(content.pending_payout_value?.split(" ")[0] || "0");
        const authorPayout = parseFloat(content.total_payout_value?.split(" ")[0] || "0");
        const curatorPayout = parseFloat(content.curator_payout_value?.split(" ")[0] || "0");
        const totalPayout = pendingPayout + authorPayout + curatorPayout;
        setPayout(totalPayout.toFixed(2));

        // Check if current user voted
        if (user && content.active_votes) {
          const foundVote = content.active_votes.find(
            (v: { voter: string; percent: number }) => v.voter === user.username
          );
          if (foundVote) {
            const voteType = foundVote.percent > 0 ? "up" : foundVote.percent < 0 ? "down" : null;
            console.log("[HiveVoteButton] Found user vote:", voteType, "percent:", foundVote.percent);
            setVoted(voteType);
          } else {
            console.log("[HiveVoteButton] No user vote found");
            setVoted(null);
          }
        }
      }
    } catch (error) {
      console.error("[HiveVoteButton] Failed to fetch post data:", error);
      toast.error("Failed to load post", String(error));
    } finally {
      setCheckingStatus(false);
    }
  }, [chain, author, permlink, user, toast]);

  useEffect(() => {
    fetchPostData();
  }, [fetchPostData]);

  const handleVoteClick = (type: "up" | "down") => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    // Show confirmation dialog
    if (type === "up") {
      setShowConfirmUpvote(true);
    } else {
      setShowConfirmDownvote(true);
    }
  };

  const executeVote = async (type: "up" | "down") => {
    if (!user) return;

    // Close dialog
    setShowConfirmUpvote(false);
    setShowConfirmDownvote(false);

    // Calculate weight for vote operation (positive for upvote, negative for downvote)
    // If already voted same way, weight 0 = remove vote
    const isRemovingVote = voted === type;
    const voteWeight = isRemovingVote ? 0 : (type === "up" ? weight * 100 : -weight * 100);

    console.log("[HiveVoteButton] Executing vote:", {
      type,
      isRemovingVote,
      voteWeight,
      author,
      permlink,
      voter: user.username,
    });

    // Optimistic update
    const previousVoted = voted;
    const previousVotes = votes;

    if (isRemovingVote) {
      setVoted(null);
      setVotes((v) => (type === "up" ? v - 1 : v + 1));
    } else {
      const diff = voted === null ? 1 : 2;
      setVotes((v) => (type === "up" ? v + diff : v - diff));
      setVoted(type);
    }

    try {
      // Build vote operation
      const operations: [string, Record<string, unknown>][] = [
        [
          "vote",
          {
            voter: user.username,
            author,
            permlink,
            weight: voteWeight,
          },
        ],
      ];

      console.log("[HiveVoteButton] Broadcasting vote operation:", operations);

      const result = await broadcast(operations);

      if (result.success) {
        console.log("[HiveVoteButton] Vote successful:", result.txId);
        const actionText = isRemovingVote
          ? "Vote removed"
          : (type === "up" ? "Upvoted" : "Downvoted");
        toast.success(
          `${actionText}!`,
          `@${author}/${permlink.slice(0, 20)}...${result.txId ? ` (tx: ${result.txId.slice(0, 8)}...)` : ""}`
        );
        onVote?.(isRemovingVote ? null : type, voteWeight);

        // Refetch data from blockchain after short delay
        setTimeout(async () => {
          console.log("[HiveVoteButton] Refetching post data after vote...");
          await fetchPostData();
        }, 4000);
      } else {
        // Revert optimistic update
        console.error("[HiveVoteButton] Vote failed:", result.error);
        setVoted(previousVoted);
        setVotes(previousVotes);
        toast.error("Vote failed", result.error || "Transaction was not broadcast");
      }
    } catch (error) {
      // Revert optimistic update
      console.error("[HiveVoteButton] Vote error:", error);
      setVoted(previousVoted);
      setVotes(previousVotes);
      toast.error("Vote failed", String(error));
    }
  };

  const isDisabled = checkingStatus || isBroadcasting;

  return (
    <>
      <div className={cn("flex flex-col items-center gap-3", className)}>
        <div className="flex items-center gap-2">
          {/* Upvote Button */}
          <button
            onClick={() => handleVoteClick("up")}
            onContextMenu={(e) => {
              e.preventDefault();
              if (user) {
                setShowSlider(!showSlider);
              } else {
                setShowLoginPrompt(true);
              }
            }}
            disabled={isDisabled}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-4 py-2 transition-colors",
              voted === "up"
                ? "bg-green-500 text-white"
                : "bg-muted hover:bg-green-500/20 hover:text-green-500",
              isDisabled && "opacity-70"
            )}
          >
            {isBroadcasting && voted !== "down" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ThumbsUp className={cn("h-4 w-4", voted === "up" && "fill-current")} />
            )}
            <span className="font-medium">{votes}</span>
          </button>

          {/* Downvote Button */}
          <button
            onClick={() => handleVoteClick("down")}
            disabled={isDisabled}
            className={cn(
              "rounded-lg p-2 transition-colors",
              voted === "down"
                ? "bg-red-500 text-white"
                : "bg-muted hover:bg-red-500/20 hover:text-red-500",
              isDisabled && "opacity-70"
            )}
          >
            {isBroadcasting && voted === "down" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ThumbsDown className={cn("h-4 w-4", voted === "down" && "fill-current")} />
            )}
          </button>

          {/* Payout Display */}
          <span className="text-sm font-semibold text-green-500 ml-1">
            ${payout}
          </span>

          {checkingStatus && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>

        {/* Vote Weight Slider */}
        {showSlider && user && (
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

        <p className="text-xs text-muted-foreground text-center">
          {voted === "up" ? (
            <span className="text-green-500">You upvoted this post</span>
          ) : voted === "down" ? (
            <span className="text-red-500">You downvoted this post</span>
          ) : (
            "Right-click for vote weight"
          )}
        </p>
      </div>

      <LoginPromptDialog
        open={showLoginPrompt}
        onOpenChange={setShowLoginPrompt}
        action="vote on this post"
      />

      <ConfirmActionDialog
        open={showConfirmUpvote}
        onOpenChange={setShowConfirmUpvote}
        title={voted === "up" ? "Remove Upvote" : "Confirm Upvote"}
        description="This will broadcast a vote transaction to the Hive blockchain."
        details={[
          { label: "Action", value: voted === "up" ? "Remove vote" : "Upvote" },
          { label: "Post", value: `@${author}/${permlink.slice(0, 20)}...` },
          { label: "Weight", value: voted === "up" ? "0%" : `${weight}%` },
          { label: "Signed by", value: `@${user?.username || ""}` },
          { label: "Key required", value: "Posting" },
        ]}
        confirmLabel={voted === "up" ? "Remove Vote" : "Upvote"}
        onConfirm={() => executeVote("up")}
      />

      <ConfirmActionDialog
        open={showConfirmDownvote}
        onOpenChange={setShowConfirmDownvote}
        title={voted === "down" ? "Remove Downvote" : "Confirm Downvote"}
        description="This will broadcast a vote transaction to the Hive blockchain."
        details={[
          { label: "Action", value: voted === "down" ? "Remove vote" : "Downvote" },
          { label: "Post", value: `@${author}/${permlink.slice(0, 20)}...` },
          { label: "Weight", value: voted === "down" ? "0%" : `-${weight}%` },
          { label: "Signed by", value: `@${user?.username || ""}` },
          { label: "Key required", value: "Posting" },
        ]}
        confirmLabel={voted === "down" ? "Remove Vote" : "Downvote"}
        variant="warning"
        onConfirm={() => executeVote("down")}
      />

      {/* WIF Key Dialog - shown when WIF login needs key */}
      <WifKeyDialog
        open={needsWifKey}
        onOpenChange={(open) => {
          if (!open) cancelWifKeyPrompt();
        }}
        username={user?.username || ""}
        keyType="posting"
        onSubmit={(wif) => {
          console.log("[HiveVoteButton] WIF key submitted");
          setWifKey(wif);
          confirmWithWifKey();
        }}
        onCancel={cancelWifKeyPrompt}
        isLoading={isBroadcasting}
      />

      {/* HB-Auth Password Dialog - shown when HB-Auth login needs password to unlock */}
      <HBAuthPasswordDialog
        open={needsHBAuthPassword}
        onOpenChange={(open) => {
          if (!open) cancelHBAuthPasswordPrompt();
        }}
        username={user?.username || ""}
        keyType="posting"
        onSubmit={(password) => {
          console.log("[HiveVoteButton] HB-Auth password submitted");
          setHBAuthPassword(password);
          confirmWithHBAuthPassword();
        }}
        onCancel={cancelHBAuthPasswordPrompt}
        isLoading={isBroadcasting}
      />
    </>
  );
}
