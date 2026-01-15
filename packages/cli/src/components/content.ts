import type { ComponentDefinition } from "../registry.js";

export const commentForm: ComponentDefinition = {
  name: "comment-form",
  description: "Comment form with markdown toolbar",
  category: "content",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [
    {
      path: "components/hive/comment-form.tsx",
      content: `"use client";

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

export function CommentForm({
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
          <button onClick={() => insertMarkdown("**", "**")} className="p-2 rounded hover:bg-muted" title="Bold">
            <Bold className="h-4 w-4" />
          </button>
          <button onClick={() => insertMarkdown("*", "*")} className="p-2 rounded hover:bg-muted" title="Italic">
            <Italic className="h-4 w-4" />
          </button>
          <button onClick={() => insertMarkdown("[", "](url)")} className="p-2 rounded hover:bg-muted" title="Link">
            <Link className="h-4 w-4" />
          </button>
          <button onClick={() => insertMarkdown("![alt](", ")")} className="p-2 rounded hover:bg-muted" title="Image">
            <Image className="h-4 w-4" />
          </button>
          <button onClick={() => insertMarkdown("\`", "\`")} className="p-2 rounded hover:bg-muted" title="Code">
            <Code className="h-4 w-4" />
          </button>
        </div>

        {/* Textarea */}
        <div className="p-3">
          <div className="flex items-start gap-3">
            <img src={\`https://images.hive.blog/u/\${username}/avatar/small\`} alt={username}
              className="w-8 h-8 rounded-full shrink-0" />
            <textarea id="comment-body" value={body} onChange={(e) => setBody(e.target.value)}
              placeholder="Write a comment..." rows={3}
              className="flex-1 bg-transparent resize-none focus:outline-none text-sm" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-3 border-t border-border bg-muted/30">
          <div className="text-xs text-muted-foreground">Replying to @{parentAuthor}</div>
          <div className="flex items-center gap-2">
            {error && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{error}</span>}
            {success && <span className="text-xs text-green-500">Comment posted!</span>}
            <button onClick={handleSubmit} disabled={isLoading || !body.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-hive-red text-white text-sm font-medium hover:bg-hive-red/90 disabled:opacity-50">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" />Reply</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
`,
    },
  ],
};

export const postEditor: ComponentDefinition = {
  name: "post-editor",
  description: "Full post editor with preview and tags",
  category: "content",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [
    {
      path: "components/hive/post-editor.tsx",
      content: `"use client";

import { useState } from "react";
import { FileText, Send, Loader2, AlertCircle, Bold, Italic, Link, Image, Code, List, Heading, Eye, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostEditorProps {
  username: string;
  onPublish?: (data: { title: string; body: string; tags: string[] }) => void;
  className?: string;
}

export function PostEditor({ username, onPublish, className }: PostEditorProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById("post-body") as HTMLTextAreaElement;
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

  const handlePublish = async () => {
    if (!title.trim()) { setError("Please add a title"); return; }
    if (!body.trim()) { setError("Please write some content"); return; }

    setIsLoading(true);
    setError(null);

    try {
      await new Promise((r) => setTimeout(r, 1500));
      const tagList = tags.split(/[\\s,]+/).filter(Boolean).map((t) => t.toLowerCase().replace(/^#/, ""));
      onPublish?.({ title, body, tags: tagList });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full max-w-2xl", className)}>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-500" />
            <h3 className="font-semibold">New Post</h3>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsPreview(false)}
              className={cn("flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium", !isPreview ? "bg-muted" : "hover:bg-muted/50")}>
              <Edit3 className="h-4 w-4" />Edit
            </button>
            <button onClick={() => setIsPreview(true)}
              className={cn("flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium", isPreview ? "bg-muted" : "hover:bg-muted/50")}>
              <Eye className="h-4 w-4" />Preview
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="p-4 border-b border-border">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title..." className="w-full text-xl font-bold bg-transparent focus:outline-none" />
        </div>

        {isPreview ? (
          <div className="p-4 min-h-[300px]">
            <div className="prose prose-invert max-w-none">
              <h1>{title || "Untitled"}</h1>
              <div className="whitespace-pre-wrap">{body || "No content yet..."}</div>
            </div>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/30 overflow-x-auto">
              <button onClick={() => insertMarkdown("# ")} className="p-2 rounded hover:bg-muted" title="Heading"><Heading className="h-4 w-4" /></button>
              <button onClick={() => insertMarkdown("**", "**")} className="p-2 rounded hover:bg-muted" title="Bold"><Bold className="h-4 w-4" /></button>
              <button onClick={() => insertMarkdown("*", "*")} className="p-2 rounded hover:bg-muted" title="Italic"><Italic className="h-4 w-4" /></button>
              <div className="w-px h-5 bg-border mx-1" />
              <button onClick={() => insertMarkdown("[", "](url)")} className="p-2 rounded hover:bg-muted" title="Link"><Link className="h-4 w-4" /></button>
              <button onClick={() => insertMarkdown("![alt](", ")")} className="p-2 rounded hover:bg-muted" title="Image"><Image className="h-4 w-4" /></button>
              <div className="w-px h-5 bg-border mx-1" />
              <button onClick={() => insertMarkdown("- ")} className="p-2 rounded hover:bg-muted" title="List"><List className="h-4 w-4" /></button>
              <button onClick={() => insertMarkdown("\`\`\`\\n", "\\n\`\`\`")} className="p-2 rounded hover:bg-muted" title="Code Block"><Code className="h-4 w-4" /></button>
            </div>

            {/* Editor */}
            <div className="p-4">
              <textarea id="post-body" value={body} onChange={(e) => setBody(e.target.value)}
                placeholder="Write your post content here... (Markdown supported)" rows={12}
                className="w-full bg-transparent resize-none focus:outline-none text-sm font-mono" />
            </div>
          </>
        )}

        {/* Tags */}
        <div className="p-4 border-t border-border bg-muted/30">
          <label className="block text-sm font-medium mb-2">Tags</label>
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)}
            placeholder="hive blockchain tutorial (space or comma separated)"
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
          <p className="mt-1 text-xs text-muted-foreground">First tag is the main category. Add up to 5 tags.</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <img src={\`https://images.hive.blog/u/\${username}/avatar/small\`} alt={username} className="w-6 h-6 rounded-full" />
            Publishing as @{username}
          </div>
          <div className="flex items-center gap-2">
            {error && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{error}</span>}
            <button onClick={handlePublish} disabled={isLoading || !title.trim() || !body.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500 text-white text-sm font-medium hover:bg-purple-600 disabled:opacity-50">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" />Publish</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
`,
    },
  ],
};
