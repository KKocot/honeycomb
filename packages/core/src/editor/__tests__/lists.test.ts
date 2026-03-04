import { describe, it, expect } from "vitest";
import type { EditorActionContext } from "../types";
import {
  unordered_list_action,
  ordered_list_action,
  task_list_action,
  is_unordered_list_active,
  is_ordered_list_active,
  is_task_list_active,
} from "../toolbar/lists";

function make_context(
  overrides: Partial<EditorActionContext> = {},
): EditorActionContext {
  const full_text = overrides.fullText ?? "";
  const start = overrides.selectionStart ?? 0;
  const end = overrides.selectionEnd ?? start;
  const selected = overrides.selectedText ?? full_text.slice(start, end);

  const line_start_idx = full_text.lastIndexOf("\n", start - 1) + 1;
  const line_end_raw = full_text.indexOf("\n", start);
  const line_end_idx = line_end_raw === -1 ? full_text.length : line_end_raw;

  return {
    fullText: full_text,
    selectionStart: start,
    selectionEnd: end,
    selectedText: selected,
    lineStart: overrides.lineStart ?? line_start_idx,
    lineEnd: overrides.lineEnd ?? line_end_idx,
    currentLine:
      overrides.currentLine ?? full_text.slice(line_start_idx, line_end_idx),
  };
}

describe("unordered_list_action", () => {
  it("adds - prefix to single line", () => {
    const ctx = make_context({
      fullText: "item one",
      selectionStart: 0,
      selectionEnd: 8,
    });
    const result = unordered_list_action(ctx);
    expect(result.text).toBe("- item one");
  });

  it("toggles off when line starts with - ", () => {
    const ctx = make_context({
      fullText: "- item one",
      selectionStart: 0,
      selectionEnd: 10,
    });
    const result = unordered_list_action(ctx);
    expect(result.text).toBe("item one");
  });

  it("adds prefix to multiple lines", () => {
    const full = "item one\nitem two\nitem three";
    const ctx = make_context({
      fullText: full,
      selectionStart: 0,
      selectionEnd: full.length,
    });
    const result = unordered_list_action(ctx);
    expect(result.text).toBe("- item one\n- item two\n- item three");
  });

  it("toggles off multiple lines when all have prefix", () => {
    const full = "- item one\n- item two\n- item three";
    const ctx = make_context({
      fullText: full,
      selectionStart: 0,
      selectionEnd: full.length,
    });
    const result = unordered_list_action(ctx);
    expect(result.text).toBe("item one\nitem two\nitem three");
  });

  it("adds prefix to all lines when only some have it", () => {
    const full = "- item one\nitem two\n- item three";
    const ctx = make_context({
      fullText: full,
      selectionStart: 0,
      selectionEnd: full.length,
    });
    const result = unordered_list_action(ctx);
    expect(result.text).toBe("- - item one\n- item two\n- - item three");
  });

  it("adjusts selection offsets correctly", () => {
    const ctx = make_context({
      fullText: "item",
      selectionStart: 0,
      selectionEnd: 4,
    });
    const result = unordered_list_action(ctx);
    expect(result.selectionStart).toBe(2);
    expect(result.selectionEnd).toBe(6);
  });
});

describe("ordered_list_action", () => {
  it("adds numbered prefix to single line", () => {
    const ctx = make_context({
      fullText: "item one",
      selectionStart: 0,
      selectionEnd: 8,
    });
    const result = ordered_list_action(ctx);
    expect(result.text).toBe("1. item one");
  });

  it("adds auto-numbered prefixes to multiple lines", () => {
    const full = "first\nsecond\nthird";
    const ctx = make_context({
      fullText: full,
      selectionStart: 0,
      selectionEnd: full.length,
    });
    const result = ordered_list_action(ctx);
    expect(result.text).toBe("1. first\n2. second\n3. third");
  });

  it("toggles off when all lines have numbered prefix", () => {
    const full = "1. first\n2. second\n3. third";
    const ctx = make_context({
      fullText: full,
      selectionStart: 0,
      selectionEnd: full.length,
    });
    const result = ordered_list_action(ctx);
    expect(result.text).toBe("first\nsecond\nthird");
  });

  it("toggles off single line with numbered prefix", () => {
    const ctx = make_context({
      fullText: "1. item",
      selectionStart: 0,
      selectionEnd: 7,
    });
    const result = ordered_list_action(ctx);
    expect(result.text).toBe("item");
  });

  it("adjusts selection correctly for multi-digit numbers", () => {
    const full = "first\nsecond\nthird";
    const ctx = make_context({
      fullText: full,
      selectionStart: 0,
      selectionEnd: full.length,
    });
    const result = ordered_list_action(ctx);
    // "1. " = 3 chars, "2. " = 3, "3. " = 3 -> total delta = 9
    expect(result.selectionEnd).toBe(full.length + 9);
  });
});

describe("task_list_action", () => {
  it("adds task prefix to single line", () => {
    const ctx = make_context({
      fullText: "todo item",
      selectionStart: 0,
      selectionEnd: 9,
    });
    const result = task_list_action(ctx);
    expect(result.text).toBe("- [ ] todo item");
  });

  it("toggles off when line has unchecked task prefix", () => {
    const ctx = make_context({
      fullText: "- [ ] todo item",
      selectionStart: 0,
      selectionEnd: 15,
    });
    const result = task_list_action(ctx);
    expect(result.text).toBe("todo item");
  });

  it("toggles off when line has checked task prefix", () => {
    const ctx = make_context({
      fullText: "- [x] done item",
      selectionStart: 0,
      selectionEnd: 15,
    });
    const result = task_list_action(ctx);
    expect(result.text).toBe("done item");
  });

  it("adds prefix to multiple lines", () => {
    const full = "first\nsecond\nthird";
    const ctx = make_context({
      fullText: full,
      selectionStart: 0,
      selectionEnd: full.length,
    });
    const result = task_list_action(ctx);
    expect(result.text).toBe("- [ ] first\n- [ ] second\n- [ ] third");
  });

  it("toggles off multiline when all have task prefix", () => {
    const full = "- [ ] first\n- [x] second\n- [ ] third";
    const ctx = make_context({
      fullText: full,
      selectionStart: 0,
      selectionEnd: full.length,
    });
    const result = task_list_action(ctx);
    expect(result.text).toBe("first\nsecond\nthird");
  });
});

describe("is_unordered_list_active", () => {
  it("returns true when line starts with - ", () => {
    const ctx = make_context({
      fullText: "- item",
      currentLine: "- item",
      selectionStart: 3,
      selectionEnd: 3,
    });
    expect(is_unordered_list_active(ctx)).toBe(true);
  });

  it("returns false for plain text", () => {
    const ctx = make_context({
      fullText: "plain",
      currentLine: "plain",
      selectionStart: 2,
      selectionEnd: 2,
    });
    expect(is_unordered_list_active(ctx)).toBe(false);
  });

  it("returns false for - without space", () => {
    const ctx = make_context({
      fullText: "-nospace",
      currentLine: "-nospace",
      selectionStart: 3,
      selectionEnd: 3,
    });
    expect(is_unordered_list_active(ctx)).toBe(false);
  });
});

describe("is_ordered_list_active", () => {
  it("returns true for 1. prefix", () => {
    const ctx = make_context({
      fullText: "1. item",
      currentLine: "1. item",
      selectionStart: 3,
      selectionEnd: 3,
    });
    expect(is_ordered_list_active(ctx)).toBe(true);
  });

  it("returns true for multi-digit prefix", () => {
    const ctx = make_context({
      fullText: "12. item",
      currentLine: "12. item",
      selectionStart: 5,
      selectionEnd: 5,
    });
    expect(is_ordered_list_active(ctx)).toBe(true);
  });

  it("returns false for plain text", () => {
    const ctx = make_context({
      fullText: "plain",
      currentLine: "plain",
      selectionStart: 2,
      selectionEnd: 2,
    });
    expect(is_ordered_list_active(ctx)).toBe(false);
  });
});

describe("is_task_list_active", () => {
  it("returns true for unchecked task", () => {
    const ctx = make_context({
      fullText: "- [ ] item",
      currentLine: "- [ ] item",
      selectionStart: 7,
      selectionEnd: 7,
    });
    expect(is_task_list_active(ctx)).toBe(true);
  });

  it("returns true for checked task", () => {
    const ctx = make_context({
      fullText: "- [x] item",
      currentLine: "- [x] item",
      selectionStart: 7,
      selectionEnd: 7,
    });
    expect(is_task_list_active(ctx)).toBe(true);
  });

  it("returns false for plain text", () => {
    const ctx = make_context({
      fullText: "plain",
      currentLine: "plain",
      selectionStart: 2,
      selectionEnd: 2,
    });
    expect(is_task_list_active(ctx)).toBe(false);
  });

  it("returns false for regular unordered list", () => {
    const ctx = make_context({
      fullText: "- item",
      currentLine: "- item",
      selectionStart: 3,
      selectionEnd: 3,
    });
    expect(is_task_list_active(ctx)).toBe(false);
  });
});
