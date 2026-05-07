import { createSignal, createEffect, onCleanup } from "solid-js";
import { useHive } from "./hive-provider";
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
  posts: () => AccountPost[];
  is_loading: () => boolean;
  error: () => Error | null;
  has_next: () => boolean;
  has_prev: () => boolean;
  next_page: () => void;
  prev_page: () => void;
  page: () => number;
}

const DEFAULT_LIMIT = 20;

const SENTINEL_CURSOR: AccountPostCursor = {
  start_author: "",
  start_permlink: "",
};

/**
 * Hook to fetch a paginated list of posts authored by a Hive account.
 *
 * Uses cursor-based Prev/Next pagination via bridge.get_account_posts.
 * Sort is hardcoded to "posts" — only top-level posts authored by the
 * account are returned. Changing account / tag resets pagination to
 * the first page.
 *
 * @example
 * ```tsx
 * const { posts, is_loading, next_page, prev_page, has_next, has_prev } =
 *   useHiveAuthorPostList({ account: "alice", limit: 10 });
 * ```
 */
export function useHiveAuthorPostList(
  options: UseHiveAuthorPostListOptions,
): UseHiveAuthorPostListResult {
  const { chain, api_endpoint } = useHive();

  const [posts, set_posts] = createSignal<AccountPost[]>([]);
  const [is_loading, set_is_loading] = createSignal(true);
  const [error, set_error] = createSignal<Error | null>(null);
  const [next_cursor, set_next_cursor] =
    createSignal<AccountPostCursor | null>(null);
  const [current_cursor, set_current_cursor] = createSignal<
    AccountPostCursor | null
  >(null);

  let cursor_history: AccountPostCursor[] = [];

  // Track previous account/tag to reset pagination when identity changes.
  let prev_account: string | undefined;
  let prev_tag: string | undefined;

  const next_page = () => {
    const nc = next_cursor();
    if (!nc) return;
    const cc = current_cursor();
    if (cc) {
      cursor_history = [...cursor_history, cc];
    } else {
      cursor_history = [...cursor_history, SENTINEL_CURSOR];
    }
    set_current_cursor(nc);
  };

  const prev_page = () => {
    if (cursor_history.length === 0) return;
    const previous = cursor_history[cursor_history.length - 1];
    cursor_history = cursor_history.slice(0, -1);
    if (
      previous.start_author === "" &&
      previous.start_permlink === ""
    ) {
      set_current_cursor(null);
    } else {
      set_current_cursor(previous);
    }
  };

  createEffect(() => {
    const chain_value = chain();
    const current_endpoint = api_endpoint();
    const current_account = options.account;
    const current_tag = options.tag;
    const current_limit = options.limit ?? DEFAULT_LIMIT;
    const opt_api_endpoint = options.api_endpoint;

    // Reset pagination when account or tag identity changes.
    if (
      prev_account !== undefined &&
      (prev_account !== current_account || prev_tag !== current_tag)
    ) {
      cursor_history = [];
      set_current_cursor(null);
    }
    prev_account = current_account;
    prev_tag = current_tag;

    const cc = current_cursor();

    if (!chain_value) {
      set_is_loading(false);
      return;
    }

    if (!current_account) {
      set_posts([]);
      set_next_cursor(null);
      set_is_loading(false);
      set_error(null);
      return;
    }

    const endpoint =
      opt_api_endpoint ?? current_endpoint ?? "https://api.hive.blog";

    let cancelled = false;
    set_posts([]);
    set_is_loading(true);
    set_error(null);

    async function load_posts() {
      try {
        const result: AccountPostsResult = await fetch_account_posts({
          api_endpoint: endpoint,
          account: current_account,
          tag: current_tag,
          limit: current_limit,
          cursor: cc,
        });

        if (cancelled) return;

        set_posts(result.posts);
        set_next_cursor(result.next_cursor);
      } catch (err) {
        if (!cancelled) {
          set_error(
            err instanceof Error
              ? err
              : new Error("Failed to fetch account posts"),
          );
        }
      } finally {
        if (!cancelled) {
          set_is_loading(false);
        }
      }
    }

    load_posts();

    onCleanup(() => {
      cancelled = true;
    });
  });

  return {
    posts,
    is_loading,
    error,
    has_next: () => next_cursor() !== null,
    has_prev: () => cursor_history.length > 0,
    next_page,
    prev_page,
    page: () => cursor_history.length + 1,
  };
}
