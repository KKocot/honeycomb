import { type ClassValue } from "clsx";
import type { PostHideOption } from "./post-card.svelte";
export declare function cn(...inputs: ClassValue[]): string;
export declare function should_hide(hide: PostHideOption[], option: PostHideOption): boolean;
/**
 * Strip markdown syntax characters for plain text preview.
 */
export declare function strip_markdown(text: string): string;
export declare function get_post_url(author: string, permlink: string, category: string, link_target: string): string;
//# sourceMappingURL=utils.d.ts.map