import { describe, it, expect } from "vitest";
import type { EditorActionContext } from "../types";
import {
  heading_action,
  horizontal_rule_action,
  quote_action,
  table_action,
  is_heading_active,
  is_quote_active,
} from "../toolbar/structure";

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

describe("heading_action", () => {
  it("adds ## prefix to plain line", () => {
    const ctx = make_context({
      fullText: "Hello world",
      selectionStart: 5,
      selectionEnd: 5,
      currentLine: "Hello world",
      lineStart: 0,
      lineEnd: 11,
    });
    const result = heading_action(ctx);
    expect(result.text).toBe("## Hello world");
  });

  it("cycles from H2 to H3", () => {
    const ctx = make_context({
      fullText: "## Hello",
      selectionStart: 5,
      selectionEnd: 5,
      currentLine: "## Hello",
      lineStart: 0,
      lineEnd: 8,
    });
    const result = heading_action(ctx);
    expect(result.text).toBe("### Hello");
  });

  it("cycles from H3 to H4", () => {
    const ctx = make_context({
      fullText: "### Hello",
      selectionStart: 6,
      selectionEnd: 6,
      currentLine: "### Hello",
      lineStart: 0,
      lineEnd: 9,
    });
    const result = heading_action(ctx);
    expect(result.text).toBe("#### Hello");
  });

  it("cycles from H5 to H6", () => {
    const ctx = make_context({
      fullText: "##### Hello",
      selectionStart: 8,
      selectionEnd: 8,
      currentLine: "##### Hello",
      lineStart: 0,
      lineEnd: 11,
    });
    const result = heading_action(ctx);
    expect(result.text).toBe("###### Hello");
  });

  it("strips heading from H6 (cycle reset)", () => {
    const ctx = make_context({
      fullText: "###### Hello",
      selectionStart: 9,
      selectionEnd: 9,
      currentLine: "###### Hello",
      lineStart: 0,
      lineEnd: 12,
    });
    const result = heading_action(ctx);
    expect(result.text).toBe("Hello");
  });

  it("handles heading in multiline text", () => {
    const full = "line one\n## Heading\nline three";
    const ctx = make_context({
      fullText: full,
      selectionStart: 12,
      selectionEnd: 12,
      currentLine: "## Heading",
      lineStart: 9,
      lineEnd: 19,
    });
    const result = heading_action(ctx);
    expect(result.text).toBe("line one\n### Heading\nline three");
  });

  it("does not touch H1 - adds ## prefix to plain #-prefixed lines", () => {
    // A line with a single # is H1 - the regex matches #{1,6}
    const ctx = make_context({
      fullText: "# Title",
      selectionStart: 2,
      selectionEnd: 2,
      currentLine: "# Title",
      lineStart: 0,
      lineEnd: 7,
    });
    const result = heading_action(ctx);
    // H1 -> H2
    expect(result.text).toBe("## Title");
  });
});

describe("horizontal_rule_action", () => {
  it("inserts --- at cursor position", () => {
    const ctx = make_context({
      fullText: "above\nbelow",
      selectionStart: 5,
      selectionEnd: 5,
    });
    const result = horizontal_rule_action(ctx);
    expect(result.text).toBe("above\n---\n\nbelow");
    expect(result.selectionStart).toBe(10);
    expect(result.selectionEnd).toBe(10);
  });

  it("inserts --- at the end of text", () => {
    const ctx = make_context({
      fullText: "end",
      selectionStart: 3,
      selectionEnd: 3,
    });
    const result = horizontal_rule_action(ctx);
    expect(result.text).toBe("end\n---\n");
  });

  it("replaces selected text with ---", () => {
    const ctx = make_context({
      fullText: "hello world",
      selectionStart: 5,
      selectionEnd: 11,
    });
    const result = horizontal_rule_action(ctx);
    expect(result.text).toBe("hello\n---\n");
  });
});

describe("quote_action", () => {
  it("adds > prefix to current line", () => {
    const ctx = make_context({
      fullText: "some text",
      selectionStart: 4,
      selectionEnd: 4,
    });
    const result = quote_action(ctx);
    expect(result.text).toBe("> some text");
  });

  it("toggles off when line starts with > ", () => {
    const ctx = make_context({
      fullText: "> quoted text",
      selectionStart: 5,
      selectionEnd: 5,
    });
    const result = quote_action(ctx);
    expect(result.text).toBe("quoted text");
  });

  it("handles multiline selection - adds prefix to all lines", () => {
    const full = "line one\nline two\nline three";
    const ctx = make_context({
      fullText: full,
      selectionStart: 0,
      selectionEnd: 17,
    });
    const result = quote_action(ctx);
    expect(result.text).toBe("> line one\n> line two\nline three");
  });

  it("toggles off multiline when all lines have prefix", () => {
    const full = "> line one\n> line two";
    const ctx = make_context({
      fullText: full,
      selectionStart: 0,
      selectionEnd: 20,
    });
    const result = quote_action(ctx);
    expect(result.text).toBe("line one\nline two");
  });

  it("handles empty text", () => {
    const ctx = make_context({
      fullText: "",
      selectionStart: 0,
      selectionEnd: 0,
    });
    const result = quote_action(ctx);
    expect(result.text).toBe("> ");
  });
});

describe("table_action", () => {
  it("inserts a 3x3 table template", () => {
    const ctx = make_context({
      fullText: "text here",
      selectionStart: 9,
      selectionEnd: 9,
    });
    const result = table_action(ctx);
    expect(result.text).toContain("| Column 1 | Column 2 | Column 3 |");
    expect(result.text).toContain("| -------- | -------- | -------- |");
    expect(result.text).toContain("| Text     | Text     | Text     |");
  });

  it("inserts table after existing content", () => {
    const ctx = make_context({
      fullText: "content",
      selectionStart: 7,
      selectionEnd: 7,
    });
    const result = table_action(ctx);
    expect(result.text.startsWith("content\n")).toBe(true);
  });

  it("places cursor after the table", () => {
    const ctx = make_context({
      fullText: "",
      selectionStart: 0,
      selectionEnd: 0,
    });
    const result = table_action(ctx);
    expect(result.selectionStart).toBe(result.text.length);
    expect(result.selectionEnd).toBe(result.text.length);
  });
});

describe("is_heading_active", () => {
  it("returns true for H2", () => {
    const ctx = make_context({
      fullText: "## Heading",
      selectionStart: 5,
      selectionEnd: 5,
      currentLine: "## Heading",
    });
    expect(is_heading_active(ctx)).toBe(true);
  });

  it("returns true for H6", () => {
    const ctx = make_context({
      fullText: "###### Heading",
      selectionStart: 8,
      selectionEnd: 8,
      currentLine: "###### Heading",
    });
    expect(is_heading_active(ctx)).toBe(true);
  });

  it("returns false for plain text", () => {
    const ctx = make_context({
      fullText: "plain text",
      selectionStart: 3,
      selectionEnd: 3,
      currentLine: "plain text",
    });
    expect(is_heading_active(ctx)).toBe(false);
  });

  it("returns false for # without space (not a heading)", () => {
    const ctx = make_context({
      fullText: "#nospace",
      selectionStart: 3,
      selectionEnd: 3,
      currentLine: "#nospace",
    });
    expect(is_heading_active(ctx)).toBe(false);
  });
});

describe("is_quote_active", () => {
  it("returns true when line starts with > ", () => {
    const ctx = make_context({
      fullText: "> quoted",
      selectionStart: 3,
      selectionEnd: 3,
      currentLine: "> quoted",
    });
    expect(is_quote_active(ctx)).toBe(true);
  });

  it("returns false for > without space", () => {
    const ctx = make_context({
      fullText: ">nospace",
      selectionStart: 3,
      selectionEnd: 3,
      currentLine: ">nospace",
    });
    expect(is_quote_active(ctx)).toBe(false);
  });
});
