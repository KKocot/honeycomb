import type { RendererOptions } from "@kkocot/honeycomb-renderer";
export interface EditorPreviewProps {
    content: string;
    renderer_options?: Partial<RendererOptions>;
    class?: string;
}
declare const EditorPreview: import("svelte").Component<EditorPreviewProps, {}, "">;
type EditorPreview = ReturnType<typeof EditorPreview>;
export default EditorPreview;
//# sourceMappingURL=EditorPreview.svelte.d.ts.map