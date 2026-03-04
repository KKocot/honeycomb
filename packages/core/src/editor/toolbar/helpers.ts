import type { EditorActionContext, EditorActionResult } from "../types.js";

export function get_lines_in_range(
  text: string,
  start: number,
  end: number,
): string[] {
  const before = text.slice(0, start);
  const start_line = before.split("\n").length - 1;
  const up_to_end = text.slice(0, end);
  const end_line = up_to_end.split("\n").length - 1;
  const all_lines = text.split("\n");
  return all_lines.slice(start_line, end_line + 1);
}

export function get_line_offsets(
  text: string,
  start: number,
  end: number,
): { line_start: number; line_end: number } {
  const before = text.slice(0, start);
  const start_line_idx = before.split("\n").length - 1;
  const up_to_end = text.slice(0, end);
  const end_line_idx = up_to_end.split("\n").length - 1;
  const all_lines = text.split("\n");

  let line_start = 0;
  for (let i = 0; i < start_line_idx; i++) {
    line_start += all_lines[i].length + 1;
  }

  let line_end = line_start;
  for (let i = start_line_idx; i <= end_line_idx; i++) {
    line_end += all_lines[i].length + (i < end_line_idx ? 1 : 0);
  }

  return { line_start, line_end };
}

export function wrap_selection(
  ctx: EditorActionContext,
  before: string,
  after: string,
): EditorActionResult {
  const { fullText, selectionStart, selectionEnd, selectedText } = ctx;

  const has_wrapper =
    fullText.slice(selectionStart - before.length, selectionStart) === before &&
    fullText.slice(selectionEnd, selectionEnd + after.length) === after;

  if (has_wrapper) {
    const text =
      fullText.slice(0, selectionStart - before.length) +
      selectedText +
      fullText.slice(selectionEnd + after.length);
    return {
      text,
      selectionStart: selectionStart - before.length,
      selectionEnd: selectionEnd - before.length,
    };
  }

  const wrapped_inside =
    selectedText.startsWith(before) && selectedText.endsWith(after);

  if (wrapped_inside && selectedText.length >= before.length + after.length) {
    const unwrapped = selectedText.slice(
      before.length,
      selectedText.length - after.length,
    );
    const text =
      fullText.slice(0, selectionStart) +
      unwrapped +
      fullText.slice(selectionEnd);
    return {
      text,
      selectionStart,
      selectionEnd: selectionStart + unwrapped.length,
    };
  }

  const text =
    fullText.slice(0, selectionStart) +
    before +
    selectedText +
    after +
    fullText.slice(selectionEnd);
  return {
    text,
    selectionStart: selectionStart + before.length,
    selectionEnd: selectionEnd + before.length,
  };
}

export function toggle_line_prefix(
  ctx: EditorActionContext,
  prefix: string,
): EditorActionResult {
  const { fullText, selectionStart, selectionEnd } = ctx;
  const lines = fullText.split("\n");
  const before_start = fullText.slice(0, selectionStart);
  const start_line_idx = before_start.split("\n").length - 1;
  const before_end = fullText.slice(0, selectionEnd);
  const end_line_idx = before_end.split("\n").length - 1;

  const all_have_prefix = lines
    .slice(start_line_idx, end_line_idx + 1)
    .every((line) => line.startsWith(prefix));

  let offset_delta = 0;

  for (let i = start_line_idx; i <= end_line_idx; i++) {
    if (all_have_prefix) {
      lines[i] = lines[i].slice(prefix.length);
      offset_delta -= prefix.length;
    } else {
      lines[i] = prefix + lines[i];
      offset_delta += prefix.length;
    }
  }

  const text = lines.join("\n");
  const first_line_delta = all_have_prefix
    ? -prefix.length
    : prefix.length;

  return {
    text,
    selectionStart: Math.max(0, selectionStart + first_line_delta),
    selectionEnd: Math.max(0, selectionEnd + offset_delta),
  };
}

export function insert_at_cursor(
  ctx: EditorActionContext,
  insert_text: string,
): EditorActionResult {
  const { fullText, selectionStart, selectionEnd } = ctx;
  const text =
    fullText.slice(0, selectionStart) +
    insert_text +
    fullText.slice(selectionEnd);
  const cursor = selectionStart + insert_text.length;
  return { text, selectionStart: cursor, selectionEnd: cursor };
}

export function noop_result(ctx: EditorActionContext): EditorActionResult {
  return {
    text: ctx.fullText,
    selectionStart: ctx.selectionStart,
    selectionEnd: ctx.selectionEnd,
  };
}
