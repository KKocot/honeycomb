import {
  AbstractEmbedder,
  type EmbedMetadata,
  type EmbedTextNode,
} from "./abstract-embedder";
import type { RendererLogger } from "../types";

export class ThreeSpeakEmbedder extends AbstractEmbedder {
  public type = "3speak";
  private logger?: RendererLogger;

  public constructor(logger?: RendererLogger) {
    super();
    this.logger = logger;
  }

  private static readonly LINK_REGEX =
    /(?:https?:\/\/)?(?:3[sS]peak\.(?:tv|online|co)\/(?:watch|embed)\?v=)([a-z0-9][a-z0-9.-]{1,15}\/[a-z0-9][a-z0-9-]*)/;

  public get_embed_metadata(
    input: string | EmbedTextNode,
  ): EmbedMetadata | undefined {
    const url = typeof input === "string" ? input : input.data;
    try {
      const clean_url = url.trim().replace(/^\n+/, "");

      const match = clean_url.match(ThreeSpeakEmbedder.LINK_REGEX);
      if (match?.[1]) {
        const id = match[1];
        return {
          id,
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
    const embed_url = `https://3speak.tv/embed?v=${id}`;
    return `<div class="threeSpeakWrapper"><iframe width="${size.width}" height="${size.height}" src="${embed_url}" frameborder="0" allowfullscreen></iframe></div>`;
  }
}
