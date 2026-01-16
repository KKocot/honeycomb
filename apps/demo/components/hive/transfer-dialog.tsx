"use client";

import { useState } from "react";
import { Send, Loader2, AlertCircle, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransferDialogProps {
  username: string;
  onTransfer?: (data: TransferData) => void;
  className?: string;
}

interface TransferData {
  to: string;
  amount: string;
  currency: "HIVE" | "HBD";
  memo: string;
}

export function HiveTransferDialog({ username, onTransfer, className }: TransferDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<"HIVE" | "HBD">("HIVE");
  const [memo, setMemo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleTransfer = async () => {
    if (!to.trim() || !amount.trim()) {
      setError("Please fill in recipient and amount");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate transfer
      await new Promise((r) => setTimeout(r, 1500));

      onTransfer?.({ to, amount, currency, memo });
      setSuccess(true);

      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        setTo("");
        setAmount("");
        setMemo("");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transfer failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg bg-hive-red text-white font-medium hover:bg-hive-red/90",
          className
        )}
      >
        <Send className="h-4 w-4" />
        Transfer
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Transfer {currency}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {success ? (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-medium text-green-500">Transfer Successful!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Sent {amount} {currency} to @{to}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                  <span>From: <strong className="text-foreground">@{username}</strong></span>
                  <ArrowRight className="h-4 w-4" />
                  <span>To: <strong className="text-foreground">{to || "..."}</strong></span>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Recipient</label>
                  <input
                    type="text"
                    value={to}
                    onChange={(e) => setTo(e.target.value.toLowerCase())}
                    placeholder="Enter username"
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Amount</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.000"
                      step="0.001"
                      min="0"
                      className="flex-1 px-3 py-2.5 rounded-lg border border-border bg-background"
                    />
                    <div className="flex rounded-lg border border-border overflow-hidden">
                      <button
                        onClick={() => setCurrency("HIVE")}
                        className={cn(
                          "px-3 py-2.5 text-sm font-medium",
                          currency === "HIVE" ? "bg-hive-red text-white" : "bg-background"
                        )}
                      >
                        HIVE
                      </button>
                      <button
                        onClick={() => setCurrency("HBD")}
                        className={cn(
                          "px-3 py-2.5 text-sm font-medium",
                          currency === "HBD" ? "bg-green-500 text-white" : "bg-background"
                        )}
                      >
                        HBD
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Memo (optional)</label>
                  <input
                    type="text"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="Add a memo..."
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Memos are public unless they start with #
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                <button
                  onClick={handleTransfer}
                  disabled={isLoading || !to.trim() || !amount.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-hive-red text-white font-medium hover:bg-hive-red/90 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send {currency}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
