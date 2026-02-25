import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
export function should_hide(hide, option) {
    return hide.includes(option);
}
/**
 * Strip markdown syntax characters for plain text preview.
 */
export function strip_markdown(text) {
    return text.replace(/[#*`>\[\]!]/g, "").substring(0, 150);
}
export function get_post_url(author, permlink, category, link_target) {
    return category
        ? `${link_target}/${category}/@${author}/${permlink}`
        : `${link_target}/@${author}/${permlink}`;
}
