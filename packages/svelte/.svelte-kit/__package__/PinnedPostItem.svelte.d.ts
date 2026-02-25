import type { PostVariant, PostHideOption } from "./post-card.svelte";
export interface PinnedPostItemProps {
    author: string;
    permlink: string;
    variant: PostVariant;
    hide: PostHideOption[];
    link_target: string;
    class?: string;
}
declare const PinnedPostItem: import("svelte").Component<PinnedPostItemProps, {}, "">;
type PinnedPostItem = ReturnType<typeof PinnedPostItem>;
export default PinnedPostItem;
//# sourceMappingURL=PinnedPostItem.svelte.d.ts.map