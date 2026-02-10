/**
 * Composable to fetch Hive account data
 * Vue 3 port of the React useHiveAccount hook
 */

import { ref, watch, toValue, type Ref, type MaybeRefOrGetter } from "vue";
import { useHiveChain } from "./hive-provider.js";

interface AssetLike {
  amount?: string;
  nai?: string;
}

function is_asset_like(value: unknown): value is AssetLike {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.amount === "string" || typeof obj.amount === "undefined"
  );
}

function format_asset(asset: unknown, symbol: string): string {
  if (!is_asset_like(asset) || !asset.amount) return `0.000 ${symbol}`;
  const amount = parseInt(asset.amount, 10) / 1000;
  return `${amount.toFixed(3)} ${symbol}`;
}

function get_asset_amount(asset: unknown): string {
  if (!is_asset_like(asset) || !asset.amount) return "0";
  return asset.amount;
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
 * import { useHiveAccount } from '@kkocot/honeycomb-vue';
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
  username: MaybeRefOrGetter<string>
): UseHiveAccountResult {
  const chain = useHiveChain();
  const account = ref<HiveAccount | null>(null);
  const is_loading = ref(true);
  const error = ref<Error | null>(null);
  const refetch_counter = ref(0);

  watch(
    [chain, refetch_counter, () => toValue(username)],
    async ([new_chain, _, current_username], __, onCleanup) => {
      let cancelled = false;
      onCleanup(() => {
        cancelled = true;
      });

      if (!new_chain || !current_username) {
        is_loading.value = false;
        return;
      }

      is_loading.value = true;
      error.value = null;

      try {
        const response = await new_chain.api.database_api.find_accounts({
          accounts: [current_username.toLowerCase()],
        });

        if (cancelled) return;

        if (response.accounts && response.accounts.length > 0) {
          const acc = response.accounts[0] as unknown as Record<
            string,
            unknown
          >;
          const reputation = acc.reputation as string | number | undefined;
          account.value = {
            name: acc.name as string,
            reputation:
              typeof reputation === "string"
                ? parseInt(reputation, 10)
                : (reputation ?? 0),
            post_count: acc.post_count as number,
            balance: format_asset(acc.balance, "HIVE"),
            hbd_balance: format_asset(acc.hbd_balance, "HBD"),
            vesting_shares: get_asset_amount(acc.vesting_shares),
            delegated_vesting_shares: get_asset_amount(
              acc.delegated_vesting_shares
            ),
            received_vesting_shares: get_asset_amount(
              acc.received_vesting_shares
            ),
            posting_json_metadata:
              (acc.posting_json_metadata as string) || "",
            json_metadata: (acc.json_metadata as string) || "",
            created: (acc.created as string) || "",
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
    { immediate: true }
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
