import type { EditorActionContext, EditorActionResult } from "../types.js";
import { wrap_selection } from "./helpers.js";

export function bold_action(ctx: EditorActionContext): EditorActionResult {
  return wrap_selection(ctx, "**", "**");
}

export function italic_action(ctx: EditorActionContext): EditorActionResult {
  return wrap_selection(ctx, "*", "*");
}

export function strikethrough_action(
  ctx: EditorActionContext,
): EditorActionResult {
  return wrap_selection(ctx, "~~", "~~");
}

export function code_action(ctx: EditorActionContext): EditorActionResult {
  return wrap_selection(ctx, "`", "`");
}

export function code_block_action(
  ctx: EditorActionContext,
): EditorActionResult {
  return wrap_selection(ctx, "```\n", "\n```");
}

export function is_bold_active(ctx: EditorActionContext): boolean {
  const { fullText, selectionStart, selectionEnd, selectedText } = ctx;
  if (selectedText.startsWith("**") && selectedText.endsWith("**")) {
    return true;
  }
  return (
    fullText.slice(selectionStart - 2, selectionStart) === "**" &&
    fullText.slice(selectionEnd, selectionEnd + 2) === "**"
  );
}

export function is_italic_active(ctx: EditorActionContext): boolean {
  const { fullText, selectionStart, selectionEnd, selectedText } = ctx;
  if (selectedText.startsWith("*") && selectedText.endsWith("*")) {
    return true;
  }
  const char_before = fullText.slice(selectionStart - 1, selectionStart);
  const char_after = fullText.slice(selectionEnd, selectionEnd + 1);
  const two_before = fullText.slice(selectionStart - 2, selectionStart);
  const two_after = fullText.slice(selectionEnd, selectionEnd + 2);
  return char_before === "*" && char_after === "*" &&
    two_before !== "**" && two_after !== "**";
}

export function is_strikethrough_active(ctx: EditorActionContext): boolean {
  const { fullText, selectionStart, selectionEnd, selectedText } = ctx;
  if (selectedText.startsWith("~~") && selectedText.endsWith("~~")) {
    return true;
  }
  return (
    fullText.slice(selectionStart - 2, selectionStart) === "~~" &&
    fullText.slice(selectionEnd, selectionEnd + 2) === "~~"
  );
}

export function is_code_active(ctx: EditorActionContext): boolean {
  const { fullText, selectionStart, selectionEnd, selectedText } = ctx;
  if (selectedText.startsWith("`") && selectedText.endsWith("`")) {
    return true;
  }
  const char_before = fullText.slice(selectionStart - 1, selectionStart);
  const char_after = fullText.slice(selectionEnd, selectionEnd + 1);
  return char_before === "`" && char_after === "`";
}

export function is_code_block_active(ctx: EditorActionContext): boolean {
  const { fullText, selectionStart } = ctx;
  const text_before = fullText.slice(0, selectionStart);
  const open_count = (text_before.match(/```/g) ?? []).length;
  return open_count % 2 === 1;
}
