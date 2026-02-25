import { useHive } from "./context.svelte";
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
  readonly account: HiveAccount | null;
  readonly is_loading: boolean;
  readonly error: Error | null;
  refetch: () => void;
}

/**
 * Hook to fetch Hive account data.
 * Accepts a static string or a getter function for reactive updates.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { useHiveAccount } from "@barddev/honeycomb-svelte";
 *   // Static:
 *   const result = useHiveAccount("blocktrades");
 *   // Reactive (tracks changes):
 *   let name = $state("blocktrades");
 *   const result = useHiveAccount(() => name);
 * </script>
 *
 * {#if result.is_loading}Loading...{/if}
 * {#if result.account}{result.account.balance}{/if}
 * ```
 */
export function useHiveAccount(
  username_or_getter: string | (() => string),
): UseHiveAccountResult {
  const ctx = useHive();
  const get_username =
    typeof username_or_getter === "function"
      ? username_or_getter
      : () => username_or_getter;

  let account: HiveAccount | null = $state(null);
  let is_loading: boolean = $state(true);
  let error: Error | null = $state(null);
  let refetch_counter = $state(0);

  $effect(() => {
    const chain = ctx.chain;
    const api_endpoint = ctx.api_endpoint;
    const username = get_username();
    // Track refetch_counter to re-run effect
    const _trigger = refetch_counter;

    if (!chain || !username) {
      is_loading = false;
      return;
    }

    const safe_chain = chain;
    const endpoint = api_endpoint ?? "https://api.hive.blog";

    let cancelled = false;
    is_loading = true;
    error = null;

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

          account = {
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
          };
        } else {
          error = new Error("Account not found");
        }
      } catch (err) {
        if (!cancelled) {
          error =
            err instanceof Error
              ? err
              : new Error("Failed to fetch account");
        }
      } finally {
        if (!cancelled) {
          is_loading = false;
        }
      }
    }

    fetch_account();

    return () => {
      cancelled = true;
    };
  });

  return {
    get account() {
      return account;
    },
    get is_loading() {
      return is_loading;
    },
    get error() {
      return error;
    },
    refetch: () => {
      refetch_counter++;
    },
  };
}
