import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  hook: `"use client";

import { useHiveChain } from "@/components/hive/hive-provider";
import { useEffect, useState, useCallback } from "react";

interface HiveAccount {
  name: string;
  balance: string;
  hbd_balance: string;
  vesting_shares: string;
  delegated_vesting_shares: string;
  received_vesting_shares: string;
  voting_manabar: {
    current_mana: string;
    last_update_time: number;
  };
  reputation: number;
  post_count: number;
  created: string;
  json_metadata: string;
  posting_json_metadata: string;
}

interface UseHiveAccountReturn {
  account: HiveAccount | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useHiveAccount(username: string | undefined): UseHiveAccountReturn {
  const { chain, isReady } = useHiveChain();
  const [account, setAccount] = useState<HiveAccount | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAccount = useCallback(async () => {
    if (!isReady || !chain || !username) {
      setAccount(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await chain.api.database_api.find_accounts({
        accounts: [username],
      });

      if (result.accounts.length === 0) {
        throw new Error(\`Account @\${username} not found\`);
      }

      setAccount(result.accounts[0] as HiveAccount);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch account"));
      setAccount(null);
    } finally {
      setIsLoading(false);
    }
  }, [chain, isReady, username]);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  return {
    account,
    isLoading,
    error,
    refetch: fetchAccount,
  };
}`,
  basicUsage: `"use client";

import { useHiveAccount } from "@/hooks/use-hive-account";

export function AccountCard({ username }: { username: string }) {
  const { account, isLoading, error } = useHiveAccount(username);

  if (isLoading) {
    return <div>Loading account...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error.message}</div>;
  }

  if (!account) {
    return null;
  }

  return (
    <div className="rounded-lg border border-border p-4">
      <h3 className="font-semibold">@{account.name}</h3>
      <div className="mt-2 text-sm text-muted-foreground">
        <p>Balance: {account.balance}</p>
        <p>HBD: {account.hbd_balance}</p>
        <p>Posts: {account.post_count}</p>
      </div>
    </div>
  );
}`,
  withMetadata: `"use client";

import { useHiveAccount } from "@/hooks/use-hive-account";
import { useMemo } from "react";

interface ProfileMetadata {
  name?: string;
  about?: string;
  location?: string;
  website?: string;
  profile_image?: string;
  cover_image?: string;
}

export function ProfileHeader({ username }: { username: string }) {
  const { account, isLoading } = useHiveAccount(username);

  const metadata = useMemo<ProfileMetadata | null>(() => {
    if (!account) return null;

    try {
      // Try posting_json_metadata first (newer format)
      if (account.posting_json_metadata) {
        const parsed = JSON.parse(account.posting_json_metadata);
        if (parsed.profile) return parsed.profile;
      }

      // Fall back to json_metadata
      if (account.json_metadata) {
        const parsed = JSON.parse(account.json_metadata);
        if (parsed.profile) return parsed.profile;
      }
    } catch {
      // Invalid JSON, return null
    }

    return null;
  }, [account]);

  if (isLoading) return <div>Loading...</div>;
  if (!account) return null;

  return (
    <div className="space-y-4">
      {metadata?.cover_image && (
        <img
          src={metadata.cover_image}
          alt="Cover"
          className="w-full h-48 object-cover rounded-lg"
        />
      )}

      <div className="flex items-center gap-4">
        <img
          src={metadata?.profile_image || \`https://images.hive.blog/u/\${username}/avatar\`}
          alt={username}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h2 className="text-xl font-bold">
            {metadata?.name || \`@\${username}\`}
          </h2>
          {metadata?.about && (
            <p className="text-muted-foreground">{metadata.about}</p>
          )}
        </div>
      </div>
    </div>
  );
}`,
  hpCalculation: `"use client";

import { useHiveAccount } from "@/hooks/use-hive-account";
import { useHiveChain } from "@/components/hive/hive-provider";
import { useEffect, useState } from "react";

// Convert VESTS to Hive Power
function vestsToHP(
  vests: number,
  totalVestingFund: number,
  totalVestingShares: number
): number {
  return (vests * totalVestingFund) / totalVestingShares;
}

export function HivePowerDisplay({ username }: { username: string }) {
  const { chain, isReady } = useHiveChain();
  const { account } = useHiveAccount(username);
  const [hp, setHp] = useState<number | null>(null);

  useEffect(() => {
    if (!chain || !isReady || !account) return;

    async function calculateHP() {
      const props = await chain.api.database_api.get_dynamic_global_properties({});

      const totalVestingFund = parseFloat(props.total_vesting_fund_hive.amount);
      const totalVestingShares = parseFloat(props.total_vesting_shares.amount);

      const ownVests = parseFloat(account.vesting_shares.split(" ")[0]);
      const delegatedVests = parseFloat(account.delegated_vesting_shares.split(" ")[0]);
      const receivedVests = parseFloat(account.received_vesting_shares.split(" ")[0]);

      const effectiveVests = ownVests - delegatedVests + receivedVests;
      const hivePower = vestsToHP(effectiveVests, totalVestingFund, totalVestingShares);

      setHp(hivePower);
    }

    calculateHP();
  }, [chain, isReady, account]);

  if (hp === null) return <span>--</span>;

  return <span>{hp.toLocaleString(undefined, { maximumFractionDigits: 3 })} HP</span>;
}`,
  refetchExample: `"use client";

import { useHiveAccount } from "@/hooks/use-hive-account";
import { RefreshCw } from "lucide-react";

export function AccountWithRefresh({ username }: { username: string }) {
  const { account, isLoading, refetch } = useHiveAccount(username);

  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">@{username}</h3>
        <button
          onClick={refetch}
          disabled={isLoading}
          className="p-2 rounded hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw className={\`h-4 w-4 \${isLoading ? "animate-spin" : ""}\`} />
        </button>
      </div>

      {account && (
        <div className="text-sm text-muted-foreground">
          <p>Balance: {account.balance}</p>
          <p>Posts: {account.post_count}</p>
        </div>
      )}
    </div>
  );
}`,
};

export default async function UseHiveAccountPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">useHiveAccount</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Fetch and manage Hive account data.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Account Data</p>
            <p className="mt-1 text-sm text-muted-foreground">
              This hook fetches account information from the Hive blockchain including
              balances, voting power, reputation, and profile metadata.
            </p>
          </div>
        </div>
      </section>

      {/* Installation */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Hook Definition</h2>
        <p className="text-muted-foreground mb-4">
          Copy this hook into your project:
        </p>
        <CodeBlock filename="hooks/use-hive-account.ts" code={CODE.hook} language="typescript" />
      </section>

      {/* Return Values */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Return Values</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Property</th>
                <th className="py-3 px-4 text-left font-semibold">Type</th>
                <th className="py-3 px-4 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4"><code>account</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>HiveAccount | null</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Account data from blockchain
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>isLoading</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>boolean</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  True while fetching data
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>error</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>Error | null</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Error if fetch failed
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>refetch</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>() =&gt; void</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Manually refresh account data
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Account Properties */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Account Properties</h2>
        <p className="text-muted-foreground mb-4">
          Key properties available on the account object:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Property</th>
                <th className="py-3 px-4 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4"><code>name</code></td>
                <td className="py-3 px-4 text-muted-foreground">Account username</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>balance</code></td>
                <td className="py-3 px-4 text-muted-foreground">HIVE balance (e.g., &quot;10.000 HIVE&quot;)</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>hbd_balance</code></td>
                <td className="py-3 px-4 text-muted-foreground">HBD balance (e.g., &quot;5.000 HBD&quot;)</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>vesting_shares</code></td>
                <td className="py-3 px-4 text-muted-foreground">VESTS (convertible to Hive Power)</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>reputation</code></td>
                <td className="py-3 px-4 text-muted-foreground">Raw reputation (needs formatting)</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>post_count</code></td>
                <td className="py-3 px-4 text-muted-foreground">Total number of posts</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>posting_json_metadata</code></td>
                <td className="py-3 px-4 text-muted-foreground">Profile metadata (JSON string)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Basic Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Basic Usage</h2>
        <p className="text-muted-foreground mb-4">
          Display basic account information:
        </p>
        <CodeBlock code={CODE.basicUsage} language="typescript" />
      </section>

      {/* With Metadata */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Profile Metadata</h2>
        <p className="text-muted-foreground mb-4">
          Parse profile metadata for display name, bio, and images:
        </p>
        <CodeBlock code={CODE.withMetadata} language="typescript" />
      </section>

      {/* Hive Power Calculation */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Calculating Hive Power</h2>
        <p className="text-muted-foreground mb-4">
          Convert VESTS to Hive Power using global properties:
        </p>
        <CodeBlock code={CODE.hpCalculation} language="typescript" />
      </section>

      {/* Refetch Example */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Manual Refresh</h2>
        <p className="text-muted-foreground mb-4">
          Allow users to manually refresh account data:
        </p>
        <CodeBlock code={CODE.refetchExample} language="typescript" />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Next</h2>
        <div className="flex gap-4">
          <Link
            href="/docs/hooks/use-vote"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            useVote
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
