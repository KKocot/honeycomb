"use client";

import { useState, useEffect, useCallback } from "react";
import { Repeat, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHive } from "@/contexts/hive-context";
import { useToast } from "@/components/ui/toast";
import { useBroadcast } from "@/hooks/use-broadcast";
import { LoginPromptDialog } from "./login-prompt-dialog";
import { ConfirmActionDialog } from "./confirm-action-dialog";
import { WifKeyDialog } from "./wif-key-dialog";
import { HBAuthPasswordDialog } from "./hbauth-password-dialog";

interface ReblogButtonProps {
  author: string;
  permlink: string;
  onReblog?: (reblogged: boolean) => void;
  className?: string;
}

export function HiveReblogButton({
  author,
  permlink,
  onReblog,
  className,
}: ReblogButtonProps) {
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

  const [reblogged, setReblogged] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showConfirmReblog, setShowConfirmReblog] = useState(false);

  // Check reblog status
  const checkReblogStatus = useCallback(async () => {
    if (!chain || !user || user.username === author) {
      setReblogged(false);
      return;
    }

    console.log("[HiveReblogButton] Checking reblog status for:", author, permlink);
    setCheckingStatus(true);
    try {
      const blogResponse = await fetch("https://api.openhive.network", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "condenser_api.get_blog_entries",
          params: [user.username, 0, 100],
          id: 1,
        }),
      });

      const blogResult = await blogResponse.json();
      if (blogResult.result) {
        const hasReblogged = blogResult.result.some(
          (entry: { author: string; permlink: string; reblog_on: string }) =>
            entry.author === author &&
            entry.permlink === permlink &&
            entry.reblog_on !== "1970-01-01T00:00:00"
        );
        console.log("[HiveReblogButton] Reblog status:", hasReblogged);
        setReblogged(hasReblogged);
      }
    } catch (error) {
      console.error("[HiveReblogButton] Failed to check reblog status:", error);
      toast.error("Failed to check reblog status", String(error));
      setReblogged(false);
    } finally {
      setCheckingStatus(false);
    }
  }, [chain, user, author, permlink, toast]);

  useEffect(() => {
    checkReblogStatus();
  }, [checkReblogStatus]);

  const handleReblogClick = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    if (reblogged || user.username === author) return;

    // Show confirmation dialog
    setShowConfirmReblog(true);
  };

  const executeReblog = async () => {
    if (!user) return;

    // Close dialog
    setShowConfirmReblog(false);

    console.log("[HiveReblogButton] Executing reblog:", {
      author,
      permlink,
      reblogger: user.username,
    });

    // Optimistic update
    const previousReblogged = reblogged;
    setReblogged(true);

    try {
      // Build reblog operation as custom_json
      const reblogJson = JSON.stringify([
        "reblog",
        {
          account: user.username,
          author,
          permlink,
        },
      ]);

      const operations: [string, Record<string, unknown>][] = [
        [
          "custom_json",
          {
            required_auths: [],
            required_posting_auths: [user.username],
            id: "follow",
            json: reblogJson,
          },
        ],
      ];

      console.log("[HiveReblogButton] Broadcasting reblog operation:", operations);

      const result = await broadcast(operations);

      if (result.success) {
        console.log("[HiveReblogButton] Reblog successful:", result.txId);
        toast.success(
          "Reblogged!",
          `@${author}/${permlink.slice(0, 20)}... shared to your blog${result.txId ? ` (tx: ${result.txId.slice(0, 8)}...)` : ""}`
        );
        setReblogged(true);
        onReblog?.(true);

        // Refetch status from blockchain after delay
        setTimeout(async () => {
          console.log("[HiveReblogButton] Refetching reblog status...");
          await checkReblogStatus();
        }, 4000);
      } else {
        // Revert optimistic update on failure
        console.error("[HiveReblogButton] Reblog failed:", result.error);
        setReblogged(previousReblogged);
        toast.error("Reblog failed", result.error || "Transaction was not broadcast");
      }
    } catch (error) {
      // Revert optimistic update on error
      console.error("[HiveReblogButton] Reblog error:", error);
      setReblogged(previousReblogged);
      toast.error("Reblog failed", String(error));
    }
  };

  // Can't reblog own post
  if (user && user.username === author) {
    return (
      <div className="text-xs text-muted-foreground text-center py-2">
        Can&apos;t reblog your own post
      </div>
    );
  }

  const isDisabled = checkingStatus || isBroadcasting || reblogged;

  return (
    <>
      <div className={cn("flex flex-col items-center gap-3", className)} data-testid="reblog-button-container">
        <button
          onClick={handleReblogClick}
          disabled={isDisabled}
          data-testid="reblog-btn"
          className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
            reblogged
              ? "bg-green-500/10 text-green-500 cursor-not-allowed"
              : "bg-muted text-muted-foreground hover:bg-green-500/20 hover:text-green-500",
            isDisabled && !reblogged && "opacity-70"
          )}
        >
          {isBroadcasting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Repeat className={cn("h-4 w-4", reblogged && "fill-current")} />
          )}
          {reblogged ? "Reblogged" : "Reblog"}
          {checkingStatus && (
            <Loader2 className="h-3 w-3 animate-spin ml-1" />
          )}
        </button>

        <p className="text-xs text-muted-foreground text-center" data-testid="reblog-status">
          {reblogged ? (
            <span className="text-green-500">You reblogged this post</span>
          ) : (
            "Share to your blog"
          )}
        </p>
      </div>

      <LoginPromptDialog
        open={showLoginPrompt}
        onOpenChange={setShowLoginPrompt}
        action="reblog this post"
      />

      <ConfirmActionDialog
        open={showConfirmReblog}
        onOpenChange={setShowConfirmReblog}
        title="Confirm Reblog"
        description="This will share the post to your blog. Reblogs cannot be undone."
        details={[
          { label: "Action", value: "Reblog" },
          { label: "Post", value: `@${author}/${permlink.slice(0, 20)}...` },
          { label: "Signed by", value: `@${user?.username || ""}` },
          { label: "Key required", value: "Posting" },
        ]}
        confirmLabel="Reblog"
        onConfirm={executeReblog}
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
          console.log("[HiveReblogButton] WIF key submitted");
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
          console.log("[HiveReblogButton] HB-Auth password submitted");
          setHBAuthPassword(password);
          confirmWithHBAuthPassword(password);
        }}
        onCancel={cancelHBAuthPasswordPrompt}
        isLoading={isBroadcasting}
      />
    </>
  );
}
