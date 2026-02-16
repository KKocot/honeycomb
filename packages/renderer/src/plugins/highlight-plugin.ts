import type { RendererPlugin } from "./renderer-plugin";

/**
 * Syntax highlighting plugin using highlight.js.
 *
 * Requires `highlight.js` as a peer dependency.
 * Import a highlight.js CSS theme in your global styles.
 *
 * Usage:
 *   import hljs from "highlight.js";
 *   import "highlight.js/styles/github-dark.css";
 *   const plugin = new HighlightPlugin(hljs);
 */
export class HighlightPlugin implements RendererPlugin {
  name = "highlight-plugin";

  private hljs: {
    highlightElement: (element: HTMLElement) => void;
  };

  constructor(hljs: {
    highlightElement: (element: HTMLElement) => void;
  }) {
    this.hljs = hljs;
  }

  onMount = (root_element: HTMLElement): (() => void) | undefined => {
    const blocks = root_element.querySelectorAll("pre code[class*='language-']");
    for (const block of blocks) {
      this.hljs.highlightElement(block as HTMLElement);
    }
    return undefined;
  };
}
