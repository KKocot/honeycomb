// Editor types - framework-agnostic type definitions for Markdown editor

// -- Theme & Preview --

export type PreviewMode = "split" | "tab" | "off";

export type EditorTheme = "light" | "dark" | "auto";

// -- Toolbar --

export type ToolbarItemType =
  | "bold"
  | "italic"
  | "strikethrough"
  | "heading"
  | "horizontal_rule"
  | "link"
  | "quote"
  | "code"
  | "code_block"
  | "image"
  | "table"
  | "unordered_list"
  | "ordered_list"
  | "task_list"
  | "spoiler"
  | "upload_image"
  | "separator"
  | "undo"
  | "redo";

export interface EditorActionContext {
  selectionStart: number;
  selectionEnd: number;
  selectedText: string;
  fullText: string;
  lineStart: number;
  lineEnd: number;
  currentLine: string;
}

export interface EditorActionResult {
  text: string;
  selectionStart: number;
  selectionEnd: number;
}

export interface ToolbarAction {
  execute: (context: EditorActionContext) => EditorActionResult;
  isActive?: (context: EditorActionContext) => boolean;
}

export interface ToolbarItem {
  type: ToolbarItemType;
  label: string;
  icon?: string;
  shortcut?: string;
  action: ToolbarAction;
}

// -- Upload --

export interface UploadResult {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface UploadHandler {
  upload: (file: File) => Promise<UploadResult>;
  maxFileSize?: number;
  acceptedTypes?: string[];
}

// -- Draft auto-save --

export interface DraftData {
  content: string;
  savedAt: number;
  cursorPosition?: number;
}

export interface DraftConfig {
  enabled: boolean;
  key: string;
  debounceMs?: number;
  ttlMs?: number;
}

// -- Paste data (framework-agnostic replacement for ClipboardEvent) --

export interface PasteData {
  text: string;
  html?: string;
  files: File[];
}

// -- Editor plugin --

export interface KeyboardShortcut {
  key: string;
  action: (context: EditorActionContext) => EditorActionResult;
}

export interface EditorPlugin {
  name: string;
  toolbarItems?: ToolbarItem[];
  keyboardShortcuts?: KeyboardShortcut[];
  onPaste?: (
    data: PasteData,
    context: EditorActionContext,
  ) => EditorActionResult | null;
}

// -- Editor state (read-only, observable) --

export interface EditorState {
  content: string;
  selectionStart: number;
  selectionEnd: number;
  isFocused: boolean;
  previewMode: PreviewMode;
  isUploading: boolean;
  wordCount: number;
  charCount: number;
}

// -- Callbacks --

export interface MdEditorCallbacks {
  onChange?: (content: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onUploadStart?: (file: File) => void;
  onUploadComplete?: (result: UploadResult) => void;
  onUploadError?: (error: Error) => void;
  onDraftSave?: (draft: DraftData) => void;
  onDraftRestore?: (draft: DraftData) => void;
}

// -- Main editor config --

export interface MdEditorConfig {
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  autoFocus?: boolean;
  toolbar?: ToolbarItem[];
  plugins?: EditorPlugin[];
  uploadHandler?: UploadHandler;
  draftConfig?: DraftConfig;
  previewMode?: PreviewMode;
  theme?: EditorTheme;
  convertHiveUrls?: boolean;
}
