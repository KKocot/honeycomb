import { ref, watch, toValue, type Ref, type MaybeRefOrGetter } from "vue";
import { useHive } from "./hive-provider.js";
import {
  fetch_account_posts,
  type AccountPostCursor,
  type AccountPost,
  type AccountPostsResult,
} from "@kkocot/honeycomb-core";

export interface UseHiveAuthorPostListOptions {
  account: MaybeRefOrGetter<string>;
  tag?: MaybeRefOrGetter<string | undefined>;
  limit?: MaybeRefOrGetter<number | undefined>;
  apiEndpoint?: MaybeRefOrGetter<string | undefined>;
}

export interface UseHiveAuthorPostListResult {
  posts: Ref<AccountPost[]>;
  isLoading: Ref<boolean>;
  error: Ref<Error | null>;
  hasNext: Ref<boolean>;
  hasPrev: Ref<boolean>;
  nextPage: () => void;
  prevPage: () => void;
  page: Ref<number>;
}

const DEFAULT_LIMIT = 20;

const SENTINEL_CURSOR: AccountPostCursor = {
  start_author: "",
  start_permlink: "",
};

/**
 * Composable to fetch a paginated list of posts authored by a Hive account.
 *
 * Uses cursor-based Prev/Next pagination via bridge.get_account_posts.
 * Sort is hardcoded to "posts" — only top-level posts authored by the
 * account are returned. Changing account / tag resets pagination to
 * the first page.
 *
 * Options accept refs, getters or plain values (MaybeRefOrGetter), so
 * the composable reacts to changes in the parent's reactive state.
 *
 * @example
 * ```vue
 * <script setup>
 * import { useHiveAuthorPostList } from '@hiveio/honeycomb-vue';
 *
 * const { posts, isLoading, nextPage, prevPage, hasNext, hasPrev } =
 *   useHiveAuthorPostList({ account: "alice", limit: 10 });
 * </script>
 * ```
 */
export function useHiveAuthorPostList(
  options: UseHiveAuthorPostListOptions,
): UseHiveAuthorPostListResult {
  const { chain, apiEndpoint: ctx_api_endpoint } = useHive();

  const posts = ref<AccountPost[]>([]) as Ref<AccountPost[]>;
  const is_loading = ref(true);
  const error = ref<Error | null>(null);
  const next_cursor = ref<AccountPostCursor | null>(null);
  const current_cursor = ref<AccountPostCursor | null>(null);

  let cursor_history: AccountPostCursor[] = [];

  const has_next = ref(false);
  const has_prev = ref(false);
  const page = ref(1);

  function update_derived() {
    has_next.value = next_cursor.value !== null;
    has_prev.value = cursor_history.length > 0;
    page.value = cursor_history.length + 1;
  }

  const next_page = () => {
    if (!next_cursor.value) return;
    const cc = current_cursor.value;
    if (cc) {
      cursor_history = [...cursor_history, cc];
    } else {
      cursor_history = [...cursor_history, SENTINEL_CURSOR];
    }
    current_cursor.value = next_cursor.value;
    update_derived();
  };

  const prev_page = () => {
    if (cursor_history.length === 0) return;
    const previous = cursor_history[cursor_history.length - 1];
    cursor_history = cursor_history.slice(0, -1);
    if (
      previous.start_author === "" &&
      previous.start_permlink === ""
    ) {
      current_cursor.value = null;
    } else {
      current_cursor.value = previous;
    }
    update_derived();
  };

  // Reset pagination when account or tag change. Runs synchronously so
  // the main fetch watcher sees a fresh `current_cursor` (null) on the
  // same tick — avoiding a stale fetch with the previous cursor.
  watch(
    [() => toValue(options.account), () => toValue(options.tag)],
    (_new, old) => {
      // Skip the initial run (immediate would otherwise reset on mount,
      // which is harmless but pointless). `old` is undefined on first call.
      if (old === undefined) return;
      cursor_history = [];
      current_cursor.value = null;
      update_derived();
    },
    { flush: "sync" },
  );

  watch(
    [
      () => toValue(options.account),
      () => toValue(options.tag),
      () => toValue(options.limit),
      () => toValue(options.apiEndpoint),
      chain,
      ctx_api_endpoint,
      current_cursor,
    ],
    async (
      [new_account, new_tag, new_limit, opt_endpoint, new_chain, ctx_endpoint, cc],
      _old,
      onCleanup,
    ) => {
      let cancelled = false;
      onCleanup(() => {
        cancelled = true;
      });

      if (!new_chain) {
        is_loading.value = false;
        return;
      }

      if (!new_account) {
        posts.value = [];
        next_cursor.value = null;
        is_loading.value = false;
        error.value = null;
        update_derived();
        return;
      }

      const endpoint =
        opt_endpoint ?? ctx_endpoint ?? "https://api.hive.blog";

      posts.value = [];
      is_loading.value = true;
      error.value = null;

      try {
        const result: AccountPostsResult = await fetch_account_posts({
          api_endpoint: endpoint,
          account: new_account,
          tag: new_tag,
          limit: new_limit ?? DEFAULT_LIMIT,
          cursor: cc,
        });

        if (cancelled) return;

        posts.value = result.posts;
        next_cursor.value = result.next_cursor;
        update_derived();
      } catch (err) {
        if (!cancelled) {
          error.value =
            err instanceof Error
              ? err
              : new Error("Failed to fetch account posts");
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
    isLoading: is_loading,
    error,
    hasNext: has_next,
    hasPrev: has_prev,
    nextPage: next_page,
    prevPage: prev_page,
    page,
  };
}
