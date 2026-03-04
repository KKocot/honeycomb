import type { MdEditorConfig, MdEditorCallbacks } from "@kkocot/honeycomb-core";
import type { RendererOptions } from "@kkocot/honeycomb-renderer";
export interface MdEditorProps extends MdEditorCallbacks {
    value: string;
    onchange: (value: string) => void;
    config?: Partial<MdEditorConfig>;
    class?: string;
    renderer_options?: Partial<RendererOptions>;
}
declare const MdEditor: import("svelte").Component<MdEditorProps, {}, "">;
type MdEditor = ReturnType<typeof MdEditor>;
export default MdEditor;
//# sourceMappingURL=MdEditor.svelte.d.ts.map