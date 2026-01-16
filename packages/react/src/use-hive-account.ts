"use client";

import { useState, useEffect } from "react";
import { useHiveChain } from "./hive-provider";

// Helper to format asset objects from API
interface AssetLike {
  amount?: string;
  nai?: string;
}

function formatAsset(asset: unknown, symbol: string): string {
  const obj = asset as AssetLike | undefined;
  if (!obj?.amount) return `0.000 ${symbol}`;
  const amount = parseInt(obj.amount, 10) / 1000;
  return `${amount.toFixed(3)} ${symbol}`;
}

function getAssetAmount(asset: unknown): string {
  const obj = asset as AssetLike | undefined;
  return obj?.amount || "0";
}

export interface HiveAccount {
  name: string;
  reputation: number;
  post_count: number;
  balance: string;
  hbd_balance: string;
  vesting_shares: string;
  delegated_vesting_shares: string;
  received_vesting_shares: string;
  posting_json_metadata: string;
  json_metadata: string;
  created: string;
}

export interface UseHiveAccountResult {
  /** Account data */
  account: HiveAccount | null;
  /** Loading state */
  isLoading: boolean;
  /** Error if any */
  error: Error | null;
  /** Refetch account data */
  refetch: () => void;
}

/**
 * Hook to fetch Hive account data
 *
 * @example
 * ```tsx
 * const { account, isLoading, error } = useHiveAccount("blocktrades");
 *
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 *
 * return <div>Balance: {account?.balance}</div>;
 * ```
 */
export function useHiveAccount(username: string): UseHiveAccountResult {
  const chain = useHiveChain();
  const [account, setAccount] = useState<HiveAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchCounter, setRefetchCounter] = useState(0);

  useEffect(() => {
    if (!chain || !username) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    async function fetchAccount() {
      try {
        const response = await chain!.api.database_api.find_accounts({
          accounts: [username.toLowerCase()],
        });

        if (cancelled) return;

        if (response.accounts && response.accounts.length > 0) {
          const acc = response.accounts[0] as unknown as Record<string, unknown>;
          const reputation = acc.reputation as string | number | undefined;
          setAccount({
            name: acc.name as string,
            reputation: typeof reputation === "string"
              ? parseInt(reputation, 10)
              : (reputation ?? 0),
            post_count: acc.post_count as number,
            balance: formatAsset(acc.balance, "HIVE"),
            hbd_balance: formatAsset(acc.hbd_balance, "HBD"),
            vesting_shares: getAssetAmount(acc.vesting_shares),
            delegated_vesting_shares: getAssetAmount(acc.delegated_vesting_shares),
            received_vesting_shares: getAssetAmount(acc.received_vesting_shares),
            posting_json_metadata: (acc.posting_json_metadata as string) || "",
            json_metadata: (acc.json_metadata as string) || "",
            created: (acc.created as string) || "",
          });
        } else {
          setError(new Error("Account not found"));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Failed to fetch account"));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchAccount();

    return () => {
      cancelled = true;
    };
  }, [chain, username, refetchCounter]);

  const refetch = () => {
    setRefetchCounter((c) => c + 1);
  };

  return { account, isLoading, error, refetch };
}
