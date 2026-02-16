import { z } from "zod";
import { Remarkable } from "remarkable";
import sanitize from "sanitize-html";
import { SecurityChecker } from "./security/security-checker";
import { HtmlDOMParser } from "./parser/html-dom-parser";
import {
  Localization,
  LocalizationOptions,
} from "./localization";
import type { RendererPlugin } from "./plugins/renderer-plugin";
import remarkable_spoiler from "./plugins/spoiler-plugin";
import { PreliminarySanitizer } from "./sanitization/preliminary-sanitizer";
import {
  TagTransformingSanitizer,
  PostContext,
} from "./sanitization/tag-transforming-sanitizer";
import type { RendererLogger } from "./types";

const fn_schema = z.custom<(...args: unknown[]) => unknown>(
  (val) => typeof val === "function",
);

const renderer_options_schema = z.object({
  baseUrl: z.string().min(1),
  breaks: z.boolean(),
  skipSanitization: z.boolean(),
  allowInsecureScriptTags: z.boolean(),
  addNofollowToLinks: z.boolean(),
  addTargetBlankToLinks: z.boolean().optional(),
  cssClassForInternalLinks: z.string().optional(),
  cssClassForExternalLinks: z.string().optional(),
  doNotShowImages: z.boolean(),
  ipfsPrefix: z.string().optional(),
  assetsWidth: z.number().int().positive(),
  assetsHeight: z.number().int().positive(),
  imageProxyFn: z.custom<(url: string) => string>(
    (val) => typeof val === "function",
  ),
  hashtagUrlFn: z.custom<(hashtag: string) => string>(
    (val) => typeof val === "function",
  ),
  usertagUrlFn: z.custom<(account: string) => string>(
    (val) => typeof val === "function",
  ),
  isLinkSafeFn: z.custom<(url: string) => boolean>(
    (val) => typeof val === "function",
  ),
  addExternalCssClassToMatchingLinksFn: z.custom<
    (url: string) => boolean
  >((val) => typeof val === "function"),
  plugins: z.array(z.object({ name: z.string() })).optional(),
  logger: z
    .object({
      warn: fn_schema,
      error: fn_schema,
    })
    .optional(),
});

export class DefaultRenderer {
  private options: RendererOptions;
  private tag_transforming_sanitizer: TagTransformingSanitizer;
  private dom_parser: HtmlDOMParser;
  private plugins: RendererPlugin[] = [];
  private logger?: RendererLogger;

  public constructor(
    options: RendererOptions,
    localization: LocalizationOptions = Localization.DEFAULT,
  ) {
    renderer_options_schema.parse(options);
    this.options = options;
    this.logger = options.logger;

    Localization.validate(localization);

    this.tag_transforming_sanitizer =
      new TagTransformingSanitizer(
        {
          iframeWidth: this.options.assetsWidth,
          iframeHeight: this.options.assetsHeight,
          addNofollowToLinks:
            this.options.addNofollowToLinks,
          addTargetBlankToLinks:
            this.options.addTargetBlankToLinks,
          cssClassForInternalLinks:
            this.options.cssClassForInternalLinks,
          cssClassForExternalLinks:
            this.options.cssClassForExternalLinks,
          noImage: this.options.doNotShowImages,
          isLinkSafeFn: this.options.isLinkSafeFn,
          addExternalCssClassToMatchingLinksFn:
            this.options
              .addExternalCssClassToMatchingLinksFn,
        },
        localization,
        this.logger,
      );

    this.dom_parser = new HtmlDOMParser(
      {
        width: this.options.assetsWidth,
        height: this.options.assetsHeight,
        ipfsPrefix: this.options.ipfsPrefix,
        baseUrl: this.options.baseUrl,
        imageProxyFn: this.options.imageProxyFn,
        hashtagUrlFn: this.options.hashtagUrlFn,
        usertagUrlFn: this.options.usertagUrlFn,
        hideImages: this.options.doNotShowImages,
      },
      localization,
      this.logger,
    );

    this.plugins = options.plugins || [];
  }

  public get_plugins(): readonly RendererPlugin[] {
    return [...this.plugins];
  }

  public render(
    input: string,
    post_context?: PostContext,
  ): string {
    if (!input || typeof input !== "string") {
      throw new Error("Input must be a non-empty string");
    }
    return this.do_render(input, post_context);
  }

  private do_render(
    text: string,
    post_context?: PostContext,
  ): string {
    text = this.run_plugin_phase("preProcess", text);
    text = PreliminarySanitizer.preliminary_sanitize(text);
    const is_html = this.is_html(text);
    text = is_html ? text : this.render_markdown(text);
    text =
      this.wrap_rendered_text_with_html_if_needed(text);
    text = this.dom_parser
      .parse(text)
      .get_parsed_document_as_string();
    text = this.sanitize(text, post_context);
    SecurityChecker.check_security(text, {
      allowScriptTag:
        this.options.allowInsecureScriptTags,
    });
    text = this.dom_parser.embedder.insert_assets(text);
    text = this.light_sanitize_embeds(text);
    text = this.run_plugin_phase("postProcess", text);
    text = this.light_sanitize_embeds(text);
    return text;
  }

  private run_plugin_phase(
    phase: "preProcess" | "postProcess",
    text: string,
  ): string {
    return this.plugins.reduce(
      (processed_text, plugin) => {
        const processor = plugin[phase];
        return processor
          ? processor(processed_text)
          : processed_text;
      },
      text,
    );
  }

  private render_markdown(text: string): string {
    const renderer = new Remarkable({
      html: true,
      breaks: this.options.breaks,
      typographer: false,
      quotes: "\u201C\u201D\u2018\u2019",
    });
    renderer.use(remarkable_spoiler);

    return renderer.render(text);
  }

  private wrap_rendered_text_with_html_if_needed(
    rendered_text: string,
  ): string {
    if (!rendered_text.startsWith("<html>")) {
      rendered_text = "<html>" + rendered_text + "</html>";
    }
    return rendered_text;
  }

  private is_html(text: string): boolean {
    let html = false;
    const m = text.match(/^<html>([\S\s]*)<\/html>$/);
    if (m && m.length === 2) {
      html = true;
    } else {
      html = /^<p>[\S\s]*<\/p>/.test(text);
    }
    return html;
  }

  private sanitize(
    text: string,
    post_context?: PostContext,
  ): string {
    if (this.options.skipSanitization) {
      this.logger?.warn(
        "skipSanitization is enabled — XSS protection disabled",
      );
      return text;
    }

    return this.tag_transforming_sanitizer.sanitize(
      text,
      post_context,
    );
  }

  private light_sanitize_embeds(text: string): string {
    return sanitize(text, {
      allowedTags: sanitize.defaults.allowedTags.concat([
        "iframe",
        "img",
        "div",
        "details",
        "summary",
      ]),
      allowedAttributes: {
        ...sanitize.defaults.allowedAttributes,
        iframe: ["src", "width", "height", "frameborder",
          "allowfullscreen", "webkitallowfullscreen",
          "mozallowfullscreen", "allowtransparency"],
        img: ["src", "alt", "loading"],
        div: ["class", "id", "style", "title",
          "data-youtube-id", "data-width", "data-height",
          "data-instgrm-permalink", "data-instgrm-version",
          "data-instgrm-theme"],
        a: ["href", "target", "rel", "class", "id"],
        button: ["class", "aria-label"],
        svg: ["viewBox", "width", "height"],
        path: ["d", "fill", "class"],
      },
      allowedIframeHostnames: [
        "www.youtube.com",
        "player.vimeo.com",
        "player.twitch.tv",
        "w.soundcloud.com",
        "open.spotify.com",
        "3speak.tv",
        "platform.twitter.com",
        "www.instagram.com",
      ],
      allowedSchemes: ["http", "https"],
    });
  }
}

export interface RendererOptions {
  baseUrl: string;
  breaks: boolean;
  skipSanitization: boolean;
  allowInsecureScriptTags: boolean;
  addNofollowToLinks: boolean;
  addTargetBlankToLinks?: boolean;
  cssClassForInternalLinks?: string;
  cssClassForExternalLinks?: string;
  doNotShowImages: boolean;
  ipfsPrefix?: string;
  assetsWidth: number;
  assetsHeight: number;
  imageProxyFn: (url: string) => string;
  hashtagUrlFn: (hashtag: string) => string;
  usertagUrlFn: (account: string) => string;
  isLinkSafeFn: (url: string) => boolean;
  addExternalCssClassToMatchingLinksFn: (
    url: string,
  ) => boolean;
  plugins?: RendererPlugin[];
  logger?: RendererLogger;
}
