"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { UserPlus, UserMinus, Loader2, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHive } from "@/contexts/hive-context";
import { useToast } from "@/components/ui/toast";
import { useBroadcast } from "@/hooks/use-broadcast";
import { LoginPromptDialog } from "./login-prompt-dialog";
import { ConfirmActionDialog } from "./confirm-action-dialog";
import { WifKeyDialog } from "./wif-key-dialog";
import { HBAuthPasswordDialog } from "./hbauth-password-dialog";

interface FollowButtonProps {
  username: string;
  onFollow?: (following: boolean) => void;
  className?: string;
  /** Show status indicator badge */
  showStatus?: boolean;
}

export function HiveFollowButton({
  username,
  onFollow,
  className,
  showStatus = true,
}: FollowButtonProps) {
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

  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showConfirmFollow, setShowConfirmFollow] = useState(false);
  const [showConfirmUnfollow, setShowConfirmUnfollow] = useState(false);

  // Track when last successful transaction occurred to prevent API from overriding optimistic update
  const lastSuccessfulTxTimeRef = useRef<number>(0);
  const OPTIMISTIC_GRACE_PERIOD = 10000; // 10s grace period after successful tx

  // Check if logged user is following target username
  const checkFollowStatus = useCallback(async (force = false) => {
    if (!chain || !user) {
      setIsFollowing(null);
      return;
    }

    // Don't check if user is trying to follow themselves
    if (user.username === username) {
      setIsFollowing(null);
      return;
    }

    // Skip API check if within grace period after successful transaction (unless forced)
    const timeSinceLastTx = Date.now() - lastSuccessfulTxTimeRef.current;
    if (!force && timeSinceLastTx < OPTIMISTIC_GRACE_PERIOD) {
      console.log("[FollowButton] Skipping API check - within grace period after tx");
      return;
    }

    setCheckingStatus(true);
    try {
      // Use bridge.get_relationship_between_accounts for accurate follow status
      const response = await fetch("https://api.openhive.network", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "bridge.get_relationship_between_accounts",
          params: [user.username, username],
          id: 1,
        }),
      });

      const data = await response.json();
      // Response: { follows: boolean, ignores: boolean, blacklists: boolean, follows_blacklists: boolean }
      const isCurrentlyFollowing = data.result?.follows === true;

      // Only update if not within grace period
      const currentTimeSinceTx = Date.now() - lastSuccessfulTxTimeRef.current;
      if (currentTimeSinceTx >= OPTIMISTIC_GRACE_PERIOD) {
        setIsFollowing(isCurrentlyFollowing);
      } else {
        console.log("[FollowButton] API returned but still in grace period, keeping optimistic state");
      }
    } catch (error) {
      console.error("Failed to check follow status:", error);
      toast.error("Failed to check follow status", String(error));
      // Only set to false if not in grace period
      if (Date.now() - lastSuccessfulTxTimeRef.current >= OPTIMISTIC_GRACE_PERIOD) {
        setIsFollowing(false);
      }
    } finally {
      setCheckingStatus(false);
    }
  }, [chain, user, username, toast]);

  useEffect(() => {
    checkFollowStatus();
  }, [checkFollowStatus]);

  const handleFollowClick = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    // Show confirmation dialog before action
    setShowConfirmFollow(true);
  };

  const handleUnfollowClick = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    // Show confirmation dialog before action
    setShowConfirmUnfollow(true);
  };

  const executeFollow = async () => {
    if (!user) return;

    // Close dialog and apply optimistic update
    setShowConfirmFollow(false);
    const previousState = isFollowing;
    setIsFollowing(true);

    try {
      // Build follow operation as custom_json
      const followJson = JSON.stringify([
        "follow",
        {
          follower: user.username,
          following: username,
          what: ["blog"],
        },
      ]);

      const operations = [
        [
          "custom_json",
          {
            required_auths: [],
            required_posting_auths: [user.username],
            id: "follow",
            json: followJson,
          },
        ],
      ];

      const result = await broadcast(operations as [string, Record<string, unknown>][]);

      if (result.success) {
        toast.success("Followed!", `You are now following @${username}${result.txId ? ` (tx: ${result.txId.slice(0, 8)}...)` : ""}`);
        // Transaction confirmed on blockchain - update state and set grace period
        lastSuccessfulTxTimeRef.current = Date.now();
        setIsFollowing(true);
        onFollow?.(true);

        // Refetch status from blockchain after grace period to confirm
        setTimeout(async () => {
          await checkFollowStatus(true); // force check after grace period
        }, OPTIMISTIC_GRACE_PERIOD + 1000);
      } else {
        // Revert optimistic update on failure
        setIsFollowing(previousState);
        toast.error("Follow failed", result.error || "Transaction was not broadcast");
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsFollowing(previousState);
      console.error("Follow failed:", error);
      toast.error("Follow failed", String(error));
    }
  };

  const executeUnfollow = async () => {
    if (!user) return;

    // Close dialog and apply optimistic update
    setShowConfirmUnfollow(false);
    const previousState = isFollowing;
    setIsFollowing(false);

    try {
      // Build unfollow operation as custom_json (empty what array = unfollow)
      const unfollowJson = JSON.stringify([
        "follow",
        {
          follower: user.username,
          following: username,
          what: [], // Empty array = unfollow
        },
      ]);

      const operations = [
        [
          "custom_json",
          {
            required_auths: [],
            required_posting_auths: [user.username],
            id: "follow",
            json: unfollowJson,
          },
        ],
      ];

      const result = await broadcast(operations as [string, Record<string, unknown>][]);

      if (result.success) {
        toast.success("Unfollowed!", `You unfollowed @${username}${result.txId ? ` (tx: ${result.txId.slice(0, 8)}...)` : ""}`);
        // Transaction confirmed on blockchain - update state and set grace period
        lastSuccessfulTxTimeRef.current = Date.now();
        setIsFollowing(false);
        onFollow?.(false);

        // Refetch status from blockchain after grace period to confirm
        setTimeout(async () => {
          await checkFollowStatus(true); // force check after grace period
        }, OPTIMISTIC_GRACE_PERIOD + 1000);
      } else {
        // Revert optimistic update on failure
        setIsFollowing(previousState);
        toast.error("Unfollow failed", result.error || "Transaction was not broadcast");
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsFollowing(previousState);
      console.error("Unfollow failed:", error);
      toast.error("Unfollow failed", String(error));
    }
  };

  // Don't show buttons if trying to follow yourself
  if (user && user.username === username) {
    return null;
  }

  const isDisabledFollow = checkingStatus || isBroadcasting || isFollowing === true;
  const isDisabledUnfollow = checkingStatus || isBroadcasting || isFollowing === false || isFollowing === null;

  return (
    <>
      <div className={cn("space-y-3", className)} data-testid="follow-button-container">
        {/* Status Badge */}
        {showStatus && user && (
          <div className="flex items-center gap-2 text-sm" data-testid="follow-status">
            {checkingStatus ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground" data-testid="follow-status-checking">
                  Checking follow status...
                </span>
              </>
            ) : isFollowing === true ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-green-500" data-testid="follow-status-following">
                  You follow @{username}
                </span>
              </>
            ) : isFollowing === false ? (
              <>
                <Circle className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground" data-testid="follow-status-not-following">
                  Not following @{username}
                </span>
              </>
            ) : null}
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Follow Button */}
          <button
            onClick={handleFollowClick}
            disabled={isDisabledFollow}
            data-testid="follow-btn"
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              isFollowing === true
                ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                : "bg-hive-red text-white hover:bg-hive-red/90",
              isDisabledFollow && isFollowing !== true && "opacity-70"
            )}
          >
            {isBroadcasting && isFollowing !== true ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            Follow
          </button>

          {/* Unfollow Button */}
          <button
            onClick={handleUnfollowClick}
            disabled={isDisabledUnfollow}
            data-testid="unfollow-btn"
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              isFollowing === false || isFollowing === null
                ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                : "bg-muted text-foreground hover:bg-red-500/10 hover:text-red-500",
              isDisabledUnfollow && isFollowing === true && "opacity-70"
            )}
          >
            {isBroadcasting && isFollowing === true ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserMinus className="h-4 w-4" />
            )}
            Unfollow
          </button>
        </div>
      </div>

      <LoginPromptDialog
        open={showLoginPrompt}
        onOpenChange={setShowLoginPrompt}
        action={`follow @${username}`}
      />

      <ConfirmActionDialog
        open={showConfirmFollow}
        onOpenChange={setShowConfirmFollow}
        title="Confirm Follow"
        description="This will broadcast a transaction to the Hive blockchain."
        details={[
          { label: "Action", value: "Follow" },
          { label: "Account", value: `@${username}` },
          { label: "Signed by", value: `@${user?.username || ""}` },
          { label: "Key required", value: "Posting" },
        ]}
        confirmLabel="Follow"
        onConfirm={executeFollow}
      />

      <ConfirmActionDialog
        open={showConfirmUnfollow}
        onOpenChange={setShowConfirmUnfollow}
        title="Confirm Unfollow"
        description="This will broadcast a transaction to the Hive blockchain."
        details={[
          { label: "Action", value: "Unfollow" },
          { label: "Account", value: `@${username}` },
          { label: "Signed by", value: `@${user?.username || ""}` },
          { label: "Key required", value: "Posting" },
        ]}
        confirmLabel="Unfollow"
        variant="warning"
        onConfirm={executeUnfollow}
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
          console.log("[HiveFollowButton] WIF key submitted");
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
          console.log("[HiveFollowButton] HB-Auth password submitted");
          setHBAuthPassword(password);
          confirmWithHBAuthPassword();
        }}
        onCancel={cancelHBAuthPasswordPrompt}
        isLoading={isBroadcasting}
      />
    </>
  );
}
