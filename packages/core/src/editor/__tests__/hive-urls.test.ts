import { describe, it, expect } from "vitest";
import {
  is_hive_url,
  convert_hive_url,
  convert_hive_urls_in_text,
} from "../url-converter/hive-urls";

describe("is_hive_url", () => {
  it("returns true for hive.blog post URL", () => {
    expect(
      is_hive_url("https://hive.blog/@user/my-post"),
    ).toBe(true);
  });

  it("returns true for peakd.com post URL", () => {
    expect(
      is_hive_url("https://peakd.com/@someuser/test-post"),
    ).toBe(true);
  });

  it("returns true for ecency.com post URL", () => {
    expect(
      is_hive_url("https://ecency.com/@author/article-title"),
    ).toBe(true);
  });

  it("returns true for URL with community path before @", () => {
    expect(
      is_hive_url("https://hive.blog/hive-123456/@user/my-post"),
    ).toBe(true);
  });

  it("returns true for profile-only URL (no permlink)", () => {
    expect(
      is_hive_url("https://peakd.com/@username"),
    ).toBe(true);
  });

  it("returns true for leofinance.io URL", () => {
    expect(
      is_hive_url("https://leofinance.io/@leouser/post-about-defi"),
    ).toBe(true);
  });

  it("returns true for blog.openhive.network URL", () => {
    expect(
      is_hive_url("https://blog.openhive.network/@dev/update-post"),
    ).toBe(true);
  });

  it("returns true for hiveblog.bard-dev.com URL", () => {
    expect(
      is_hive_url("https://hiveblog.bard-dev.com/@barddev/test"),
    ).toBe(true);
  });

  it("returns false for non-hive domain", () => {
    expect(is_hive_url("https://google.com/@user/post")).toBe(false);
  });

  it("returns false for hive domain without @ path", () => {
    expect(is_hive_url("https://hive.blog/about")).toBe(false);
  });

  it("returns false for invalid URL", () => {
    expect(is_hive_url("not-a-url")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(is_hive_url("")).toBe(false);
  });

  it("returns false for URL with invalid username", () => {
    // Usernames must start with lowercase letter, 3-16 chars
    expect(
      is_hive_url("https://hive.blog/@AB/post"),
    ).toBe(false);
  });

  it("returns true for www. prefixed domain", () => {
    expect(
      is_hive_url("https://www.hive.blog/@user/post"),
    ).toBe(true);
  });
});

describe("convert_hive_url", () => {
  it("converts hive.blog post to relative path", () => {
    const result = convert_hive_url(
      "https://hive.blog/@user/my-post",
    );
    expect(result).toBe("/@user/my-post");
  });

  it("converts peakd.com post to relative path", () => {
    const result = convert_hive_url(
      "https://peakd.com/@author/some-article",
    );
    expect(result).toBe("/@author/some-article");
  });

  it("preserves hash fragment", () => {
    const result = convert_hive_url(
      "https://hive.blog/@user/post#comments",
    );
    expect(result).toBe("/@user/post#comments");
  });

  it("preserves query string", () => {
    const result = convert_hive_url(
      "https://peakd.com/@user/post?ref=share",
    );
    expect(result).toBe("/@user/post?ref=share");
  });

  it("preserves both query and hash", () => {
    const result = convert_hive_url(
      "https://hive.blog/@user/post?ref=1#top",
    );
    expect(result).toBe("/@user/post?ref=1#top");
  });

  it("strips community prefix from path", () => {
    const result = convert_hive_url(
      "https://hive.blog/hive-123456/@user/post-title",
    );
    expect(result).toBe("/@user/post-title");
  });

  it("converts profile-only URL", () => {
    const result = convert_hive_url("https://peakd.com/@username");
    expect(result).toBe("/@username");
  });

  it("returns null for non-hive URL", () => {
    expect(convert_hive_url("https://google.com/@user/post")).toBeNull();
  });

  it("returns null for invalid URL", () => {
    expect(convert_hive_url("not-a-url")).toBeNull();
  });

  it("returns null for hive URL without @ path", () => {
    expect(convert_hive_url("https://hive.blog/about")).toBeNull();
  });
});

describe("convert_hive_urls_in_text", () => {
  it("converts bare hive URL to markdown link", () => {
    const input = "Check https://hive.blog/@user/my-post here";
    const result = convert_hive_urls_in_text(input);
    expect(result.text).toBe(
      "Check [/@user/my-post](/@user/my-post) here",
    );
    expect(result.conversions).toHaveLength(1);
    expect(result.conversions[0].original).toBe(
      "https://hive.blog/@user/my-post",
    );
    expect(result.conversions[0].converted).toBe("/@user/my-post");
  });

  it("converts URL inside existing markdown link", () => {
    const input = "[My Post](https://peakd.com/@author/article)";
    const result = convert_hive_urls_in_text(input);
    expect(result.text).toBe("[My Post](/@author/article)");
    expect(result.conversions).toHaveLength(1);
  });

  it("does not convert URL inside fenced code block", () => {
    const input =
      "```\nhttps://hive.blog/@user/post\n```";
    const result = convert_hive_urls_in_text(input);
    expect(result.text).toBe(input);
    expect(result.conversions).toHaveLength(0);
  });

  it("does not convert URL inside inline code", () => {
    const input = "Use `https://hive.blog/@user/post` as example";
    const result = convert_hive_urls_in_text(input);
    expect(result.text).toBe(input);
    expect(result.conversions).toHaveLength(0);
  });

  it("converts multiple bare URLs", () => {
    const input =
      "Post 1: https://hive.blog/@alice/post1 and Post 2: https://peakd.com/@bob123/post2";
    const result = convert_hive_urls_in_text(input);
    expect(result.conversions).toHaveLength(2);
    expect(result.text).toContain("[/@alice/post1](/@alice/post1)");
    expect(result.text).toContain("[/@bob123/post2](/@bob123/post2)");
  });

  it("does not convert non-hive URLs", () => {
    const input = "Visit https://google.com and https://github.com/@user";
    const result = convert_hive_urls_in_text(input);
    expect(result.text).toBe(input);
    expect(result.conversions).toHaveLength(0);
  });

  it("handles text with no URLs", () => {
    const input = "Plain text without any links";
    const result = convert_hive_urls_in_text(input);
    expect(result.text).toBe(input);
    expect(result.conversions).toHaveLength(0);
  });

  it("handles empty text", () => {
    const result = convert_hive_urls_in_text("");
    expect(result.text).toBe("");
    expect(result.conversions).toHaveLength(0);
  });

  it("tracks conversion positions", () => {
    const input = "[Link](https://hive.blog/@user/post)";
    const result = convert_hive_urls_in_text(input);
    expect(result.conversions).toHaveLength(1);
    expect(result.conversions[0].position).toBeGreaterThanOrEqual(0);
  });

  it("converts mixed markdown links and bare URLs", () => {
    const input =
      "[See post](https://hive.blog/@alice/post1) also https://peakd.com/@bob123/post2";
    const result = convert_hive_urls_in_text(input);
    expect(result.conversions).toHaveLength(2);
    expect(result.text).toContain("[See post](/@alice/post1)");
    expect(result.text).toContain("[/@bob123/post2](/@bob123/post2)");
  });
});
