"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useHive } from "./hive-provider";
import {
  fetch_ranked_posts,
  type SortType,
  type PaginationCursor,
  type RankedPost,
  type RankedPostsResult,
} from "@kkocot/honeycomb-core";

export interface UseHivePostListOptions {
  sort?: SortType;
  tag?: string;
  limit?: number;
}

export interface UseHivePostListResult {
  posts: RankedPost[];
  is_loading: boolean;
  error: Error | null;
  sort: SortType;
  set_sort: (sort: SortType) => void;
  has_next: boolean;
  has_prev: boolean;
  next_page: () => void;
  prev_page: () => void;
  page: number;
}

const DEFAULT_SORT: SortType = "trending";
const DEFAULT_LIMIT = 20;

/**
 * Hook to fetch a paginated list of ranked Hive posts.
 *
 * Uses cursor-based Prev/Next pagination via bridge.get_ranked_posts.
 * Changing sort resets pagination to the first page.
 *
 * @example
 * ```tsx
 * const { posts, is_loading, next_page, prev_page, has_next, has_prev } =
 *   useHivePostList({ sort: "trending", limit: 10 });
 * ```
 */
export function useHivePostList(
  options: UseHivePostListOptions = {},
): UseHivePostListResult {
  const { chain, api_endpoint } = useHive();
  const { tag, limit = DEFAULT_LIMIT } = options;

  const [sort, set_sort_state] = useState<SortType>(
    options.sort ?? DEFAULT_SORT,
  );
  const [posts, set_posts] = useState<RankedPost[]>([]);
  const [is_loading, set_is_loading] = useState(true);
  const [error, set_error] = useState<Error | null>(null);
  const [next_cursor, set_next_cursor] = useState<PaginationCursor | null>(
    null,
  );

  const [current_cursor, set_current_cursor] = useState<
    PaginationCursor | undefined
  >(undefined);
  const cursor_history_ref = useRef<PaginationCursor[]>([]);

  const set_sort = useCallback((new_sort: SortType) => {
    set_sort_state(new_sort);
    cursor_history_ref.current = [];
    set_current_cursor(undefined);
  }, []);

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
        { author: "", permlink: "" },
      ];
    }
    set_current_cursor(next_cursor);
  }, [next_cursor, current_cursor]);

  const prev_page = useCallback(() => {
    const history = cursor_history_ref.current;
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    cursor_history_ref.current = history.slice(0, -1);
    if (previous.author === "" && previous.permlink === "") {
      set_current_cursor(undefined);
    } else {
      set_current_cursor(previous);
    }
  }, []);

  useEffect(() => {
    if (!chain) {
      set_is_loading(false);
      return;
    }

    const endpoint = api_endpoint ?? "https://api.hive.blog";

    let cancelled = false;
    set_posts([]);
    set_is_loading(true);
    set_error(null);

    async function load_posts() {
      try {
        const result: RankedPostsResult = await fetch_ranked_posts(
          endpoint,
          sort,
          tag,
          current_cursor,
          limit,
        );

        if (cancelled) return;

        set_posts(result.posts);
        set_next_cursor(result.next_cursor);
      } catch (err) {
        if (!cancelled) {
          set_error(
            err instanceof Error
              ? err
              : new Error("Failed to fetch ranked posts"),
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
  }, [chain, api_endpoint, sort, tag, limit, current_cursor]);

  return {
    posts,
    is_loading,
    error,
    sort,
    set_sort,
    has_next: next_cursor !== null,
    has_prev: cursor_history_ref.current.length > 0,
    next_page,
    prev_page,
    page: cursor_history_ref.current.length + 1,
  };
}
