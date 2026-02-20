import { createSignal, createEffect, onCleanup } from "solid-js";
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
  posts: () => RankedPost[];
  is_loading: () => boolean;
  error: () => Error | null;
  sort: () => SortType;
  set_sort: (sort: SortType) => void;
  has_next: () => boolean;
  has_prev: () => boolean;
  next_page: () => void;
  prev_page: () => void;
  page: () => number;
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

  const [sort, set_sort_state] = createSignal<SortType>(
    options.sort ?? DEFAULT_SORT,
  );
  const [posts, set_posts] = createSignal<RankedPost[]>([]);
  const [is_loading, set_is_loading] = createSignal(true);
  const [error, set_error] = createSignal<Error | null>(null);
  const [next_cursor, set_next_cursor] =
    createSignal<PaginationCursor | null>(null);
  const [current_cursor, set_current_cursor] = createSignal<
    PaginationCursor | undefined
  >(undefined);

  let cursor_history: PaginationCursor[] = [];

  const set_sort = (new_sort: SortType) => {
    set_sort_state(new_sort);
    cursor_history = [];
    set_current_cursor(undefined);
  };

  const next_page = () => {
    const nc = next_cursor();
    if (!nc) return;
    const cc = current_cursor();
    if (cc) {
      cursor_history = [...cursor_history, cc];
    } else {
      cursor_history = [...cursor_history, { author: "", permlink: "" }];
    }
    set_current_cursor(nc);
  };

  const prev_page = () => {
    if (cursor_history.length === 0) return;
    const previous = cursor_history[cursor_history.length - 1];
    cursor_history = cursor_history.slice(0, -1);
    if (previous.author === "" && previous.permlink === "") {
      set_current_cursor(undefined);
    } else {
      set_current_cursor(previous);
    }
  };

  createEffect(() => {
    const chain_value = chain();
    const current_endpoint = api_endpoint();
    const current_sort = sort();
    const current_tag = options.tag;
    const current_limit = options.limit ?? DEFAULT_LIMIT;
    const cc = current_cursor();

    if (!chain_value) {
      set_is_loading(false);
      return;
    }

    const endpoint = current_endpoint ?? "https://api.hive.blog";

    let cancelled = false;
    set_posts([]);
    set_is_loading(true);
    set_error(null);

    async function load_posts() {
      try {
        const result: RankedPostsResult = await fetch_ranked_posts(
          endpoint,
          current_sort,
          current_tag,
          cc,
          current_limit,
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

    onCleanup(() => {
      cancelled = true;
    });
  });

  return {
    posts,
    is_loading,
    error,
    sort,
    set_sort,
    has_next: () => next_cursor() !== null,
    has_prev: () => cursor_history.length > 0,
    next_page,
    prev_page,
    page: () => cursor_history.length + 1,
  };
}
