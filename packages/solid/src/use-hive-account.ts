import { createSignal, createEffect, onCleanup, type Accessor } from "solid-js";
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
  /** Account data signal getter */
  account: () => HiveAccount | null;
  /** Loading state signal getter */
  is_loading: () => boolean;
  /** Error signal getter */
  error: () => Error | null;
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
 * return (
 *   <Show when={!is_loading()} fallback={<div>Loading...</div>}>
 *     <Show when={!error()} fallback={<div>Error: {error()?.message}</div>}>
 *       <div>Balance: {account()?.balance}</div>
 *     </Show>
 *   </Show>
 * );
 * ```
 */
export function useHiveAccount(
  username: string | Accessor<string>,
): UseHiveAccountResult {
  const get_username =
    typeof username === "function" ? username : () => username;

  const { chain, api_endpoint } = useHive();
  const [account, set_account] = createSignal<HiveAccount | null>(null);
  const [is_loading, set_is_loading] = createSignal(true);
  const [error, set_error] = createSignal<Error | null>(null);
  const [refetch_counter, set_refetch_counter] = createSignal(0);

  createEffect(() => {
    const chain_value = chain();
    const current_username = get_username();
    const current_endpoint = api_endpoint();
    void refetch_counter();

    if (!chain_value || !current_username) {
      set_is_loading(false);
      return;
    }

    const safe_chain = chain_value;
    const safe_username = current_username;
    const endpoint = current_endpoint ?? "https://api.hive.blog";

    let cancelled = false;
    set_is_loading(true);
    set_error(null);

    async function fetch_account() {
      try {
        const [account_response, global_response, reputation] =
          await Promise.all([
            safe_chain.api.database_api.find_accounts({
              accounts: [safe_username.toLowerCase()],
            }),
            safe_chain.api.database_api.get_dynamic_global_properties({}),
            fetch_bridge_reputation(safe_username.toLowerCase(), endpoint),
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
          const savings_hbd_asset = format_nai_asset(
            acc.savings_hbd_balance,
          );

          set_account({
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
            delegated_vesting_shares:
              acc.delegated_vesting_shares.amount,
            received_vesting_shares:
              acc.received_vesting_shares.amount,
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
          set_error(new Error("Account not found"));
        }
      } catch (err) {
        if (!cancelled) {
          set_error(
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

    onCleanup(() => {
      cancelled = true;
    });
  });

  const refetch = () => {
    set_refetch_counter((c) => c + 1);
  };

  return { account, is_loading, error, refetch };
}
