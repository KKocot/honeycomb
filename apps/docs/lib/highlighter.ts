import { createHighlighter, type Highlighter } from "shiki";

// Singleton instance - cached globally
let highlighterPromise: Promise<Highlighter> | null = null;

export async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark"],
      langs: [
        "typescript",
        "tsx",
        "javascript",
        "jsx",
        "json",
        "bash",
        "shell",
        "text",
        "markdown",
        "css",
        "html",
      ],
    });
  }
  return highlighterPromise;
}

export async function highlightCode(
  code: string,
  language: string = "typescript"
): Promise<string> {
  const hl = await getHighlighter();

  // Map common language aliases
  const langMap: Record<string, string> = {
    ts: "typescript",
    js: "javascript",
    sh: "bash",
    zsh: "bash",
  };

  const lang = langMap[language] || language;

  try {
    return hl.codeToHtml(code, {
      lang,
      theme: "github-dark",
    });
  } catch {
    // Fallback to text if language not supported
    return hl.codeToHtml(code, {
      lang: "text",
      theme: "github-dark",
    });
  }
}
