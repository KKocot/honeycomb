import { describe, it, expect } from "vitest";
import type { EditorActionContext } from "../types";
import {
  link_action,
  image_action,
  spoiler_action,
} from "../toolbar/insert";

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

describe("link_action", () => {
  it("inserts link with selected text as label", () => {
    const ctx = make_context({
      fullText: "click here please",
      selectionStart: 6,
      selectionEnd: 10,
    });
    const result = link_action(ctx);
    expect(result.text).toBe("click [here](url) please");
  });

  it("selects url placeholder after insert", () => {
    const ctx = make_context({
      fullText: "click here please",
      selectionStart: 6,
      selectionEnd: 10,
    });
    const result = link_action(ctx);
    // "url" should be selected: starts after "[here]("
    const url_in_result = result.text.slice(
      result.selectionStart,
      result.selectionEnd,
    );
    expect(url_in_result).toBe("url");
  });

  it("inserts empty link when no selection", () => {
    const ctx = make_context({
      fullText: "text ",
      selectionStart: 5,
      selectionEnd: 5,
    });
    const result = link_action(ctx);
    expect(result.text).toBe("text [](url)");
    const url_in_result = result.text.slice(
      result.selectionStart,
      result.selectionEnd,
    );
    expect(url_in_result).toBe("url");
  });

  it("inserts link at beginning of text", () => {
    const ctx = make_context({
      fullText: "hello",
      selectionStart: 0,
      selectionEnd: 5,
    });
    const result = link_action(ctx);
    expect(result.text).toBe("[hello](url)");
  });

  it("inserts link at end of text", () => {
    const ctx = make_context({
      fullText: "end",
      selectionStart: 3,
      selectionEnd: 3,
    });
    const result = link_action(ctx);
    expect(result.text).toBe("end[](url)");
  });
});

describe("image_action", () => {
  it("inserts image with selected text as alt", () => {
    const ctx = make_context({
      fullText: "my photo here",
      selectionStart: 3,
      selectionEnd: 8,
    });
    const result = image_action(ctx);
    expect(result.text).toBe("my ![photo](url) here");
  });

  it("selects url placeholder after insert", () => {
    const ctx = make_context({
      fullText: "my photo here",
      selectionStart: 3,
      selectionEnd: 8,
    });
    const result = image_action(ctx);
    const url_in_result = result.text.slice(
      result.selectionStart,
      result.selectionEnd,
    );
    expect(url_in_result).toBe("url");
  });

  it("uses 'alt' as default when no selection", () => {
    const ctx = make_context({
      fullText: "text ",
      selectionStart: 5,
      selectionEnd: 5,
    });
    const result = image_action(ctx);
    expect(result.text).toBe("text ![alt](url)");
  });

  it("selects url placeholder when no selection", () => {
    const ctx = make_context({
      fullText: "",
      selectionStart: 0,
      selectionEnd: 0,
    });
    const result = image_action(ctx);
    expect(result.text).toBe("![alt](url)");
    const url_in_result = result.text.slice(
      result.selectionStart,
      result.selectionEnd,
    );
    expect(url_in_result).toBe("url");
  });
});

describe("spoiler_action", () => {
  it("inserts spoiler with selected text as content", () => {
    const ctx = make_context({
      fullText: "visible secret visible",
      selectionStart: 8,
      selectionEnd: 14,
    });
    const result = spoiler_action(ctx);
    expect(result.text).toBe(
      "visible >! [Click to reveal] secret visible",
    );
  });

  it("selects the content after insert", () => {
    const ctx = make_context({
      fullText: "visible secret visible",
      selectionStart: 8,
      selectionEnd: 14,
    });
    const result = spoiler_action(ctx);
    const selected = result.text.slice(
      result.selectionStart,
      result.selectionEnd,
    );
    expect(selected).toBe("secret");
  });

  it("uses default text when no selection", () => {
    const ctx = make_context({
      fullText: "",
      selectionStart: 0,
      selectionEnd: 0,
    });
    const result = spoiler_action(ctx);
    expect(result.text).toBe(">! [Click to reveal] Your spoiler content");
    const selected = result.text.slice(
      result.selectionStart,
      result.selectionEnd,
    );
    expect(selected).toBe("Your spoiler content");
  });

  it("inserts spoiler at end of text", () => {
    const ctx = make_context({
      fullText: "before ",
      selectionStart: 7,
      selectionEnd: 7,
    });
    const result = spoiler_action(ctx);
    expect(result.text).toBe(
      "before >! [Click to reveal] Your spoiler content",
    );
  });
});
