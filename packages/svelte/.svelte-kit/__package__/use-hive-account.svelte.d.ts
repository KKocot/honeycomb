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
 *   import { useHiveAccount } from "@hiveio/honeycomb-svelte";
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
export declare function useHiveAccount(username_or_getter: string | (() => string)): UseHiveAccountResult;
//# sourceMappingURL=use-hive-account.svelte.d.ts.map