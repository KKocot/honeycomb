import { untrack } from "svelte";
import { useHive } from "./context.svelte";
import {
  fetch_account_posts,
  type AccountPostCursor,
  type AccountPost,
  type AccountPostsResult,
} from "@kkocot/honeycomb-core";

export interface UseHiveAuthorPostListOptions {
  account: string;
  tag?: string;
  limit?: number;
  api_endpoint?: string;
}

export interface UseHiveAuthorPostListResult {
  readonly posts: AccountPost[];
  readonly is_loading: boolean;
  readonly error: Error | null;
  readonly has_next: boolean;
  readonly has_prev: boolean;
  next_page: () => void;
  prev_page: () => void;
  readonly page: number;
}

const DEFAULT_LIMIT = 20;

const SENTINEL_CURSOR: AccountPostCursor = {
  start_author: "",
  start_permlink: "",
};

/**
 * Hook to fetch a paginated list of posts authored by a Hive account.
 * Accepts a static options object or a getter function for reactive updates.
 *
 * Uses cursor-based Prev/Next pagination via bridge.get_account_posts.
 * Sort is hardcoded to "posts" — only top-level posts authored by the
 * account are returned. Changing account / tag resets pagination to
 * the first page.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { useHiveAuthorPostList } from "@hiveio/honeycomb-svelte";
 *   // Static:
 *   const result = useHiveAuthorPostList({ account: "alice", limit: 10 });
 *   // Reactive (tracks changes):
 *   let account = $state("alice");
 *   const result = useHiveAuthorPostList(() => ({ account }));
 * </script>
 *
 * {#each result.posts as post}
 *   <p>{post.title}</p>
 * {/each}
 * ```
 */
export function useHiveAuthorPostList(
  options:
    | UseHiveAuthorPostListOptions
    | (() => UseHiveAuthorPostListOptions),
): UseHiveAuthorPostListResult {
  const ctx = useHive();
  const get_options =
    typeof options === "function" ? options : () => options;

  let posts: AccountPost[] = $state([]);
  let is_loading: boolean = $state(true);
  let error: Error | null = $state(null);
  let next_cursor: AccountPostCursor | null = $state(null);

  let current_cursor: AccountPostCursor | null = $state(null);
  let cursor_history: AccountPostCursor[] = $state([]);

  function next_page() {
    if (!next_cursor) return;
    if (current_cursor) {
      cursor_history = [...cursor_history, current_cursor];
    } else {
      cursor_history = [...cursor_history, SENTINEL_CURSOR];
    }
    current_cursor = next_cursor;
  }

  function prev_page() {
    if (cursor_history.length === 0) return;
    const previous = cursor_history[cursor_history.length - 1];
    cursor_history = cursor_history.slice(0, -1);
    if (
      previous.start_author === "" &&
      previous.start_permlink === ""
    ) {
      current_cursor = null;
    } else {
      current_cursor = previous;
    }
  }

  // Effect 1: Reset pagination when account/tag identity changes.
  // Uses untrack() so cursor mutations don't trigger this effect to re-run.
  // Mirrors React's separate useEffect([account, tag]) approach.
  $effect(() => {
    const { account, tag } = get_options();
    // Touch the values to register as dependencies (no-op statements).
    void account;
    void tag;
    untrack(() => {
      cursor_history = [];
      current_cursor = null;
    });
  });

  // Effect 2: Fetch posts. Tracks all options + current_cursor as dependencies.
  $effect(() => {
    const chain = ctx.chain;
    const ctx_api_endpoint = ctx.api_endpoint;
    const {
      account,
      tag,
      limit = DEFAULT_LIMIT,
      api_endpoint: opt_api_endpoint,
    } = get_options();

    // Track reactive dependency on current_cursor for re-fetch on pagination.
    const _current_cursor = current_cursor;

    if (!chain) {
      is_loading = false;
      return;
    }

    if (!account) {
      posts = [];
      next_cursor = null;
      is_loading = false;
      error = null;
      return;
    }

    const endpoint =
      opt_api_endpoint ?? ctx_api_endpoint ?? "https://api.hive.blog";

    let cancelled = false;
    posts = [];
    is_loading = true;
    error = null;

    async function load_posts() {
      try {
        const result: AccountPostsResult = await fetch_account_posts({
          api_endpoint: endpoint,
          account,
          tag,
          limit,
          cursor: _current_cursor,
        });

        if (cancelled) return;

        posts = result.posts;
        next_cursor = result.next_cursor;
      } catch (err) {
        if (!cancelled) {
          error =
            err instanceof Error
              ? err
              : new Error("Failed to fetch account posts");
        }
      } finally {
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
