/**
 * Composable to fetch a single Hive post via condenser_api.get_content
 * Vue 3 port of the React useHivePost hook
 */

import { ref, watch, type Ref } from "vue";
import { useHive } from "./hive-provider.js";
import {
  format_time_ago,
  extract_thumbnail,
} from "@kkocot/honeycomb-core";

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
  post: Ref<HivePost | null>;
  isLoading: Ref<boolean>;
  error: Ref<Error | null>;
}

/**
 * Parse condenser_api asset string (e.g. "1.234 HBD") to a number.
 * Condenser API returns a different format than database_api (strings vs NaiAsset),
 * so this parser is local to this composable.
 */
function parse_asset_string(asset: string | undefined): number {
  if (!asset) return 0;
  const match = asset.match(/^([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

interface CondenserPostResult {
  author: string;
  permlink: string;
  title: string;
  body: string;
  category: string;
  net_votes: number;
  children: number;
  pending_payout_value: string;
  total_payout_value: string;
  curator_payout_value: string;
  created: string;
  json_metadata: string;
}

function is_valid_post_result(
  data: unknown,
): data is { result: CondenserPostResult } {
  if (typeof data !== "object" || data === null) return false;
  if (!("result" in data)) return false;

  const result = data.result;
  if (typeof result !== "object" || result === null) return false;
  if (!("author" in result)) return false;

  return typeof result.author === "string" && result.author.length > 0;
}

/**
 * Composable to fetch a single Hive post via condenser_api.get_content
 *
 * @example
 * ```vue
 * <script setup>
 * import { useHivePost } from '@barddev/honeycomb-vue';
 *
 * const { post, isLoading, error } = useHivePost("barddev", "my-post-permlink");
 * </script>
 *
 * <template>
 *   <div v-if="isLoading">Loading...</div>
 *   <div v-else-if="error">Error: {{ error.message }}</div>
 *   <div v-else>{{ post?.title }}</div>
 * </template>
 * ```
 */
export function useHivePost(
  author: string,
  permlink: string,
): UseHivePostResult {
  const { chain, apiEndpoint } = useHive();
  const post = ref<HivePost | null>(null);
  const is_loading = ref(true);
  const error = ref<Error | null>(null);

  watch(
    [chain, apiEndpoint],
    async ([new_chain, current_endpoint], __, onCleanup) => {
      let cancelled = false;
      onCleanup(() => {
        cancelled = true;
      });

      if (!new_chain || !author || !permlink) {
        is_loading.value = false;
        return;
      }

      const endpoint = current_endpoint ?? "https://api.hive.blog";

      post.value = null;
      is_loading.value = true;
      error.value = null;

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "condenser_api.get_content",
            params: [author, permlink],
            id: 1,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data: unknown = await response.json();

        if (cancelled) return;

        if (is_valid_post_result(data)) {
          const comment = data.result;

          const pending_payout = parse_asset_string(
            comment.pending_payout_value,
          );
          const author_payout = parse_asset_string(
            comment.total_payout_value,
          );
          const curator_payout = parse_asset_string(
            comment.curator_payout_value,
          );
          const total_payout =
            pending_payout + author_payout + curator_payout;

          post.value = {
            title: comment.title || "Untitled",
            body: comment.body ?? "",
            author: comment.author,
            permlink: comment.permlink,
            category: comment.category ?? "",
            votes: comment.net_votes ?? 0,
            comments: comment.children ?? 0,
            payout: `$${total_payout.toFixed(2)}`,
            created: format_time_ago(comment.created),
            raw_created: comment.created,
            thumbnail:
              extract_thumbnail(
                comment.json_metadata || "{}",
                comment.body,
              ) ?? `https://images.hive.blog/u/${comment.author}/avatar`,
          };
        } else {
          error.value = new Error("Post not found");
        }
      } catch (err) {
        if (!cancelled) {
          error.value =
            err instanceof Error
              ? err
              : new Error("Failed to fetch post");
        }
      } finally {
        if (!cancelled) {
          is_loading.value = false;
        }
      }
    },
    { immediate: true },
  );

  return { post, isLoading: is_loading, error };
}
