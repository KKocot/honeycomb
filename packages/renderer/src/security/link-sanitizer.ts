import { z } from "zod";
import { Phishing } from "./phishing";
import type { RendererLogger } from "../types";

const PRIVATE_IPV4_PATTERNS = [
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^169\.254\./,
  /^0\./,
];

const PRIVATE_HOSTNAMES = ["localhost", "localhost.localdomain"];

const PRIVATE_IPV6_PATTERNS = [
  /^::1$/,
  /^fe80:/i,
  /^fc00:/i,
  /^fd[0-9a-f]{2}:/i,
];

const link_sanitizer_options_schema = z.object({
  baseUrl: z.string().min(1),
});

export class LinkSanitizer {
  private options: LinkSanitizerOptions;
  private base_url: URL;
  private top_levels_base_domain: string;
  private logger?: RendererLogger;

  public constructor(
    options: LinkSanitizerOptions,
    logger?: RendererLogger,
  ) {
    link_sanitizer_options_schema.parse(options);
    this.options = options;
    this.logger = logger;
    this.base_url = new URL(this.options.baseUrl);
    this.top_levels_base_domain =
      LinkSanitizer.get_top_level_base_domain(this.base_url);
  }

  public sanitize_link(url: string, url_title: string): string | false {
    url = this.prepend_unknown_protocol_link(url);

    if (Phishing.looks_phishy(url)) {
      this.logger?.warn(
        `LinkSanitizer: phishing link detected: ${url}`,
      );
      return false;
    }

    if (this.is_pseudo_local_url(url, url_title)) {
      this.logger?.warn(
        `LinkSanitizer: pseudo local url detected: ${url}`,
      );
      return false;
    }

    if (LinkSanitizer.is_private_network_url(url)) {
      this.logger?.warn(
        `LinkSanitizer: private network URL blocked: ${url}`,
      );
      return false;
    }

    return url;
  }

  public static is_private_network_url(url: string): boolean {
    try {
      const parsed = new URL(url);
      const hostname = parsed.hostname.toLowerCase();

      if (PRIVATE_HOSTNAMES.includes(hostname)) {
        return true;
      }

      for (const pattern of PRIVATE_IPV4_PATTERNS) {
        if (pattern.test(hostname)) {
          return true;
        }
      }

      const ipv6_hostname = hostname.replace(/^\[|\]$/g, "");
      for (const pattern of PRIVATE_IPV6_PATTERNS) {
        if (pattern.test(ipv6_hostname)) {
          return true;
        }
      }

      return false;
    } catch {
      return false;
    }
  }

  private static get_top_level_base_domain(url: URL): string {
    if (!url.hostname.includes(".")) return url.hostname;

    const regex = /([^\s/$.?#]+\.[^\s/$.?#]+)$/g;
    const m = regex.exec(url.hostname);
    if (m?.[0]) return m[0];
    throw new Error(
      `LinkSanitizer: could not determine top level base domain from baseUrl hostname: ${url.hostname}`,
    );
  }

  private prepend_unknown_protocol_link(url: string): string {
    if (!/^((#)|(\/(?!\/))|(((hive|https?):)?\/\/))/.test(url)) {
      url = "https://" + url;
    }
    return url;
  }

  private is_pseudo_local_url(
    url: string,
    url_title: string,
  ): boolean {
    if (url.indexOf("#") === 0) return false;
    url = url.toLowerCase();
    url_title = url_title.toLowerCase();

    try {
      const url_title_contains_base_domain =
        url_title.indexOf(this.top_levels_base_domain) !== -1;
      const url_contains_base_domain =
        url.indexOf(this.top_levels_base_domain) !== -1;
      if (url_title_contains_base_domain && !url_contains_base_domain) {
        return true;
      }
    } catch (error) {
      if (error instanceof TypeError) {
        return false;
      }
      throw error;
    }
    return false;
  }
}

export interface LinkSanitizerOptions {
  baseUrl: string;
}
