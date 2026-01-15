import Link from "next/link";
import { ArrowRight, Info, Users, Plus, Minus, Settings } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  component: `"use client";

import { useState } from "react";
import { Users, Plus, Minus, Loader2, X } from "lucide-react";

interface Delegation {
  delegatee: string;
  vesting_shares: string;
  hp_amount: string;
  min_delegation_time: string;
}

interface DelegationCardProps {
  username: string;
  availableHp: string;
  delegations: Delegation[];
  incomingDelegations?: Delegation[];
  onDelegate?: (delegatee: string, amount: string) => Promise<void>;
  onUndelegate?: (delegatee: string) => Promise<void>;
  className?: string;
}

export function DelegationCard({
  username,
  availableHp,
  delegations,
  incomingDelegations = [],
  onDelegate,
  onUndelegate,
  className = "",
}: DelegationCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newDelegatee, setNewDelegatee] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"outgoing" | "incoming">("outgoing");

  const totalDelegated = delegations.reduce(
    (sum, d) => sum + parseFloat(d.hp_amount),
    0
  );

  const totalReceived = incomingDelegations.reduce(
    (sum, d) => sum + parseFloat(d.hp_amount),
    0
  );

  async function handleDelegate() {
    if (!newDelegatee || !newAmount) return;

    setIsLoading(true);
    try {
      await onDelegate?.(newDelegatee, newAmount);
      setNewDelegatee("");
      setNewAmount("");
      setIsAdding(false);
    } catch (error) {
      console.error("Delegation failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUndelegate(delegatee: string) {
    setIsLoading(true);
    try {
      await onUndelegate?.(delegatee);
    } catch (error) {
      console.error("Undelegation failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={\`rounded-xl border border-border bg-card \${className}\`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">Delegations</h3>
            <p className="text-sm text-muted-foreground">
              {totalDelegated.toFixed(3)} HP delegated
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-purple-500 text-white hover:bg-purple-600"
        >
          <Plus className="h-4 w-4" />
          Delegate
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("outgoing")}
          className={\`flex-1 py-2 text-sm font-medium \${
            activeTab === "outgoing"
              ? "border-b-2 border-purple-500 text-purple-500"
              : "text-muted-foreground"
          }\`}
        >
          Outgoing ({delegations.length})
        </button>
        <button
          onClick={() => setActiveTab("incoming")}
          className={\`flex-1 py-2 text-sm font-medium \${
            activeTab === "incoming"
              ? "border-b-2 border-purple-500 text-purple-500"
              : "text-muted-foreground"
          }\`}
        >
          Incoming ({incomingDelegations.length})
        </button>
      </div>

      {/* Add delegation form */}
      {isAdding && (
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">New Delegation</span>
            <button
              onClick={() => setIsAdding(false)}
              className="p-1 hover:bg-muted rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              value={newDelegatee}
              onChange={(e) => setNewDelegatee(e.target.value.toLowerCase())}
              placeholder="Username"
              className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-purple-500 focus:outline-none"
            />
            <div className="flex gap-2">
              <input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="Amount"
                step="0.001"
                className="flex-1 px-3 py-2 rounded-lg bg-background border border-border focus:border-purple-500 focus:outline-none"
              />
              <span className="px-3 py-2 bg-muted rounded-lg text-sm">HP</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Available: {availableHp} HP
            </p>
            <button
              onClick={handleDelegate}
              disabled={isLoading || !newDelegatee || !newAmount}
              className="w-full py-2 rounded-lg bg-purple-500 text-white font-medium hover:bg-purple-600 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin inline" />
              ) : (
                "Delegate HP"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Delegations list */}
      <div className="divide-y divide-border max-h-[300px] overflow-y-auto">
        {activeTab === "outgoing" ? (
          delegations.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No outgoing delegations
            </div>
          ) : (
            delegations.map((d) => (
              <div
                key={d.delegatee}
                className="flex items-center justify-between p-4 hover:bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={\`https://images.hive.blog/u/\${d.delegatee}/avatar/small\`}
                    alt={d.delegatee}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-medium">@{d.delegatee}</p>
                    <p className="text-sm text-muted-foreground">
                      {d.hp_amount} HP
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleUndelegate(d.delegatee)}
                  disabled={isLoading}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                  title="Remove delegation"
                >
                  <Minus className="h-4 w-4" />
                </button>
              </div>
            ))
          )
        ) : incomingDelegations.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No incoming delegations
          </div>
        ) : (
          incomingDelegations.map((d) => (
            <div
              key={d.delegatee}
              className="flex items-center justify-between p-4 hover:bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <img
                  src={\`https://images.hive.blog/u/\${d.delegatee}/avatar/small\`}
                  alt={d.delegatee}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="font-medium">@{d.delegatee}</p>
                  <p className="text-sm text-green-500">+{d.hp_amount} HP</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total delegated</span>
          <span className="font-medium text-red-500">-{totalDelegated.toFixed(3)} HP</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-muted-foreground">Total received</span>
          <span className="font-medium text-green-500">+{totalReceived.toFixed(3)} HP</span>
        </div>
      </div>
    </div>
  );
}`,
  basicUsage: `"use client";

import { DelegationCard } from "@/components/hive/delegation-card";
import { useHiveAuth } from "@/hooks/use-hive-auth";
import { useDelegations } from "@/hooks/use-delegations";
import { useTransfer } from "@/hooks/use-transfer";

export function DelegationsPage() {
  const { user } = useHiveAuth();
  const { delegations, incomingDelegations, availableHp } = useDelegations(user?.username);
  const { delegate, undelegate } = useTransfer();

  if (!user) return null;

  return (
    <DelegationCard
      username={user.username}
      availableHp={availableHp}
      delegations={delegations}
      incomingDelegations={incomingDelegations}
      onDelegate={delegate}
      onUndelegate={undelegate}
    />
  );
}`,
};

export default async function DelegationCardPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Delegation Card</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage HP delegations to and from other accounts.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-purple-500">HP Delegation</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Delegated HP gives the recipient voting power and resource credits
              without transferring ownership. Undelegation has a 5-day cooldown period.
            </p>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="max-w-md mx-auto rounded-xl border border-border">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Delegations</h3>
                <p className="text-sm text-muted-foreground">5,000.000 HP delegated</p>
              </div>
            </div>
            <button className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-purple-500 text-white">
              <Plus className="h-4 w-4" /> Delegate
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border">
            <button className="flex-1 py-2 text-sm font-medium border-b-2 border-purple-500 text-purple-500">
              Outgoing (3)
            </button>
            <button className="flex-1 py-2 text-sm font-medium text-muted-foreground">
              Incoming (2)
            </button>
          </div>

          {/* List */}
          <div className="divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-hive-red/20" />
                <div>
                  <p className="font-medium">@alice</p>
                  <p className="text-sm text-muted-foreground">2,500.000 HP</p>
                </div>
              </div>
              <button className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                <Minus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20" />
                <div>
                  <p className="font-medium">@bob</p>
                  <p className="text-sm text-muted-foreground">1,500.000 HP</p>
                </div>
              </div>
              <button className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                <Minus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 border-t border-border bg-muted/30">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total delegated</span>
              <span className="font-medium text-red-500">-5,000.000 HP</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-muted-foreground">Total received</span>
              <span className="font-medium text-green-500">+10,000.000 HP</span>
            </div>
          </div>
        </div>
      </section>

      {/* Component Code */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Component</h2>
        <CodeBlock
          filename="components/hive/delegation-card.tsx"
          code={CODE.component}
          language="typescript"
        />
      </section>

      {/* Basic Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Basic Usage</h2>
        <CodeBlock code={CODE.basicUsage} language="typescript" />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Next</h2>
        <div className="flex gap-4">
          <Link
            href="/docs/components/trade-hive"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            Trade Hive
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
