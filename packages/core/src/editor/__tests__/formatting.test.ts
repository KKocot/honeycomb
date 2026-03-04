import { describe, it, expect } from "vitest";
import type { EditorActionContext } from "../types";
import {
  bold_action,
  italic_action,
  strikethrough_action,
  code_action,
  code_block_action,
  is_bold_active,
  is_italic_active,
  is_strikethrough_active,
  is_code_active,
  is_code_block_active,
} from "../toolbar/formatting";

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
    currentLine: overrides.currentLine ?? full_text.slice(line_start_idx, line_end_idx),
  };
}

describe("bold_action", () => {
  it("wraps selected text with **", () => {
    const ctx = make_context({
      fullText: "hello world",
      selectionStart: 6,
      selectionEnd: 11,
    });
    const result = bold_action(ctx);
    expect(result.text).toBe("hello **world**");
    expect(result.selectionStart).toBe(8);
    expect(result.selectionEnd).toBe(13);
  });

  it("inserts empty bold markers when no selection", () => {
    const ctx = make_context({
      fullText: "hello ",
      selectionStart: 6,
      selectionEnd: 6,
    });
    const result = bold_action(ctx);
    expect(result.text).toBe("hello ****");
    expect(result.selectionStart).toBe(8);
    expect(result.selectionEnd).toBe(8);
  });

  it("toggles off when ** surrounds selection externally", () => {
    const ctx = make_context({
      fullText: "hello **world** end",
      selectionStart: 8,
      selectionEnd: 13,
    });
    const result = bold_action(ctx);
    expect(result.text).toBe("hello world end");
    expect(result.selectionStart).toBe(6);
    expect(result.selectionEnd).toBe(11);
  });

  it("toggles off when selection includes ** wrappers", () => {
    const ctx = make_context({
      fullText: "hello **world** end",
      selectionStart: 6,
      selectionEnd: 15,
    });
    const result = bold_action(ctx);
    expect(result.text).toBe("hello world end");
    expect(result.selectionStart).toBe(6);
    expect(result.selectionEnd).toBe(11);
  });

  it("wraps multiline selection", () => {
    const ctx = make_context({
      fullText: "line one\nline two",
      selectionStart: 5,
      selectionEnd: 13,
    });
    const result = bold_action(ctx);
    expect(result.text).toBe("line **one\nline** two");
  });

  it("wraps at beginning of text", () => {
    const ctx = make_context({
      fullText: "hello",
      selectionStart: 0,
      selectionEnd: 5,
    });
    const result = bold_action(ctx);
    expect(result.text).toBe("**hello**");
    expect(result.selectionStart).toBe(2);
    expect(result.selectionEnd).toBe(7);
  });
});

describe("italic_action", () => {
  it("wraps selected text with *", () => {
    const ctx = make_context({
      fullText: "hello world",
      selectionStart: 6,
      selectionEnd: 11,
    });
    const result = italic_action(ctx);
    expect(result.text).toBe("hello *world*");
    expect(result.selectionStart).toBe(7);
    expect(result.selectionEnd).toBe(12);
  });

  it("toggles off when * surrounds selection externally", () => {
    const ctx = make_context({
      fullText: "hello *world* end",
      selectionStart: 7,
      selectionEnd: 12,
    });
    const result = italic_action(ctx);
    expect(result.text).toBe("hello world end");
    expect(result.selectionStart).toBe(6);
    expect(result.selectionEnd).toBe(11);
  });

  it("toggles off when selection includes * wrappers", () => {
    const ctx = make_context({
      fullText: "hello *world* end",
      selectionStart: 6,
      selectionEnd: 13,
    });
    const result = italic_action(ctx);
    expect(result.text).toBe("hello world end");
    expect(result.selectionStart).toBe(6);
    expect(result.selectionEnd).toBe(11);
  });

  it("does not false-positive on bold **text**", () => {
    const ctx = make_context({
      fullText: "hello **bold** end",
      selectionStart: 9,
      selectionEnd: 13,
    });
    // Inside bold markers - should NOT detect italic
    expect(is_italic_active(ctx)).toBe(false);
  });

  it("inserts empty italic markers when no selection", () => {
    const ctx = make_context({
      fullText: "text ",
      selectionStart: 5,
      selectionEnd: 5,
    });
    const result = italic_action(ctx);
    expect(result.text).toBe("text **");
    expect(result.selectionStart).toBe(6);
    expect(result.selectionEnd).toBe(6);
  });
});

describe("strikethrough_action", () => {
  it("wraps selected text with ~~", () => {
    const ctx = make_context({
      fullText: "hello world",
      selectionStart: 6,
      selectionEnd: 11,
    });
    const result = strikethrough_action(ctx);
    expect(result.text).toBe("hello ~~world~~");
    expect(result.selectionStart).toBe(8);
    expect(result.selectionEnd).toBe(13);
  });

  it("toggles off when ~~ surrounds selection externally", () => {
    const ctx = make_context({
      fullText: "hello ~~world~~ end",
      selectionStart: 8,
      selectionEnd: 13,
    });
    const result = strikethrough_action(ctx);
    expect(result.text).toBe("hello world end");
    expect(result.selectionStart).toBe(6);
    expect(result.selectionEnd).toBe(11);
  });

  it("toggles off when selection includes ~~ wrappers", () => {
    const ctx = make_context({
      fullText: "hello ~~world~~ end",
      selectionStart: 6,
      selectionEnd: 15,
    });
    const result = strikethrough_action(ctx);
    expect(result.text).toBe("hello world end");
    expect(result.selectionStart).toBe(6);
    expect(result.selectionEnd).toBe(11);
  });
});

describe("code_action", () => {
  it("wraps selected text with backtick", () => {
    const ctx = make_context({
      fullText: "use const here",
      selectionStart: 4,
      selectionEnd: 9,
    });
    const result = code_action(ctx);
    expect(result.text).toBe("use `const` here");
    expect(result.selectionStart).toBe(5);
    expect(result.selectionEnd).toBe(10);
  });

  it("toggles off when backtick surrounds selection externally", () => {
    const ctx = make_context({
      fullText: "use `const` here",
      selectionStart: 5,
      selectionEnd: 10,
    });
    const result = code_action(ctx);
    expect(result.text).toBe("use const here");
    expect(result.selectionStart).toBe(4);
    expect(result.selectionEnd).toBe(9);
  });

  it("toggles off when selection includes backtick wrappers", () => {
    const ctx = make_context({
      fullText: "use `const` here",
      selectionStart: 4,
      selectionEnd: 11,
    });
    const result = code_action(ctx);
    expect(result.text).toBe("use const here");
    expect(result.selectionStart).toBe(4);
    expect(result.selectionEnd).toBe(9);
  });

  it("inserts empty backticks when no selection", () => {
    const ctx = make_context({
      fullText: "text ",
      selectionStart: 5,
      selectionEnd: 5,
    });
    const result = code_action(ctx);
    expect(result.text).toBe("text ``");
    expect(result.selectionStart).toBe(6);
    expect(result.selectionEnd).toBe(6);
  });
});

describe("code_block_action", () => {
  it("wraps selected text with triple backticks", () => {
    const ctx = make_context({
      fullText: "const x = 1",
      selectionStart: 0,
      selectionEnd: 11,
    });
    const result = code_block_action(ctx);
    expect(result.text).toBe("```\nconst x = 1\n```");
    expect(result.selectionStart).toBe(4);
    expect(result.selectionEnd).toBe(15);
  });

  it("toggles off when triple backticks surround selection externally", () => {
    const ctx = make_context({
      fullText: "```\nconst x = 1\n```",
      selectionStart: 4,
      selectionEnd: 15,
    });
    const result = code_block_action(ctx);
    expect(result.text).toBe("const x = 1");
    expect(result.selectionStart).toBe(0);
    expect(result.selectionEnd).toBe(11);
  });

  it("inserts empty code block when no selection", () => {
    const ctx = make_context({
      fullText: "",
      selectionStart: 0,
      selectionEnd: 0,
    });
    const result = code_block_action(ctx);
    expect(result.text).toBe("```\n\n```");
    expect(result.selectionStart).toBe(4);
    expect(result.selectionEnd).toBe(4);
  });
});

describe("is_bold_active", () => {
  it("returns true when selection is surrounded by **", () => {
    const ctx = make_context({
      fullText: "**hello**",
      selectionStart: 2,
      selectionEnd: 7,
    });
    expect(is_bold_active(ctx)).toBe(true);
  });

  it("returns true when selected text includes ** wrappers", () => {
    const ctx = make_context({
      fullText: "text **hello** end",
      selectionStart: 5,
      selectionEnd: 14,
    });
    expect(is_bold_active(ctx)).toBe(true);
  });

  it("returns false for plain text", () => {
    const ctx = make_context({
      fullText: "hello world",
      selectionStart: 0,
      selectionEnd: 5,
    });
    expect(is_bold_active(ctx)).toBe(false);
  });
});

describe("is_italic_active", () => {
  it("returns true when selection is surrounded by single *", () => {
    const ctx = make_context({
      fullText: "*hello*",
      selectionStart: 1,
      selectionEnd: 6,
    });
    expect(is_italic_active(ctx)).toBe(true);
  });

  it("returns false when surrounded by **", () => {
    const ctx = make_context({
      fullText: "**hello**",
      selectionStart: 2,
      selectionEnd: 7,
    });
    expect(is_italic_active(ctx)).toBe(false);
  });
});

describe("is_strikethrough_active", () => {
  it("returns true when selection is surrounded by ~~", () => {
    const ctx = make_context({
      fullText: "~~hello~~",
      selectionStart: 2,
      selectionEnd: 7,
    });
    expect(is_strikethrough_active(ctx)).toBe(true);
  });

  it("returns false for plain text", () => {
    const ctx = make_context({
      fullText: "hello",
      selectionStart: 0,
      selectionEnd: 5,
    });
    expect(is_strikethrough_active(ctx)).toBe(false);
  });
});

describe("is_code_active", () => {
  it("returns true when selection is surrounded by backtick", () => {
    const ctx = make_context({
      fullText: "`hello`",
      selectionStart: 1,
      selectionEnd: 6,
    });
    expect(is_code_active(ctx)).toBe(true);
  });

  it("returns false for plain text", () => {
    const ctx = make_context({
      fullText: "hello",
      selectionStart: 0,
      selectionEnd: 5,
    });
    expect(is_code_active(ctx)).toBe(false);
  });
});

describe("is_code_block_active", () => {
  it("returns true when cursor is inside a code block", () => {
    const ctx = make_context({
      fullText: "```\ncode here\n```",
      selectionStart: 8,
      selectionEnd: 8,
    });
    expect(is_code_block_active(ctx)).toBe(true);
  });

  it("returns false when cursor is outside code blocks", () => {
    const ctx = make_context({
      fullText: "text before\n```\ncode\n```\ntext after",
      selectionStart: 5,
      selectionEnd: 5,
    });
    expect(is_code_block_active(ctx)).toBe(false);
  });

  it("returns false when code block is closed", () => {
    const ctx = make_context({
      fullText: "```\ncode\n```\noutside",
      selectionStart: 15,
      selectionEnd: 15,
    });
    expect(is_code_block_active(ctx)).toBe(false);
  });
});
