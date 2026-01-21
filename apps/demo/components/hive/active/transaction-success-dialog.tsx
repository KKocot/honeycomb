"use client";

import { CheckCircle2, ExternalLink, X, Copy, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TransactionSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  transactionId?: string;
  details?: { label: string; value: string }[];
}

export function TransactionSuccessDialog({
  open,
  onOpenChange,
  title = "Transaction Successful!",
  description = "Your transaction has been confirmed on the Hive blockchain.",
  transactionId,
  details = [],
}: TransactionSuccessDialogProps) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const handleCopyTxId = async () => {
    if (!transactionId) return;

    try {
      await navigator.clipboard.writeText(transactionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      console.log("[TransactionSuccessDialog] Copied transaction ID:", transactionId);
    } catch (error) {
      console.error("[TransactionSuccessDialog] Failed to copy:", error);
    }
  };

  const handleViewOnExplorer = () => {
    if (!transactionId) return;
    const explorerUrl = `https://hivehub.dev/tx/${transactionId}`;
    console.log("[TransactionSuccessDialog] Opening explorer:", explorerUrl);
    window.open(explorerUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Success icon */}
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-500/10 p-3">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center mb-2">{title}</h2>

        {/* Description */}
        <p className="text-sm text-muted-foreground text-center mb-4">
          {description}
        </p>

        {/* Transaction ID */}
        {transactionId && (
          <div className="rounded-lg border border-border bg-muted/50 p-3 mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Transaction ID</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopyTxId}
                  className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  title="Copy transaction ID"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  onClick={handleViewOnExplorer}
                  className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  title="View on explorer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <code className="text-xs font-mono break-all text-foreground">
              {transactionId}
            </code>
          </div>
        )}

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
        <div className="flex items-center justify-center gap-3">
          {transactionId && (
            <button
              onClick={handleViewOnExplorer}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              View on Explorer
            </button>
          )}
          <button
            onClick={() => onOpenChange(false)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              "bg-green-500 text-white hover:bg-green-500/90"
            )}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
