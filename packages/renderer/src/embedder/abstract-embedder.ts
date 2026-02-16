const SAFE_EMBED_ID_PATTERN = /^([\w/?=.-]+) ([^ ]*) ~~~/;

export interface EmbedTextNode {
  data: string;
}

export abstract class AbstractEmbedder {
  public abstract type: string;

  public abstract get_embed_metadata(
    text_node: EmbedTextNode,
  ): EmbedMetadata | undefined;

  public abstract process_embed(
    id: string,
    size: { width: number; height: number },
  ): string;

  public static get_embed_marker(id: string, type: string): string {
    return `~~~ embed:${id} ${type} ~~~`;
  }

  public static insert_all_embeds(
    embedders: AbstractEmbedder[],
    input: string,
    size: { width: number; height: number },
  ): string {
    const sections: string[] = [];

    for (let section of input.split("~~~ embed:")) {
      const match = section.match(SAFE_EMBED_ID_PATTERN);

      if (match && match.length >= 3) {
        const id = match[1];
        const type = match[2];
        for (const embedder of embedders) {
          if (embedder.type === type) {
            sections.push(embedder.process_embed(id, size));
            break;
          }
        }
        section = section.substring(`${id} ${type} ~~~`.length);
        if (section === "") {
          continue;
        }
      }
      sections.push(section);
    }
    return sections.join("");
  }
}

export interface EmbedMetadata {
  id: string;
  url: string;
  image?: string;
  link?: string;
}
