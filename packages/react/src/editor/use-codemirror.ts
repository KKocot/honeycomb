"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { EditorView, keymap, placeholder as cm_placeholder } from "@codemirror/view";
import { EditorState, Compartment } from "@codemirror/state";
import { markdown } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { defaultKeymap, history, historyKeymap, undo, redo } from "@codemirror/commands";
import { highlightSelectionMatches } from "@codemirror/search";
import { closeBrackets } from "@codemirror/autocomplete";
import { oneDark } from "@codemirror/theme-one-dark";
import type {
  EditorTheme,
  EditorActionContext,
  ToolbarAction,
} from "@kkocot/honeycomb-core";
import { convert_hive_urls_in_text } from "@kkocot/honeycomb-core";

interface UseCodemirrorOptions {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  theme?: EditorTheme;
  onSelectionChange?: (context: EditorActionContext) => void;
  convertHiveUrls?: boolean;
}

interface UseCodemirrorReturn {
  ref: React.RefObject<HTMLDivElement | null>;
  view: EditorView | null;
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

export function use_codemirror(options: UseCodemirrorOptions): UseCodemirrorReturn {
  const {
    value,
    onChange,
    placeholder,
    theme = "auto",
    onSelectionChange,
    convertHiveUrls = false,
  } = options;
  const ref = useRef<HTMLDivElement | null>(null);
  const [view, set_view] = useState<EditorView | null>(null);
  const theme_compartment = useRef(new Compartment());
  const is_external_update = useRef(false);
  const on_change_ref = useRef(onChange);
  const on_selection_ref = useRef(onSelectionChange);
  const convert_hive_urls_ref = useRef(convertHiveUrls);

  on_change_ref.current = onChange;
  on_selection_ref.current = onSelectionChange;
  convert_hive_urls_ref.current = convertHiveUrls;

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const is_dark = theme === "dark" || (theme === "auto" && resolve_dark_mode());

    const update_listener = EditorView.updateListener.of((update) => {
      if (update.docChanged && !is_external_update.current) {
        on_change_ref.current(update.state.doc.toString());
      }
      if (update.selectionSet && on_selection_ref.current) {
        const ctx = build_context(update.view);
        on_selection_ref.current(ctx);
      }
    });

    const hive_url_paste_handler = EditorView.domEventHandlers({
      paste(event, view) {
        if (!convert_hive_urls_ref.current) return false;
        const text = event.clipboardData?.getData("text/plain");
        if (!text) return false;
        const { text: converted, conversions } = convert_hive_urls_in_text(text);
        if (conversions.length === 0) return false;
        event.preventDefault();
        const { from, to } = view.state.selection.main;
        view.dispatch({
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
      theme_compartment.current.of(is_dark ? oneDark : []),
      EditorView.lineWrapping,
    ];

    if (placeholder) {
      extensions.push(cm_placeholder(placeholder));
    }

    const state = EditorState.create({
      doc: value,
      extensions,
    });

    const editor_view = new EditorView({
      state,
      parent: container,
    });

    set_view(editor_view);

    return () => {
      editor_view.destroy();
      set_view(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally run only on mount
  }, []);

  // Sync external value changes into CodeMirror
  useEffect(() => {
    if (!view) return;
    const current_value = view.state.doc.toString();
    if (current_value === value) return;

    is_external_update.current = true;
    view.dispatch({
      changes: {
        from: 0,
        to: current_value.length,
        insert: value,
      },
    });
    is_external_update.current = false;
  }, [view, value]);

  // Sync theme changes
  useEffect(() => {
    if (!view) return;

    if (theme === "auto") {
      const observer = new MutationObserver(() => {
        const is_dark = resolve_dark_mode();
        view.dispatch({
          effects: theme_compartment.current.reconfigure(is_dark ? oneDark : []),
        });
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      // Initial sync
      const is_dark = resolve_dark_mode();
      view.dispatch({
        effects: theme_compartment.current.reconfigure(is_dark ? oneDark : []),
      });

      return () => observer.disconnect();
    }

    const is_dark = theme === "dark";
    view.dispatch({
      effects: theme_compartment.current.reconfigure(is_dark ? oneDark : []),
    });
  }, [view, theme]);

  const get_context = useCallback((): EditorActionContext | null => {
    if (!view) return null;
    return build_context(view);
  }, [view]);

  const execute_action = useCallback(
    (action: ToolbarAction) => {
      if (!view) return;

      const context = build_context(view);
      const result = action.execute(context);

      is_external_update.current = true;
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
      is_external_update.current = false;

      on_change_ref.current(result.text);
      view.focus();
    },
    [view],
  );

  const focus = useCallback(() => {
    view?.focus();
  }, [view]);

  const insert_text_fn = useCallback(
    (text: string, at?: number) => {
      if (!view) return;
      const pos = at ?? view.state.selection.main.from;

      is_external_update.current = true;
      view.dispatch({
        changes: { from: pos, to: pos, insert: text },
      });
      is_external_update.current = false;

      on_change_ref.current(view.state.doc.toString());
    },
    [view],
  );

  return {
    ref,
    view,
    execute_action,
    get_context,
    focus,
    insert_text: insert_text_fn,
  };
}
