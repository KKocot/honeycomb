"use client";

import { useState, useEffect, FC } from "react";

// Extend Window interface to include Twitter widgets API
declare global {
  interface Window {
    twttr?: {
      widgets: {
        load(): void;
      };
    };
  }
}

const twitterRegex =
  /(?:https?:\/\/)?(?:www\.)?(twitter|x)\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/;

interface Metadata {
  id: string;
  url: string;
  username: string;
}

/**
 * Extract Twitter/X post metadata from a link
 */
export const getXMetadataFromLink = (data: string): Metadata | undefined => {
  if (!data) return undefined;

  const cleanData = data.replace(/^(@|https:\/\/)/, "");

  const match = cleanData.match(twitterRegex);
  if (!match) return undefined;

  const username = match[2];
  const id = match[4];
  const url = `https://${cleanData}`;

  return { id, url, username };
};

/**
 * Twitter/X embed component
 */
export const TwitterEmbedder: FC<{ id: string; username: string }> = ({
  id,
  username,
}) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const loadTwitterScript = () => {
      if (
        document.querySelector(
          'script[src="https://platform.twitter.com/widgets.js"]'
        )
      ) {
        setScriptLoaded(true);
        if (window.twttr?.widgets) {
          window.twttr.widgets.load();
        }
        return;
      }

      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.onload = () => {
        setScriptLoaded(true);
        if (window.twttr?.widgets) {
          window.twttr.widgets.load();
        }
      };
      document.body.appendChild(script);
    };

    loadTwitterScript();

    return () => {
      const tweetElements = document.querySelectorAll(".twitter-tweet");
      tweetElements.forEach((element) => {
        const iframe = element.nextElementSibling;
        if (iframe && iframe.tagName === "IFRAME") {
          try {
            iframe.remove();
          } catch {
            // Ignore removal errors
          }
        }
      });
    };
  }, []);

  useEffect(() => {
    if (scriptLoaded && window.twttr?.widgets) {
      window.twttr.widgets.load();
    }
  }, [scriptLoaded, id]);

  return (
    <blockquote className="twitter-tweet" key={`tweet-${id}`}>
      <a href={`https://twitter.com/${username}/status/${id}`}></a>
    </blockquote>
  );
};
