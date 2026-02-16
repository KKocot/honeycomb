import * as xmldom from "@xmldom/xmldom";
import { LinkSanitizer } from "../security/link-sanitizer";
import { AssetEmbedder } from "../embedder/asset-embedder";
import { YoutubeEmbedder } from "../embedder/youtube-embedder";
import { LocalizationOptions } from "../localization";
import { TextProcessor } from "./text-processor";
import type { State } from "./html-dom-parser";
import type { RendererLogger } from "../types";

interface DomTextNode {
  nodeName: string;
  data: string;
  parentNode: Node | null;
  ownerDocument: Document | null;
}

function is_element(node: ChildNode): node is Element {
  return "tagName" in node && typeof (node as Record<string, unknown>)["tagName"] === "string";
}

function is_text_node(
  node: ChildNode,
): node is ChildNode & DomTextNode {
  return (
    node.nodeName === "#text" &&
    "data" in node &&
    typeof (node as Record<string, unknown>)["data"] === "string"
  );
}

function is_node_element(
  node: Node,
): node is Element {
  return (
    "tagName" in node &&
    typeof (node as Record<string, unknown>)[
      "tagName"
    ] === "string"
  );
}

function get_element_tag(
  node: Node | null,
): string | null {
  if (node && is_node_element(node)) {
    return node.tagName.toLowerCase();
  }
  return null;
}

export class NodeProcessor {
  private link_sanitizer: LinkSanitizer;
  private embedder: AssetEmbedder;
  private text_processor: TextProcessor;
  private localization: LocalizationOptions;
  private dom_parser: xmldom.DOMParser;
  private xml_serializer: xmldom.XMLSerializer;
  private logger?: RendererLogger;

  public constructor(
    link_sanitizer: LinkSanitizer,
    embedder: AssetEmbedder,
    text_processor: TextProcessor,
    localization: LocalizationOptions,
    logger?: RendererLogger,
  ) {
    this.link_sanitizer = link_sanitizer;
    this.embedder = embedder;
    this.text_processor = text_processor;
    this.localization = localization;
    this.logger = logger;
    this.dom_parser = new xmldom.DOMParser({
      errorHandler: {
        warning: () => {},
        error: () => {},
      },
    });
    this.xml_serializer = new xmldom.XMLSerializer();
  }

  public traverse_dom_node(
    node: Document | ChildNode,
    state: State,
    mutate: boolean,
    depth = 0,
  ): void {
    if (!node || !node.childNodes) {
      return;
    }

    Array.from(node.childNodes).forEach((child) => {
      const tag = is_element(child)
        ? child.tagName.toLowerCase()
        : null;
      if (tag) {
        state.htmltags.add(tag);
      }

      if (tag === "img" && is_element(child)) {
        this.process_img_tag(child, state, mutate);
      } else if (tag === "iframe" && is_element(child)) {
        this.process_iframe_tag(child, state, mutate);
      } else if (tag === "a" && is_element(child)) {
        this.process_link_tag(child, state, mutate);
      } else if (is_text_node(child)) {
        this.process_text_node(child, state, mutate);
      }

      this.traverse_dom_node(
        child,
        state,
        mutate,
        depth + 1,
      );
    });
  }

  private process_link_tag(
    child: Element,
    state: State,
    mutate: boolean,
  ): void {
    const parent = child.parentNode;
    if (!parent) return;

    const url = child.getAttribute("href");
    if (url) {
      state.links.add(url);
      if (mutate) {
        const url_title = child.textContent || "";
        const sanitized_link =
          this.link_sanitizer.sanitize_link(
            url,
            url_title,
          );
        if (sanitized_link === false) {
          const owner_doc = child.ownerDocument;
          if (!owner_doc) return;
          const phishy_div =
            owner_doc.createElement("div");
          phishy_div.textContent = `${child.textContent} / ${url}`;
          phishy_div.setAttribute(
            "title",
            this.localization.phishingWarning,
          );
          phishy_div.setAttribute("class", "phishy");
          parent.insertBefore(phishy_div, child);
          parent.removeChild(child);
        } else {
          child.setAttribute("href", sanitized_link);
        }
      }
    }
  }

  private process_iframe_tag(
    child: Element,
    state: State,
    mutate: boolean,
  ): void {
    const url = child.getAttribute("src");
    if (url) this.report_iframe_link(url, state);

    if (!mutate) {
      return;
    }

    const parent_node = child.parentNode;
    const parent_tag = get_element_tag(parent_node);
    if (
      parent_tag === "div" &&
      parent_node &&
      is_node_element(parent_node)
    ) {
      if (
        parent_node.getAttribute("class") ===
        "videoWrapper"
      ) {
        return;
      }
    }
    const html =
      this.xml_serializer.serializeToString(child);
    const wrapper = this.dom_parser.parseFromString(
      `<div class="videoWrapper">${html}</div>`,
    );
    if (parent_node) {
      parent_node.appendChild(wrapper);
      parent_node.removeChild(child);
    }
  }

  private report_iframe_link(
    url: string,
    state: State,
  ): void {
    const yt =
      YoutubeEmbedder.get_youtube_metadata_from_link(
        url,
      );
    if (yt) {
      state.links.add(yt.url);
      state.images.add(
        "https://img.youtube.com/vi/" + yt.id + "/0.jpg",
      );
    }
  }

  private process_img_tag(
    child: Element,
    state: State,
    mutate: boolean,
  ): void {
    const url = child.getAttribute("src");
    if (url) {
      state.images.add(url);
      if (mutate) {
        let url2 =
          this.text_processor.normalize_url(url);
        if (/^\/\//.test(url2)) {
          url2 = "https:" + url2;
        }
        if (url2 !== url) {
          child.setAttribute("src", url2);
        }
      }
    }
  }

  private process_text_node(
    child: ChildNode & DomTextNode,
    state: State,
    mutate: boolean,
  ): void {
    try {
      const parent_tag = get_element_tag(
        child.parentNode,
      );
      if (parent_tag === "code") {
        return;
      }
      if (parent_tag === "a") {
        return;
      }

      if (!child.data) {
        return;
      }

      const embed_resp =
        this.embedder.process_text_node_and_insert_embeds(child);
      embed_resp.images.forEach((img) =>
        state.images.add(img),
      );
      embed_resp.links.forEach((link) =>
        state.links.add(link),
      );

      const data =
        this.xml_serializer.serializeToString(child);
      const content = this.text_processor.linkify(
        data,
        state,
        mutate,
      );
      if (mutate && content !== data) {
        const parent = child.parentNode;
        if (parent) {
          const temp_doc =
            this.dom_parser.parseFromString(
              `<span>${content}</span>`,
            );
          if (temp_doc.childNodes[0]?.childNodes) {
            Array.from(
              temp_doc.childNodes[0].childNodes,
            ).forEach((new_child) => {
              parent.insertBefore(
                new_child.cloneNode(true),
                child,
              );
            });
          }
          parent.removeChild(child);
        }
        return;
      }
    } catch (error) {
      this.logger?.error(String(error));
    }
  }
}
