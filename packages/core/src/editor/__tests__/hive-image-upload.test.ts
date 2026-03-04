import { describe, it, expect } from "vitest";
import type { EditorActionContext, UploadResult } from "../types";
import {
  create_hive_upload_handler,
  extract_images_from_markdown,
  insert_image_markdown,
} from "../upload/hive-image-upload";

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

function make_file(
  name: string,
  size: number,
  type: string,
): File {
  const content = new Uint8Array(size);
  return new File([content], name, { type });
}

describe("create_hive_upload_handler", () => {
  it("returns handler with default maxFileSize (10MB)", () => {
    const handler = create_hive_upload_handler({
      imageEndpoint: "https://images.hive.blog/",
      username: "testuser",
      signChallenge: async () => "sig",
    });
    expect(handler.maxFileSize).toBe(10 * 1024 * 1024);
  });

  it("returns handler with default acceptedTypes", () => {
    const handler = create_hive_upload_handler({
      imageEndpoint: "https://images.hive.blog/",
      username: "testuser",
      signChallenge: async () => "sig",
    });
    expect(handler.acceptedTypes).toEqual([
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ]);
  });

  it("uses custom maxFileSize when provided", () => {
    const handler = create_hive_upload_handler({
      imageEndpoint: "https://images.hive.blog/",
      username: "testuser",
      signChallenge: async () => "sig",
      maxFileSize: 5 * 1024 * 1024,
    });
    expect(handler.maxFileSize).toBe(5 * 1024 * 1024);
  });

  it("uses custom acceptedTypes when provided", () => {
    const handler = create_hive_upload_handler({
      imageEndpoint: "https://images.hive.blog/",
      username: "testuser",
      signChallenge: async () => "sig",
      acceptedTypes: ["image/png"],
    });
    expect(handler.acceptedTypes).toEqual(["image/png"]);
  });

  it("rejects file exceeding max size", async () => {
    const handler = create_hive_upload_handler({
      imageEndpoint: "https://images.hive.blog/",
      username: "testuser",
      signChallenge: async () => "sig",
      maxFileSize: 1024,
    });
    const large_file = make_file("big.jpg", 2048, "image/jpeg");

    await expect(handler.upload(large_file)).rejects.toThrow(
      /exceeds maximum size/,
    );
  });

  it("rejects file with invalid MIME type", async () => {
    const handler = create_hive_upload_handler({
      imageEndpoint: "https://images.hive.blog/",
      username: "testuser",
      signChallenge: async () => "sig",
    });
    const bad_file = make_file("doc.pdf", 100, "application/pdf");

    await expect(handler.upload(bad_file)).rejects.toThrow(
      /not accepted/,
    );
  });

  it("includes file name in size error message", async () => {
    const handler = create_hive_upload_handler({
      imageEndpoint: "https://images.hive.blog/",
      username: "testuser",
      signChallenge: async () => "sig",
      maxFileSize: 100,
    });
    const file = make_file("photo.png", 200, "image/png");

    await expect(handler.upload(file)).rejects.toThrow("photo.png");
  });

  it("includes rejected MIME type in error message", async () => {
    const handler = create_hive_upload_handler({
      imageEndpoint: "https://images.hive.blog/",
      username: "testuser",
      signChallenge: async () => "sig",
    });
    const file = make_file("video.mp4", 100, "video/mp4");

    await expect(handler.upload(file)).rejects.toThrow("video/mp4");
  });
});

describe("extract_images_from_markdown", () => {
  it("extracts single image URL", () => {
    const text = "![alt text](https://images.hive.blog/photo.jpg)";
    const urls = extract_images_from_markdown(text);
    expect(urls).toEqual(["https://images.hive.blog/photo.jpg"]);
  });

  it("extracts multiple image URLs", () => {
    const text =
      "![a](url1.jpg) text ![b](url2.png) more ![c](url3.gif)";
    const urls = extract_images_from_markdown(text);
    expect(urls).toEqual(["url1.jpg", "url2.png", "url3.gif"]);
  });

  it("returns empty array when no images", () => {
    const text = "No images here, just [a link](https://example.com)";
    const urls = extract_images_from_markdown(text);
    expect(urls).toEqual([]);
  });

  it("handles empty text", () => {
    const urls = extract_images_from_markdown("");
    expect(urls).toEqual([]);
  });

  it("extracts URL with empty alt text", () => {
    const text = "![](https://img.com/photo.png)";
    const urls = extract_images_from_markdown(text);
    expect(urls).toEqual(["https://img.com/photo.png"]);
  });

  it("does not match regular links (without !)", () => {
    const text = "[not an image](https://example.com/page)";
    const urls = extract_images_from_markdown(text);
    expect(urls).toEqual([]);
  });

  it("can be called multiple times without state issues", () => {
    const text = "![a](url1.jpg)";
    expect(extract_images_from_markdown(text)).toEqual(["url1.jpg"]);
    expect(extract_images_from_markdown(text)).toEqual(["url1.jpg"]);
  });
});

describe("insert_image_markdown", () => {
  it("inserts image at cursor position", () => {
    const ctx = make_context({
      fullText: "text here",
      selectionStart: 5,
      selectionEnd: 5,
    });
    const upload_result: UploadResult = {
      url: "https://images.hive.blog/photo.jpg",
      alt: "my photo",
    };
    const result = insert_image_markdown(ctx, upload_result);
    expect(result.text).toBe(
      "text ![my photo](https://images.hive.blog/photo.jpg)here",
    );
  });

  it("places cursor after inserted image", () => {
    const ctx = make_context({
      fullText: "",
      selectionStart: 0,
      selectionEnd: 0,
    });
    const upload_result: UploadResult = {
      url: "https://img.com/a.png",
      alt: "alt",
    };
    const result = insert_image_markdown(ctx, upload_result);
    expect(result.text).toBe("![alt](https://img.com/a.png)");
    expect(result.selectionStart).toBe(result.text.length);
    expect(result.selectionEnd).toBe(result.text.length);
  });

  it("uses 'image' as default alt when not provided", () => {
    const ctx = make_context({
      fullText: "",
      selectionStart: 0,
      selectionEnd: 0,
    });
    const upload_result: UploadResult = {
      url: "https://img.com/a.png",
    };
    const result = insert_image_markdown(ctx, upload_result);
    expect(result.text).toBe("![image](https://img.com/a.png)");
  });

  it("replaces selected text with image", () => {
    const ctx = make_context({
      fullText: "replace this text",
      selectionStart: 8,
      selectionEnd: 12,
    });
    const upload_result: UploadResult = {
      url: "https://img.com/b.png",
      alt: "photo",
    };
    const result = insert_image_markdown(ctx, upload_result);
    expect(result.text).toBe(
      "replace ![photo](https://img.com/b.png) text",
    );
  });

  it("inserts at end of text", () => {
    const ctx = make_context({
      fullText: "end",
      selectionStart: 3,
      selectionEnd: 3,
    });
    const upload_result: UploadResult = {
      url: "https://img.com/c.jpg",
      alt: "pic",
    };
    const result = insert_image_markdown(ctx, upload_result);
    expect(result.text).toBe("end![pic](https://img.com/c.jpg)");
  });
});
