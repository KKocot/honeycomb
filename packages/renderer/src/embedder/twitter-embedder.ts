import {
  AbstractEmbedder,
  type EmbedMetadata,
  type EmbedTextNode,
} from "./abstract-embedder";
import type { RendererLogger } from "../types";

export class TwitterEmbedder extends AbstractEmbedder {
  public type = "twitter";
  private logger?: RendererLogger;

  public constructor(logger?: RendererLogger) {
    super();
    this.logger = logger;
  }

  private static readonly LINK_REGEX =
    /https?:\/\/(?:www\.)?(twitter|x)\.com\/(?:\w+)\/status\/(\d{1,20})[^\s]*/i;

  public get_embed_metadata(
    input: string | EmbedTextNode,
  ): EmbedMetadata | undefined {
    const data = typeof input === "string" ? input : input.data;
    try {
      const match = data.match(TwitterEmbedder.LINK_REGEX);
      if (match?.[2]) {
        const id = match[2];
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
    _size: { width: number; height: number },
  ): string {
    const embed_url = `https://platform.twitter.com/embed/Tweet.html?id=${id}`;
    return `<div class="twitterWrapper"><iframe src="${embed_url}" frameborder="0" allowtransparency="true"></iframe></div>`;
  }
}
