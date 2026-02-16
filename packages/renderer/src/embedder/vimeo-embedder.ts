import {
  AbstractEmbedder,
  type EmbedMetadata,
  type EmbedTextNode,
} from "./abstract-embedder";
import type { RendererLogger } from "../types";

export class VimeoEmbedder extends AbstractEmbedder {
  public type = "vimeo";
  private logger?: RendererLogger;

  public constructor(logger?: RendererLogger) {
    super();
    this.logger = logger;
  }

  private static readonly REGEX =
    /https?:\/\/(?:vimeo.com\/|player.vimeo.com\/video\/)([0-9]+)\/*/;

  public get_embed_metadata(
    child: EmbedTextNode,
  ): EmbedMetadata | undefined {
    try {
      const data = child.data;
      const metadata = this.extract_metadata(data);
      if (!metadata) {
        return undefined;
      }
      return {
        id: metadata.id,
        url: metadata.url,
      };
    } catch (error) {
      this.logger?.error(String(error));
    }
    return undefined;
  }

  public process_embed(
    id: string,
    size: { width: number; height: number },
  ): string {
    const url = this.generate_canonical_url(id);
    return `<div class="videoWrapper"><iframe src="${url}" width="${size.width}" height="${size.height}" frameBorder="0" webkitallowfullscreen mozallowfullscreen allowFullScreen></iframe></div>`;
  }

  private generate_canonical_url(id: string): string {
    return `https://player.vimeo.com/video/${id}`;
  }

  private extract_metadata(data: string) {
    if (!data) {
      return null;
    }
    const m = data.match(VimeoEmbedder.REGEX);
    if (!m || m.length < 2) {
      return null;
    }

    return {
      id: m[1],
      url: m[0],
      canonical: this.generate_canonical_url(m[1]),
    };
  }
}
