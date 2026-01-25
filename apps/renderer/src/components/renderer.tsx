import "highlight.js/styles/github.css";
import "remark-github-blockquote-alert/alert.css";
import ReactMarkdown, { Components } from "react-markdown";
import Image from "next/image";

// remark plugins
import remarkBreaks from "remark-breaks";
import remarkParse from "remark-parse";
import remarkInternalLinks from "./plugins/remark-internal-links";
import remarkFlexibleParagraphs from "remark-flexible-paragraphs";
import remarkFlexibleMarkers from "remark-flexible-markers";
import remarkAlert from "remark-github-blockquote-alert";
import remarkMath from "remark-math";
import remarkSubSup from "./plugins/remark-sub-sup";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";

// rehype plugins
import rehypeStringify from "rehype-stringify";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeLinkHandler from "./plugins/rehype-link-handler";
import rehypeSanitize from "rehype-sanitize";
import LinkHeader from "./link-header";
import {
  createElement,
  HTMLAttributes,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { getDoubleSize, proxifyImageUrl } from "@/lib/old-profixy";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { LeavePageDialog } from "./leave-page-dialog";
import { getTwitchMetadataFromLink, TwitchEmbed } from "./embeds/twitch";
import {
  getInstagramMetadataFromLink,
  InstagramEmbedder,
} from "./embeds/instagram";
import {
  getThreespeakMetadataFromLink,
  ThreeSpeakEmbed,
} from "./embeds/threespeak";
import { getXMetadataFromLink, TwitterEmbedder } from "./embeds/twitter-x";
import { getYoutubeaFromLink, YoutubeEmbed } from "./embeds/youtube";
import MermaidComponent from "./mermaid-component";
import { cn } from "@/lib/utils";

export default function Renderer({ content }: { content: string }) {
  const components: Components = {
    ...(["h1", "h2", "h3", "h4", "h5", "h6"] as const).reduce((acc, tag) => {
      acc[tag] = ({ children, ...props }: HeaderProps) => (
        <LinkHeader id={children?.toString()}>
          {createElement(tag, props, children)}
        </LinkHeader>
      );
      return acc;
    }, {} as Components),
    img: ({ src, alt, ...props }) => {
      if (!src || src instanceof Blob) return null;
      const imageProxy = getDoubleSize(
        proxifyImageUrl(src, true).replace(/ /g, "%20")
      );
      return <img src={imageProxy} alt={alt || "Image"} {...props} />;
    },
    code: ({ className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "";

      if (language === "mermaid") {
        return (
          <MermaidComponent>
            {String(children).replace(/\n$/, "")}
          </MermaidComponent>
        );
      }

      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    a: LinkComponent,
  };

  return (
    <>
      <div className="w-full relative min-w-full self-center break-words p-2 font-source text-[16.5px] prose-h1:text-[26.4px] prose-h2:text-[23.1px] prose-h3:text-[19.8px] prose-h4:text-[18.1px] sm:text-[17.6px] sm:prose-h1:text-[28px] sm:prose-h2:text-[24.7px] sm:prose-h3:text-[22.1px] sm:prose-h4:text-[19.4px] lg:text-[19.2px] lg:prose-h1:text-[30.7px] lg:prose-h2:text-[28.9px] lg:prose-h3:text-[23px] lg:prose-h4:text-[21.1px] prose-p:mb-6 prose-p:mt-0 prose-img:cursor-pointer prose max-w-none dark:prose-invert">
        <ReactMarkdown
          components={components}
          remarkPlugins={[
            remarkParse,
            remarkBreaks,
            remarkInternalLinks,
            remarkFlexibleParagraphs,
            remarkFlexibleMarkers,
            remarkAlert,
            remarkMath,
            remarkSubSup,
            [
              remarkGfm,
              { singleTilde: false, subscript: true, superscript: true },
            ],
            remarkRehype,
          ]}
          rehypePlugins={[
            rehypeStringify,
            rehypeRaw,
            rehypeKatex,
            rehypeHighlight,
            rehypeLinkHandler,
            [
              rehypeSanitize,
              {
                attributes: {
                  "*": ["style", "className", "class", "id"],
                  a: ["href", "title"],
                  img: ["src", "alt"],
                  input: ["checked"],
                  th: ["align", "style"],
                  td: ["align", "style"],
                  table: ["style"],
                  thead: ["style"],
                  tbody: ["style"],
                  tr: ["style"],
                  svg: [
                    "width",
                    "height",
                    "viewBox",
                    "xmlns",
                    "class",
                    "aria-hidden",
                  ],
                  path: ["d"],
                },
                tagNames: [
                  "span",
                  "div",
                  "p",
                  "a",
                  "ul",
                  "ol",
                  "li",
                  "h1",
                  "h2",
                  "h3",
                  "h4",
                  "h5",
                  "h6",
                  "u",
                  "strong",
                  "em",
                  "blockquote",
                  "code",
                  "pre",
                  "img",
                  "table",
                  "thead",
                  "tbody",
                  "tr",
                  "th",
                  "td",
                  "sub",
                  "sup",
                  "mark",
                  "br",
                  "input",
                  "center",
                  "svg",
                  "g",
                  "path",
                  "rect",
                  "circle",
                  "text",
                  "line",
                  "polygon",
                  "polyline",
                  "defs",
                  "marker",
                  "style",
                ],
              },
            ],
          ]}
        >
          {content}
        </ReactMarkdown>
      </div>
    </>
  );
}

interface LinkComponentProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  children?: React.ReactNode;
  className?: string;
}

const LinkComponent = ({
  href,
  children,
  className,
  ...props
}: LinkComponentProps) => {
  const url = href ?? "";
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Link href={url} {...props}>
        {children}
      </Link>
    );
  }
  const imageExtensions = [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".svg",
    ".bmp",
  ];
  if (imageExtensions.some((ext) => url.toLowerCase().endsWith(ext))) {
    const imageProxy = getDoubleSize(
      proxifyImageUrl(url, true).replace(/ /g, "%20")
    );
    return (
      <Image
        src={imageProxy}
        alt={children?.toString() || "Image"}
        width={800}
        height={600}
        style={{ width: "auto", height: "auto" }}
      />
    );
  }

  const twitch = getTwitchMetadataFromLink(url);
  if (twitch) {
    return (
      <div
        key={`twitch-embed-${twitch}`}
        className="flex w-full justify-center"
      >
        <TwitchEmbed url={twitch} />
      </div>
    );
  }

  const threeSpeak = getThreespeakMetadataFromLink(url);
  if (threeSpeak) {
    return (
      <div
        key={`threespeak-embed-${threeSpeak}`}
        suppressHydrationWarning
        className="flex w-full justify-center"
      >
        <ThreeSpeakEmbed id={threeSpeak} />
      </div>
    );
  }

  const instagram = getInstagramMetadataFromLink(url);
  if (instagram) {
    return (
      <div
        key={`instagram-embed-${instagram}`}
        suppressHydrationWarning
        className="flex w-full justify-center"
      >
        <InstagramEmbedder href={instagram} />
      </div>
    );
  }

  const youtube = getYoutubeaFromLink(url);
  if (youtube) {
    return (
      <div
        key={`youtube-embed-${youtube.id}`}
        suppressHydrationWarning
        className="flex w-full justify-center"
      >
        <YoutubeEmbed url={youtube.url} id={youtube.id} />
      </div>
    );
  }

  const x = getXMetadataFromLink(url);
  if (x) {
    return (
      <div
        key={`twitter-embed-${x.id}`}
        suppressHydrationWarning
        className="flex w-full justify-center"
      >
        <TwitterEmbedder id={x.id} username={x.username} />
      </div>
    );
  }

  if (className?.includes("link-external")) {
    if (className?.includes("safe-external-link")) {
      return (
        <Link href={url} target="_blank" className="text-destructive">
          <span>{children}</span>
          <ExternalLink className="inline h-4 w-4 cursor-pointer pl-1" />
        </Link>
      );
    }
    if (className?.includes("unknown-external-link")) {
      return (
        <>
          <LeavePageDialog link={url} {...props}>
            {children}
          </LeavePageDialog>
          <ExternalLink className="inline h-4 w-4 cursor-pointer pl-1 text-destructive" />
        </>
      );
    }
  }

  return (
    <Link href={url} {...props} className={cn(className, "text-destructive")}>
      {children}
    </Link>
  );
};

interface HeaderProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode;
}
