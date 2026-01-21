"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Loader2, Calendar, MessageSquare, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostPreviewCardProps {
  author: string;
  permlink: string;
  className?: string;
}

interface PostData {
  title: string;
  body: string;
  image: string | null;
  created: string;
  votes: number;
  comments: number;
  payout: string;
  tags: string[];
}

export function PostPreviewCard({ author, permlink, className }: PostPreviewCardProps) {
  const [postData, setPostData] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      try {
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
        const content = data.result;

        if (content && content.author) {
          // Extract image from json_metadata
          let image: string | null = null;
          try {
            const metadata = JSON.parse(content.json_metadata || "{}");
            if (metadata.image && metadata.image.length > 0) {
              image = metadata.image[0];
            }
          } catch {
            // Try to find image in body
            const imgMatch = content.body?.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/);
            if (imgMatch) {
              image = imgMatch[1];
            }
          }

          // Get payout
          const pendingPayout = parseFloat(content.pending_payout_value?.split(" ")[0] || "0");
          const authorPayout = parseFloat(content.total_payout_value?.split(" ")[0] || "0");
          const curatorPayout = parseFloat(content.curator_payout_value?.split(" ")[0] || "0");
          const totalPayout = pendingPayout + authorPayout + curatorPayout;

          // Extract description (first 200 chars of body without markdown)
          const cleanBody = content.body
            ?.replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
            .replace(/\[.*?\]\(.*?\)/g, "") // Remove links
            .replace(/[#*_~`>]/g, "") // Remove markdown chars
            .replace(/\n+/g, " ") // Replace newlines
            .trim()
            .substring(0, 200);

          // Get tags
          let tags: string[] = [];
          try {
            const metadata = JSON.parse(content.json_metadata || "{}");
            tags = metadata.tags || [];
          } catch {
            // ignore
          }

          setPostData({
            title: content.title,
            body: cleanBody + (cleanBody?.length === 200 ? "..." : ""),
            image,
            created: content.created,
            votes: content.net_votes || 0,
            comments: content.children || 0,
            payout: totalPayout.toFixed(2),
            tags: tags.slice(0, 5),
          });
        }
      } catch (error) {
        console.error("Failed to fetch post:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [author, permlink]);

  if (loading) {
    return (
      <div className={cn("rounded-xl border border-border bg-card p-6", className)}>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Loading post...</span>
        </div>
      </div>
    );
  }

  if (!postData) {
    return (
      <div className={cn("rounded-xl border border-border bg-card p-6", className)}>
        <p className="text-sm text-muted-foreground text-center">Failed to load post</p>
      </div>
    );
  }

  const postUrl = `https://blog.openhive.network/hive-139531/@${author}/${permlink}`;
  const formattedDate = new Date(postData.created + "Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className={cn("rounded-xl border border-border bg-card overflow-hidden flex", className)}>
      {/* Image - left side */}
      {postData.image && (
        <div className="relative w-48 md:w-64 flex-shrink-0 bg-muted">
          <img
            src={postData.image}
            alt={postData.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content - right side */}
      <div className="p-4 space-y-3 flex-1 min-w-0">
        {/* Author */}
        <div className="flex items-center gap-2">
          <img
            src={`https://images.hive.blog/u/${author}/avatar/small`}
            alt={author}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="text-sm font-medium">@{author}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formattedDate}
            </p>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg leading-tight">{postData.title}</h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">{postData.body}</p>

        {/* Tags */}
        {postData.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {postData.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              {postData.votes}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              {postData.comments}
            </span>
            <span className="font-medium text-green-500">${postData.payout}</span>
          </div>

          <a
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-hive-red hover:underline flex items-center gap-1"
          >
            View on Hive
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
