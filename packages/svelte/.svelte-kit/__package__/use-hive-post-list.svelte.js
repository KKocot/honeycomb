import { useHive } from "./context.svelte";
import { fetch_ranked_posts, } from "@kkocot/honeycomb-core";
const DEFAULT_SORT = "trending";
const DEFAULT_LIMIT = 20;
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
 *   import { useHivePostList } from "@barddev/honeycomb-svelte";
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
export function useHivePostList(options = {}) {
    const ctx = useHive();
    const get_options = typeof options === "function" ? options : () => options;
    let sort = $state(get_options().sort ?? DEFAULT_SORT);
    let posts = $state([]);
    let is_loading = $state(true);
    let error = $state(null);
    let next_cursor = $state(null);
    let current_cursor = $state(undefined);
    let cursor_history = $state([]);
    function set_sort(new_sort) {
        sort = new_sort;
        cursor_history = [];
        current_cursor = undefined;
    }
    function next_page() {
        if (!next_cursor)
            return;
        if (current_cursor) {
            cursor_history = [...cursor_history, current_cursor];
        }
        else {
            cursor_history = [...cursor_history, { author: "", permlink: "" }];
        }
        current_cursor = next_cursor;
    }
    function prev_page() {
        if (cursor_history.length === 0)
            return;
        const previous = cursor_history[cursor_history.length - 1];
        cursor_history = cursor_history.slice(0, -1);
        if (previous.author === "" && previous.permlink === "") {
            current_cursor = undefined;
        }
        else {
            current_cursor = previous;
        }
    }
    $effect(() => {
        const chain = ctx.chain;
        const api_endpoint = ctx.api_endpoint;
        const { tag: opt_tag, limit: opt_limit = DEFAULT_LIMIT } = get_options();
        // Track reactive dependencies
        const _sort = sort;
        const _current_cursor = current_cursor;
        if (!chain) {
            is_loading = false;
            return;
        }
        const endpoint = api_endpoint ?? "https://api.hive.blog";
        let cancelled = false;
        posts = [];
        is_loading = true;
        error = null;
        async function load_posts() {
            try {
                const result = await fetch_ranked_posts(endpoint, _sort, opt_tag, _current_cursor, opt_limit);
                if (cancelled)
                    return;
                posts = result.posts;
                next_cursor = result.next_cursor;
            }
            catch (err) {
                if (!cancelled) {
                    error =
                        err instanceof Error
                            ? err
                            : new Error("Failed to fetch ranked posts");
                }
            }
            finally {
                if (!cancelled) {
                    is_loading = false;
                }
            }
        }
        load_posts();
        return () => {
            cancelled = true;
        };
    });
    return {
        get posts() {
            return posts;
        },
        get is_loading() {
            return is_loading;
        },
        get error() {
            return error;
        },
        get sort() {
            return sort;
        },
        set_sort,
        get has_next() {
            return next_cursor !== null;
        },
        get has_prev() {
            return cursor_history.length > 0;
        },
        next_page,
        prev_page,
        get page() {
            return cursor_history.length + 1;
        },
    };
}
