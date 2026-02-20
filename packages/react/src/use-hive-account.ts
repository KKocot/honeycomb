"use client";

import { useState, useEffect } from "react";
import { useHive } from "./hive-provider";
import {
  fetch_bridge_reputation,
  format_nai_asset,
  convert_vests_to_hp,
} from "@kkocot/honeycomb-core";

function format_with_symbol(amount: number, symbol: string): string {
  return `${amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 })} ${symbol}`;
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
  hive_power: string;
  effective_hp: string;
  savings_balance: string;
  savings_hbd_balance: string;
  delegated_hp: string;
  received_hp: string;
  posting_json_metadata: string;
  json_metadata: string;
  created: string;
}

export interface UseHiveAccountResult {
  /** Account data */
  account: HiveAccount | null;
  /** Loading state */
  is_loading: boolean;
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
 * const { account, is_loading, error } = useHiveAccount("blocktrades");
 *
 * if (is_loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 *
 * return <div>Balance: {account?.balance}</div>;
 * ```
 */
export function useHiveAccount(username: string): UseHiveAccountResult {
  const { chain, api_endpoint } = useHive();
  const [account, setAccount] = useState<HiveAccount | null>(null);
  const [is_loading, set_is_loading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetch_counter, set_refetch_counter] = useState(0);

  useEffect(() => {
    if (!chain || !username) {
      set_is_loading(false);
      return;
    }

    const safe_chain = chain;
    const endpoint = api_endpoint ?? "https://api.hive.blog";

    let cancelled = false;
    set_is_loading(true);
    setError(null);

    async function fetch_account() {
      try {
        const [account_response, global_response, reputation] =
          await Promise.all([
            safe_chain.api.database_api.find_accounts({
              accounts: [username.toLowerCase()],
            }),
            safe_chain.api.database_api.get_dynamic_global_properties({}),
            fetch_bridge_reputation(username.toLowerCase(), endpoint),
          ]);

        if (cancelled) return;

        // find_accounts returns typed ApiAccount[] with NaiAsset fields
        const acc = account_response.accounts?.[0];
        if (acc) {
          const balance_asset = format_nai_asset(acc.balance);
          const hbd_asset = format_nai_asset(acc.hbd_balance);

          const hp = convert_vests_to_hp(
            acc.vesting_shares,
            global_response.total_vesting_shares,
            global_response.total_vesting_fund_hive,
          );
          const delegated_hp_value = convert_vests_to_hp(
            acc.delegated_vesting_shares,
            global_response.total_vesting_shares,
            global_response.total_vesting_fund_hive,
          );
          const received_hp_value = convert_vests_to_hp(
            acc.received_vesting_shares,
            global_response.total_vesting_shares,
            global_response.total_vesting_fund_hive,
          );
          const effective = hp - delegated_hp_value + received_hp_value;

          const savings_asset = format_nai_asset(acc.savings_balance);
          const savings_hbd_asset = format_nai_asset(acc.savings_hbd_balance);

          setAccount({
            name: acc.name,
            reputation,
            post_count: acc.post_count,
            balance: format_with_symbol(
              balance_asset.amount,
              balance_asset.symbol,
            ),
            hbd_balance: format_with_symbol(
              hbd_asset.amount,
              hbd_asset.symbol,
            ),
            vesting_shares: acc.vesting_shares.amount,
            delegated_vesting_shares: acc.delegated_vesting_shares.amount,
            received_vesting_shares: acc.received_vesting_shares.amount,
            hive_power: format_with_symbol(hp, "HP"),
            effective_hp: format_with_symbol(effective, "HP"),
            savings_balance: format_with_symbol(
              savings_asset.amount,
              savings_asset.symbol,
            ),
            savings_hbd_balance: format_with_symbol(
              savings_hbd_asset.amount,
              savings_hbd_asset.symbol,
            ),
            delegated_hp: format_with_symbol(delegated_hp_value, "HP"),
            received_hp: format_with_symbol(received_hp_value, "HP"),
            posting_json_metadata: acc.posting_json_metadata,
            json_metadata: acc.json_metadata,
            created: acc.created,
          });
        } else {
          setError(new Error("Account not found"));
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err
              : new Error("Failed to fetch account"),
          );
        }
      } finally {
        if (!cancelled) {
          set_is_loading(false);
        }
      }
    }

    fetch_account();

    return () => {
      cancelled = true;
    };
  }, [chain, api_endpoint, username, refetch_counter]);

  const refetch = () => {
    set_refetch_counter((c) => c + 1);
  };

  return { account, is_loading, error, refetch };
}
