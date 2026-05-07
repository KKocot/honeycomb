"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  posts: AccountPost[];
  is_loading: boolean;
  error: Error | null;
  has_next: boolean;
  has_prev: boolean;
  next_page: () => void;
  prev_page: () => void;
  page: number;
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
  const { chain, api_endpoint: ctx_api_endpoint } = useHive();
  const {
    account,
    tag,
    limit = DEFAULT_LIMIT,
    api_endpoint: opt_api_endpoint,
  } = options;

  const [posts, set_posts] = useState<AccountPost[]>([]);
  const [is_loading, set_is_loading] = useState(true);
  const [error, set_error] = useState<Error | null>(null);
  const [next_cursor, set_next_cursor] = useState<AccountPostCursor | null>(
    null,
  );

  const [current_cursor, set_current_cursor] = useState<
    AccountPostCursor | null
  >(null);
  const cursor_history_ref = useRef<AccountPostCursor[]>([]);

  const next_page = useCallback(() => {
    if (!next_cursor) return;
    if (current_cursor) {
      cursor_history_ref.current = [
        ...cursor_history_ref.current,
        current_cursor,
      ];
    } else {
      cursor_history_ref.current = [
        ...cursor_history_ref.current,
        SENTINEL_CURSOR,
      ];
    }
    set_current_cursor(next_cursor);
  }, [next_cursor, current_cursor]);

  const prev_page = useCallback(() => {
    const history = cursor_history_ref.current;
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    cursor_history_ref.current = history.slice(0, -1);
    if (
      previous.start_author === "" &&
      previous.start_permlink === ""
    ) {
      set_current_cursor(null);
    } else {
      set_current_cursor(previous);
    }
  }, []);

  // Reset pagination when account or tag changes.
  useEffect(() => {
    cursor_history_ref.current = [];
    set_current_cursor(null);
  }, [account, tag]);

  useEffect(() => {
    if (!chain) {
      set_is_loading(false);
      return;
    }

    if (!account) {
      set_posts([]);
      set_next_cursor(null);
      set_is_loading(false);
      set_error(null);
      return;
    }

    const endpoint =
      opt_api_endpoint ?? ctx_api_endpoint ?? "https://api.hive.blog";

    let cancelled = false;
    set_posts([]);
    set_is_loading(true);
    set_error(null);

    async function load_posts() {
      try {
        const result: AccountPostsResult = await fetch_account_posts({
          api_endpoint: endpoint,
          account,
          tag,
          limit,
          cursor: current_cursor,
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

    return () => {
      cancelled = true;
    };
  }, [
    chain,
    ctx_api_endpoint,
    opt_api_endpoint,
    account,
    tag,
    limit,
    current_cursor,
  ]);

  return {
    posts,
    is_loading,
    error,
    has_next: next_cursor !== null,
    has_prev: cursor_history_ref.current.length > 0,
    next_page,
    prev_page,
    page: cursor_history_ref.current.length + 1,
  };
}
