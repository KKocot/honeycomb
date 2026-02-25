import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { PostHideOption } from "./post-card.svelte";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function should_hide(
  hide: PostHideOption[],
  option: PostHideOption,
): boolean {
  return hide.includes(option);
}

/**
 * Strip markdown syntax characters for plain text preview.
 */
export function strip_markdown(text: string): string {
  return text.replace(/[#*`>\[\]!]/g, "").substring(0, 150);
}

export function get_post_url(
  author: string,
  permlink: string,
  category: string,
  link_target: string,
): string {
  return category
    ? `${link_target}/${category}/@${author}/${permlink}`
    : `${link_target}/@${author}/${permlink}`;
}
