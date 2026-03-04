const HIVE_FRONTENDS = new Set([
  "hive.blog",
  "peakd.com",
  "ecency.com",
  "leofinance.io",
  "actifit.io",
  "blog.openhive.network",
  "blog.dev.openhive.network",
  "hiveblog.bard-dev.com",
]);

const USERNAME_REGEX = /^[a-z][a-z0-9.-]{2,15}$/;
const PERMLINK_REGEX = /^[a-z0-9-]+$/;

export interface UrlConversion {
  original: string;
  converted: string;
  position: number;
}

export interface ConvertResult {
  text: string;
  conversions: UrlConversion[];
}

function parse_hive_post_url(
  url_string: string,
): { relative_path: string } | null {
  let url: URL;
  try {
    url = new URL(url_string);
  } catch {
    return null;
  }

  const hostname = url.hostname.replace(/^www\./, "");
  if (!HIVE_FRONTENDS.has(hostname)) return null;

  const { pathname, hash, search } = url;

  const at_index = pathname.indexOf("/@");
  if (at_index === -1) return null;

  const user_path = pathname.slice(at_index);
  const segments = user_path.slice(2).split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const username = segments[0];
  if (!USERNAME_REGEX.test(username)) return null;

  if (segments.length >= 2) {
    const permlink = segments[1];
    if (!PERMLINK_REGEX.test(permlink)) return null;
  }

  const suffix = search + hash;
  return { relative_path: user_path + suffix };
}

export function is_hive_url(url: string): boolean {
  return parse_hive_post_url(url) !== null;
}

export function convert_hive_url(url: string): string | null {
  const parsed = parse_hive_post_url(url);
  return parsed ? parsed.relative_path : null;
}

function extract_code_block_ranges(text: string): Array<[number, number]> {
  const ranges: Array<[number, number]> = [];
  const fenced_regex = /```[\s\S]*?```/g;
  let match: RegExpExecArray | null = fenced_regex.exec(text);
  while (match !== null) {
    ranges.push([match.index, match.index + match[0].length]);
    match = fenced_regex.exec(text);
  }

  const inline_regex = /`[^`\n]+`/g;
  let inline_match: RegExpExecArray | null = inline_regex.exec(text);
  while (inline_match !== null) {
    const start = inline_match.index;
    const end = start + inline_match[0].length;
    const inside_fenced = ranges.some((r) => start >= r[0] && end <= r[1]);
    if (!inside_fenced) {
      ranges.push([start, end]);
    }
    inline_match = inline_regex.exec(text);
  }

  return ranges;
}

function is_inside_code(
  position: number,
  length: number,
  ranges: Array<[number, number]>,
): boolean {
  return ranges.some((r) => position >= r[0] && position + length <= r[1]);
}

export function convert_hive_urls_in_text(text: string): ConvertResult {
  const code_ranges = extract_code_block_ranges(text);
  const conversions: UrlConversion[] = [];
  let offset_delta = 0;

  const md_link_regex = /\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g;
  let result = text.replace(
    md_link_regex,
    (full_match, link_text: string, url: string, match_index: number) => {
      if (is_inside_code(match_index, full_match.length, code_ranges)) {
        return full_match;
      }

      const parsed = parse_hive_post_url(url);
      if (!parsed) return full_match;

      const converted_match = `[${link_text}](${parsed.relative_path})`;
      const adjusted_position = match_index + offset_delta;
      conversions.push({
        original: url,
        converted: parsed.relative_path,
        position: adjusted_position,
      });
      offset_delta += converted_match.length - full_match.length;
      return converted_match;
    },
  );

  const code_ranges_after = extract_code_block_ranges(result);

  const bare_url_regex = /(?<!\]\()https?:\/\/[^\s\])"<>,]+/g;
  offset_delta = 0;
  const intermediate = result;
  let bare_result = "";
  let last_index = 0;
  let bare_match: RegExpExecArray | null = bare_url_regex.exec(intermediate);

  while (bare_match !== null) {
    const match_start = bare_match.index;
    const match_str = bare_match[0];

    bare_result += intermediate.slice(last_index, match_start);

    if (is_inside_code(match_start, match_str.length, code_ranges_after)) {
      bare_result += match_str;
    } else {
      const parsed = parse_hive_post_url(match_str);
      if (parsed) {
        const replacement = `[${parsed.relative_path}](${parsed.relative_path})`;
        conversions.push({
          original: match_str,
          converted: parsed.relative_path,
          position: bare_result.length,
        });
        bare_result += replacement;
      } else {
        bare_result += match_str;
      }
    }

    last_index = match_start + match_str.length;
    bare_match = bare_url_regex.exec(intermediate);
  }

  bare_result += intermediate.slice(last_index);
  result = bare_result;

  return { text: result, conversions };
}
