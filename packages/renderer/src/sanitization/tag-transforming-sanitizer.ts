import { z } from "zod";
import sanitize from "sanitize-html";
import { Localization, LocalizationOptions } from "../localization";
import { StaticConfig } from "../static-config";
import type { RendererLogger } from "../types";

const tags_sanitizer_options_schema = z.object({
  iframeWidth: z.number().int().positive(),
  iframeHeight: z.number().int().positive(),
  addNofollowToLinks: z.boolean(),
  addTargetBlankToLinks: z.boolean().optional(),
  cssClassForInternalLinks: z.string().optional(),
  cssClassForExternalLinks: z.string().optional(),
  noImage: z.boolean(),
  isLinkSafeFn: z.custom<(url: string) => boolean>(
    (val) => typeof val === "function",
  ),
  addExternalCssClassToMatchingLinksFn: z.custom<
    (url: string) => boolean
  >((val) => typeof val === "function"),
});

export class TagTransformingSanitizer {
  private options: TagsSanitizerOptions;
  private localization: LocalizationOptions;
  private sanitization_errors: string[] = [];
  private current_post_context?: PostContext;
  private logger?: RendererLogger;

  public constructor(
    options: TagsSanitizerOptions,
    localization: LocalizationOptions,
    logger?: RendererLogger,
  ) {
    tags_sanitizer_options_schema.parse(options);
    Localization.validate(localization);

    this.localization = localization;
    this.options = options;
    this.logger = logger;
  }

  public sanitize(text: string, post_context?: PostContext): string {
    this.sanitization_errors = [];
    this.current_post_context = post_context;
    return sanitize(text, this.generate_sanitize_config());
  }

  private format_post_context(): string {
    if (!this.current_post_context) return "";
    const { author, permlink } = this.current_post_context;
    if (author && permlink) return ` in @${author}/${permlink}`;
    if (author) return ` by @${author}`;
    return "";
  }

  public get_errors(): string[] {
    return this.sanitization_errors;
  }

  private generate_sanitize_config(): sanitize.IOptions {
    return {
      allowedTags: StaticConfig.sanitization.allowedTags,
      allowedAttributes: {
        iframe: [
          "src",
          "width",
          "height",
          "frameborder",
          "allowfullscreen",
          "webkitallowfullscreen",
          "mozallowfullscreen",
        ],
        div: ["class", "title"],
        td: ["style"],
        th: ["style"],
        img: ["src", "alt"],
        a: ["href", "rel", "title", "class", "target", "id"],
        ol: ["start"],
      },
      allowedSchemes: ["http", "https", "hive"],
      transformTags: {
        iframe: (
          _tag_name: string,
          attributes: sanitize.Attributes,
        ) => {
          const src_atty = attributes.src;
          for (const item of StaticConfig.sanitization
            .iframeWhitelist) {
            if (item.re.test(src_atty)) {
              const src =
                typeof item.fn === "function"
                  ? item.fn(src_atty)
                  : src_atty;
              if (!src) {
                break;
              }
              const iframe_tag: sanitize.Tag = {
                tagName: "iframe",
                attribs: {
                  src,
                  width: this.options.iframeWidth + "",
                  height: this.options.iframeHeight + "",
                  frameborder: "0",
                  allowfullscreen: "allowfullscreen",
                  webkitallowfullscreen: "webkitallowfullscreen",
                  mozallowfullscreen: "mozallowfullscreen",
                },
              };
              return iframe_tag;
            }
          }
          this.logger?.warn(
            `Blocked iframe (not whitelisted)${this.format_post_context()}: src="${src_atty || "(empty)"}"`,
          );
          this.sanitization_errors.push(
            "Invalid iframe URL: " + src_atty,
          );

          const ret_tag: sanitize.Tag = {
            tagName: "div",
            text: `(Unsupported ${src_atty})`,
            attribs: {},
          };
          return ret_tag;
        },
        img: (_tag_name: string, attribs: sanitize.Attributes) => {
          if (this.options.noImage) {
            const ret_tag: sanitize.Tag = {
              tagName: "div",
              text: this.localization.noImage,
              attribs: {},
            };
            return ret_tag;
          }
          const { src, alt } = attribs;
          if (!/^(https?:)?\/\//i.test(src)) {
            this.logger?.warn(
              `Blocked image (invalid src)${this.format_post_context()}: src="${src || "(empty)"}"`,
            );
            this.sanitization_errors.push(
              "An image in this post did not save properly.",
            );
            const ret_tag: sanitize.Tag = {
              tagName: "img",
              attribs: { src: "brokenimg.jpg" },
            };
            return ret_tag;
          }

          const atts: sanitize.Attributes = {};
          atts.src = src.replace(/^http:\/\//i, "//");
          if (alt && alt !== "") {
            atts.alt = alt;
          }
          const ret_tag: sanitize.Tag = {
            tagName: "img",
            attribs: atts,
          };
          return ret_tag;
        },
        div: (_tag_name: string, attribs: sanitize.Attributes) => {
          const attys: sanitize.Attributes = {};
          const class_whitelist = [
            "pull-right",
            "pull-left",
            "text-justify",
            "text-rtl",
            "text-center",
            "text-right",
            "videoWrapper",
            "phishy",
          ];
          const valid_class = class_whitelist.find(
            (e) => attribs.class === e,
          );
          if (valid_class) {
            attys.class = valid_class;
          }
          if (
            valid_class === "phishy" &&
            attribs.title === this.localization.phishingWarning
          ) {
            attys.title = attribs.title;
          }
          const ret_tag: sanitize.Tag = {
            tagName: "div",
            attribs: attys,
          };
          return ret_tag;
        },
        td: (_tag_name: string, attribs: sanitize.Attributes) => {
          const attys: sanitize.Attributes = {};
          if (attribs.style === "text-align:right") {
            attys.style = "text-align:right";
          }
          if (attribs.style === "text-align:center") {
            attys.style = "text-align:center";
          }
          const ret_tag: sanitize.Tag = {
            tagName: "td",
            attribs: attys,
          };
          return ret_tag;
        },
        th: (_tag_name: string, attribs: sanitize.Attributes) => {
          const attys: sanitize.Attributes = {};
          if (attribs.style === "text-align:right") {
            attys.style = "text-align:right";
          }
          if (attribs.style === "text-align:center") {
            attys.style = "text-align:center";
          }
          const ret_tag: sanitize.Tag = {
            tagName: "th",
            attribs: attys,
          };
          return ret_tag;
        },
        a: (_tag_name: string, attribs: sanitize.Attributes) => {
          const attys: sanitize.Attributes = { ...attribs };
          let { href } = attribs;
          if (href) {
            href = href.trim();
            attys.href = href;
          }
          if (href && !this.options.isLinkSafeFn(href)) {
            attys.rel = this.options.addNofollowToLinks
              ? "nofollow noopener"
              : "noopener";
            attys.target = this.options.addTargetBlankToLinks
              ? "_blank"
              : "_self";
          }
          if (
            href &&
            this.options.addExternalCssClassToMatchingLinksFn(href)
          ) {
            attys.class = this.options.cssClassForExternalLinks
              ? this.options.cssClassForExternalLinks
              : "";
          } else {
            attys.class = this.options.cssClassForInternalLinks
              ? this.options.cssClassForInternalLinks
              : "";
          }
          const ret_tag: sanitize.Tag = {
            tagName: "a",
            attribs: attys,
          };
          return ret_tag;
        },
      },
    };
  }
}

export interface TagsSanitizerOptions {
  iframeWidth: number;
  iframeHeight: number;
  addNofollowToLinks: boolean;
  addTargetBlankToLinks?: boolean;
  cssClassForInternalLinks?: string;
  cssClassForExternalLinks?: string;
  noImage: boolean;
  isLinkSafeFn: (url: string) => boolean;
  addExternalCssClassToMatchingLinksFn: (url: string) => boolean;
}

export interface PostContext {
  author?: string;
  permlink?: string;
}
