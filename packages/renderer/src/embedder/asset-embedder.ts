import { z } from "zod";
import { LocalizationOptions } from "../localization";
import { AbstractEmbedder, type EmbedTextNode } from "./abstract-embedder";
import { InstagramEmbedder } from "./instagram-embedder";
import { SpotifyEmbedder } from "./spotify-embedder";
import { ThreeSpeakEmbedder } from "./three-speak-embedder";
import { TwitchEmbedder } from "./twitch-embedder";
import { TwitterEmbedder } from "./twitter-embedder";
import { VimeoEmbedder } from "./vimeo-embedder";
import { YoutubeEmbedder } from "./youtube-embedder";
import type { RendererLogger } from "../types";

const asset_embedder_options_schema = z.object({
  ipfsPrefix: z.string().optional(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  hideImages: z.boolean(),
  baseUrl: z.string().min(1),
  imageProxyFn: z.custom<(url: string) => string>(
    (val) => typeof val === "function",
  ),
  hashtagUrlFn: z.custom<(hashtag: string) => string>(
    (val) => typeof val === "function",
  ),
  usertagUrlFn: z.custom<(account: string) => string>(
    (val) => typeof val === "function",
  ),
});

export class AssetEmbedder {
  private readonly options: AssetEmbedderOptions;
  private readonly localization: LocalizationOptions;
  private readonly embedders: AbstractEmbedder[];

  public constructor(
    options: AssetEmbedderOptions,
    localization: LocalizationOptions,
    logger?: RendererLogger,
  ) {
    AssetEmbedder.validate(options);
    this.options = options;
    this.localization = localization;
    this.embedders = [
      new YoutubeEmbedder(logger),
      new VimeoEmbedder(logger),
      new TwitchEmbedder(options, logger),
      new SpotifyEmbedder(logger),
      new ThreeSpeakEmbedder(logger),
      new InstagramEmbedder(logger),
      new TwitterEmbedder(logger),
    ];
  }

  public static validate(o: AssetEmbedderOptions): void {
    asset_embedder_options_schema.parse(o);
  }

  public insert_assets(input: string): string {
    const size = {
      width: this.options.width,
      height: this.options.height,
    };
    return this.insert_marked_embeds_to_rendered_output(input, size);
  }

  public insert_marked_embeds_to_rendered_output(
    input: string,
    size: { width: number; height: number },
  ): string {
    return AbstractEmbedder.insert_all_embeds(
      this.embedders,
      input,
      size,
    );
  }

  public process_text_node_and_insert_embeds(
    node: EmbedTextNode,
  ): { links: string[]; images: string[] } {
    const out: { links: string[]; images: string[] } = {
      links: [],
      images: [],
    };

    for (const embedder of this.embedders) {
      const metadata = embedder.get_embed_metadata(node);
      if (metadata) {
        node.data = node.data.replace(
          metadata.url,
          AbstractEmbedder.get_embed_marker(
            metadata.id,
            embedder.type,
          ),
        );
        if (metadata.image) out.images.push(metadata.image);
        if (metadata.link) out.links.push(metadata.link);
      }
    }
    return out;
  }
}

export interface AssetEmbedderOptions {
  ipfsPrefix?: string;
  width: number;
  height: number;
  hideImages: boolean;
  baseUrl: string;
  imageProxyFn: (url: string) => string;
  hashtagUrlFn: (hashtag: string) => string;
  usertagUrlFn: (account: string) => string;
}
