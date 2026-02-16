import {
  AbstractEmbedder,
  type EmbedMetadata,
  type EmbedTextNode,
} from "./abstract-embedder";
import type { RendererLogger } from "../types";

export class InstagramEmbedder extends AbstractEmbedder {
  public type = "instagram";
  private logger?: RendererLogger;

  public constructor(logger?: RendererLogger) {
    super();
    this.logger = logger;
  }

  private static readonly LINK_REGEX =
    /https?:\/\/(?:www\.)?instagram\.com\/(?:[\w.]+\/)?(p|reel)\/([a-zA-Z0-9_-]{10,14})\/?(?:\?[^\s]*)?/i;

  public get_embed_metadata(
    input: string | EmbedTextNode,
  ): EmbedMetadata | undefined {
    const data = typeof input === "string" ? input : input.data;
    try {
      const match = data.match(InstagramEmbedder.LINK_REGEX);
      if (match?.[2]) {
        const type = match[1];
        const id = match[2];
        return {
          id: `${type}/${id}`,
          url: match[0],
        };
      }
    } catch (error) {
      this.logger?.error(String(error));
    }
    return undefined;
  }

  public process_embed(
    id: string,
    size: { width: number; height: number },
  ): string {
    const embed_url = `https://www.instagram.com/${id}/embed/`;
    return `<div class="instagramWrapper"><iframe width="${size.width}" height="${size.height}" src="${embed_url}" frameborder="0" allowtransparency="true"></iframe></div>`;
  }
}
