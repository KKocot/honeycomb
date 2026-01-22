"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { VolumeX, Volume2, Loader2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHive } from "@/contexts/hive-context";
import { useToast } from "@/components/ui/toast";
import { useBroadcast } from "@/hooks/use-broadcast";
import { LoginPromptDialog } from "./login-prompt-dialog";
import { ConfirmActionDialog } from "./confirm-action-dialog";
import { WifKeyDialog } from "./wif-key-dialog";
import { HBAuthPasswordDialog } from "./hbauth-password-dialog";

interface MuteButtonProps {
  username: string;
  onMute?: (muted: boolean) => void;
  className?: string;
  /** Show status indicator badge */
  showStatus?: boolean;
}

export function HiveMuteButton({
  username,
  onMute,
  className,
  showStatus = true,
}: MuteButtonProps) {
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

  const [isMuted, setIsMuted] = useState<boolean | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showConfirmMute, setShowConfirmMute] = useState(false);
  const [showConfirmUnmute, setShowConfirmUnmute] = useState(false);

  // Track when last successful transaction occurred to prevent API from overriding optimistic update
  const lastSuccessfulTxTimeRef = useRef<number>(0);
  const OPTIMISTIC_GRACE_PERIOD = 10000; // 10s grace period after successful tx

  // Check if logged user has muted target username
  const checkMuteStatus = useCallback(async (force = false) => {
    if (!chain || !user) {
      setIsMuted(null);
      return;
    }

    // Don't check if user is trying to mute themselves
    if (user.username === username) {
      setIsMuted(null);
      return;
    }

    // Skip API check if within grace period after successful transaction (unless forced)
    const timeSinceLastTx = Date.now() - lastSuccessfulTxTimeRef.current;
    if (!force && timeSinceLastTx < OPTIMISTIC_GRACE_PERIOD) {
      console.log("[MuteButton] Skipping API check - within grace period after tx");
      return;
    }

    setCheckingStatus(true);
    try {
      // Use bridge.get_relationship_between_accounts for accurate mute status
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
      const isCurrentlyMuted = data.result?.ignores === true;

      // Only update if not within grace period
      const currentTimeSinceTx = Date.now() - lastSuccessfulTxTimeRef.current;
      if (currentTimeSinceTx >= OPTIMISTIC_GRACE_PERIOD) {
        setIsMuted(isCurrentlyMuted);
      } else {
        console.log("[MuteButton] API returned but still in grace period, keeping optimistic state");
      }
    } catch (error) {
      console.error("Failed to check mute status:", error);
      toast.error("Failed to check mute status", String(error));
      // Only set to false if not in grace period
      if (Date.now() - lastSuccessfulTxTimeRef.current >= OPTIMISTIC_GRACE_PERIOD) {
        setIsMuted(false);
      }
    } finally {
      setCheckingStatus(false);
    }
  }, [chain, user, username, toast]);

  useEffect(() => {
    checkMuteStatus();
  }, [checkMuteStatus]);

  const handleMuteClick = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    // Show confirmation dialog before action
    setShowConfirmMute(true);
  };

  const handleUnmuteClick = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    // Show confirmation dialog before action
    setShowConfirmUnmute(true);
  };

  const executeMute = async () => {
    if (!user) return;

    // Close dialog and apply optimistic update
    setShowConfirmMute(false);
    const previousState = isMuted;
    setIsMuted(true);

    try {
      // Build mute operation as custom_json (what: ["ignore"])
      const muteJson = JSON.stringify([
        "follow",
        {
          follower: user.username,
          following: username,
          what: ["ignore"],
        },
      ]);

      const operations = [
        [
          "custom_json",
          {
            required_auths: [],
            required_posting_auths: [user.username],
            id: "follow",
            json: muteJson,
          },
        ],
      ];

      const result = await broadcast(operations as [string, Record<string, unknown>][]);

      if (result.success) {
        toast.success("Muted!", `You have muted @${username}${result.txId ? ` (tx: ${result.txId.slice(0, 8)}...)` : ""}`);
        // Transaction confirmed on blockchain - update state and set grace period
        lastSuccessfulTxTimeRef.current = Date.now();
        setIsMuted(true);
        onMute?.(true);

        // Refetch status from blockchain after grace period to confirm
        setTimeout(async () => {
          await checkMuteStatus(true); // force check after grace period
        }, OPTIMISTIC_GRACE_PERIOD + 1000);
      } else {
        // Revert optimistic update on failure
        setIsMuted(previousState);
        toast.error("Mute failed", result.error || "Transaction was not broadcast");
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsMuted(previousState);
      console.error("Mute failed:", error);
      toast.error("Mute failed", String(error));
    }
  };

  const executeUnmute = async () => {
    if (!user) return;

    // Close dialog and apply optimistic update
    setShowConfirmUnmute(false);
    const previousState = isMuted;
    setIsMuted(false);

    try {
      // Build unmute operation as custom_json (empty what array = unmute)
      const unmuteJson = JSON.stringify([
        "follow",
        {
          follower: user.username,
          following: username,
          what: [], // Empty array = unmute/unfollow
        },
      ]);

      const operations = [
        [
          "custom_json",
          {
            required_auths: [],
            required_posting_auths: [user.username],
            id: "follow",
            json: unmuteJson,
          },
        ],
      ];

      const result = await broadcast(operations as [string, Record<string, unknown>][]);

      if (result.success) {
        toast.success("Unmuted!", `You have unmuted @${username}${result.txId ? ` (tx: ${result.txId.slice(0, 8)}...)` : ""}`);
        // Transaction confirmed on blockchain - update state and set grace period
        lastSuccessfulTxTimeRef.current = Date.now();
        setIsMuted(false);
        onMute?.(false);

        // Refetch status from blockchain after grace period to confirm
        setTimeout(async () => {
          await checkMuteStatus(true); // force check after grace period
        }, OPTIMISTIC_GRACE_PERIOD + 1000);
      } else {
        // Revert optimistic update on failure
        setIsMuted(previousState);
        toast.error("Unmute failed", result.error || "Transaction was not broadcast");
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsMuted(previousState);
      console.error("Unmute failed:", error);
      toast.error("Unmute failed", String(error));
    }
  };

  // Don't show buttons if trying to mute yourself
  if (user && user.username === username) {
    return null;
  }

  const isDisabledMute = checkingStatus || isBroadcasting || isMuted === true;
  const isDisabledUnmute = checkingStatus || isBroadcasting || isMuted === false || isMuted === null;

  return (
    <>
      <div className={cn("space-y-3", className)} data-testid="mute-button-container">
        {/* Status Badge */}
        {showStatus && user && (
          <div className="flex items-center gap-2 text-sm" data-testid="mute-status">
            {checkingStatus ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground" data-testid="mute-status-checking">
                  Checking mute status...
                </span>
              </>
            ) : isMuted === true ? (
              <>
                <VolumeX className="h-4 w-4 text-orange-500" />
                <span className="text-orange-500" data-testid="mute-status-muted">
                  @{username} is muted
                </span>
              </>
            ) : isMuted === false ? (
              <>
                <Circle className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground" data-testid="mute-status-not-muted">
                  @{username} is not muted
                </span>
              </>
            ) : null}
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Mute Button */}
          <button
            onClick={handleMuteClick}
            disabled={isDisabledMute}
            data-testid="mute-btn"
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              isMuted === true
                ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                : "bg-orange-500 text-white hover:bg-orange-500/90",
              isDisabledMute && isMuted !== true && "opacity-70"
            )}
          >
            {isBroadcasting && isMuted !== true ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
            Mute
          </button>

          {/* Unmute Button */}
          <button
            onClick={handleUnmuteClick}
            disabled={isDisabledUnmute}
            data-testid="unmute-btn"
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              isMuted === false || isMuted === null
                ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                : "bg-muted text-foreground hover:bg-green-500/10 hover:text-green-500",
              isDisabledUnmute && isMuted === true && "opacity-70"
            )}
          >
            {isBroadcasting && isMuted === true ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
            Unmute
          </button>
        </div>
      </div>

      <LoginPromptDialog
        open={showLoginPrompt}
        onOpenChange={setShowLoginPrompt}
        action={`mute @${username}`}
      />

      <ConfirmActionDialog
        open={showConfirmMute}
        onOpenChange={setShowConfirmMute}
        title="Confirm Mute"
        description="This will broadcast a transaction to the Hive blockchain. Muted users' content will be hidden from your feed."
        details={[
          { label: "Action", value: "Mute" },
          { label: "Account", value: `@${username}` },
          { label: "Signed by", value: `@${user?.username || ""}` },
          { label: "Key required", value: "Posting" },
        ]}
        confirmLabel="Mute"
        variant="warning"
        onConfirm={executeMute}
      />

      <ConfirmActionDialog
        open={showConfirmUnmute}
        onOpenChange={setShowConfirmUnmute}
        title="Confirm Unmute"
        description="This will broadcast a transaction to the Hive blockchain."
        details={[
          { label: "Action", value: "Unmute" },
          { label: "Account", value: `@${username}` },
          { label: "Signed by", value: `@${user?.username || ""}` },
          { label: "Key required", value: "Posting" },
        ]}
        confirmLabel="Unmute"
        onConfirm={executeUnmute}
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
          console.log("[HiveMuteButton] WIF key submitted");
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
          console.log("[HiveMuteButton] HB-Auth password submitted");
          setHBAuthPassword(password);
          confirmWithHBAuthPassword();
        }}
        onCancel={cancelHBAuthPasswordPrompt}
        isLoading={isBroadcasting}
      />
    </>
  );
}
