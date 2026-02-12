/**
 * Post list utilities for bridge.get_ranked_posts API.
 * Provides types, fetching, and parsing for ranked post listings.
 */

export type SortType = "trending" | "hot" | "created" | "payout" | "muted";

export interface PaginationCursor {
  author: string;
  permlink: string;
}

export interface RankedPost {
  post_id: number;
  author: string;
  permlink: string;
  title: string;
  body: string;
  category: string;
  children: number;
  net_votes: number;
  pending_payout_value: string;
  total_payout_value: string;
  curator_payout_value: string;
  created: string;
  json_metadata: string;
  stats?: {
    total_votes: number;
    is_pinned?: boolean;
  };
}

export interface RankedPostsResult {
  posts: RankedPost[];
  next_cursor: PaginationCursor | null;
}

const DEFAULT_LIMIT = 20;

function is_ranked_post_object(
  item: unknown,
): item is { author: string; permlink: string } {
  if (typeof item !== "object" || item === null) return false;
  if (!("author" in item) || !("permlink" in item)) return false;
  return (
    typeof item.author === "string" &&
    typeof item.permlink === "string" &&
    item.author.length > 0 &&
    item.permlink.length > 0
  );
}

function is_valid_ranked_posts_result(
  data: unknown,
): data is { result: unknown[] } {
  if (typeof data !== "object" || data === null) return false;
  if (!("result" in data)) return false;
  if (!Array.isArray(data.result)) return false;
  return data.result.every(is_ranked_post_object);
}

function is_stats_object(
  value: unknown,
): value is { total_votes: number; is_pinned?: boolean } {
  if (typeof value !== "object" || value === null) return false;
  if (!("total_votes" in value)) return false;
  return typeof value.total_votes === "number";
}

function get_string(obj: Record<string, unknown>, key: string, fallback: string): string {
  const val = obj[key];
  return typeof val === "string" ? val : fallback;
}

function get_number(obj: Record<string, unknown>, key: string, fallback: number): number {
  const val = obj[key];
  return typeof val === "number" ? val : fallback;
}

function to_record(item: unknown): Record<string, unknown> {
  if (typeof item === "object" && item !== null) {
    return item as Record<string, unknown>;
  }
  return {};
}

function parse_ranked_post(raw: unknown): RankedPost {
  const obj = to_record(raw);
  const stats_raw: unknown = "stats" in obj ? obj.stats : undefined;

  return {
    post_id: get_number(obj, "post_id", 0),
    author: get_string(obj, "author", ""),
    permlink: get_string(obj, "permlink", ""),
    title: get_string(obj, "title", ""),
    body: get_string(obj, "body", ""),
    category: get_string(obj, "category", ""),
    children: get_number(obj, "children", 0),
    net_votes: get_number(obj, "net_votes", 0),
    pending_payout_value: get_string(obj, "pending_payout_value", "0.000 HBD"),
    total_payout_value: get_string(obj, "total_payout_value", "0.000 HBD"),
    curator_payout_value: get_string(obj, "curator_payout_value", "0.000 HBD"),
    created: get_string(obj, "created", ""),
    json_metadata: get_string(obj, "json_metadata", "{}"),
    stats: is_stats_object(stats_raw) ? stats_raw : undefined,
  };
}

/**
 * Parse asset string "1.234 HBD" to formatted dollar string "$1.23".
 * Returns "$0.00" for invalid or empty input.
 */
export function format_payout(asset_string: string): string {
  const match = asset_string.match(/^([\d.]+)/);
  if (!match) return "$0.00";
  const value = parseFloat(match[1]);
  if (isNaN(value)) return "$0.00";
  return `$${value.toFixed(2)}`;
}

/**
 * Fetch ranked posts from Hive bridge API.
 *
 * Uses bridge.get_ranked_posts JSON-RPC method.
 * When a cursor is provided, the API returns the cursor post as the first item
 * (duplicate), so it is stripped from the result.
 */
export async function fetch_ranked_posts(
  api_endpoint: string,
  sort: SortType,
  tag?: string,
  cursor?: PaginationCursor,
  limit: number = DEFAULT_LIMIT,
): Promise<RankedPostsResult> {
  const response = await fetch(api_endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "bridge.get_ranked_posts",
      params: {
        sort,
        tag: tag ?? "",
        start_author: cursor?.author ?? "",
        start_permlink: cursor?.permlink ?? "",
        limit: cursor ? limit + 1 : limit,
        observer: "hive.blog",
      },
      id: 1,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data: unknown = await response.json();

  if (!is_valid_ranked_posts_result(data)) {
    throw new Error("Invalid response from bridge.get_ranked_posts");
  }

  const raw_posts: unknown[] = data.result;
  const trimmed = cursor ? raw_posts.slice(1) : raw_posts;
  const posts = trimmed.map(parse_ranked_post);

  const has_more = trimmed.length >= limit;
  const last_post = posts.length > 0 ? posts[posts.length - 1] : undefined;

  const next_cursor: PaginationCursor | null =
    has_more && last_post
      ? { author: last_post.author, permlink: last_post.permlink }
      : null;

  return { posts, next_cursor };
}
