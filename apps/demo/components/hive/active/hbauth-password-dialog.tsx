"use client";

import { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  X,
  AlertTriangle,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HBAuthPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
  keyType: "posting" | "active";
  onSubmit: (password: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const KEY_INFO = {
  posting: {
    label: "Posting",
    color: "text-blue-500 bg-blue-500/10",
    description: "Social actions like voting, commenting, and following.",
  },
  active: {
    label: "Active",
    color: "text-orange-500 bg-orange-500/10",
    description: "Financial transactions like transfers and power-ups.",
  },
};

export function HBAuthPasswordDialog({
  open,
  onOpenChange,
  username,
  keyType,
  onSubmit,
  onCancel,
  isLoading = false,
}: HBAuthPasswordDialogProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const keyInfo = KEY_INFO[keyType];

  const handleSubmit = () => {
    console.log("[HBAuthPasswordDialog] Submitting password...");

    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    setError(null);
    console.log("[HBAuthPasswordDialog] Password provided, unlocking...");
    onSubmit(password);

    // Clear form after submit
    setPassword("");
  };

  const handleCancel = () => {
    console.log("[HBAuthPasswordDialog] Cancelled");
    setPassword("");
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
            <div className={cn("p-2 rounded-lg bg-emerald-500/10 text-emerald-500")}>
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                Unlock Safe Storage
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
          <Shield className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">
              Enter your password to unlock your <span className={cn("font-medium", keyInfo.color.split(" ")[0])}>{keyInfo.label}</span> key.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {keyInfo.description}
            </p>
          </div>
        </div>

        {/* Password input */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    handleSubmit();
                  }
                }}
                placeholder="Enter your password"
                disabled={isLoading}
                autoFocus
                className="w-full px-3 py-2.5 pr-10 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                {showPassword ? (
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
              disabled={isLoading || !password.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Unlock & Sign
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
