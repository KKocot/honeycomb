"use client";

import { useState } from "react";
import { Users, Plus, Minus, Loader2, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Delegation {
  delegatee: string;
  vesting_shares: string;
}

interface DelegationCardProps {
  username: string;
  delegations?: Delegation[];
  availableHP?: string;
  onDelegate?: (to: string, amount: string) => void;
  onUndelegate?: (to: string) => void;
  className?: string;
}

const mockDelegations: Delegation[] = [
  { delegatee: "actifit", vesting_shares: "100000.000000 VESTS" },
  { delegatee: "ecency", vesting_shares: "50000.000000 VESTS" },
];

export function DelegationCard({
  username,
  delegations = mockDelegations,
  availableHP = "1000",
  onDelegate,
  onUndelegate,
  className,
}: DelegationCardProps) {
  const [showForm, setShowForm] = useState(false);
  const [delegatee, setDelegatee] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelegate = async () => {
    if (!delegatee.trim() || !amount.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await new Promise((r) => setTimeout(r, 1000));
      onDelegate?.(delegatee, amount);
      setShowForm(false);
      setDelegatee("");
      setAmount("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delegation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUndelegate = async (to: string) => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      onUndelegate?.(to);
    } finally {
      setIsLoading(false);
    }
  };

  const formatVests = (vests: string) => {
    const num = parseFloat(vests.split(" ")[0]);
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(2);
  };

  return (
    <div className={cn("w-full max-w-md rounded-xl border border-border bg-card", className)}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">Delegations</h3>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600"
          >
            <Plus className="h-4 w-4" />
            New
          </button>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Available HP: <strong>{availableHP}</strong>
        </p>
      </div>

      {/* New Delegation Form */}
      {showForm && (
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Delegate to</label>
              <input
                type="text"
                value={delegatee}
                onChange={(e) => setDelegatee(e.target.value.toLowerCase())}
                placeholder="Username"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount (HP)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.000"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleDelegate}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delegate"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setError(null);
                }}
                className="px-3 py-2 rounded-lg bg-muted text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delegations List */}
      <div className="divide-y divide-border">
        {delegations.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No active delegations
          </div>
        ) : (
          delegations.map((d) => (
            <div key={d.delegatee} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <img
                  src={`https://images.hive.blog/u/${d.delegatee}/avatar/small`}
                  alt={d.delegatee}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="font-medium">@{d.delegatee}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatVests(d.vesting_shares)} VESTS
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleUndelegate(d.delegatee)}
                disabled={isLoading}
                className="p-2 rounded-lg hover:bg-red-500/10 text-red-500"
                title="Remove delegation"
              >
                <Minus className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
