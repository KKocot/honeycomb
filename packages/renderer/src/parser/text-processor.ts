import links_re, { any as links_any } from "../utils/links";
import { AccountNameValidator } from "../utils/account-name-validator";
import { LinkSanitizer } from "../security/link-sanitizer";
import type { LocalizationOptions } from "../localization";
import type { AssetEmbedderOptions } from "../embedder/asset-embedder";
import type { State } from "./html-dom-parser";

export class TextProcessor {
  private options: AssetEmbedderOptions;
  private localization: LocalizationOptions;
  private link_sanitizer: LinkSanitizer;

  public constructor(
    options: AssetEmbedderOptions,
    localization: LocalizationOptions,
    link_sanitizer: LinkSanitizer,
  ) {
    this.options = options;
    this.localization = localization;
    this.link_sanitizer = link_sanitizer;
  }

  public linkify(
    content: string,
    state: State,
    mutate: boolean,
  ): string {
    content = this.linkify_urls(content, state, mutate);
    content = this.linkify_hashtags(content, state, mutate);
    content = this.linkify_usertags(content, state, mutate);
    return content;
  }

  private linkify_urls(
    content: string,
    state: State,
    mutate: boolean,
  ): string {
    return content.replace(links_any("gi"), (ln) => {
      if (links_re.image.test(ln)) {
        state.images.add(ln);
        return `<img src="${this.normalize_url(ln)}" alt="Embedded Image" />`;
      }

      if (/\.(zip|exe)$/i.test(ln)) {
        return ln;
      }

      const sanitized_link = this.link_sanitizer.sanitize_link(
        ln,
        ln,
      );
      if (sanitized_link === false) {
        return `<div title='${this.localization.phishingWarning}' class='phishy'>${ln}</div>`;
      }

      state.links.add(sanitized_link);
      return `<a href="${this.normalize_url(ln)}">${sanitized_link}</a>`;
    });
  }

  private linkify_hashtags(
    content: string,
    state: State,
    mutate: boolean,
  ): string {
    return content.replace(/(^|\s)(#[-a-z\d]+)/gi, (tag) => {
      if (/#[\d]+$/.test(tag)) {
        return tag;
      }
      const space = /^\s/.test(tag) ? tag[0] : "";
      const tag2 = tag.trim().substring(1);
      const tag_lower = tag2.toLowerCase();
      state.hashtags.add(tag_lower);
      if (!mutate) {
        return tag;
      }
      const tag_url = this.options.hashtagUrlFn(tag_lower);
      return space + `<a href="${tag_url}">${tag.trim()}</a>`;
    });
  }

  private linkify_usertags(
    content: string,
    state: State,
    mutate: boolean,
  ): string {
    return content.replace(
      /(^|[^a-zA-Z0-9_!#$%&*@\uFF20/]|(^|[^a-zA-Z0-9_+~.\-/#]))[@\uFF20]([a-z][-.a-z\d]+[a-z\d])/gi,
      (
        _match: string,
        preceeding1: string,
        preceeding2: string,
        user: string,
      ) => {
        const user_lower = user.toLowerCase();
        const valid =
          AccountNameValidator.validate_account_name(
            user_lower,
            this.localization,
          ) == null;

        if (valid && state.usertags) {
          state.usertags.add(user_lower);
        }

        const preceedings =
          (preceeding1 || "") + (preceeding2 || "");

        if (!mutate) {
          return `${preceedings}${user}`;
        }

        const user_tag_url =
          this.options.usertagUrlFn(user_lower);
        return valid
          ? `${preceedings}<a href="${user_tag_url}">@${user}</a>`
          : `${preceedings}@${user}`;
      },
    );
  }

  public normalize_url(url: string): string {
    if (this.options.ipfsPrefix) {
      if (links_re.ipfsProtocol.test(url)) {
        const match = url.match(links_re.ipfsProtocol);
        if (match) {
          const protocol = match[0];
          const cid = url.replace(protocol, "");
          return `${this.options.ipfsPrefix.replace(/\/+$/, "")}/${cid}`;
        }
      }
    }
    return url;
  }
}
