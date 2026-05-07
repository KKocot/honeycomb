/**
 * Author post list utilities for bridge.get_account_posts API.
 * Provides types, fetching, and parsing for account post listings
 * with optional client-side tag filtering and prev/next pagination.
 *
 * Sort is hardcoded to "posts" — only top-level posts authored by the
 * account are returned. Other bridge sort modes are not exposed.
 */

export interface AccountPostCursor {
  start_author: string;
  start_permlink: string;
}

export interface ParsedPostMetadata {
  tags?: string[];
  image?: string[];
  app?: string;
  format?: string;
  [key: string]: unknown;
}

export interface AccountPost {
  author: string;
  permlink: string;
  title: string;
  body: string;
  created: string;
  category: string;
  payout: number;
  pending_payout_value: string;
  total_payout_value: string;
  curator_payout_value: string;
  children: number;
  net_votes: number;
  json_metadata: string;
  parsed_metadata?: ParsedPostMetadata;
  community?: string;
  community_title?: string;
  replies: string[];
}

export interface AccountPostsResult {
  posts: AccountPost[];
  next_cursor: AccountPostCursor | null;
}

export interface FetchAccountPostsOptions {
  api_endpoint: string;
  account: string;
  tag?: string;
  limit?: number;
  cursor?: AccountPostCursor | null;
}

const DEFAULT_LIMIT = 20;
const MAX_ITERATIONS = 5;
/** Maximum items per request — API hard limit for bridge.get_account_posts. */
const API_MAX_LIMIT = 20;

function to_record(item: unknown): Record<string, unknown> {
  if (typeof item === "object" && item !== null) {
    return item as Record<string, unknown>;
  }
  return {};
}

function get_string(
  obj: Record<string, unknown>,
  key: string,
  fallback: string,
): string {
  const val = obj[key];
  return typeof val === "string" ? val : fallback;
}

function get_number(
  obj: Record<string, unknown>,
  key: string,
  fallback: number,
): number {
  const val = obj[key];
  return typeof val === "number" ? val : fallback;
}

function get_optional_string(
  obj: Record<string, unknown>,
  key: string,
): string | undefined {
  const val = obj[key];
  return typeof val === "string" ? val : undefined;
}

function get_string_array(
  obj: Record<string, unknown>,
  key: string,
): string[] {
  const val = obj[key];
  if (!Array.isArray(val)) return [];
  return val.filter((item): item is string => typeof item === "string");
}

function is_account_post_object(
  item: unknown,
): item is { author: string; permlink: string } {
  if (typeof item !== "object" || item === null) return false;
  if (!("author" in item) || !("permlink" in item)) return false;
  return (
    typeof (item as Record<string, unknown>).author === "string" &&
    typeof (item as Record<string, unknown>).permlink === "string"
  );
}

function is_valid_account_posts_response(
  data: unknown,
): data is { result: unknown[] } {
  if (typeof data !== "object" || data === null) return false;
  if (!("result" in data)) return false;
  const result = (data as Record<string, unknown>).result;
  if (!Array.isArray(result)) return false;
  return result.every(is_account_post_object);
}

function parse_metadata(
  json_metadata: unknown,
): ParsedPostMetadata | undefined {
  if (json_metadata === undefined || json_metadata === null) return undefined;
  if (typeof json_metadata === "object") {
    return json_metadata as ParsedPostMetadata;
  }
  if (typeof json_metadata === "string") {
    if (!json_metadata) return undefined;
    try {
      const parsed = JSON.parse(json_metadata);
      if (typeof parsed === "object" && parsed !== null) {
        return parsed as ParsedPostMetadata;
      }
      return undefined;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

function parse_account_post(raw: unknown): AccountPost {
  const obj = to_record(raw);
  const raw_metadata = obj.json_metadata;
  const json_metadata =
    typeof raw_metadata === "string"
      ? raw_metadata
      : typeof raw_metadata === "object" && raw_metadata !== null
        ? JSON.stringify(raw_metadata)
        : "{}";
  const parsed_metadata = parse_metadata(raw_metadata);

  return {
    author: get_string(obj, "author", ""),
    permlink: get_string(obj, "permlink", ""),
    title: get_string(obj, "title", ""),
    body: get_string(obj, "body", ""),
    created: get_string(obj, "created", ""),
    category: get_string(obj, "category", ""),
    payout: get_number(obj, "payout", 0),
    pending_payout_value: get_string(obj, "pending_payout_value", "0.000 HBD"),
    total_payout_value: get_string(obj, "total_payout_value", "0.000 HBD"),
    curator_payout_value: get_string(obj, "curator_payout_value", "0.000 HBD"),
    children: get_number(obj, "children", 0),
    net_votes: get_number(obj, "net_votes", 0),
    json_metadata,
    parsed_metadata,
    community: get_optional_string(obj, "community"),
    community_title: get_optional_string(obj, "community_title"),
    replies: get_string_array(obj, "replies"),
  };
}

interface RpcRequestParams {
  sort: "posts";
  account: string;
  limit: number;
  observer: string;
  start_author?: string;
  start_permlink?: string;
}

async function call_get_account_posts(
  api_endpoint: string,
  params: RpcRequestParams,
): Promise<AccountPost[]> {
  const response = await fetch(api_endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "bridge.get_account_posts",
      params,
      id: 1,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status} from bridge.get_account_posts`,
    );
  }

  const data: unknown = await response.json();

  if (typeof data === "object" && data !== null && "error" in data) {
    const err = (data as Record<string, unknown>).error;
    const message =
      typeof err === "object" && err !== null && "message" in err
        ? String((err as Record<string, unknown>).message)
        : "JSON-RPC error";
    throw new Error(`bridge.get_account_posts: ${message}`);
  }

  if (!is_valid_account_posts_response(data)) {
    throw new Error("Invalid response from bridge.get_account_posts");
  }

  return data.result.map(parse_account_post);
}

function tag_matches(post: AccountPost, normalized_tag: string): boolean {
  const tags = post.parsed_metadata?.tags;
  if (!Array.isArray(tags)) return false;
  return tags.some(
    (t) => typeof t === "string" && t.toLowerCase() === normalized_tag,
  );
}

/**
 * Fetch top-level posts authored by an account from Hive bridge API.
 *
 * Uses bridge.get_account_posts JSON-RPC method with `sort: "posts"`
 * hardcoded — only original top-level posts (not reblogs, comments,
 * replies, or feed entries) are returned.
 * - When `tag` is provided, performs a fetch-loop with client-side filter
 *   (parses json_metadata, matches case-insensitively against parsed_metadata.tags)
 *   until `limit` matching posts are collected, the source list is exhausted,
 *   or MAX_ITERATIONS is reached.
 * - When `cursor` is provided, the API returns the cursor post as the first
 *   item (duplicate), so it is stripped from the result.
 * - Returns full prev/next-style cursor regardless of whether tag filter is active.
 *
 * Page size constraint: The Hive bridge API caps responses at 20 items per
 * request. When a cursor is provided, the API returns the cursor post as the
 * first item (duplicate), which is stripped here. As a result:
 * - First page (no cursor): up to `limit` posts (capped at 20).
 * - Subsequent pages (with cursor): up to `min(limit, 19)` posts.
 *
 * The `next_cursor` is `null` only when the API returned fewer items than
 * requested (true end of list); otherwise the consumer should assume there
 * may be more posts available.
 */
export async function fetch_account_posts(
  options: FetchAccountPostsOptions,
): Promise<AccountPostsResult> {
  const {
    api_endpoint,
    account,
    tag,
    limit = DEFAULT_LIMIT,
    cursor,
  } = options;

  if (!account) {
    return { posts: [], next_cursor: null };
  }

  // Cap user-requested limit to API maximum (20). When a cursor is provided,
  // we request safe_limit + 1 inside the loop because the first item is the
  // cursor post itself (duplicate, stripped below) — this preserves the
  // effective page size after the slice.
  const safe_limit = Math.min(Math.max(1, limit), API_MAX_LIMIT);

  const normalized_tag = tag ? tag.toLowerCase() : null;

  let current_cursor: AccountPostCursor | null = cursor ?? null;
  const collected: AccountPost[] = [];
  let last_batch_last_post: AccountPost | undefined;
  let last_batch_size = 0;
  let iterations = 0;
  let exhausted = false;

  while (iterations < MAX_ITERATIONS) {
    iterations += 1;

    const iter_has_cursor = Boolean(
      current_cursor?.start_author && current_cursor?.start_permlink,
    );
    const iter_api_limit = iter_has_cursor
      ? Math.min(safe_limit + 1, API_MAX_LIMIT)
      : safe_limit;

    const params: RpcRequestParams = {
      sort: "posts",
      account,
      limit: iter_api_limit,
      observer: "",
    };

    if (current_cursor?.start_author && current_cursor?.start_permlink) {
      params.start_author = current_cursor.start_author;
      params.start_permlink = current_cursor.start_permlink;
    }

    const raw_batch = await call_get_account_posts(api_endpoint, params);

    // Strip duplicate cursor post (API returns cursor item as first element).
    const batch = iter_has_cursor ? raw_batch.slice(1) : raw_batch;

    last_batch_size = batch.length;
    if (batch.length > 0) {
      last_batch_last_post = batch[batch.length - 1];
    }

    if (batch.length === 0) {
      exhausted = true;
      break;
    }

    if (!normalized_tag) {
      collected.push(...batch);
      // Single fetch when no tag filter. Compare actual batch size to the
      // expected page size (raw_batch.length is api_limit pre-slice).
      if (raw_batch.length < iter_api_limit) {
        exhausted = true;
      }
      break;
    }

    // Tag filter mode: accumulate matches.
    for (const post of batch) {
      if (tag_matches(post, normalized_tag)) {
        collected.push(post);
        if (collected.length >= limit) break;
      }
    }

    // Stop if API returned less than requested (end of list reached).
    if (raw_batch.length < iter_api_limit) {
      exhausted = true;
      break;
    }

    if (collected.length >= limit) {
      break;
    }

    // Advance cursor for next API call to last post of pre-filter batch.
    if (last_batch_last_post) {
      current_cursor = {
        start_author: last_batch_last_post.author,
        start_permlink: last_batch_last_post.permlink,
      };
    } else {
      exhausted = true;
      break;
    }
  }

  const trimmed = normalized_tag ? collected.slice(0, limit) : collected;

  let next_cursor: AccountPostCursor | null = null;
  if (!exhausted && last_batch_last_post && last_batch_size > 0) {
    next_cursor = {
      start_author: last_batch_last_post.author,
      start_permlink: last_batch_last_post.permlink,
    };
  }

  return { posts: trimmed, next_cursor };
}
