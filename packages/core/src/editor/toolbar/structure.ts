import type { EditorActionContext, EditorActionResult } from "../types.js";
import { insert_at_cursor, toggle_line_prefix } from "./helpers.js";

const HEADING_REGEX = /^(#{1,6})\s/;

export function heading_action(ctx: EditorActionContext): EditorActionResult {
  const { fullText, currentLine, lineStart, lineEnd } = ctx;
  const match = currentLine.match(HEADING_REGEX);

  if (match) {
    const level = match[1].length;
    if (level < 6) {
      const new_prefix = "#".repeat(level + 1) + " ";
      const old_prefix = "#".repeat(level) + " ";
      const new_line = new_prefix + currentLine.slice(old_prefix.length);
      const text =
        fullText.slice(0, lineStart) + new_line + fullText.slice(lineEnd);
      const cursor = lineStart + new_line.length;
      return { text, selectionStart: cursor, selectionEnd: cursor };
    }
    const stripped = currentLine.slice(match[0].length);
    const text =
      fullText.slice(0, lineStart) + stripped + fullText.slice(lineEnd);
    const cursor = lineStart + stripped.length;
    return { text, selectionStart: cursor, selectionEnd: cursor };
  }

  const new_line = "## " + currentLine;
  const text =
    fullText.slice(0, lineStart) + new_line + fullText.slice(lineEnd);
  const cursor = lineStart + new_line.length;
  return { text, selectionStart: cursor, selectionEnd: cursor };
}

export function horizontal_rule_action(
  ctx: EditorActionContext,
): EditorActionResult {
  return insert_at_cursor(ctx, "\n---\n");
}

export function quote_action(ctx: EditorActionContext): EditorActionResult {
  return toggle_line_prefix(ctx, "> ");
}

export function table_action(ctx: EditorActionContext): EditorActionResult {
  const template =
    "\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text     | Text     |\n";
  return insert_at_cursor(ctx, template);
}

export function is_heading_active(ctx: EditorActionContext): boolean {
  return HEADING_REGEX.test(ctx.currentLine);
}

export function is_quote_active(ctx: EditorActionContext): boolean {
  return ctx.currentLine.startsWith("> ");
}
