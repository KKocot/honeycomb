import * as xmldom from "@xmldom/xmldom";
import {
  Localization,
  LocalizationOptions,
} from "../localization";
import {
  AssetEmbedder,
  AssetEmbedderOptions,
} from "../embedder/asset-embedder";
import { LinkSanitizer } from "../security/link-sanitizer";
import type { RendererLogger } from "../types";
import { NodeProcessor } from "./node-processor";
import { TextProcessor } from "./text-processor";
import { ImageProcessor } from "./image-processor";

export class HtmlDOMParser {
  private options: AssetEmbedderOptions;
  public embedder: AssetEmbedder;

  private dom_parser = new xmldom.DOMParser({
    errorHandler: {
      warning: () => {},
      error: () => {},
    },
  });
  private xml_serializer = new xmldom.XMLSerializer();
  private state: State;
  private mutate = true;
  private parsed_document: Document | undefined = undefined;
  private node_processor: NodeProcessor;
  private image_processor: ImageProcessor;

  public constructor(
    options: AssetEmbedderOptions,
    localization: LocalizationOptions = Localization.DEFAULT,
    logger?: RendererLogger,
  ) {
    AssetEmbedder.validate(options);
    Localization.validate(localization);
    this.options = options;

    const link_sanitizer = new LinkSanitizer(
      { baseUrl: this.options.baseUrl },
      logger,
    );

    this.embedder = new AssetEmbedder(
      {
        ipfsPrefix: this.options.ipfsPrefix,
        width: this.options.width,
        height: this.options.height,
        hideImages: this.options.hideImages,
        imageProxyFn: this.options.imageProxyFn,
        hashtagUrlFn: this.options.hashtagUrlFn,
        usertagUrlFn: this.options.usertagUrlFn,
        baseUrl: this.options.baseUrl,
      },
      localization,
      logger,
    );

    const text_processor = new TextProcessor(
      options,
      localization,
      link_sanitizer,
    );

    this.node_processor = new NodeProcessor(
      link_sanitizer,
      this.embedder,
      text_processor,
      localization,
      logger,
    );

    this.image_processor = new ImageProcessor(options);

    this.state = {
      hashtags: new Set(),
      usertags: new Set(),
      htmltags: new Set(),
      images: new Set(),
      links: new Set(),
    };
  }

  public set_mutate_enabled(mutate: boolean): HtmlDOMParser {
    this.mutate = mutate;
    return this;
  }

  public parse(html: string): HtmlDOMParser {
    this.state = {
      hashtags: new Set(),
      usertags: new Set(),
      htmltags: new Set(),
      images: new Set(),
      links: new Set(),
    };

    try {
      const doc: Document = this.dom_parser.parseFromString(
        preprocess_html(html),
        "text/html",
      );
      this.node_processor.traverse_dom_node(
        doc,
        this.state,
        this.mutate,
      );
      if (this.mutate) this.postprocess_dom(doc);

      this.parsed_document = doc;
    } catch (error) {
      throw new HtmlDOMParserError(
        "Parsing error",
        error instanceof Error ? error : undefined,
      );
    }
    return this;
  }

  public get_state(): State {
    if (!this.parsed_document)
      throw new HtmlDOMParserError(
        "Html has not been parsed yet",
      );
    return this.state;
  }

  public get_parsed_document(): Document {
    if (!this.parsed_document)
      throw new HtmlDOMParserError(
        "Html has not been parsed yet",
      );
    return this.parsed_document;
  }

  public get_parsed_document_as_string(): string {
    return this.xml_serializer.serializeToString(
      this.get_parsed_document(),
    );
  }

  private postprocess_dom(doc: Document): void {
    this.image_processor.hide_images_if_needed(
      doc,
      this.mutate,
    );
    this.image_processor.proxify_images_if_needed(
      doc,
      this.mutate,
    );
  }
}

export interface State {
  hashtags: Set<string>;
  usertags: Set<string>;
  htmltags: Set<string>;
  images: Set<string>;
  links: Set<string>;
}

export class HtmlDOMParserError extends Error {
  public cause?: Error;
  public constructor(message?: string, cause?: Error) {
    super(message);
    this.name = "HtmlDOMParserError";
    this.cause = cause;
  }
}

function preprocess_html(child: string): string {
  try {
    if (typeof child === "string") {
      const gist = extract_metadata_from_embed_code(child);
      if (gist) {
        child = child.replace(
          GIST_REGEX.htmlReplacement,
          `~~~ embed:${gist.id} gist metadata:${Buffer.from(gist.fullId).toString("base64")} ~~~`,
        );
      }
      child = preprocess_details(child);
      child = preprocess_center(child);
    }
  } catch {
    // silently ignore preprocessing errors
  }

  return child;
}

interface GistMetadata {
  id: string;
  fullId: string;
  url: string;
  canonical: string;
  thumbnail: string | null;
  username: string;
}

function preprocess_details(html: string): string {
  html = html.replace(
    /<p>\s*(<details>[\s\S]*?<\/details>)\s*<\/p>/g,
    "$1",
  );
  html = html.replace(
    /(<details>[\s\S]*?<\/pre>)([\s\S]*?)(<\/details>)/g,
    "$1$3$2",
  );
  return html;
}

function preprocess_center(html: string): string {
  html = html.replace(
    /<p>\s*(<center>[\s\S]*?<\/center>)\s*<\/p>/g,
    "$1",
  );
  html = html.replace(
    /(<center>[\s\S]*?<\/pre>)([\s\S]*?)(<\/center>)/g,
    "$1$3$2",
  );
  return html;
}

function extract_metadata_from_embed_code(
  data: string,
): GistMetadata | null {
  if (!data) return null;

  const match: RegExpMatchArray | null = data.match(
    GIST_REGEX.htmlReplacement,
  );
  if (match) {
    const url: string = match[1];
    const full_id: string = match[2];
    const username: string = match[3];
    const id: string = match[4];

    return {
      id,
      fullId: full_id,
      url,
      canonical: url,
      thumbnail: null,
      username,
    };
  }
  return null;
}

const GIST_REGEX = {
  main: /(https?:\/\/gist\.github\.com\/((.*?)\/(.*)))/i,
  sanitize:
    /(https:\/\/gist\.github\.com\/((.*?)\/(.*?))\.js)/i,
  htmlReplacement:
    /<script src="(https:\/\/gist\.github\.com\/((.*?)\/(.*?))\.js)"><\/script>/i,
};
