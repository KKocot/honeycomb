import { createSignal, createEffect, onCleanup, type Accessor } from "solid-js";
import { useHiveChain } from "./hive-provider";

// Helper to format asset objects from API
interface AssetLike {
  amount?: string;
  nai?: string;
}

function isAssetLike(value: unknown): value is AssetLike {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.amount === "string" || typeof obj.amount === "undefined"
  );
}

function formatAsset(asset: unknown, symbol: string): string {
  if (!isAssetLike(asset) || !asset.amount) return `0.000 ${symbol}`;
  const amount = parseInt(asset.amount, 10) / 1000;
  return `${amount.toFixed(3)} ${symbol}`;
}

function getAssetAmount(asset: unknown): string {
  if (!isAssetLike(asset)) return "0";
  return asset.amount || "0";
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
  /** Account data signal getter */
  account: () => HiveAccount | null;
  /** Loading state signal getter */
  isLoading: () => boolean;
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
 * const { account, isLoading, error } = useHiveAccount("blocktrades");
 *
 * return (
 *   <Show when={!isLoading()} fallback={<div>Loading...</div>}>
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

  const chain = useHiveChain();
  const [account, set_account] = createSignal<HiveAccount | null>(null);
  const [is_loading, set_is_loading] = createSignal(true);
  const [error, set_error] = createSignal<Error | null>(null);
  const [refetch_counter, set_refetch_counter] = createSignal(0);

  createEffect(() => {
    // Track reactive dependencies
    const chain_value = chain();
    const current_username = get_username();
    void refetch_counter();

    if (!chain_value || !current_username) {
      set_is_loading(false);
      return;
    }

    // Narrow type for async closure (avoids non-null assertion)
    const safe_chain = chain_value;
    const safe_username = current_username;

    let cancelled = false;
    set_is_loading(true);
    set_error(null);

    async function fetch_account() {
      try {
        const response =
          await safe_chain.api.database_api.find_accounts({
            accounts: [safe_username.toLowerCase()],
          });

        if (cancelled) return;

        if (response.accounts && response.accounts.length > 0) {
          const acc = response.accounts[0] as unknown as Record<
            string,
            unknown
          >;
          const reputation = acc.reputation as string | number | undefined;
          set_account({
            name: acc.name as string,
            reputation:
              typeof reputation === "string"
                ? parseInt(reputation, 10)
                : (reputation ?? 0),
            post_count: acc.post_count as number,
            balance: formatAsset(acc.balance, "HIVE"),
            hbd_balance: formatAsset(acc.hbd_balance, "HBD"),
            vesting_shares: getAssetAmount(acc.vesting_shares),
            delegated_vesting_shares: getAssetAmount(
              acc.delegated_vesting_shares,
            ),
            received_vesting_shares: getAssetAmount(
              acc.received_vesting_shares,
            ),
            posting_json_metadata:
              (acc.posting_json_metadata as string) || "",
            json_metadata: (acc.json_metadata as string) || "",
            created: (acc.created as string) || "",
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

  return { account, isLoading: is_loading, error, refetch };
}
