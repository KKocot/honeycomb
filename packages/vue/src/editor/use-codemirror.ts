import {
  ref,
  shallowRef,
  watch,
  onMounted,
  onUnmounted,
  type Ref,
} from "vue";
import {
  EditorView,
  keymap,
  placeholder as cm_placeholder,
} from "@codemirror/view";
import { EditorState, Compartment } from "@codemirror/state";
import { markdown } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import {
  defaultKeymap,
  history,
  historyKeymap,
} from "@codemirror/commands";
import { highlightSelectionMatches } from "@codemirror/search";
import { closeBrackets } from "@codemirror/autocomplete";
import { oneDark } from "@codemirror/theme-one-dark";
import type {
  EditorTheme,
  EditorActionContext,
  ToolbarAction,
} from "@kkocot/honeycomb-core";
import { convert_hive_urls_in_text } from "@kkocot/honeycomb-core";

export interface UseCodemirrorOptions {
  value: Ref<string>;
  on_change: (value: string) => void;
  placeholder?: string;
  theme?: Ref<EditorTheme>;
  on_selection_change?: (context: EditorActionContext) => void;
  convert_hive_urls?: Ref<boolean>;
}

export interface UseCodemirrorReturn {
  container_ref: Ref<HTMLDivElement | null>;
  view: Ref<EditorView | null>;
  execute_action: (action: ToolbarAction) => void;
  get_context: () => EditorActionContext | null;
  focus: () => void;
  insert_text: (text: string, at?: number) => void;
}

function resolve_dark_mode(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

function build_context(view: EditorView): EditorActionContext {
  const state = view.state;
  const selection = state.selection.main;
  const full_text = state.doc.toString();
  const selected_text = state.sliceDoc(selection.from, selection.to);
  const line = state.doc.lineAt(selection.from);

  return {
    selectionStart: selection.from,
    selectionEnd: selection.to,
    selectedText: selected_text,
    fullText: full_text,
    lineStart: line.from,
    lineEnd: line.to,
    currentLine: line.text,
  };
}

export function use_codemirror(
  options: UseCodemirrorOptions,
): UseCodemirrorReturn {
  const container_ref = ref<HTMLDivElement | null>(null);
  const view = shallowRef<EditorView | null>(null);
  const theme_compartment = new Compartment();
  let is_external_update = false;
  let theme_observer: MutationObserver | null = null;

  onMounted(() => {
    const container = container_ref.value;
    if (!container) return;

    const theme_value = options.theme?.value ?? "auto";
    const is_dark =
      theme_value === "dark" ||
      (theme_value === "auto" && resolve_dark_mode());

    const update_listener = EditorView.updateListener.of((update) => {
      if (update.docChanged && !is_external_update) {
        options.on_change(update.state.doc.toString());
      }
      if (update.selectionSet && options.on_selection_change) {
        const ctx = build_context(update.view);
        options.on_selection_change(ctx);
      }
    });

    const hive_url_paste_handler = EditorView.domEventHandlers({
      paste(event, paste_view) {
        const convert_urls = options.convert_hive_urls?.value ?? false;
        if (!convert_urls) return false;
        const text = event.clipboardData?.getData("text/plain");
        if (!text) return false;
        const { text: converted, conversions } =
          convert_hive_urls_in_text(text);
        if (conversions.length === 0) return false;
        event.preventDefault();
        const { from, to } = paste_view.state.selection.main;
        paste_view.dispatch({
          changes: { from, to, insert: converted },
          selection: { anchor: from + converted.length },
        });
        return true;
      },
    });

    const extensions = [
      history(),
      closeBrackets(),
      highlightSelectionMatches(),
      markdown({ codeLanguages: languages }),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      update_listener,
      hive_url_paste_handler,
      theme_compartment.of(is_dark ? oneDark : []),
      EditorView.lineWrapping,
    ];

    if (options.placeholder) {
      extensions.push(cm_placeholder(options.placeholder));
    }

    const state = EditorState.create({
      doc: options.value.value,
      extensions,
    });

    const editor_view = new EditorView({
      state,
      parent: container,
    });

    view.value = editor_view;

    // Setup theme observer for auto mode
    if (theme_value === "auto") {
      start_theme_observer(editor_view);
    }
  });

  function start_theme_observer(editor_view: EditorView) {
    theme_observer?.disconnect();
    theme_observer = new MutationObserver(() => {
      const dark = resolve_dark_mode();
      editor_view.dispatch({
        effects: theme_compartment.reconfigure(dark ? oneDark : []),
      });
    });
    theme_observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  // Watch theme changes at runtime
  if (options.theme) {
    watch(options.theme, (new_theme) => {
      const current_view = view.value;
      if (!current_view) return;

      theme_observer?.disconnect();
      theme_observer = null;

      if (new_theme === "auto") {
        const dark = resolve_dark_mode();
        current_view.dispatch({
          effects: theme_compartment.reconfigure(dark ? oneDark : []),
        });
        start_theme_observer(current_view);
      } else {
        current_view.dispatch({
          effects: theme_compartment.reconfigure(
            new_theme === "dark" ? oneDark : [],
          ),
        });
      }
    });
  }

  onUnmounted(() => {
    theme_observer?.disconnect();
    theme_observer = null;
    view.value?.destroy();
    view.value = null;
  });

  // Sync external value changes into CodeMirror
  watch(
    () => options.value.value,
    (new_value) => {
      const current_view = view.value;
      if (!current_view) return;
      const current_value = current_view.state.doc.toString();
      if (current_value === new_value) return;

      is_external_update = true;
      current_view.dispatch({
        changes: {
          from: 0,
          to: current_value.length,
          insert: new_value,
        },
      });
      is_external_update = false;
    },
  );

  function get_context(): EditorActionContext | null {
    const current_view = view.value;
    if (!current_view) return null;
    return build_context(current_view);
  }

  function execute_action(action: ToolbarAction): void {
    const current_view = view.value;
    if (!current_view) return;

    const context = build_context(current_view);
    const result = action.execute(context);

    is_external_update = true;
    current_view.dispatch({
      changes: {
        from: 0,
        to: current_view.state.doc.length,
        insert: result.text,
      },
      selection: {
        anchor: result.selectionStart,
        head: result.selectionEnd,
      },
    });
    is_external_update = false;

    options.on_change(result.text);
    current_view.focus();
  }

  function focus(): void {
    view.value?.focus();
  }

  function insert_text(text: string, at?: number): void {
    const current_view = view.value;
    if (!current_view) return;
    const pos = at ?? current_view.state.selection.main.from;

    is_external_update = true;
    current_view.dispatch({
      changes: { from: pos, to: pos, insert: text },
    });
    is_external_update = false;

    options.on_change(current_view.state.doc.toString());
  }

  return {
    container_ref,
    view,
    execute_action,
    get_context,
    focus,
    insert_text,
  };
}
