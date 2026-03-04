import type { DraftConfig, DraftData } from "@kkocot/honeycomb-core";
export interface CreateDraftOptions {
    config: DraftConfig | undefined;
    on_save?: (draft: DraftData) => void;
    on_restore?: (draft: DraftData) => void;
}
export interface CreateDraftReturn {
    save: (content: string) => void;
    restore_draft: () => DraftData | null;
    clear_draft: () => void;
    start_cross_tab_sync: () => () => void;
}
export declare function create_draft(options: CreateDraftOptions): CreateDraftReturn;
//# sourceMappingURL=create-draft.svelte.d.ts.map