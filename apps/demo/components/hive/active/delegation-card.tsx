"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Minus, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Delegation {
  delegatee: string;
  vesting_shares: string;
  hp?: string;
}

interface DelegationCardProps {
  username: string;
  delegations?: Delegation[];
  availableHP?: string;
  onDelegate?: (to: string, amount: string) => void;
  onUndelegate?: (to: string) => void;
  className?: string;
}

export function HiveDelegationCard({
  username,
  delegations: propDelegations,
  availableHP: propAvailableHP,
  onDelegate,
  onUndelegate,
  className,
}: DelegationCardProps) {
  const [showForm, setShowForm] = useState(false);
  const [delegatee, setDelegatee] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [delegations, setDelegations] = useState<Delegation[]>(propDelegations || []);
  const [availableHP, setAvailableHP] = useState(propAvailableHP || "0");
  const [loadingData, setLoadingData] = useState(false);
  const [vestsToHpRatio, setVestsToHpRatio] = useState(0);

  // Fetch real delegation data
  useEffect(() => {
    async function fetchData() {
      if (!username) return;
      setLoadingData(true);
      try {
        // Fetch delegations, account info, and global props in parallel
        const [delegationsRes, accountRes, propsRes] = await Promise.all([
          fetch("https://api.hive.blog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              method: "condenser_api.get_vesting_delegations",
              params: [username, "", 100],
              id: 1,
            }),
          }),
          fetch("https://api.hive.blog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              method: "condenser_api.get_accounts",
              params: [[username]],
              id: 2,
            }),
          }),
          fetch("https://api.hive.blog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              method: "condenser_api.get_dynamic_global_properties",
              params: [],
              id: 3,
            }),
          }),
        ]);

        const delegationsData = await delegationsRes.json();
        const accountData = await accountRes.json();
        const propsData = await propsRes.json();

        if (propsData.result) {
          const props = propsData.result;
          const totalVestingFund = parseFloat(props.total_vesting_fund_hive?.split(" ")[0] || "1");
          const totalVestingShares = parseFloat(props.total_vesting_shares?.split(" ")[0] || "1");
          const ratio = totalVestingFund / totalVestingShares;
          setVestsToHpRatio(ratio);

          if (delegationsData.result) {
            const dels = delegationsData.result.map((d: { delegatee: string; vesting_shares: string }) => {
              const vests = parseFloat(d.vesting_shares.split(" ")[0]);
              return {
                delegatee: d.delegatee,
                vesting_shares: d.vesting_shares,
                hp: (vests * ratio).toFixed(3),
              };
            });
            setDelegations(dels);
          }

          if (accountData.result?.[0]) {
            const account = accountData.result[0];
            const vestingShares = parseFloat(account.vesting_shares?.split(" ")[0] || "0");
            const delegatedVests = parseFloat(account.delegated_vesting_shares?.split(" ")[0] || "0");
            const receivedVests = parseFloat(account.received_vesting_shares?.split(" ")[0] || "0");
            const availableVests = vestingShares - delegatedVests;
            const hp = (availableVests * ratio).toFixed(3);
            setAvailableHP(hp);
          }
        }
      } catch (err) {
        console.error("Failed to fetch delegation data:", err);
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, [username]);

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

  return (
    <div className={cn("w-full max-w-md", className)}>
      <div className="pb-4 mb-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {loadingData && <Loader2 className="h-4 w-4 animate-spin" />}
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600"
          >
            <Plus className="h-4 w-4" />
            New Delegation
          </button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Available HP: <strong>{availableHP} HP</strong>
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
        {loadingData ? (
          <div className="p-4 text-center">
            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
          </div>
        ) : delegations.length === 0 ? (
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
                    {d.hp || "0"} HP
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
