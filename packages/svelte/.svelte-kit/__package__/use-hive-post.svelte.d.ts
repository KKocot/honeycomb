export interface HivePost {
    title: string;
    body: string;
    author: string;
    permlink: string;
    category: string;
    votes: number;
    comments: number;
    payout: string;
    created: string;
    raw_created: string;
    thumbnail: string | null;
}
export interface UseHivePostResult {
    readonly post: HivePost | null;
    readonly is_loading: boolean;
    readonly error: Error | null;
}
/**
 * Hook to fetch a single Hive post via condenser_api.get_content.
 * Accepts static strings or getter functions for reactive updates.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { useHivePost } from "@barddev/honeycomb-svelte";
 *   // Static:
 *   const result = useHivePost("barddev", "my-post-permlink");
 *   // Reactive (tracks changes):
 *   let author = $state("barddev");
 *   const result = useHivePost(() => author, () => permlink);
 * </script>
 *
 * {#if result.is_loading}Loading...{/if}
 * {#if result.post}{result.post.title}{/if}
 * ```
 */
export declare function useHivePost(author_or_getter: string | (() => string), permlink_or_getter: string | (() => string)): UseHivePostResult;
//# sourceMappingURL=use-hive-post.svelte.d.ts.map