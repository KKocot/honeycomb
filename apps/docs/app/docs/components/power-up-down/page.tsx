import Link from "next/link";
import { ArrowRight, Info, ArrowUp, ArrowDown, Zap, Clock } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  component: `"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown, Loader2, Clock, Zap } from "lucide-react";

interface PowerUpDownProps {
  username: string;
  availableHive: string;
  availableHp: string;
  vestingShares: string;
  currentPowerDown?: {
    nextPayout: string;
    remaining: string;
    weeklyAmount: string;
  };
  onPowerUp?: (to: string, amount: string) => Promise<void>;
  onPowerDown?: (amount: string) => Promise<void>;
  onCancelPowerDown?: () => Promise<void>;
  className?: string;
}

export function PowerUpDown({
  username,
  availableHive,
  availableHp,
  vestingShares,
  currentPowerDown,
  onPowerUp,
  onPowerDown,
  onCancelPowerDown,
  className = "",
}: PowerUpDownProps) {
  const [mode, setMode] = useState<"up" | "down">("up");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState(username);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount) return;

    setIsLoading(true);
    try {
      if (mode === "up") {
        await onPowerUp?.(recipient, amount);
      } else {
        await onPowerDown?.(amount);
      }
      setAmount("");
    } catch (error) {
      console.error("Power operation failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={\`rounded-xl border border-border bg-card \${className}\`}>
      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setMode("up")}
          className={\`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors \${
            mode === "up"
              ? "border-b-2 border-hive-red text-hive-red"
              : "text-muted-foreground hover:text-foreground"
          }\`}
        >
          <ArrowUp className="h-4 w-4" />
          Power Up
        </button>
        <button
          onClick={() => setMode("down")}
          className={\`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors \${
            mode === "down"
              ? "border-b-2 border-hive-red text-hive-red"
              : "text-muted-foreground hover:text-foreground"
          }\`}
        >
          <ArrowDown className="h-4 w-4" />
          Power Down
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Info box */}
        <div className={\`p-3 rounded-lg text-sm \${
          mode === "up" ? "bg-green-500/10" : "bg-orange-500/10"
        }\`}>
          {mode === "up" ? (
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-green-500">Power Up Benefits</p>
                <p className="text-muted-foreground mt-1">
                  Increases voting power, curation rewards, and resource credits.
                  HP is locked but can be powered down later.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-orange-500 mt-0.5" />
              <div>
                <p className="font-medium text-orange-500">Power Down Info</p>
                <p className="text-muted-foreground mt-1">
                  Takes 13 weeks with weekly payouts. You can cancel anytime.
                  Reduces your influence on the platform.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Current power down status */}
        {mode === "down" && currentPowerDown && (
          <div className="p-3 rounded-lg bg-muted space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Weekly payout</span>
              <span className="font-medium">{currentPowerDown.weeklyAmount} HIVE</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Next payout</span>
              <span>{currentPowerDown.nextPayout}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Remaining</span>
              <span>{currentPowerDown.remaining} HP</span>
            </div>
            <button
              type="button"
              onClick={onCancelPowerDown}
              className="w-full mt-2 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded"
            >
              Cancel Power Down
            </button>
          </div>
        )}

        {/* Recipient (power up only) */}
        {mode === "up" && (
          <div>
            <label className="block text-sm font-medium mb-1">Power up to</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value.toLowerCase())}
              className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-hive-red focus:outline-none"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              You can power up to yourself or another account
            </p>
          </div>
        )}

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.000"
              step="0.001"
              min="0"
              className="w-full px-3 py-2 pr-16 rounded-lg bg-muted border border-border focus:border-hive-red focus:outline-none"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {mode === "up" ? "HIVE" : "HP"}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Available: {mode === "up" ? availableHive : availableHp} {mode === "up" ? "HIVE" : "HP"}
            <button
              type="button"
              onClick={() => setAmount(mode === "up" ? availableHive : availableHp)}
              className="ml-2 text-hive-red hover:underline"
            >
              Max
            </button>
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || !amount}
          className={\`w-full py-3 rounded-lg font-medium disabled:opacity-50 \${
            mode === "up"
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-orange-500 text-white hover:bg-orange-600"
          }\`}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin inline" />
          ) : mode === "up" ? (
            <>
              <ArrowUp className="h-4 w-4 inline mr-2" />
              Power Up
            </>
          ) : (
            <>
              <ArrowDown className="h-4 w-4 inline mr-2" />
              Start Power Down
            </>
          )}
        </button>
      </form>
    </div>
  );
}`,
  basicUsage: `"use client";

import { PowerUpDown } from "@/components/hive/power-up-down";
import { useHiveAuth } from "@/hooks/use-hive-auth";
import { useHiveAccount } from "@/hooks/use-hive-account";
import { useTransfer } from "@/hooks/use-transfer";

export function StakingCard() {
  const { user } = useHiveAuth();
  const { account } = useHiveAccount(user?.username);
  const { powerUp, powerDown, cancelPowerDown } = useTransfer();

  if (!user || !account) return null;

  return (
    <PowerUpDown
      username={user.username}
      availableHive={account.balance.split(" ")[0]}
      availableHp={account.vesting_shares.split(" ")[0]}
      vestingShares={account.vesting_shares}
      onPowerUp={powerUp}
      onPowerDown={powerDown}
      onCancelPowerDown={cancelPowerDown}
    />
  );
}`,
  withPowerDownStatus: `<PowerUpDown
  username="alice"
  availableHive="1234.567"
  availableHp="50000.000"
  vestingShares="100000.000000 VESTS"
  currentPowerDown={{
    nextPayout: "2024-01-20",
    remaining: "45000.000",
    weeklyAmount: "3846.153",
  }}
  onPowerUp={powerUp}
  onPowerDown={powerDown}
  onCancelPowerDown={cancelPowerDown}
/>`,
};

export default async function PowerUpDownPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Power Up/Down</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Stake and unstake HIVE to Hive Power for voting influence.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Hive Power (HP)</p>
            <p className="mt-1 text-sm text-muted-foreground">
              HP determines your voting power, curation rewards, and resource credits.
              Power up is instant. Power down takes 13 weeks with weekly payouts.
            </p>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="max-w-md mx-auto rounded-xl border border-border">
          {/* Tabs */}
          <div className="flex border-b border-border">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 border-hive-red text-hive-red">
              <ArrowUp className="h-4 w-4" /> Power Up
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-muted-foreground">
              <ArrowDown className="h-4 w-4" /> Power Down
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Info */}
            <div className="p-3 rounded-lg bg-green-500/10 flex items-start gap-2">
              <Zap className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-green-500 text-sm">Power Up Benefits</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Increases voting power and curation rewards.
                </p>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <div className="flex gap-2">
                <div className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-muted-foreground">
                  0.000
                </div>
                <div className="px-3 py-2 rounded-lg bg-muted border border-border text-sm">
                  HIVE
                </div>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Available: 1,234.567 HIVE
              </p>
            </div>

            <button className="w-full py-3 rounded-lg bg-green-500 text-white font-medium flex items-center justify-center gap-2">
              <ArrowUp className="h-4 w-4" /> Power Up
            </button>
          </div>
        </div>
      </section>

      {/* Component Code */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Component</h2>
        <CodeBlock
          filename="components/hive/power-up-down.tsx"
          code={CODE.component}
          language="typescript"
        />
      </section>

      {/* Props */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Props</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Prop</th>
                <th className="py-3 px-4 text-left font-semibold">Type</th>
                <th className="py-3 px-4 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4"><code>availableHive</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">Available HIVE for power up</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>availableHp</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">Available HP for power down</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>currentPowerDown</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>object</code></td>
                <td className="py-3 px-4 text-muted-foreground">Active power down status</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onPowerUp</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>function</code></td>
                <td className="py-3 px-4 text-muted-foreground">Power up handler</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onPowerDown</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>function</code></td>
                <td className="py-3 px-4 text-muted-foreground">Power down handler</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Basic Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Basic Usage</h2>
        <CodeBlock code={CODE.basicUsage} language="typescript" />
      </section>

      {/* With Power Down Status */}
      <section>
        <h2 className="text-xl font-semibold mb-4">With Active Power Down</h2>
        <CodeBlock code={CODE.withPowerDownStatus} language="tsx" />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Next</h2>
        <div className="flex gap-4">
          <Link
            href="/docs/components/delegation-card"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            Delegation Card
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
