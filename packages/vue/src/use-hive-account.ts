/**
 * Composable to fetch Hive account data
 * Vue 3 port of the React useHiveAccount hook
 */

import { ref, watch, toValue, type Ref, type MaybeRefOrGetter } from "vue";
import { useHive } from "./hive-provider.js";
import {
  fetch_bridge_reputation,
  format_nai_asset,
  convert_vests_to_hp,
  type NaiAsset,
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
  account: Ref<HiveAccount | null>;
  /** Loading state */
  isLoading: Ref<boolean>;
  /** Error if any */
  error: Ref<Error | null>;
  /** Refetch account data */
  refetch: () => void;
}

/**
 * Composable to fetch Hive account data
 *
 * @example
 * ```vue
 * <script setup>
 * import { useHiveAccount } from '@barddev/honeycomb-vue';
 *
 * const { account, isLoading, error } = useHiveAccount("blocktrades");
 * </script>
 *
 * <template>
 *   <div v-if="isLoading">Loading...</div>
 *   <div v-else-if="error">Error: {{ error.message }}</div>
 *   <div v-else>Balance: {{ account?.balance }}</div>
 * </template>
 * ```
 */
export function useHiveAccount(
  username: MaybeRefOrGetter<string>,
): UseHiveAccountResult {
  const { chain, apiEndpoint } = useHive();
  const account = ref<HiveAccount | null>(null);
  const is_loading = ref(true);
  const error = ref<Error | null>(null);
  const refetch_counter = ref(0);

  watch(
    [chain, apiEndpoint, refetch_counter, () => toValue(username)],
    async ([new_chain, current_endpoint, _, current_username], __, onCleanup) => {
      let cancelled = false;
      onCleanup(() => {
        cancelled = true;
      });

      if (!new_chain || !current_username) {
        is_loading.value = false;
        return;
      }

      const endpoint = current_endpoint ?? "https://api.hive.blog";

      is_loading.value = true;
      error.value = null;

      try {
        const [account_response, global_response, reputation] =
          await Promise.all([
            new_chain.api.database_api.find_accounts({
              accounts: [current_username.toLowerCase()],
            }),
            new_chain.api.database_api.get_dynamic_global_properties({}),
            fetch_bridge_reputation(current_username.toLowerCase(), endpoint),
          ]);

        if (cancelled) return;

        if (
          account_response.accounts &&
          account_response.accounts.length > 0
        ) {
          const acc = account_response.accounts[0] as unknown as Record<
            string,
            unknown
          >;
          const global_props = global_response as unknown as Record<
            string,
            unknown
          >;

          const balance_asset = format_nai_asset(
            acc.balance as unknown as NaiAsset,
          );
          const hbd_asset = format_nai_asset(
            acc.hbd_balance as unknown as NaiAsset,
          );

          const vesting = acc.vesting_shares as unknown as NaiAsset;
          const delegated =
            acc.delegated_vesting_shares as unknown as NaiAsset;
          const received =
            acc.received_vesting_shares as unknown as NaiAsset;
          const total_vesting_shares =
            global_props.total_vesting_shares as unknown as NaiAsset;
          const total_vesting_fund_hive =
            global_props.total_vesting_fund_hive as unknown as NaiAsset;

          const hp = convert_vests_to_hp(
            vesting,
            total_vesting_shares,
            total_vesting_fund_hive,
          );
          const delegated_hp_value = convert_vests_to_hp(
            delegated,
            total_vesting_shares,
            total_vesting_fund_hive,
          );
          const received_hp_value = convert_vests_to_hp(
            received,
            total_vesting_shares,
            total_vesting_fund_hive,
          );
          const effective = hp - delegated_hp_value + received_hp_value;

          const savings_asset = format_nai_asset(
            acc.savings_balance as unknown as NaiAsset,
          );
          const savings_hbd_asset = format_nai_asset(
            acc.savings_hbd_balance as unknown as NaiAsset,
          );

          account.value = {
            name: String(acc.name ?? ""),
            reputation,
            post_count: Number(acc.post_count ?? 0),
            balance: format_with_symbol(
              balance_asset.amount,
              balance_asset.symbol,
            ),
            hbd_balance: format_with_symbol(
              hbd_asset.amount,
              hbd_asset.symbol,
            ),
            vesting_shares: String(vesting.amount),
            delegated_vesting_shares: String(delegated.amount),
            received_vesting_shares: String(received.amount),
            hive_power: format_with_symbol(hp, "HP"),
            effective_hp: format_with_symbol(effective, "HP"),
            savings_balance: format_with_symbol(savings_asset.amount, savings_asset.symbol),
            savings_hbd_balance: format_with_symbol(savings_hbd_asset.amount, savings_hbd_asset.symbol),
            delegated_hp: format_with_symbol(delegated_hp_value, "HP"),
            received_hp: format_with_symbol(received_hp_value, "HP"),
            posting_json_metadata: String(acc.posting_json_metadata ?? ""),
            json_metadata: String(acc.json_metadata ?? ""),
            created: String(acc.created ?? ""),
          };
        } else {
          error.value = new Error("Account not found");
        }
      } catch (err) {
        if (!cancelled) {
          error.value =
            err instanceof Error
              ? err
              : new Error("Failed to fetch account");
        }
      } finally {
        if (!cancelled) {
          is_loading.value = false;
        }
      }
    },
    { immediate: true },
  );

  const refetch = () => {
    refetch_counter.value += 1;
  };

  return {
    account,
    isLoading: is_loading,
    error,
    refetch,
  };
}
