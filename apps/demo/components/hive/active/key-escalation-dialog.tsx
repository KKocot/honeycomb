"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Key,
  Lock,
  Shield,
  Eye,
  EyeOff,
  Loader2,
  X,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useHive, KeyType } from "@/contexts/hive-context";

const KEY_INFO: Record<KeyType, { label: string; color: string; icon: typeof Key; description: string }> = {
  posting: {
    label: "Posting",
    color: "text-blue-500 bg-blue-500/10",
    icon: Key,
    description: "Used for social actions like voting, commenting, and following.",
  },
  active: {
    label: "Active",
    color: "text-orange-500 bg-orange-500/10",
    icon: Shield,
    description: "Used for financial transactions like transfers and power-ups.",
  },
  owner: {
    label: "Owner",
    color: "text-red-500 bg-red-500/10",
    icon: Lock,
    description: "Used for account recovery and authority changes. Keep offline!",
  },
};

export function KeyEscalationDialog() {
  const { escalationRequest, resolveEscalation, user } = useHive();
  const [privateKey, setPrivateKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saveKey, setSaveKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!escalationRequest) return null;

  const keyInfo = KEY_INFO[escalationRequest.requiredKeyType];
  const KeyIcon = keyInfo.icon;

  const handleSubmit = async () => {
    if (!privateKey.trim()) {
      setError("Please enter your private key");
      return;
    }

    // Basic WIF validation
    if (!privateKey.startsWith("5") || privateKey.length !== 51) {
      setError("Invalid WIF format. Private keys start with 5 and are 51 characters.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would:
      // 1. Validate the key against the blockchain
      // 2. If saveKey is true, encrypt and store in HB-Auth
      // 3. Sign the pending transaction
      await new Promise((r) => setTimeout(r, 800)); // Simulate validation

      // Clear form
      setPrivateKey("");
      setSaveKey(false);
      setError(null);

      // Resolve escalation successfully
      resolveEscalation(true, saveKey);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid key or validation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setPrivateKey("");
    setSaveKey(false);
    setError(null);
    resolveEscalation(false);
  };

  const handleUseOneTime = async () => {
    if (!privateKey.trim()) {
      setError("Please enter your private key");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await new Promise((r) => setTimeout(r, 500));
      setPrivateKey("");
      setError(null);
      resolveEscalation(true, false); // Don't save
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid key");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleCancel}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg mx-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", keyInfo.color)}>
              <KeyIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                {keyInfo.label} Key Required
              </h2>
              <p className="text-sm text-muted-foreground">
                @{user?.username}
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Warning for owner key */}
        {escalationRequest.requiredKeyType === "owner" && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-500">Security Warning</p>
                <p className="text-sm text-muted-foreground">
                  This operation requires your Owner key. Only use this for critical account changes.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Reason */}
        <div className="mb-4 p-3 rounded-lg bg-muted/50">
          <p className="text-sm text-muted-foreground">
            <strong>Reason:</strong> {escalationRequest.reason}
          </p>
        </div>

        {/* Key description */}
        <p className="text-sm text-muted-foreground mb-4">
          {keyInfo.description}
        </p>

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
                onChange={(e) => setPrivateKey(e.target.value)}
                placeholder="5..."
                disabled={isLoading}
                className="w-full px-3 py-2.5 pr-10 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          )}

          {/* Save option */}
          {escalationRequest.allowSave !== false && (
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                className={cn(
                  "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                  saveKey
                    ? "bg-primary border-primary"
                    : "border-border hover:border-muted-foreground"
                )}
                onClick={() => setSaveKey(!saveKey)}
              >
                {saveKey && <Check className="h-3 w-3 text-primary-foreground" />}
              </div>
              <div>
                <p className="text-sm font-medium">Save to Safe Storage</p>
                <p className="text-xs text-muted-foreground">
                  Encrypt and store locally for future use
                </p>
              </div>
            </label>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-2">
            {saveKey ? (
              <button
                onClick={handleSubmit}
                disabled={isLoading || !privateKey.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    Save & Continue
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleUseOneTime}
                disabled={isLoading || !privateKey.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Key className="h-5 w-5" />
                    Use One Time
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="w-full px-4 py-2.5 rounded-lg border border-border text-muted-foreground font-medium hover:bg-muted disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
