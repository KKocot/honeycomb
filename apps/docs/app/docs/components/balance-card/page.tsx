import Link from "next/link";
import { ArrowRight, Info, Wallet } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  component: `"use client";

import { useHiveAccount } from "@/hooks/use-hive-account";
import { useHiveChain } from "@/components/hive/hive-provider";
import { useEffect, useState } from "react";
import { Wallet, TrendingUp, Lock, Coins } from "lucide-react";

interface BalanceCardProps {
  username: string;
  showHivePower?: boolean;
  showSavings?: boolean;
  variant?: "compact" | "default" | "detailed";
  className?: string;
}

interface HivePowerInfo {
  own: number;
  delegatedOut: number;
  delegatedIn: number;
  effective: number;
}

export function BalanceCard({
  username,
  showHivePower = true,
  showSavings = false,
  variant = "default",
  className = "",
}: BalanceCardProps) {
  const { account, isLoading, error } = useHiveAccount(username);
  const { chain, isReady } = useHiveChain();
  const [hivePower, setHivePower] = useState<HivePowerInfo | null>(null);

  useEffect(() => {
    if (!chain || !isReady || !account || !showHivePower) return;

    async function calculateHP() {
      const props = await chain.api.database_api.get_dynamic_global_properties({});

      const totalVestingFund = parseFloat(props.total_vesting_fund_hive.amount) / 1000;
      const totalVestingShares = parseFloat(props.total_vesting_shares.amount) / 1000000;

      const vestsToHP = (vests: number) =>
        (vests * totalVestingFund) / totalVestingShares;

      const ownVests = parseFloat(account.vesting_shares.split(" ")[0]);
      const delegatedOutVests = parseFloat(account.delegated_vesting_shares.split(" ")[0]);
      const delegatedInVests = parseFloat(account.received_vesting_shares.split(" ")[0]);

      setHivePower({
        own: vestsToHP(ownVests),
        delegatedOut: vestsToHP(delegatedOutVests),
        delegatedIn: vestsToHP(delegatedInVests),
        effective: vestsToHP(ownVests - delegatedOutVests + delegatedInVests),
      });
    }

    calculateHP();
  }, [chain, isReady, account, showHivePower]);

  const formatNumber = (num: number, decimals = 3) =>
    num.toLocaleString(undefined, { maximumFractionDigits: decimals });

  if (isLoading) {
    return (
      <div className={\`rounded-lg border border-border bg-card p-4 animate-pulse \${className}\`}>
        <div className="h-6 w-32 bg-muted rounded mb-4" />
        <div className="space-y-3">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-4 w-28 bg-muted rounded" />
          <div className="h-4 w-20 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className={\`rounded-lg border border-border bg-card p-4 \${className}\`}>
        <p className="text-sm text-muted-foreground">
          {error?.message || "Unable to load balance"}
        </p>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={\`flex items-center gap-4 text-sm \${className}\`}>
        <span className="font-medium">{account.balance}</span>
        <span className="text-muted-foreground">{account.hbd_balance}</span>
        {hivePower && (
          <span className="text-muted-foreground">
            {formatNumber(hivePower.effective)} HP
          </span>
        )}
      </div>
    );
  }

  if (variant === "detailed") {
    return (
      <div className={\`rounded-lg border border-border bg-card \${className}\`}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-hive-red" />
            <h3 className="font-semibold">@{username} Wallet</h3>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* HIVE */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">HIVE</span>
            </div>
            <span className="font-medium">{account.balance}</span>
          </div>

          {/* HBD */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">HBD</span>
            </div>
            <span className="font-medium">{account.hbd_balance}</span>
          </div>

          {/* Hive Power */}
          {hivePower && (
            <>
              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Hive Power</span>
                  </div>
                  <span className="font-medium">{formatNumber(hivePower.own)} HP</span>
                </div>

                {hivePower.delegatedIn > 0 && (
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <span className="text-green-500">+ Received</span>
                    <span className="text-green-500">
                      {formatNumber(hivePower.delegatedIn)} HP
                    </span>
                  </div>
                )}

                {hivePower.delegatedOut > 0 && (
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <span className="text-red-500">- Delegated</span>
                    <span className="text-red-500">
                      {formatNumber(hivePower.delegatedOut)} HP
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                  <span className="text-sm font-medium">Effective HP</span>
                  <span className="font-bold text-hive-red">
                    {formatNumber(hivePower.effective)} HP
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Savings */}
          {showSavings && (
            <div className="pt-2 border-t border-border">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Savings</span>
              </div>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>HIVE</span>
                  <span>{account.savings_balance || "0.000 HIVE"}</span>
                </div>
                <div className="flex justify-between">
                  <span>HBD</span>
                  <span>{account.savings_hbd_balance || "0.000 HBD"}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={\`rounded-lg border border-border bg-card p-4 \${className}\`}>
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="h-5 w-5 text-hive-red" />
        <h3 className="font-semibold">Balance</h3>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">HIVE</span>
          <span className="font-medium">{account.balance}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">HBD</span>
          <span className="font-medium">{account.hbd_balance}</span>
        </div>

        {hivePower && (
          <div className="flex justify-between pt-2 border-t border-border">
            <span className="text-muted-foreground">Hive Power</span>
            <span className="font-medium">{formatNumber(hivePower.effective)} HP</span>
          </div>
        )}
      </div>
    </div>
  );
}`,
  basicUsage: `import { BalanceCard } from "@/components/hive/balance-card";

export function WalletPage() {
  return (
    <div className="max-w-md">
      <BalanceCard username="blocktrades" />
    </div>
  );
}`,
  variants: `import { BalanceCard } from "@/components/hive/balance-card";

export function BalanceVariants() {
  return (
    <div className="space-y-4">
      {/* Compact - inline display */}
      <BalanceCard username="blocktrades" variant="compact" />

      {/* Default - simple card */}
      <BalanceCard username="blocktrades" variant="default" />

      {/* Detailed - full breakdown */}
      <BalanceCard username="blocktrades" variant="detailed" showSavings />
    </div>
  );
}`,
  withSavings: `import { BalanceCard } from "@/components/hive/balance-card";

export function FullWallet() {
  return (
    <BalanceCard
      username="blocktrades"
      variant="detailed"
      showSavings
    />
  );
}`,
  walletDashboard: `"use client";

import { BalanceCard } from "@/components/hive/balance-card";
import { UserCard } from "@/components/hive/user-card";
import { useHiveAuth } from "@/hooks/use-hive-auth";

export function WalletDashboard() {
  const { user, isAuthenticated } = useHiveAuth();

  if (!isAuthenticated || !user) {
    return <div>Please login to view your wallet</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <UserCard username={user.username} variant="expanded" />
      <BalanceCard
        username={user.username}
        variant="detailed"
        showSavings
      />
    </div>
  );
}`,
};

export default async function BalanceCardPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Balance Card</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Display Hive account balances including HIVE, HBD, and Hive Power.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Hive Tokens</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Hive has three main tokens: <strong>HIVE</strong> (liquid), <strong>HBD</strong>{" "}
              (Hive Backed Dollars, pegged to ~$1 USD), and <strong>HP</strong> (Hive Power,
              staked HIVE that provides influence and generates rewards).
            </p>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="max-w-sm">
          <div className="rounded-lg border border-border bg-background p-4">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="h-5 w-5 text-hive-red" />
              <h3 className="font-semibold">Balance</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">HIVE</span>
                <span className="font-medium">1,234.567 HIVE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">HBD</span>
                <span className="font-medium">456.789 HBD</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="text-muted-foreground">Hive Power</span>
                <span className="font-medium">10,000.000 HP</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Component Code */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Component</h2>
        <p className="text-muted-foreground mb-4">
          Copy this component into your project:
        </p>
        <CodeBlock
          filename="components/hive/balance-card.tsx"
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
                <th className="py-3 px-4 text-left font-semibold">Default</th>
                <th className="py-3 px-4 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4"><code>username</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">required</td>
                <td className="py-3 px-4 text-muted-foreground">Hive username</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>variant</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>&quot;compact&quot; | &quot;default&quot; | &quot;detailed&quot;</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground"><code>&quot;default&quot;</code></td>
                <td className="py-3 px-4 text-muted-foreground">Display style</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>showHivePower</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>true</code></td>
                <td className="py-3 px-4 text-muted-foreground">Calculate and show HP</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>showSavings</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>false</code></td>
                <td className="py-3 px-4 text-muted-foreground">Show savings balances</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>className</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
                <td className="py-3 px-4 text-muted-foreground">Additional CSS classes</td>
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

      {/* Variants */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Variants</h2>
        <p className="text-muted-foreground mb-4">
          Choose between compact, default, and detailed display styles:
        </p>
        <CodeBlock code={CODE.variants} language="typescript" />
      </section>

      {/* With Savings */}
      <section>
        <h2 className="text-xl font-semibold mb-4">With Savings</h2>
        <p className="text-muted-foreground mb-4">
          Show savings account balances (3-day withdrawal period):
        </p>
        <CodeBlock code={CODE.withSavings} language="typescript" />
      </section>

      {/* Wallet Dashboard */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Wallet Dashboard</h2>
        <p className="text-muted-foreground mb-4">
          Combine with UserCard for a complete wallet view:
        </p>
        <CodeBlock code={CODE.walletDashboard} language="typescript" />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Next</h2>
        <div className="flex gap-4">
          <Link
            href="/docs/components/comment-form"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            Comment Form
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
