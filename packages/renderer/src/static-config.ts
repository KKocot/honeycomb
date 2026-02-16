export class StaticConfig {
  public static sanitization = {
    iframeWhitelist: [
      {
        re: /^(?:@?(?:https?:)?\/\/)?(?:www\.)?(twitter|x)\.com\/(?:\w+\/status|status)\/(\d{1,20})/i,
        fn: (src: string) => {
          if (!src) {
            return null;
          }
          const clean_src = src.replace(/^(@|https?:\/\/)/, "");
          const match = clean_src.match(
            /(?:twitter|x)\.com\/(?:\w+\/status|status)\/(\d{1,20})/i,
          );
          if (!match || match.length !== 2) {
            return null;
          }
          return `https://platform.twitter.com/embed/Tweet.html?id=${match[1]}`;
        },
      },
      {
        re: /^(https?:)?\/\/player.vimeo.com\/video\/.*/i,
        fn: (src: string) => {
          if (!src) {
            return null;
          }
          const m = src.match(
            /https:\/\/player\.vimeo\.com\/video\/([0-9]+)/,
          );
          if (!m || m.length !== 2) {
            return null;
          }
          return "https://player.vimeo.com/video/" + m[1];
        },
      },
      {
        re: /^(https?:)?\/\/www.youtube.com\/embed\/.*/i,
        fn: (src: string) => {
          return src.replace(/\?.+$/, "");
        },
      },
      {
        re: /^https:\/\/w.soundcloud.com\/player\/.*/i,
        fn: (src: string) => {
          if (!src) {
            return null;
          }
          const m = src.match(/url=(.+?)&/);
          if (!m || m.length !== 2) {
            return null;
          }
          return `https://w.soundcloud.com/player/?url=${m[1]}&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&visual=true`;
        },
      },
      {
        re: /^(https?:)?\/\/player.twitch.tv\/.*/i,
        fn: (src: string) => {
          return src;
        },
      },
      {
        re: /^https:\/\/open\.spotify\.com\/(embed|embed-podcast)\/(playlist|show|episode|album|track|artist)\/(.*)/i,
        fn: (src: string) => {
          return src;
        },
      },
      {
        re: /^(?:https?:)?\/\/(?:3speak\.(?:tv|online|co))\/embed\?v=([^&\s]+)/i,
        fn: (src: string) => {
          if (!src) return null;
          const match = src.match(
            /3speak\.(?:tv|online|co)\/embed\?v=([^&\s]+)/i,
          );
          if (!match || match.length !== 2) return null;
          return `https://3speak.tv/embed?v=${match[1]}`;
        },
      },
      {
        re: /^(?:https?:)?\/\/(?:3speak\.(?:tv|online|co))\/watch\?v=([^&\s]+)/i,
        fn: (src: string) => {
          if (!src) return null;
          const match = src.match(
            /3speak\.(?:tv|online|co)\/watch\?v=([^&\s]+)/i,
          );
          if (!match || match.length !== 2) return null;
          return `https://3speak.tv/embed?v=${match[1]}`;
        },
      },
      {
        re: /^(?:https:)\/\/(?:www\.)?(twitter|x)\.com\/(?:\w+\/status|status)\/(\d{1,20})/i,
        fn: (src: string) => {
          if (!src) {
            return null;
          }
          const match = src.match(
            /(?:twitter|x)\.com\/(?:\w+\/status|status)\/(\d{1,20})/i,
          );
          if (!match || match.length !== 2) {
            return null;
          }
          return `https://platform.twitter.com/embed/Tweet.html?id=${match[1]}`;
        },
      },
    ],
    noImageText: "(Image not shown due to low ratings)",
    allowedTags: `
    div, iframe, del,
    a, p, b, i, q, br, ul, li, ol, img, h1, h2, h3, h4, h5, h6, hr,
    blockquote, pre, code, em, strong, center, table, thead, tbody, tr, th, td,
    strike, sup, sub, details, summary
`
      .trim()
      .split(/,\s*/),
  };
}
