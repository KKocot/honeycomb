export interface HiveContentRendererProps {
    body: string;
    author?: string;
    permlink?: string;
    options?: Partial<import("@kkocot/honeycomb-renderer").RendererOptions>;
    plugins?: import("@kkocot/honeycomb-renderer").RendererPlugin[];
    class?: string;
}
declare const HiveContentRenderer: import("svelte").Component<HiveContentRendererProps, {}, "">;
type HiveContentRenderer = ReturnType<typeof HiveContentRenderer>;
export default HiveContentRenderer;
//# sourceMappingURL=HiveContentRenderer.svelte.d.ts.map