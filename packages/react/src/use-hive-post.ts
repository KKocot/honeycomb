"use client";

import { useState, useEffect } from "react";
import { useHive } from "./hive-provider";
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
  post: HivePost | null;
  is_loading: boolean;
  error: Error | null;
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
 *
 * @example
 * ```tsx
 * const { post, is_loading, error } = useHivePost("barddev", "my-post-permlink");
 *
 * if (is_loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 *
 * return <div>{post?.title}</div>;
 * ```
 */
export function useHivePost(
  author: string,
  permlink: string,
): UseHivePostResult {
  const { chain, api_endpoint } = useHive();
  const [post, set_post] = useState<HivePost | null>(null);
  const [is_loading, set_is_loading] = useState(true);
  const [error, set_error] = useState<Error | null>(null);

  useEffect(() => {
    if (!chain || !author || !permlink) {
      set_is_loading(false);
      return;
    }

    const endpoint = api_endpoint ?? "https://api.hive.blog";

    let cancelled = false;
    set_post(null);
    set_is_loading(true);
    set_error(null);

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

          set_post({
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
            thumbnail: extract_thumbnail(comment.json_metadata || "{}"),
          });
        } else {
          set_error(new Error("Post not found"));
        }
      } catch (err) {
        if (!cancelled) {
          set_error(
            err instanceof Error
              ? err
              : new Error("Failed to fetch post"),
          );
        }
      } finally {
        if (!cancelled) {
          set_is_loading(false);
        }
      }
    }

    fetch_post();

    return () => {
      cancelled = true;
    };
  }, [chain, api_endpoint, author, permlink]);

  return { post, is_loading, error };
}
