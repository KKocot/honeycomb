"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { HiveAvatar } from "./avatar";
import { useHive } from "@/contexts/hive-context";
import { ThumbsUp, MessageCircle, Share, Clock, User, Loader2, ImageOff } from "lucide-react";
import type { NaiAsset } from "@hiveio/wax";

type PostVariant = "card" | "compact" | "grid";
type HideOption = "author" | "thumbnail" | "payout" | "votes" | "comments" | "reblog" | "time";

interface HivePostCardProps {
  author: string;
  permlink: string;
  variant?: PostVariant;
  hide?: HideOption[];
  linkTarget?: string;
  onVote?: (weight: number) => void;
  onReblog?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

interface PostData {
  title: string;
  body: string;
  votes: number;
  comments: number;
  payout: string;
  created: string;
  thumbnail: string | null;
  category: string;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString + "Z");
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function extractThumbnail(jsonMetadata: string): string | null {
  try {
    const meta = JSON.parse(jsonMetadata);
    if (meta.image && meta.image.length > 0) {
      return meta.image[0];
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

// Parse asset string (e.g. "1.234 HBD") or NaiAsset to number
function parseAsset(asset: string | NaiAsset | undefined): number {
  if (!asset) return 0;
  if (typeof asset === "string") {
    const match = asset.match(/^([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }
  return Number(asset.amount) / Math.pow(10, asset.precision);
}

export function HivePostCard({
  author,
  permlink,
  variant = "card",
  hide = [],
  linkTarget = "https://blog.openhive.network",
  onVote,
  onReblog,
  className,
  style,
}: HivePostCardProps) {
  const { chain } = useHive();
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState<PostData | null>(null);

  useEffect(() => {
    async function fetchPost() {
      if (!chain) return;
      setIsLoading(true);
      try {
        // Use fetch directly since wax doesn't expose condenser_api
        const response = await fetch("https://api.hive.blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "condenser_api.get_content",
            params: [author, permlink],
            id: 1,
          }),
        });
        const data = await response.json();
        const comment = data.result;

        if (comment && comment.author) {
          // Calculate payout - condenser_api returns strings like "1.234 HBD"
          const pendingPayout = parseAsset(comment.pending_payout_value);
          const authorPayout = parseAsset(comment.total_payout_value);
          const curatorPayout = parseAsset(comment.curator_payout_value);
          const totalPayout = pendingPayout + authorPayout + curatorPayout;

          setPost({
            title: comment.title || "Untitled",
            body: comment.body?.substring(0, 200) || "",
            votes: comment.net_votes || 0,
            comments: comment.children || 0,
            payout: `$${totalPayout.toFixed(2)}`,
            created: formatTimeAgo(comment.created),
            thumbnail: extractThumbnail(comment.json_metadata || "{}"),
            category: comment.category || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch post:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPost();
  }, [chain, author, permlink]);

  // Build post URL
  const postUrl = post?.category
    ? `${linkTarget}/${post.category}/@${author}/${permlink}`
    : `${linkTarget}/@${author}/${permlink}`;

  const shouldHide = (option: HideOption) => hide.includes(option);

  if (isLoading) {
    return (
      <div className={cn("rounded-lg border border-border p-8 flex justify-center", className)} style={style}>
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className={cn("rounded-lg border border-border p-4 text-center text-muted-foreground", className)} style={style}>
        Post not found
      </div>
    );
  }

  const handleVote = () => {
    setHasVoted(!hasVoted);
    onVote?.(hasVoted ? 0 : 10000);
  };

  const handleReblog = () => {
    onReblog?.();
  };

  // Thumbnail component
  const Thumbnail = ({ className: thumbClass }: { className?: string }) => {
    if (post.thumbnail) {
      return (
        <img
          src={post.thumbnail}
          alt={post.title}
          className={cn("object-cover", thumbClass)}
        />
      );
    }
    return (
      <div className={cn("bg-muted flex items-center justify-center", thumbClass)}>
        <ImageOff className="h-8 w-8 text-muted-foreground" />
      </div>
    );
  };

  if (variant === "compact") {
    return (
      <div className={cn("flex gap-4 p-4 rounded-lg border border-border hover:border-hive-red/50 transition-colors", className)} style={style}>
        {!shouldHide("thumbnail") && (
          <a href={postUrl} target="_blank" rel="noopener noreferrer" className="w-20 h-20 rounded overflow-hidden shrink-0">
            <Thumbnail className="w-full h-full" />
          </a>
        )}
        <div className="flex-1 min-w-0">
          <a href={postUrl} target="_blank" rel="noopener noreferrer" className="hover:text-hive-red transition-colors">
            <h3 className="font-semibold truncate">{post.title}</h3>
          </a>
          {!shouldHide("author") && (
            <p className="text-sm text-muted-foreground">
              @{author} {!shouldHide("time") && `· ${post.created}`}
            </p>
          )}
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            {!shouldHide("votes") && (
              <button
                onClick={handleVote}
                className={cn(
                  "flex items-center gap-1 transition-colors",
                  hasVoted ? "text-hive-red" : "hover:text-hive-red"
                )}
              >
                <ThumbsUp className="h-3.5 w-3.5" /> {post.votes + (hasVoted ? 1 : 0)}
              </button>
            )}
            {!shouldHide("comments") && (
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" /> {post.comments}
              </span>
            )}
            {!shouldHide("payout") && (
              <span className="text-green-500">{post.payout}</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div className={cn("rounded-lg border border-border overflow-hidden hover:border-hive-red/50 transition-colors", className)} style={style}>
        {!shouldHide("thumbnail") && (
          <a href={postUrl} target="_blank" rel="noopener noreferrer" className="block aspect-video overflow-hidden">
            <Thumbnail className="w-full h-full hover:scale-105 transition-transform" />
          </a>
        )}
        <div className="p-4">
          <a href={postUrl} target="_blank" rel="noopener noreferrer" className="hover:text-hive-red transition-colors">
            <h3 className="font-semibold line-clamp-2">{post.title}</h3>
          </a>
          {!shouldHide("author") && (
            <p className="mt-1 text-sm text-muted-foreground">
              @{author} {!shouldHide("time") && `· ${post.created}`}
            </p>
          )}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border text-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              {!shouldHide("votes") && (
                <button
                  onClick={handleVote}
                  className={cn(
                    "flex items-center gap-1 transition-colors",
                    hasVoted ? "text-hive-red" : "hover:text-hive-red"
                  )}
                >
                  <ThumbsUp className="h-4 w-4" /> {post.votes + (hasVoted ? 1 : 0)}
                </button>
              )}
              {!shouldHide("comments") && (
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" /> {post.comments}
                </span>
              )}
            </div>
            {!shouldHide("payout") && (
              <span className="font-medium text-green-500">{post.payout}</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default card variant
  return (
    <div className={cn("rounded-lg border border-border overflow-hidden hover:border-hive-red/50 transition-colors", className)} style={style}>
      {!shouldHide("thumbnail") && post.thumbnail && (
        <a href={postUrl} target="_blank" rel="noopener noreferrer" className="block aspect-video overflow-hidden">
          <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
        </a>
      )}
      <div className="p-4">
        {!shouldHide("author") && (
          <div className="flex items-center gap-3 mb-3">
            <HiveAvatar username={author} size="sm" />
            <div>
              <p className="font-medium">@{author}</p>
              {!shouldHide("time") && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {post.created}
                </p>
              )}
            </div>
          </div>
        )}
        <a href={postUrl} target="_blank" rel="noopener noreferrer" className="hover:text-hive-red transition-colors">
          <h2 className="text-lg font-bold">{post.title}</h2>
        </a>
        <p className="mt-2 text-muted-foreground text-sm line-clamp-2">{post.body.replace(/[#*`>\[\]!]/g, "").substring(0, 150)}...</p>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-4 text-muted-foreground">
            {!shouldHide("votes") && (
              <button
                onClick={handleVote}
                className={cn(
                  "flex items-center gap-1.5 transition-colors",
                  hasVoted ? "text-hive-red" : "hover:text-hive-red"
                )}
              >
                <ThumbsUp className="h-4 w-4" /> {post.votes + (hasVoted ? 1 : 0)}
              </button>
            )}
            {!shouldHide("comments") && (
              <span className="flex items-center gap-1.5">
                <MessageCircle className="h-4 w-4" /> {post.comments}
              </span>
            )}
            {!shouldHide("reblog") && (
              <button
                onClick={handleReblog}
                className="hover:text-foreground transition-colors"
              >
                <Share className="h-4 w-4" />
              </button>
            )}
          </div>
          {!shouldHide("payout") && (
            <span className="text-sm font-medium text-green-500">{post.payout}</span>
          )}
        </div>
      </div>
    </div>
  );
}
