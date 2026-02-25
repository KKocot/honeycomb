import type { PostVariant, PostHideOption } from "./post-card.svelte";
import type { RankedPost } from "@kkocot/honeycomb-core";
export interface PostItemProps {
    post: RankedPost;
    variant: PostVariant;
    hide: PostHideOption[];
    link_target: string;
    is_pinned?: boolean;
}
export declare function get_thumbnail(post: RankedPost): string | null;
export { should_hide, get_post_url } from "./utils";
declare const PostListItems: import("svelte").Component<PostItemProps, {}, "">;
type PostListItems = ReturnType<typeof PostListItems>;
export default PostListItems;
//# sourceMappingURL=post-list-items.svelte.d.ts.map