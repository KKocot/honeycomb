import type { PostVariant, PostHideOption } from "./post-card.svelte";
import type { SortType } from "@kkocot/honeycomb-core";
export interface HivePostListProps {
    /** Initial sort order */
    sort?: SortType;
    /** Community or tag filter */
    tag?: string;
    /** Posts per page */
    limit?: number;
    /** Pinned posts displayed at the top (fetched separately) */
    pinned_posts?: Array<{
        author: string;
        permlink: string;
    }>;
    /** Show sort control buttons */
    show_sort_controls?: boolean;
    /** Card variant for post items */
    variant?: PostVariant;
    /** Elements to hide on post cards */
    hide?: PostHideOption[];
    /** Base URL for post links */
    linkTarget?: string;
    /** Additional CSS classes */
    class?: string;
}
declare const PostList: import("svelte").Component<HivePostListProps, {}, "">;
type PostList = ReturnType<typeof PostList>;
export default PostList;
//# sourceMappingURL=post-list.svelte.d.ts.map