"use client";

import { useState } from "react";
import { Send, Loader2, AlertCircle, Bold, Italic, Link, Image, Code } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommentFormProps {
  parentAuthor: string;
  parentPermlink: string;
  username: string;
  onSubmit?: (body: string) => void;
  className?: string;
}

export function HiveCommentForm({
  parentAuthor,
  parentPermlink,
  username,
  onSubmit,
  className,
}: CommentFormProps) {
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById("comment-body") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = body.substring(start, end);
    const newText = body.substring(0, start) + prefix + selectedText + suffix + body.substring(end);
    setBody(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const handleSubmit = async () => {
    if (!body.trim()) {
      setError("Please write something");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await new Promise((r) => setTimeout(r, 1000));
      onSubmit?.(body);
      setSuccess(true);
      setBody("");
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post comment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full max-w-lg", className)}>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/30">
          <button
            onClick={() => insertMarkdown("**", "**")}
            className="p-2 rounded hover:bg-muted"
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            onClick={() => insertMarkdown("*", "*")}
            className="p-2 rounded hover:bg-muted"
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            onClick={() => insertMarkdown("[", "](url)")}
            className="p-2 rounded hover:bg-muted"
            title="Link"
          >
            <Link className="h-4 w-4" />
          </button>
          <button
            onClick={() => insertMarkdown("![alt](", ")")}
            className="p-2 rounded hover:bg-muted"
            title="Image"
          >
            <Image className="h-4 w-4" />
          </button>
          <button
            onClick={() => insertMarkdown("`", "`")}
            className="p-2 rounded hover:bg-muted"
            title="Code"
          >
            <Code className="h-4 w-4" />
          </button>
        </div>

        {/* Textarea */}
        <div className="p-3">
          <div className="flex items-start gap-3">
            <img
              src={`https://images.hive.blog/u/${username}/avatar/small`}
              alt={username}
              className="w-8 h-8 rounded-full shrink-0"
            />
            <textarea
              id="comment-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              className="flex-1 bg-transparent resize-none focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-3 border-t border-border bg-muted/30">
          <div className="text-xs text-muted-foreground">
            Replying to @{parentAuthor}
          </div>

          <div className="flex items-center gap-2">
            {error && (
              <span className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {error}
              </span>
            )}
            {success && (
              <span className="text-xs text-green-500">Comment posted!</span>
            )}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !body.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-hive-red text-white text-sm font-medium hover:bg-hive-red/90 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Reply
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
