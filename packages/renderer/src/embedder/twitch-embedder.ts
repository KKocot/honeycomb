import {
  AbstractEmbedder,
  type EmbedMetadata,
  type EmbedTextNode,
} from "./abstract-embedder";
import type { AssetEmbedderOptions } from "./asset-embedder";
import links_re from "../utils/links";
import type { RendererLogger } from "../types";

export class TwitchEmbedder extends AbstractEmbedder {
  public type = "twitch";
  private readonly domain: string;
  private logger?: RendererLogger;

  public constructor(
    options: AssetEmbedderOptions,
    logger?: RendererLogger,
  ) {
    super();
    this.domain = new URL(options.baseUrl).hostname;
    this.logger = logger;
  }

  public get_embed_metadata(
    child: EmbedTextNode,
  ): EmbedMetadata | undefined {
    try {
      const data = child.data;
      const twitch = this.twitch_id(data);
      if (!twitch) {
        return undefined;
      }

      return {
        ...twitch,
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
    const url = `https://player.twitch.tv/${id}&parent=${this.domain}`;
    return `<div class="videoWrapper"><iframe src="${url}" width="${size.width}" height="${size.height}" frameBorder="0" allowFullScreen></iframe></div>`;
  }

  private twitch_id(data: string) {
    if (!data) {
      return null;
    }
    const m = data.match(links_re.twitch);
    if (!m || m.length < 3) {
      return null;
    }

    return {
      id:
        m[1] === "videos"
          ? `?video=${m[2]}`
          : `?channel=${m[2]}`,
      url: m[0],
      canonical:
        m[1] === "videos"
          ? `https://player.twitch.tv/?video=${m[2]}`
          : `https://player.twitch.tv/?channel=${m[2]}`,
    };
  }
}
