import type { PostVariant } from "./post-card.svelte";
export interface LoadingSkeletonProps {
    variant: PostVariant;
    count: number;
}
declare const PostListSkeletons: import("svelte").Component<LoadingSkeletonProps, {}, "">;
type PostListSkeletons = ReturnType<typeof PostListSkeletons>;
export default PostListSkeletons;
//# sourceMappingURL=post-list-skeletons.svelte.d.ts.map