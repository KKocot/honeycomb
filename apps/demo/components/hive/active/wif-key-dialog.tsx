"use client";

import { useState } from "react";
import {
  Key,
  Eye,
  EyeOff,
  Loader2,
  X,
  AlertTriangle,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WifKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
  keyType: "posting" | "active";
  onSubmit: (wifKey: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const KEY_INFO = {
  posting: {
    label: "Posting",
    color: "text-blue-500 bg-blue-500/10",
    description: "Used for social actions like voting, commenting, and following.",
  },
  active: {
    label: "Active",
    color: "text-orange-500 bg-orange-500/10",
    description: "Used for financial transactions like transfers and power-ups.",
  },
};

export function WifKeyDialog({
  open,
  onOpenChange,
  username,
  keyType,
  onSubmit,
  onCancel,
  isLoading = false,
}: WifKeyDialogProps) {
  const [privateKey, setPrivateKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const keyInfo = KEY_INFO[keyType];

  const handleSubmit = () => {
    console.log("[WifKeyDialog] Submitting key...");

    if (!privateKey.trim()) {
      setError("Please enter your private key");
      return;
    }

    // Basic WIF validation
    if (!privateKey.startsWith("5") || privateKey.length !== 51) {
      setError("Invalid WIF format. Private keys start with '5' and are 51 characters.");
      return;
    }

    setError(null);
    console.log("[WifKeyDialog] Key validated, submitting...");
    onSubmit(privateKey);

    // Clear form after submit
    setPrivateKey("");
  };

  const handleCancel = () => {
    console.log("[WifKeyDialog] Cancelled");
    setPrivateKey("");
    setError(null);
    onCancel();
  };

  const handleClose = () => {
    if (!isLoading) {
      handleCancel();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg mx-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", keyInfo.color)}>
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                Enter {keyInfo.label} Key
              </h2>
              <p className="text-sm text-muted-foreground">
                @{username}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Info */}
        <div className="mb-4 p-3 rounded-lg bg-muted/50 flex items-start gap-2">
          <Shield className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">
              {keyInfo.description}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Your key is used locally to sign the transaction and is never stored or sent to any server.
            </p>
          </div>
        </div>

        {/* Key input */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Private {keyInfo.label} Key (WIF)
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={privateKey}
                onChange={(e) => {
                  setPrivateKey(e.target.value);
                  setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    handleSubmit();
                  }
                }}
                placeholder="5..."
                disabled={isLoading}
                autoFocus
                className="w-full px-3 py-2.5 pr-10 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-500">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-lg border border-border text-muted-foreground font-medium hover:bg-muted disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !privateKey.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-hive-red text-white font-medium hover:bg-hive-red/90 disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing...
                </>
              ) : (
                <>
                  <Key className="h-4 w-4" />
                  Sign & Broadcast
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
