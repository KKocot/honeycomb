/// <reference path="./twitter-types.d.ts" />
import type { RendererPlugin } from "./renderer-plugin";

const WIDGETS_JS_URL = "https://platform.twitter.com/widgets.js";
const TWEET_ID_REGEX = /[?&]id=(\d+)/;
const LOAD_TIMEOUT_MS = 10_000;

export class TwitterResizePlugin implements RendererPlugin {
  name = "twitter-resize";

  private script_loading = false;

  private is_widgets_ready(): boolean {
    return (
      typeof window.twttr?.widgets?.createTweet === "function"
    );
  }

  private load_widgets_js(): {
    promise: Promise<void>;
    cancel: () => void;
  } {
    if (this.is_widgets_ready()) {
      return {
        promise: Promise.resolve(),
        cancel: () => {},
      };
    }

    let aborted = false;
    let resolve_fn: (() => void) | null = null;
    const timeout_ids: ReturnType<typeof setTimeout>[] = [];

    const cancel = () => {
      aborted = true;
      timeout_ids.forEach((id) => clearTimeout(id));
      timeout_ids.length = 0;
      this.script_loading = false;
      if (resolve_fn) resolve_fn();
    };

    if (this.script_loading) {
      const promise = new Promise<void>((resolve) => {
        resolve_fn = resolve;
        const started = Date.now();
        const check = () => {
          if (aborted || this.is_widgets_ready()) {
            resolve();
            return;
          }
          if (Date.now() - started > LOAD_TIMEOUT_MS) {
            resolve();
            return;
          }
          const timeout_id = setTimeout(check, 100);
          timeout_ids.push(timeout_id);
        };
        check();
      });
      return { promise, cancel };
    }

    this.script_loading = true;

    const promise = new Promise<void>((resolve) => {
      resolve_fn = resolve;
      const script = document.createElement("script");
      script.src = WIDGETS_JS_URL;
      script.async = true;

      const main_timeout_id = setTimeout(() => {
        if (aborted) return;
        this.script_loading = false;
        resolve();
      }, LOAD_TIMEOUT_MS);
      timeout_ids.push(main_timeout_id);

      script.onerror = () => {
        if (aborted) return;
        clearTimeout(main_timeout_id);
        this.script_loading = false;
        resolve();
      };

      script.onload = () => {
        const started = Date.now();
        const check = () => {
          if (aborted) {
            clearTimeout(main_timeout_id);
            resolve();
            return;
          }
          if (this.is_widgets_ready()) {
            clearTimeout(main_timeout_id);
            resolve();
            return;
          }
          if (Date.now() - started > LOAD_TIMEOUT_MS) {
            clearTimeout(main_timeout_id);
            this.script_loading = false;
            resolve();
            return;
          }
          const timeout_id = setTimeout(check, 50);
          timeout_ids.push(timeout_id);
        };
        check();
      };

      document.head.appendChild(script);
    });

    return { promise, cancel };
  }

  onMount = (
    root_element: HTMLElement,
  ): (() => void) | undefined => {
    if (typeof window === "undefined") return undefined;

    const wrappers =
      root_element.querySelectorAll(".twitterWrapper");
    if (wrappers.length === 0) return undefined;

    let cancelled = false;
    let cancel_loading: (() => void) | null = null;

    const render_tweets = async () => {
      const load_result = this.load_widgets_js();
      cancel_loading = load_result.cancel;

      await load_result.promise;
      if (cancelled) return;

      if (!this.is_widgets_ready()) return;

      const wrapper_list = Array.from(wrappers);
      for (let i = 0; i < wrapper_list.length; i++) {
        if (cancelled) return;
        const wrapper = wrapper_list[i];
        if (!(wrapper instanceof HTMLElement)) continue;
        const iframe = wrapper.querySelector("iframe");
        if (!iframe) continue;

        const src = iframe.getAttribute("src") ?? "";
        const match = src.match(TWEET_ID_REGEX);
        if (!match?.[1]) continue;

        const tweet_id = match[1];
        const is_dark_mode =
          wrapper.closest(".dark") !== null;

        iframe.style.display = "none";

        const result =
          await window.twttr?.widgets?.createTweet?.(
            tweet_id,
            wrapper,
            {
              theme: is_dark_mode ? "dark" : "light",
            },
          );

        if (cancelled) return;

        if (result !== undefined) {
          iframe.remove();
        } else {
          iframe.style.display = "";
        }
      }
    };

    render_tweets();

    return () => {
      cancelled = true;
      if (cancel_loading) cancel_loading();
    };
  };
}
