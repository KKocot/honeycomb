import { EditorView, keymap, placeholder as cm_placeholder } from "@codemirror/view";
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

export function create_codemirror(
  options: CreateCodemirrorOptions,
): CreateCodemirrorReturn {
  let view: EditorView | null = $state(null);
  const theme_compartment = new Compartment();
  let is_external_update = false;
  let mutation_observer: MutationObserver | null = null;
  let current_convert_hive_urls = options.convert_hive_urls ?? false;

  function attach(container: HTMLDivElement): void {
    if (view) return;

    const theme_value = options.theme ?? "auto";
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
        if (!current_convert_hive_urls) return false;
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
      doc: options.initial_value,
      extensions,
    });

    const editor_view = new EditorView({
      state,
      parent: container,
    });

    view = editor_view;
  }

  function destroy(): void {
    mutation_observer?.disconnect();
    mutation_observer = null;
    view?.destroy();
    view = null;
  }

  function sync_value(new_value: string): void {
    if (!view) return;
    const current_value = view.state.doc.toString();
    if (current_value === new_value) return;

    is_external_update = true;
    view.dispatch({
      changes: {
        from: 0,
        to: current_value.length,
        insert: new_value,
      },
    });
    is_external_update = false;
  }

  function sync_theme(theme: EditorTheme): void {
    if (!view) return;

    mutation_observer?.disconnect();
    mutation_observer = null;

    if (theme === "auto") {
      mutation_observer = new MutationObserver(() => {
        if (!view) return;
        const is_dark = resolve_dark_mode();
        view.dispatch({
          effects: theme_compartment.reconfigure(is_dark ? oneDark : []),
        });
      });

      mutation_observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      const is_dark = resolve_dark_mode();
      view.dispatch({
        effects: theme_compartment.reconfigure(is_dark ? oneDark : []),
      });
      return;
    }

    const is_dark = theme === "dark";
    view.dispatch({
      effects: theme_compartment.reconfigure(is_dark ? oneDark : []),
    });
  }

  function get_context(): EditorActionContext | null {
    if (!view) return null;
    return build_context(view);
  }

  function execute_action(action: ToolbarAction): void {
    if (!view) return;

    const context = build_context(view);
    const result = action.execute(context);

    is_external_update = true;
    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: result.text,
      },
      selection: {
        anchor: result.selectionStart,
        head: result.selectionEnd,
      },
    });
    is_external_update = false;

    options.on_change(result.text);
    view.focus();
  }

  function sync_convert_hive_urls(value: boolean): void {
    current_convert_hive_urls = value;
  }

  function insert_text(text: string, at?: number): void {
    if (!view) return;
    const pos = at ?? view.state.selection.main.from;

    is_external_update = true;
    view.dispatch({
      changes: { from: pos, to: pos, insert: text },
    });
    is_external_update = false;

    options.on_change(view.state.doc.toString());
  }

  function focus(): void {
    view?.focus();
  }

  return {
    get view() {
      return view;
    },
    attach,
    destroy,
    execute_action,
    get_context,
    focus,
    sync_value,
    sync_theme,
    sync_convert_hive_urls,
    insert_text,
  };
}
