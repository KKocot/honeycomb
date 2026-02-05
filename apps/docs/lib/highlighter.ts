import { createHighlighter, type Highlighter } from "shiki";

// Singleton instance - use globalThis to persist across hot reloads
const globalForHighlighter = globalThis as unknown as {
  highlighterPromise?: Promise<Highlighter>;
};

// VS Code-like theme
const THEME = "one-dark-pro";

export async function getHighlighter(): Promise<Highlighter> {
  if (!globalForHighlighter.highlighterPromise) {
    globalForHighlighter.highlighterPromise = createHighlighter({
      themes: [THEME],
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
        "vue",
      ],
    });
  }
  return globalForHighlighter.highlighterPromise;
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
      theme: THEME,
    });
  } catch {
    // Fallback to text if language not supported
    return hl.codeToHtml(code, {
      lang: "text",
      theme: THEME,
    });
  }
}
