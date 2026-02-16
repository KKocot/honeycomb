import {
  AbstractEmbedder,
  type EmbedMetadata,
  type EmbedTextNode,
} from "./abstract-embedder";
import type { RendererLogger } from "../types";

interface SpotifyMetadata {
  id: string;
  url: string;
  canonical: string;
}

export class SpotifyEmbedder extends AbstractEmbedder {
  public type = "spotify";
  private logger?: RendererLogger;

  public constructor(logger?: RendererLogger) {
    super();
    this.logger = logger;
  }

  private static readonly REGEX = {
    main: /https?:\/\/open.spotify.com\/(playlist|show|episode|album|track|artist)\/([A-Za-z0-9]+)/i,
    sanitize:
      /^https:\/\/open\.spotify\.com\/(embed|embed-podcast)\/(playlist|show|episode|album|track|artist)\/([A-Za-z0-9]+)/i,
  };

  private static extract_metadata(
    data: string,
  ): SpotifyMetadata | undefined {
    if (!data) return undefined;
    const m = data.match(SpotifyEmbedder.REGEX.main);
    if (!m || m.length < 2) return undefined;

    const embed =
      m[1] === "show" || m[1] === "episode"
        ? "embed-podcast"
        : "embed";

    return {
      id: `${embed}/${m[1]}/${m[2]}`,
      url: m[0],
      canonical: `https://open.spotify.com/${m[1]}/${m[2]}`,
    };
  }

  public get_embed_metadata(
    child: EmbedTextNode,
  ): EmbedMetadata | undefined {
    try {
      const metadata = SpotifyEmbedder.extract_metadata(child.data);
      if (!metadata) {
        return undefined;
      }
      return {
        id: metadata.id,
        url: metadata.url,
        image: metadata.canonical,
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
    const url = `https://open.spotify.com/${id}`;
    return `<div class="videoWrapper"><iframe src="${url}" width="${size.width}" height="${size.height}" frameBorder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen ></iframe></div>`;
  }
}
