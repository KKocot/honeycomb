import type { ToolbarItem, ToolbarAction, PreviewMode, ToolbarItemType } from "@kkocot/honeycomb-core";
export interface EditorToolbarProps {
    items: ToolbarItem[];
    on_action: (action: ToolbarAction) => void;
    active_actions: Set<ToolbarItemType>;
    is_uploading: boolean;
    preview_mode: PreviewMode;
    on_preview_mode_change: (mode: PreviewMode) => void;
    on_file_upload?: (file: File) => void;
}
declare const EditorToolbar: import("svelte").Component<EditorToolbarProps, {}, "">;
type EditorToolbar = ReturnType<typeof EditorToolbar>;
export default EditorToolbar;
//# sourceMappingURL=EditorToolbar.svelte.d.ts.map