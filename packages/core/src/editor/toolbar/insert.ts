import type { EditorActionContext, EditorActionResult } from "../types.js";

export function link_action(ctx: EditorActionContext): EditorActionResult {
  const { fullText, selectionStart, selectionEnd, selectedText } = ctx;
  const replacement = `[${selectedText}](url)`;
  const text =
    fullText.slice(0, selectionStart) +
    replacement +
    fullText.slice(selectionEnd);

  const url_start = selectionStart + selectedText.length + 3;
  const url_end = url_start + 3;
  return { text, selectionStart: url_start, selectionEnd: url_end };
}

export function image_action(ctx: EditorActionContext): EditorActionResult {
  const { fullText, selectionStart, selectionEnd, selectedText } = ctx;
  const alt = selectedText || "alt";
  const replacement = `![${alt}](url)`;
  const text =
    fullText.slice(0, selectionStart) +
    replacement +
    fullText.slice(selectionEnd);

  const url_start = selectionStart + alt.length + 4;
  const url_end = url_start + 3;
  return { text, selectionStart: url_start, selectionEnd: url_end };
}

export function spoiler_action(ctx: EditorActionContext): EditorActionResult {
  const { fullText, selectionStart, selectionEnd, selectedText } = ctx;
  const content = selectedText || "Your spoiler content";
  const replacement = `>! [Click to reveal] ${content}`;
  const text =
    fullText.slice(0, selectionStart) +
    replacement +
    fullText.slice(selectionEnd);

  const content_start = selectionStart + ">! [Click to reveal] ".length;
  const content_end = content_start + content.length;
  return { text, selectionStart: content_start, selectionEnd: content_end };
}
