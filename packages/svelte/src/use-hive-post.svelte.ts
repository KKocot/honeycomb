import { useHive } from "./context.svelte";
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
  readonly post: HivePost | null;
  readonly is_loading: boolean;
  readonly error: Error | null;
}

/**
 * Parse condenser_api asset string (e.g. "1.234 HBD") to a number.
 * Condenser API returns a different format than database_api (strings vs NaiAsset),
 * so this parser is local to this hook.
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
 * Hook to fetch a single Hive post via condenser_api.get_content.
 * Accepts static strings or getter functions for reactive updates.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { useHivePost } from "@hiveio/honeycomb-svelte";
 *   // Static:
 *   const result = useHivePost("barddev", "my-post-permlink");
 *   // Reactive (tracks changes):
 *   let author = $state("barddev");
 *   const result = useHivePost(() => author, () => permlink);
 * </script>
 *
 * {#if result.is_loading}Loading...{/if}
 * {#if result.post}{result.post.title}{/if}
 * ```
 */
export function useHivePost(
  author_or_getter: string | (() => string),
  permlink_or_getter: string | (() => string),
): UseHivePostResult {
  const ctx = useHive();
  const get_author =
    typeof author_or_getter === "function"
      ? author_or_getter
      : () => author_or_getter;
  const get_permlink =
    typeof permlink_or_getter === "function"
      ? permlink_or_getter
      : () => permlink_or_getter;

  let post: HivePost | null = $state(null);
  let is_loading: boolean = $state(true);
  let error: Error | null = $state(null);

  $effect(() => {
    const chain = ctx.chain;
    const api_endpoint = ctx.api_endpoint;
    const author = get_author();
    const permlink = get_permlink();

    if (!chain || !author || !permlink) {
      is_loading = false;
      return;
    }

    const endpoint = api_endpoint ?? "https://api.hive.blog";

    let cancelled = false;
    post = null;
    is_loading = true;
    error = null;

    async function fetch_post() {
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
          const total_payout = pending_payout + author_payout + curator_payout;

          post = {
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
          error = new Error("Post not found");
        }
      } catch (err) {
        if (!cancelled) {
          error =
            err instanceof Error
              ? err
              : new Error("Failed to fetch post");
        }
      } finally {
        if (!cancelled) {
          is_loading = false;
        }
      }
    }

    fetch_post();

    return () => {
      cancelled = true;
    };
  });

  return {
    get post() {
      return post;
    },
    get is_loading() {
      return is_loading;
    },
    get error() {
      return error;
    },
  };
}
