import Link from "next/link";
import { ArrowRight, Info, AlertTriangle, MessageSquare } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  component: `"use client";

import { useState, useRef } from "react";
import { Loader2, Send, Image, Link as LinkIcon, Bold, Italic } from "lucide-react";
import { HiveAvatar } from "@/components/hive/avatar";

interface CommentFormProps {
  parentAuthor: string;
  parentPermlink: string;
  username?: string;
  onSubmit: (body: string, permlink: string) => Promise<void>;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  showToolbar?: boolean;
  className?: string;
}

export function CommentForm({
  parentAuthor,
  parentPermlink,
  username,
  onSubmit,
  placeholder = "Write a comment...",
  minLength = 1,
  maxLength = 65535,
  showToolbar = true,
  className = "",
}: CommentFormProps) {
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Generate unique permlink for comment
  function generatePermlink(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return \`re-\${parentAuthor}-\${parentPermlink.slice(0, 20)}-\${timestamp}-\${random}\`;
  }

  // Insert markdown at cursor position
  function insertMarkdown(before: string, after: string = "") {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = body.substring(start, end);

    const newText =
      body.substring(0, start) +
      before +
      selectedText +
      after +
      body.substring(end);

    setBody(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!username) {
      setError("Please login to comment");
      return;
    }

    const trimmedBody = body.trim();

    if (trimmedBody.length < minLength) {
      setError(\`Comment must be at least \${minLength} character(s)\`);
      return;
    }

    if (trimmedBody.length > maxLength) {
      setError(\`Comment must be less than \${maxLength} characters\`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const permlink = generatePermlink();
      await onSubmit(trimmedBody, permlink);
      setBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  }

  const charCount = body.length;
  const isOverLimit = charCount > maxLength;

  return (
    <form onSubmit={handleSubmit} className={\`\${className}\`}>
      {error && (
        <div className="mb-3 text-sm text-red-500 bg-red-500/10 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {/* Header with avatar */}
        {username && (
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/30">
            <HiveAvatar username={username} size="sm" />
            <span className="text-sm font-medium">@{username}</span>
          </div>
        )}

        {/* Toolbar */}
        {showToolbar && (
          <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border bg-muted/20">
            <button
              type="button"
              onClick={() => insertMarkdown("**", "**")}
              className="p-1.5 rounded hover:bg-muted"
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("*", "*")}
              className="p-1.5 rounded hover:bg-muted"
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("[", "](url)")}
              className="p-1.5 rounded hover:bg-muted"
              title="Link"
            >
              <LinkIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("![alt](", ")")}
              className="p-1.5 rounded hover:bg-muted"
              title="Image"
            >
              <Image className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={placeholder}
          disabled={isSubmitting || !username}
          rows={4}
          className="w-full px-3 py-2 bg-transparent resize-none focus:outline-none disabled:opacity-50 placeholder:text-muted-foreground"
        />

        {/* Footer */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-border bg-muted/20">
          <span
            className={\`text-xs \${
              isOverLimit ? "text-red-500" : "text-muted-foreground"
            }\`}
          >
            {charCount.toLocaleString()} / {maxLength.toLocaleString()}
          </span>

          <button
            type="submit"
            disabled={isSubmitting || !body.trim() || isOverLimit || !username}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-hive-red text-white text-sm font-medium hover:bg-hive-red/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Comment
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}`,
  broadcastHook: `"use client";

import { useHiveChain } from "@/components/hive/hive-provider";
import { useHiveAuth } from "@/hooks/use-hive-auth";
import { useCallback } from "react";

interface CommentOperation {
  parent_author: string;
  parent_permlink: string;
  author: string;
  permlink: string;
  title: string;
  body: string;
  json_metadata: string;
}

export function useComment() {
  const { chain, isReady } = useHiveChain();
  const { user, isAuthenticated } = useHiveAuth();

  const postComment = useCallback(
    async (
      parentAuthor: string,
      parentPermlink: string,
      body: string,
      permlink: string
    ) => {
      if (!isReady || !chain) {
        throw new Error("Chain not ready");
      }

      if (!isAuthenticated || !user) {
        throw new Error("User not authenticated");
      }

      if (typeof window === "undefined" || !window.hive_keychain) {
        throw new Error("Hive Keychain is required");
      }

      const operation: CommentOperation = {
        parent_author: parentAuthor,
        parent_permlink: parentPermlink,
        author: user.username,
        permlink,
        title: "",
        body,
        json_metadata: JSON.stringify({
          app: "hive-ui/1.0",
          format: "markdown",
        }),
      };

      return new Promise<void>((resolve, reject) => {
        window.hive_keychain.requestBroadcast(
          user.username,
          [["comment", operation]],
          "Posting",
          (response: any) => {
            if (response.success) {
              resolve();
            } else {
              reject(new Error(response.message || "Failed to post comment"));
            }
          }
        );
      });
    },
    [chain, isReady, user, isAuthenticated]
  );

  return { postComment };
}`,
  basicUsage: `"use client";

import { CommentForm } from "@/components/hive/comment-form";
import { useComment } from "@/hooks/use-comment";
import { useHiveAuth } from "@/hooks/use-hive-auth";

interface CommentSectionProps {
  author: string;
  permlink: string;
}

export function CommentSection({ author, permlink }: CommentSectionProps) {
  const { postComment } = useComment();
  const { user } = useHiveAuth();

  async function handleSubmit(body: string, commentPermlink: string) {
    await postComment(author, permlink, body, commentPermlink);
    // Optionally refresh comments list
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Comments</h3>
      <CommentForm
        parentAuthor={author}
        parentPermlink={permlink}
        username={user?.username}
        onSubmit={handleSubmit}
      />
    </div>
  );
}`,
  replyToComment: `"use client";

import { CommentForm } from "@/components/hive/comment-form";
import { HiveAvatar } from "@/components/hive/avatar";
import { useComment } from "@/hooks/use-comment";
import { useHiveAuth } from "@/hooks/use-hive-auth";
import { useState } from "react";
import { MessageSquare } from "lucide-react";

interface CommentProps {
  author: string;
  permlink: string;
  body: string;
  created: string;
}

export function Comment({ author, permlink, body, created }: CommentProps) {
  const [showReply, setShowReply] = useState(false);
  const { postComment } = useComment();
  const { user } = useHiveAuth();

  async function handleReply(replyBody: string, replyPermlink: string) {
    await postComment(author, permlink, replyBody, replyPermlink);
    setShowReply(false);
  }

  return (
    <div className="border-l-2 border-border pl-4">
      <div className="flex items-start gap-3">
        <HiveAvatar username={author} size="sm" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">@{author}</span>
            <span className="text-xs text-muted-foreground">{created}</span>
          </div>
          <p className="text-sm mb-2">{body}</p>

          <button
            onClick={() => setShowReply(!showReply)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <MessageSquare className="h-4 w-4" />
            Reply
          </button>

          {showReply && (
            <div className="mt-3">
              <CommentForm
                parentAuthor={author}
                parentPermlink={permlink}
                username={user?.username}
                onSubmit={handleReply}
                placeholder="Write a reply..."
                showToolbar={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}`,
  minimalForm: `"use client";

import { CommentForm } from "@/components/hive/comment-form";
import { useComment } from "@/hooks/use-comment";
import { useHiveAuth } from "@/hooks/use-hive-auth";

export function MinimalCommentForm({ author, permlink }: { author: string; permlink: string }) {
  const { postComment } = useComment();
  const { user } = useHiveAuth();

  return (
    <CommentForm
      parentAuthor={author}
      parentPermlink={permlink}
      username={user?.username}
      onSubmit={(body, perm) => postComment(author, permlink, body, perm)}
      showToolbar={false}
      placeholder="Add a comment..."
      minLength={3}
    />
  );
}`,
  withValidation: `"use client";

import { CommentForm } from "@/components/hive/comment-form";
import { useComment } from "@/hooks/use-comment";
import { useHiveAuth } from "@/hooks/use-hive-auth";

export function ValidatedCommentForm({ author, permlink }: { author: string; permlink: string }) {
  const { postComment } = useComment();
  const { user } = useHiveAuth();

  return (
    <CommentForm
      parentAuthor={author}
      parentPermlink={permlink}
      username={user?.username}
      onSubmit={(body, perm) => postComment(author, permlink, body, perm)}
      minLength={10}
      maxLength={16384}
      placeholder="Share your thoughts (10+ characters)..."
    />
  );
}`,
  fullExample: `"use client";

import { CommentForm } from "@/components/hive/comment-form";
import { HiveAvatar } from "@/components/hive/avatar";
import { VoteButton } from "@/components/hive/vote-button";
import { useComment } from "@/hooks/use-comment";
import { useVote } from "@/hooks/use-vote";
import { useHiveAuth } from "@/hooks/use-hive-auth";
import { useState } from "react";

interface CommentThreadProps {
  postAuthor: string;
  postPermlink: string;
  comments: Array<{
    author: string;
    permlink: string;
    body: string;
    created: string;
    votes: number;
  }>;
}

export function CommentThread({ postAuthor, postPermlink, comments }: CommentThreadProps) {
  const { postComment } = useComment();
  const { vote } = useVote();
  const { user } = useHiveAuth();
  const [commentList, setCommentList] = useState(comments);

  async function handleNewComment(body: string, permlink: string) {
    await postComment(postAuthor, postPermlink, body, permlink);

    // Optimistically add comment to list
    setCommentList((prev) => [
      ...prev,
      {
        author: user!.username,
        permlink,
        body,
        created: "just now",
        votes: 0,
      },
    ]);
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">{commentList.length} Comments</h3>

      {/* New comment form */}
      <CommentForm
        parentAuthor={postAuthor}
        parentPermlink={postPermlink}
        username={user?.username}
        onSubmit={handleNewComment}
      />

      {/* Comment list */}
      <div className="space-y-4">
        {commentList.map((comment) => (
          <div key={comment.permlink} className="flex gap-3">
            <HiveAvatar username={comment.author} size="sm" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">@{comment.author}</span>
                <span className="text-xs text-muted-foreground">{comment.created}</span>
              </div>
              <p className="text-sm mb-2">{comment.body}</p>
              <VoteButton
                author={comment.author}
                permlink={comment.permlink}
                voter={user?.username}
                initialVoteCount={comment.votes}
                onVote={(weight) => vote({ author: comment.author, permlink: comment.permlink, weight })}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`,
};

export default async function CommentFormPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Comment Form</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Post comments and replies to Hive content with markdown support.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Comments on Hive</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Comments on Hive are stored on the blockchain and support Markdown formatting.
              Each comment has a unique permlink and references its parent post or comment.
              Comments can receive upvotes and earn rewards just like posts.
            </p>
          </div>
        </div>
      </section>

      {/* Warning */}
      <section className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-500">Resource Credits Required</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Posting comments requires Resource Credits (RC). New accounts may need to
              wait for RC regeneration or receive a delegation before posting.
            </p>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="max-w-lg">
          <div className="rounded-lg border border-border bg-background overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/30">
              <div className="h-8 w-8 rounded-full bg-hive-red/20 flex items-center justify-center text-xs font-medium">
                BT
              </div>
              <span className="text-sm font-medium">@blocktrades</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border bg-muted/20">
              <button className="p-1.5 rounded hover:bg-muted">
                <MessageSquare className="h-4 w-4" />
              </button>
            </div>
            <textarea
              placeholder="Write a comment..."
              rows={3}
              className="w-full px-3 py-2 bg-transparent resize-none focus:outline-none placeholder:text-muted-foreground"
              disabled
            />
            <div className="flex items-center justify-between px-3 py-2 border-t border-border bg-muted/20">
              <span className="text-xs text-muted-foreground">0 / 65,535</span>
              <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-hive-red text-white text-sm font-medium opacity-50">
                Comment
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Component Code */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Component</h2>
        <p className="text-muted-foreground mb-4">
          Copy this component into your project:
        </p>
        <CodeBlock
          filename="components/hive/comment-form.tsx"
          code={CODE.component}
          language="typescript"
        />
      </section>

      {/* useComment Hook */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Comment Hook</h2>
        <p className="text-muted-foreground mb-4">
          This hook handles broadcasting comments to the Hive blockchain:
        </p>
        <CodeBlock
          filename="hooks/use-comment.ts"
          code={CODE.broadcastHook}
          language="typescript"
        />
      </section>

      {/* Props */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Props</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Prop</th>
                <th className="py-3 px-4 text-left font-semibold">Type</th>
                <th className="py-3 px-4 text-left font-semibold">Default</th>
                <th className="py-3 px-4 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4"><code>parentAuthor</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">required</td>
                <td className="py-3 px-4 text-muted-foreground">Author of parent post/comment</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>parentPermlink</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">required</td>
                <td className="py-3 px-4 text-muted-foreground">Permlink of parent post/comment</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>username</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
                <td className="py-3 px-4 text-muted-foreground">Current user (required to post)</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onSubmit</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>(body, permlink) =&gt; Promise</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">required</td>
                <td className="py-3 px-4 text-muted-foreground">Submit handler</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>placeholder</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">&quot;Write a comment...&quot;</td>
                <td className="py-3 px-4 text-muted-foreground">Textarea placeholder</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>minLength</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>number</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>1</code></td>
                <td className="py-3 px-4 text-muted-foreground">Minimum comment length</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>maxLength</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>number</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>65535</code></td>
                <td className="py-3 px-4 text-muted-foreground">Maximum comment length</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>showToolbar</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>true</code></td>
                <td className="py-3 px-4 text-muted-foreground">Show markdown toolbar</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Basic Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Basic Usage</h2>
        <CodeBlock code={CODE.basicUsage} language="typescript" />
      </section>

      {/* Reply to Comment */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Reply to Comment</h2>
        <p className="text-muted-foreground mb-4">
          Create threaded replies by using the comment as the parent:
        </p>
        <CodeBlock code={CODE.replyToComment} language="typescript" />
      </section>

      {/* Minimal Form */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Minimal Form</h2>
        <p className="text-muted-foreground mb-4">
          A simplified version without the toolbar:
        </p>
        <CodeBlock code={CODE.minimalForm} language="typescript" />
      </section>

      {/* With Validation */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Custom Validation</h2>
        <p className="text-muted-foreground mb-4">
          Set minimum and maximum character limits:
        </p>
        <CodeBlock code={CODE.withValidation} language="typescript" />
      </section>

      {/* Full Example */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Complete Comment Thread</h2>
        <p className="text-muted-foreground mb-4">
          Full example with comment list, voting, and new comment form:
        </p>
        <CodeBlock code={CODE.fullExample} language="typescript" />
      </section>

      {/* Best Practices */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Best Practices</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-hive-red mt-1">•</span>
            <span>
              <strong>Check authentication:</strong> Disable the form or show a login
              prompt when the user is not authenticated.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-hive-red mt-1">•</span>
            <span>
              <strong>Validate before submit:</strong> Check minimum length and RC
              availability before attempting to broadcast.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-hive-red mt-1">•</span>
            <span>
              <strong>Optimistic updates:</strong> Add the comment to the UI immediately
              while the transaction confirms.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-hive-red mt-1">•</span>
            <span>
              <strong>Error handling:</strong> Display clear error messages for RC issues,
              network errors, or Keychain rejections.
            </span>
          </li>
        </ul>
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Related</h2>
        <div className="flex gap-4">
          <Link
            href="/docs/hooks/use-vote"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            useVote Hook
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
