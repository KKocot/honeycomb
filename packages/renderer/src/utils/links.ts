const url_char = '[^\\s"<>\\]\\[\\(\\)]';
const url_char_end = url_char.replace(/\]$/, ".,']");
const image_path =
  "(?:(?:\\.(?:tiff?|jpe?g|gif|png|svg|ico|webp)|ipfs/[a-z\\d]{40,}))";
const domain_path = "(?:[-a-zA-Z0-9\\._]*[-a-zA-Z0-9])";
const url_chars = "(?:" + url_char + "*" + url_char_end + ")?";

const url_set = ({ domain = domain_path, path = "" } = {}) => {
  return `https?://${domain}(?::\\d{2,5})?(?:[/\\?#]${url_chars}${path ? path : ""})${path ? "" : "?"}`;
};

export const any = (flags = "i") => new RegExp(url_set(), flags);
export const local = (flags = "i") =>
  new RegExp(
    url_set({ domain: "(?:localhost|(?:.*\\.)?hive.blog)" }),
    flags,
  );
export const remote = (flags = "i") =>
  new RegExp(
    url_set({
      domain: `(?!localhost|(?:.*\\.)?hive.blog)${domain_path}`,
    }),
    flags,
  );
export const image = (flags = "i") =>
  new RegExp(url_set({ path: image_path }), flags);
export const image_file = (flags = "i") => new RegExp(image_path, flags);

const links_re = {
  any: any(),
  local: local(),
  remote: remote(),
  image: image(),
  imageFile: image_file(),
  vimeo:
    /https?:\/\/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)\/?(#t=((\d+)s?))?\/?/,
  vimeoId:
    /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/,
  twitch:
    /https?:\/\/(?:www.)?twitch\.tv\/(?:(videos)\/)?([a-zA-Z0-9][\w]{3,24})/i,
  ipfsProtocol: /^((\/\/?ipfs\/)|(ipfs:\/\/))/,
};

export default links_re;
