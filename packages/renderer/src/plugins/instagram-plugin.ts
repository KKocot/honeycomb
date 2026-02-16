import { RendererPlugin } from "./renderer-plugin";

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

interface InstagramPostData {
  type: "p" | "reel";
  id: string;
}

export class InstagramPlugin implements RendererPlugin {
  private static readonly VALID_ID = /^[a-zA-Z0-9_-]{10,14}$/;

  private rendered_posts = new Set<string>();
  private script_loaded = false;
  private link_counts = new Map<string, number>();
  name = "instagram";

  constructor() {
    if (typeof window !== "undefined") {
      this.load_instagram_script();
    }
  }

  private is_valid_instagram_api(): boolean {
    return (
      typeof window.instgrm === "object" &&
      window.instgrm !== null &&
      typeof window.instgrm.Embeds?.process === "function"
    );
  }

  private load_instagram_script() {
    if (
      document.querySelector(
        'script[src*="instagram.com/embed.js"]',
      )
    ) {
      this.script_loaded = true;
      return;
    }
    if (!this.script_loaded && !this.is_valid_instagram_api()) {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.onload = () => {
        this.script_loaded = true;
        this.process_queued_posts();
      };
      document.head.appendChild(script);
    }
  }

  private process_queued_posts() {
    if (this.is_valid_instagram_api()) {
      window.instgrm?.Embeds.process();
    }
  }

  private parse_instagram_url(
    url: string,
  ): InstagramPostData | null {
    if (!url) return null;

    const match = url.match(
      /^https:\/\/(?:www\.)?instagram\.com\/(?:[\w.]+\/)?(?<type>p|reels?)\/(?<id>[^/?#]+)/i,
    );

    const id = match?.groups?.id;
    if (!id || !InstagramPlugin.VALID_ID.test(id)) {
      return null;
    }

    return {
      type: match.groups?.type?.includes("reel") ? "reel" : "p",
      id,
    };
  }

  private build_url(type: "p" | "reel", id: string): string {
    return `https://www.instagram.com/${type}/${id}/`;
  }

  private render_post(
    post_data: InstagramPostData,
    container_id: string,
  ) {
    if (typeof window === "undefined") return;
    if (this.rendered_posts.has(container_id)) return;

    const container = document.getElementById(container_id);
    if (!container) return;

    this.rendered_posts.add(container_id);
    const url = this.build_url(post_data.type, post_data.id);
    const is_dark_mode = container.closest(".dark") !== null;

    const blockquote = document.createElement("blockquote");
    blockquote.className = "instagram-media";
    blockquote.dataset.instgrmPermalink = url;
    blockquote.dataset.instgrmVersion = "14";
    if (is_dark_mode) {
      blockquote.dataset.instgrmTheme = "dark";
    }

    const wrapper = document.createElement("div");
    wrapper.style.padding = "16px";

    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Loading Instagram post...";

    wrapper.appendChild(link);
    blockquote.appendChild(wrapper);
    container.replaceChildren(blockquote);

    if (this.script_loaded) {
      this.process_queued_posts();
    }
  }

  preProcess = (text: string): string => {
    if (typeof window === "undefined") {
      this.link_counts.clear();
    }
    return text.replace(
      /(?<!\()(https?:\/\/(www\.)?instagram\.com\/[^\s)]+)/g,
      (match) => {
        const post_data = this.parse_instagram_url(match);
        if (!post_data) return match;

        const count =
          (this.link_counts.get(match) || 0) + 1;
        this.link_counts.set(match, count);
        const index_suffix = count > 1 ? `${count}` : "";

        return `&nbsp;<div>instagram-embed-${post_data.type}-${post_data.id}-count-${index_suffix}</div>&nbsp;`;
      },
    );
  };

  postProcess = (text: string): string => {
    return text.replace(
      /<div>instagram-embed-(?<type>p|reel)-(?<id>[a-zA-Z0-9_-]{10,14})-count-(?<count>\d*)<\/div>/g,
      (
        _match,
        type: "p" | "reel",
        id: string,
        count: string,
      ) => {
        const post_data: InstagramPostData = { type, id };
        const url = this.build_url(type, id);
        const container_id = `instagram-${type}-${id}-${count}`;

        setTimeout(
          () => this.render_post(post_data, container_id),
          1000,
        );

        return `<div id="${container_id}" class="instagram-embed"><a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a></div>`;
      },
    );
  };
}
