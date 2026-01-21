"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  details?: { label: string; value: string }[];
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "warning" | "danger";
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
}

export function ConfirmActionDialog({
  open,
  onOpenChange,
  title,
  description,
  details = [],
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  isLoading = false,
  onConfirm,
}: ConfirmActionDialogProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const loading = isLoading || internalLoading;

  const handleConfirm = async () => {
    setInternalLoading(true);
    try {
      await onConfirm();
    } finally {
      setInternalLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onOpenChange(false);
    }
  };

  if (!open) return null;

  const variantStyles = {
    default: {
      confirmBtn: "bg-hive-red text-white hover:bg-hive-red/90",
    },
    warning: {
      confirmBtn: "bg-orange-500 text-white hover:bg-orange-500/90",
    },
    danger: {
      confirmBtn: "bg-red-500 text-white hover:bg-red-500/90",
    },
  };

  const style = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4">{description}</p>

        {/* Details */}
        {details.length > 0 && (
          <div className="rounded-lg border border-border bg-muted/50 p-3 mb-6 space-y-2">
            {details.map((detail, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{detail.label}:</span>
                <span className="font-medium">{detail.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2",
              style.confirmBtn
            )}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
