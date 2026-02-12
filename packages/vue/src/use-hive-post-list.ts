import { ref, watch, type Ref } from "vue";
import { useHive } from "./hive-provider.js";
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
  posts: Ref<RankedPost[]>;
  is_loading: Ref<boolean>;
  error: Ref<Error | null>;
  sort: Ref<SortType>;
  set_sort: (sort: SortType) => void;
  has_next: Ref<boolean>;
  has_prev: Ref<boolean>;
  next_page: () => void;
  prev_page: () => void;
  page: Ref<number>;
}

const DEFAULT_SORT: SortType = "trending";
const DEFAULT_LIMIT = 20;

/**
 * Composable to fetch a paginated list of ranked Hive posts.
 *
 * Uses cursor-based Prev/Next pagination via bridge.get_ranked_posts.
 * Changing sort resets pagination to the first page.
 *
 * @example
 * ```vue
 * <script setup>
 * import { useHivePostList } from '@kkocot/honeycomb-vue';
 *
 * const { posts, is_loading, next_page, prev_page, has_next, has_prev } =
 *   useHivePostList({ sort: "trending", limit: 10 });
 * </script>
 * ```
 */
export function useHivePostList(
  options: UseHivePostListOptions = {},
): UseHivePostListResult {
  const { chain, apiEndpoint } = useHive();
  const { tag, limit = DEFAULT_LIMIT } = options;

  const sort = ref<SortType>(options.sort ?? DEFAULT_SORT) as Ref<SortType>;
  const posts = ref<RankedPost[]>([]) as Ref<RankedPost[]>;
  const is_loading = ref(true);
  const error = ref<Error | null>(null);
  const next_cursor = ref<PaginationCursor | null>(null);
  const current_cursor = ref<PaginationCursor | undefined>(undefined);

  let cursor_history: PaginationCursor[] = [];

  const has_next = ref(false);
  const has_prev = ref(false);
  const page = ref(1);

  function update_derived() {
    has_next.value = next_cursor.value !== null;
    has_prev.value = cursor_history.length > 0;
    page.value = cursor_history.length + 1;
  }

  const set_sort = (new_sort: SortType) => {
    sort.value = new_sort;
    cursor_history = [];
    current_cursor.value = undefined;
    update_derived();
  };

  const next_page = () => {
    if (!next_cursor.value) return;
    const cc = current_cursor.value;
    if (cc) {
      cursor_history = [...cursor_history, cc];
    } else {
      cursor_history = [...cursor_history, { author: "", permlink: "" }];
    }
    current_cursor.value = next_cursor.value;
    update_derived();
  };

  const prev_page = () => {
    if (cursor_history.length === 0) return;
    const previous = cursor_history[cursor_history.length - 1];
    cursor_history = cursor_history.slice(0, -1);
    if (previous.author === "" && previous.permlink === "") {
      current_cursor.value = undefined;
    } else {
      current_cursor.value = previous;
    }
    update_derived();
  };

  watch(
    [chain, apiEndpoint, sort, current_cursor],
    async ([new_chain, current_endpoint, current_sort, cc], __, onCleanup) => {
      let cancelled = false;
      onCleanup(() => {
        cancelled = true;
      });

      if (!new_chain) {
        is_loading.value = false;
        return;
      }

      const endpoint = current_endpoint ?? "https://api.hive.blog";

      posts.value = [];
      is_loading.value = true;
      error.value = null;

      try {
        const result: RankedPostsResult = await fetch_ranked_posts(
          endpoint,
          current_sort,
          tag,
          cc,
          limit,
        );

        if (cancelled) return;

        posts.value = result.posts;
        next_cursor.value = result.next_cursor;
        update_derived();
      } catch (err) {
        if (!cancelled) {
          error.value =
            err instanceof Error
              ? err
              : new Error("Failed to fetch ranked posts");
        }
      } finally {
        if (!cancelled) {
          is_loading.value = false;
        }
      }
    },
    { immediate: true },
  );

  return {
    posts,
    is_loading,
    error,
    sort,
    set_sort,
    has_next,
    has_prev,
    next_page,
    prev_page,
    page,
  };
}
