export interface NaiAsset {
  amount: string;
  precision: number;
  nai: string;
}

const NAI_SYMBOL_MAP: Record<string, string> = {
  "@@000000021": "HIVE",
  "@@000000013": "HBD",
  "@@000000037": "VESTS",
};

/**
 * Custom log10 for large number strings.
 * Uses leading 4 digits + string length for precision with big integers.
 * Matches the official Hive condenser implementation.
 */
function log10_string(str: string): number {
  const leading_digits = parseInt(str.substring(0, 4));
  const log =
    Math.log(leading_digits) / Math.LN10 + 0.00000001;
  const n = str.length - 1;
  return n + (log - Math.floor(log));
}

/**
 * Convert raw Hive blockchain reputation to human-readable score.
 *
 * Accepts:
 * - Raw reputation string/number from reputation_api or condenser_api
 *   (e.g. "26714311062" -> 37)
 * - Already converted float from bridge.get_profile
 *   (e.g. 79.75 -> 79)
 * - Zero, null-ish, or invalid values -> 25 (new account default)
 *
 * Formula source: hive/condenser ParsersAndFormatters.js (repLog10)
 */
export function format_reputation(input: string | number): number {
  const str = String(input);

  if (str === "undefined" || str === "null" || str === "NaN" || str === "") {
    return 25;
  }

  const neg = str.charAt(0) === "-";
  const abs_str = neg ? str.substring(1) : str;

  // Already human-readable float from bridge.get_profile (e.g. "79.75")
  if (abs_str.includes(".")) {
    const parsed = parseFloat(abs_str);
    if (isNaN(parsed)) return 25;
    return Math.floor(neg ? -parsed : parsed);
  }

  // Zero or non-numeric -> new account default
  const numeric_check = parseInt(abs_str);
  if (isNaN(numeric_check) || numeric_check === 0) return 25;

  // Raw reputation: use condenser's log10 string algorithm
  let out = log10_string(abs_str);
  if (isNaN(out)) out = 0;
  out = Math.max(out - 9, 0);
  out = (neg ? -1 : 1) * out;
  out = out * 9 + 25;

  return Math.floor(out);
}

export function format_nai_asset(
  asset: NaiAsset
): { amount: number; symbol: string } {
  const amount = Number(asset.amount) / Math.pow(10, asset.precision);
  const symbol = NAI_SYMBOL_MAP[asset.nai] ?? "UNKNOWN";

  return { amount, symbol };
}

function is_bridge_profile_response(
  data: unknown,
): data is { result: { reputation: number } } {
  if (typeof data !== "object" || data === null) return false;
  if (!("result" in data)) return false;

  const result_value = data.result;
  if (typeof result_value !== "object" || result_value === null) return false;
  if (!("reputation" in result_value)) return false;

  return typeof result_value.reputation === "number";
}

/**
 * Fetch pre-computed reputation from Hive bridge API.
 * database_api.find_accounts does NOT include reputation.
 * bridge.get_profile returns the already-converted score (e.g. 75.91).
 */
export async function fetch_bridge_reputation(
  username: string,
  api_endpoint: string,
): Promise<number> {
  const trimmed = username.trim();
  if (!trimmed) return 25;

  const response = await fetch(api_endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "bridge.get_profile",
      params: { account: trimmed },
      id: 1,
    }),
  });

  if (!response.ok) return 25;

  const data: unknown = await response.json();

  if (is_bridge_profile_response(data)) {
    return Math.floor(data.result.reputation);
  }

  return 25;
}

export function convert_vests_to_hp(
  vests: NaiAsset,
  total_vesting_shares: NaiAsset,
  total_vesting_fund_hive: NaiAsset
): number {
  const vests_amount =
    Number(vests.amount) / Math.pow(10, vests.precision);
  const total_vests =
    Number(total_vesting_shares.amount) /
    Math.pow(10, total_vesting_shares.precision);
  const total_hive =
    Number(total_vesting_fund_hive.amount) /
    Math.pow(10, total_vesting_fund_hive.precision);

  if (total_vests === 0 || isNaN(total_vests)) return 0;

  return (vests_amount / total_vests) * total_hive;
}

// Manabar calculation constants
export const MANA_REGENERATION_SECONDS = 432000; // 5 days

export interface ManabarData {
  current: string;
  max: string;
  percentage: number;
  cooldown: number; // seconds until full
}

export function calculate_manabar(
  current_mana: string,
  max_mana: string,
  last_update_time: number,
): ManabarData {
  const now = Math.floor(Date.now() / 1000);
  const elapsed = Math.max(0, now - last_update_time);

  const max_mana_num = BigInt(max_mana);
  let current_mana_num = BigInt(current_mana);

  const regenerated =
    (max_mana_num * BigInt(elapsed)) / BigInt(MANA_REGENERATION_SECONDS);
  current_mana_num = current_mana_num + regenerated;

  if (current_mana_num > max_mana_num) {
    current_mana_num = max_mana_num;
  }

  const percentage =
    max_mana_num > BigInt(0)
      ? Number((current_mana_num * BigInt(10000)) / max_mana_num) / 100
      : 0;

  const remaining = max_mana_num - current_mana_num;
  const cooldown =
    remaining > BigInt(0)
      ? Number(
          (remaining * BigInt(MANA_REGENERATION_SECONDS)) / max_mana_num,
        )
      : 0;

  return {
    current: current_mana_num.toString(),
    max: max_mana_num.toString(),
    percentage: Math.min(100, Math.max(0, percentage)),
    cooldown,
  };
}

export function format_mana_number(num: string): string {
  const n = BigInt(num);
  if (n >= BigInt(1e12))
    return (Number(n / BigInt(1e9)) / 1000).toFixed(1) + "T";
  if (n >= BigInt(1e9))
    return (Number(n / BigInt(1e6)) / 1000).toFixed(1) + "B";
  if (n >= BigInt(1e6))
    return (Number(n / BigInt(1e3)) / 1000).toFixed(1) + "M";
  if (n >= BigInt(1e3)) return (Number(n) / 1000).toFixed(1) + "K";
  return num;
}

export function format_cooldown(seconds: number): string {
  if (seconds <= 0) return "Full";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

// Post helpers

/**
 * Format a blockchain date string into a human-readable "time ago" string.
 * Hive dates are UTC without timezone suffix, so "Z" is appended.
 */
export function format_time_ago(date_string: string): string {
  const date = new Date(date_string + "Z");
  if (isNaN(date.getTime())) return "unknown";
  const now = new Date();
  const diff_ms = now.getTime() - date.getTime();
  const diff_mins = Math.floor(diff_ms / 60000);
  const diff_hours = Math.floor(diff_mins / 60);
  const diff_days = Math.floor(diff_hours / 24);

  if (diff_mins < 60) return `${diff_mins}m ago`;
  if (diff_hours < 24) return `${diff_hours}h ago`;
  if (diff_days < 30) return `${diff_days}d ago`;
  return date.toLocaleDateString();
}

function is_safe_image_url(url: string): boolean {
  return url.startsWith("https://") || url.startsWith("http://");
}

function is_image_metadata(
  meta: unknown,
): meta is { image: string[] } {
  if (typeof meta !== "object" || meta === null) return false;
  if (!("image" in meta)) return false;

  const obj = meta as Record<string, unknown>;
  return (
    Array.isArray(obj.image) &&
    obj.image.length > 0 &&
    typeof obj.image[0] === "string"
  );
}

/**
 * Extract the first image URL from a post's json_metadata string.
 * Returns null if no image found or metadata is invalid.
 */
export function extract_thumbnail(json_metadata: string): string | null {
  try {
    const meta: unknown = JSON.parse(json_metadata);
    if (is_image_metadata(meta)) {
      const url = meta.image[0];
      if (is_safe_image_url(url)) return url;
    }
  } catch {
    // ignore parse errors
  }
  return null;
}
