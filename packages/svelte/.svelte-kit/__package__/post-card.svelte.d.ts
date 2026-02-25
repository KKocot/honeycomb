export type PostVariant = "card" | "compact" | "grid";
export type PostHideOption = "author" | "thumbnail" | "payout" | "votes" | "comments" | "time";
export interface HivePostCardProps {
    /** Hive post author username */
    author: string;
    /** Hive post permlink */
    permlink: string;
    /** Card display variant */
    variant?: PostVariant;
    /** Elements to hide */
    hide?: PostHideOption[];
    /** Base URL for post links */
    linkTarget?: string;
    /** Additional CSS classes */
    class?: string;
}
declare const PostCard: import("svelte").Component<HivePostCardProps, {}, "">;
type PostCard = ReturnType<typeof PostCard>;
export default PostCard;
//# sourceMappingURL=post-card.svelte.d.ts.map