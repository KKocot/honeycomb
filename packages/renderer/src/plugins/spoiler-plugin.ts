import type { Remarkable } from "remarkable";

interface SpoilerConfig {
  prefix?: string;
  defaultRevealText?: string;
  revealTextMaxLength?: number;
}

interface SpoilerMetadata {
  revealText: string;
}

interface SpoilerCandidate {
  type: string;
  content?: unknown;
}

function is_spoiler_candidate(
  value: unknown,
): value is SpoilerCandidate {
  if (
    typeof value !== "object" ||
    value === null ||
    !("type" in value)
  ) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return typeof candidate["type"] === "string";
}

function has_string_content(
  token: SpoilerCandidate,
): token is SpoilerCandidate & { content: string } {
  return typeof token.content === "string";
}

const remarkable_spoiler: Remarkable.Plugin = (
  md: Remarkable,
  config?: SpoilerConfig,
) => {
  const {
    prefix = "!",
    defaultRevealText = "Reveal spoiler",
    revealTextMaxLength = 50,
  } = config ?? {};
  const original_open_renderer =
    md.renderer.rules.blockquote_open;
  const original_close_renderer =
    md.renderer.rules.blockquote_close;
  const original_inline = md.renderer.rules.text;
  let spoiler_metadata: SpoilerMetadata | undefined;

  const extract_spoiler_metadata = (
    tokens: unknown[],
    idx: number,
  ): SpoilerMetadata | null => {
    for (let ti = idx; ti < tokens.length; ti += 1) {
      const token = tokens[ti];
      if (!is_spoiler_candidate(token)) continue;

      if (token.type === "blockquote_close") {
        return null;
      }

      if (
        token.type === "inline" &&
        has_string_content(token) &&
        token.content.indexOf(prefix) === 0
      ) {
        const regex = new RegExp(
          `${prefix} {0,1}\\[([A-Za-z0-9 ?!]{1,${revealTextMaxLength}}?)\\] {0,1}`,
        );
        const match = token.content.match(regex);

        if (match) {
          return { revealText: match[1] };
        }

        return { revealText: defaultRevealText };
      }
    }

    return null;
  };

  md.renderer.rules.blockquote_open = (
    tokens: Remarkable.BlockquoteOpenToken[],
    idx: number,
    options?: Remarkable.Options,
    env?: Remarkable.Env,
  ): string => {
    if (!spoiler_metadata) {
      spoiler_metadata =
        extract_spoiler_metadata(tokens, idx) ??
        undefined;
      if (spoiler_metadata) {
        return `<details><summary>${spoiler_metadata.revealText}</summary>`;
      }
    }

    return original_open_renderer(
      tokens,
      idx,
      options,
      env,
    );
  };

  md.renderer.rules.blockquote_close = (
    tokens: Remarkable.BlockquoteCloseToken[],
    idx: number,
    options?: Remarkable.Options,
    env?: Remarkable.Env,
  ): string => {
    if (spoiler_metadata) {
      spoiler_metadata = undefined;
      return "</details>";
    }

    return original_close_renderer(
      tokens,
      idx,
      options,
      env,
    );
  };

  md.renderer.rules.text = (
    tokens: Remarkable.TextToken[],
    idx: number,
    options?: Remarkable.Options,
    env?: Remarkable.Env,
  ): string => {
    if (spoiler_metadata) {
      const prefix_pattern = prefix.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      );
      const reveal_text_pattern =
        spoiler_metadata.revealText.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&",
        );
      const full_pattern = new RegExp(
        `^${prefix_pattern} {0,1}\\[${reveal_text_pattern}\\] {0,1}`,
      );
      const simple_pattern = new RegExp(
        `^${prefix_pattern}`,
      );

      return String(tokens[idx].content ?? "")
        .replace(full_pattern, "")
        .replace(simple_pattern, "");
    }
    return original_inline(tokens, idx, options, env);
  };
};

export default remarkable_spoiler;
