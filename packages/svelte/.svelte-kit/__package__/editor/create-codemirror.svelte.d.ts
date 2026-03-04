import { EditorView } from "@codemirror/view";
import type { EditorTheme, EditorActionContext, ToolbarAction } from "@kkocot/honeycomb-core";
export interface CreateCodemirrorOptions {
    initial_value: string;
    on_change: (value: string) => void;
    placeholder?: string;
    theme?: EditorTheme;
    on_selection_change?: (context: EditorActionContext) => void;
    convert_hive_urls?: boolean;
}
export interface CreateCodemirrorReturn {
    readonly view: EditorView | null;
    attach: (el: HTMLDivElement) => void;
    destroy: () => void;
    execute_action: (action: ToolbarAction) => void;
    get_context: () => EditorActionContext | null;
    focus: () => void;
    sync_value: (new_value: string) => void;
    sync_theme: (theme: EditorTheme) => void;
    sync_convert_hive_urls: (value: boolean) => void;
    insert_text: (text: string, at?: number) => void;
}
export declare function create_codemirror(options: CreateCodemirrorOptions): CreateCodemirrorReturn;
//# sourceMappingURL=create-codemirror.svelte.d.ts.map