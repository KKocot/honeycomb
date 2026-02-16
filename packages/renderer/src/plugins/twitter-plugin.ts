/// <reference path="./twitter-types.d.ts" />
import { RendererPlugin } from "./renderer-plugin";

export class TwitterPlugin implements RendererPlugin {
  private rendered_tweets = new Set<string>();
  private script_loaded = false;
  private tweet_counts = new Map<string, number>();
  name = "twitter";

  constructor() {
    if (typeof window !== "undefined") {
      this.load_twitter_script();
    }
  }

  private is_valid_twitter_api(): boolean {
    return (
      typeof window.twttr === "object" &&
      window.twttr !== null &&
      typeof window.twttr.widgets?.createTweet === "function"
    );
  }

  private load_twitter_script() {
    if (
      document.querySelector(
        'script[src*="platform.twitter.com/widgets.js"]',
      )
    ) {
      this.script_loaded = true;
      return;
    }
    if (!this.script_loaded && !this.is_valid_twitter_api()) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.onload = () => (this.script_loaded = true);
      document.head.appendChild(script);
    }
  }

  private render_tweet(id: string, container_id: string) {
    if (typeof window === "undefined") return;

    if (!this.rendered_tweets.has(container_id)) {
      this.rendered_tweets.add(container_id);
      const container = document.getElementById(container_id);
      if (container && this.is_valid_twitter_api()) {
        container.innerHTML = "";
        const is_dark_mode =
          container.closest(".dark") !== null;
        window.twttr?.widgets
          ?.createTweet?.(id, container, {
            theme: is_dark_mode ? "dark" : "light",
          })
          .then((el) => {
            if (!el)
              this.rendered_tweets.delete(container_id);
          });
      }
    }
  }

  preProcess: (text: string) => string = (text: string) => {
    if (typeof window === "undefined") {
      this.tweet_counts.clear();
    }

    return text.replace(
      /(?<!\()(https?:\/\/)?(?:www\.)?(twitter|x)\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)[^)\s]*/g,
      (_match, _protocol, _domain, author, _status, id) => {
        const count =
          (this.tweet_counts.get(id) || 0) + 1;
        this.tweet_counts.set(id, count);
        const index_suffix = count > 1 ? `${count}` : "";
        return `&nbsp;<div>twitter-id-${id}-author-${author}-count-${index_suffix}</div>&nbsp;`;
      },
    );
  };

  postProcess: (text: string) => string = (text: string) => {
    return text.replace(
      /<div>twitter-id-(\d+)-author-(\w+)-count-([^<]*)<\/div>/g,
      (_match, id, author, index_suffix) => {
        const container_id = `tweet-${id}-${index_suffix}`;
        const url = `https://x.com/${author}/status/${id}`;
        if (typeof window !== "undefined") {
          if (window.twttr?.ready) {
            window.twttr.ready(() => {
              this.render_tweet(id, container_id);
            });
          } else {
            const check_interval = setInterval(() => {
              if (window.twttr?.ready) {
                clearInterval(check_interval);
                window.twttr.ready(() =>
                  this.render_tweet(id, container_id),
                );
              }
            }, 200);
            setTimeout(
              () => clearInterval(check_interval),
              10000,
            );
          }
        }

        return `<div id="${container_id}" class="twitter-tweet"><a href="${url}" target="_blank">${url}</a></div>`;
      },
    );
  };
}
