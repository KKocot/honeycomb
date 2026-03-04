import type { EditorActionContext, EditorActionResult } from "../types.js";

function toggle_list_lines(
  ctx: EditorActionContext,
  get_prefix: (index: number) => string,
  detect_prefix: (line: string) => string | null,
): EditorActionResult {
  const { fullText, selectionStart, selectionEnd } = ctx;
  const lines = fullText.split("\n");
  const before_start = fullText.slice(0, selectionStart);
  const start_line_idx = before_start.split("\n").length - 1;
  const before_end = fullText.slice(0, selectionEnd);
  const end_line_idx = before_end.split("\n").length - 1;

  const target_lines = lines.slice(start_line_idx, end_line_idx + 1);
  const all_have_prefix = target_lines.every(
    (line) => detect_prefix(line) !== null,
  );

  let offset_delta = 0;
  let first_line_delta = 0;

  for (let i = start_line_idx; i <= end_line_idx; i++) {
    const relative_idx = i - start_line_idx;

    if (all_have_prefix) {
      const existing = detect_prefix(lines[i]);
      if (existing !== null) {
        const removed_len = existing.length;
        lines[i] = lines[i].slice(removed_len);
        offset_delta -= removed_len;
        if (i === start_line_idx) {
          first_line_delta = -removed_len;
        }
      }
    } else {
      const prefix = get_prefix(relative_idx);
      lines[i] = prefix + lines[i];
      offset_delta += prefix.length;
      if (i === start_line_idx) {
        first_line_delta = prefix.length;
      }
    }
  }

  return {
    text: lines.join("\n"),
    selectionStart: Math.max(0, selectionStart + first_line_delta),
    selectionEnd: Math.max(0, selectionEnd + offset_delta),
  };
}

const UL_REGEX = /^- /;

export function unordered_list_action(
  ctx: EditorActionContext,
): EditorActionResult {
  return toggle_list_lines(
    ctx,
    () => "- ",
    (line) => (UL_REGEX.test(line) ? "- " : null),
  );
}

const OL_REGEX = /^(\d+)\.\s/;

export function ordered_list_action(
  ctx: EditorActionContext,
): EditorActionResult {
  return toggle_list_lines(
    ctx,
    (index) => `${index + 1}. `,
    (line) => {
      const match = line.match(OL_REGEX);
      return match ? match[0] : null;
    },
  );
}

const TASK_REGEX = /^- \[([ x])\] /;

export function task_list_action(
  ctx: EditorActionContext,
): EditorActionResult {
  return toggle_list_lines(
    ctx,
    () => "- [ ] ",
    (line) => {
      const match = line.match(TASK_REGEX);
      return match ? match[0] : null;
    },
  );
}

export function is_unordered_list_active(ctx: EditorActionContext): boolean {
  return UL_REGEX.test(ctx.currentLine);
}

export function is_ordered_list_active(ctx: EditorActionContext): boolean {
  return OL_REGEX.test(ctx.currentLine);
}

export function is_task_list_active(ctx: EditorActionContext): boolean {
  return TASK_REGEX.test(ctx.currentLine);
}
