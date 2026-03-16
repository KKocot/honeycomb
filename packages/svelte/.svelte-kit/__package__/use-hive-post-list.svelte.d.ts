import { type SortType, type RankedPost } from "@kkocot/honeycomb-core";
export interface UseHivePostListOptions {
    sort?: SortType;
    tag?: string;
    limit?: number;
}
export interface UseHivePostListResult {
    readonly posts: RankedPost[];
    readonly is_loading: boolean;
    readonly error: Error | null;
    readonly sort: SortType;
    set_sort: (sort: SortType) => void;
    readonly has_next: boolean;
    readonly has_prev: boolean;
    next_page: () => void;
    prev_page: () => void;
    readonly page: number;
}
/**
 * Hook to fetch a paginated list of ranked Hive posts.
 * Accepts a static options object or a getter function for reactive updates.
 *
 * Uses cursor-based Prev/Next pagination via bridge.get_ranked_posts.
 * Changing sort resets pagination to the first page.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { useHivePostList } from "@hiveio/honeycomb-svelte";
 *   // Static:
 *   const result = useHivePostList({ sort: "trending", limit: 10 });
 *   // Reactive (tracks changes):
 *   let tag = $state("hive");
 *   const result = useHivePostList(() => ({ sort: "trending", tag }));
 * </script>
 *
 * {#each result.posts as post}
 *   <p>{post.title}</p>
 * {/each}
 * ```
 */
export declare function useHivePostList(options?: UseHivePostListOptions | (() => UseHivePostListOptions)): UseHivePostListResult;
//# sourceMappingURL=use-hive-post-list.svelte.d.ts.map