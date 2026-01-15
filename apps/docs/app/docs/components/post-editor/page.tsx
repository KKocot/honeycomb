import Link from "next/link";
import { ArrowRight, Info, Bold, Italic, Link2, Image, List, Quote, Code } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  component: `"use client";

import { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Link2,
  Image,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Loader2,
} from "lucide-react";

interface PostEditorProps {
  initialTitle?: string;
  initialBody?: string;
  initialTags?: string[];
  onSubmit?: (post: {
    title: string;
    body: string;
    tags: string[];
    beneficiaries?: { account: string; weight: number }[];
  }) => Promise<void>;
  onSaveDraft?: (post: { title: string; body: string; tags: string[] }) => void;
  submitLabel?: string;
  showBeneficiaries?: boolean;
  className?: string;
}

export function PostEditor({
  initialTitle = "",
  initialBody = "",
  initialTags = [],
  onSubmit,
  onSaveDraft,
  submitLabel = "Publish",
  showBeneficiaries = false,
  className = "",
}: PostEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [tags, setTags] = useState(initialTags.join(" "));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function insertMarkdown(before: string, after: string = "") {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = body.substring(start, end);

    const newText =
      body.substring(0, start) +
      before +
      selected +
      after +
      body.substring(end);

    setBody(newText);

    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursor = start + before.length + selected.length;
      textarea.setSelectionRange(newCursor, newCursor);
    }, 0);
  }

  async function handleSubmit() {
    if (!title.trim() || !body.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        title: title.trim(),
        body: body.trim(),
        tags: tags.split(/[\\s,]+/).filter(Boolean),
      });
    } catch (error) {
      console.error("Failed to publish:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const toolbarButtons = [
    { icon: Bold, action: () => insertMarkdown("**", "**"), title: "Bold" },
    { icon: Italic, action: () => insertMarkdown("*", "*"), title: "Italic" },
    { icon: Link2, action: () => insertMarkdown("[", "](url)"), title: "Link" },
    { icon: Image, action: () => insertMarkdown("![alt](", ")"), title: "Image" },
    { icon: Heading1, action: () => insertMarkdown("# "), title: "Heading 1" },
    { icon: Heading2, action: () => insertMarkdown("## "), title: "Heading 2" },
    { icon: List, action: () => insertMarkdown("- "), title: "Bullet List" },
    { icon: ListOrdered, action: () => insertMarkdown("1. "), title: "Numbered List" },
    { icon: Quote, action: () => insertMarkdown("> "), title: "Quote" },
    { icon: Code, action: () => insertMarkdown("\`", "\`"), title: "Code" },
  ];

  return (
    <div className={\`rounded-lg border border-border bg-card \${className}\`}>
      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title..."
        className="w-full px-4 py-3 text-xl font-bold bg-transparent border-b border-border focus:outline-none"
      />

      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-2 border-b border-border overflow-x-auto">
        {toolbarButtons.map(({ icon: Icon, action, title }) => (
          <button
            key={title}
            onClick={action}
            title={title}
            className="p-2 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}

        <div className="flex-1" />

        <button
          onClick={() => setIsPreview(!isPreview)}
          className={\`px-3 py-1 text-sm rounded \${
            isPreview ? "bg-hive-red text-white" : "hover:bg-muted"
          }\`}
        >
          {isPreview ? "Edit" : "Preview"}
        </button>
      </div>

      {/* Editor/Preview */}
      <div className="min-h-[300px]">
        {isPreview ? (
          <div
            className="p-4 prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your post content here... (Markdown supported)"
            className="w-full h-[300px] p-4 bg-transparent resize-none focus:outline-none font-mono text-sm"
          />
        )}
      </div>

      {/* Tags */}
      <div className="px-4 py-3 border-t border-border">
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (space or comma separated, first tag is category)"
          className="w-full bg-transparent text-sm focus:outline-none"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
        <button
          onClick={() => onSaveDraft?.({ title, body, tags: tags.split(/[\\s,]+/).filter(Boolean) })}
          className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
        >
          Save Draft
        </button>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !title.trim() || !body.trim()}
          className="px-4 py-2 rounded-lg bg-hive-red text-white text-sm font-medium hover:bg-hive-red/90 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
              Publishing...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </div>
  );
}`,
  basicUsage: `"use client";

import { PostEditor } from "@/components/hive/post-editor";
import { useHiveAuth } from "@/hooks/use-hive-auth";
import { useCreatePost } from "@/hooks/use-create-post";

export function CreatePost() {
  const { user } = useHiveAuth();
  const { createPost } = useCreatePost();

  async function handleSubmit(post: {
    title: string;
    body: string;
    tags: string[];
  }) {
    await createPost({
      author: user!.username,
      ...post,
    });
  }

  if (!user) {
    return <p>Please login to create a post.</p>;
  }

  return (
    <PostEditor
      onSubmit={handleSubmit}
      submitLabel="Publish Post"
    />
  );
}`,
  editPost: `"use client";

import { PostEditor } from "@/components/hive/post-editor";
import { useUpdatePost } from "@/hooks/use-update-post";

interface EditPostProps {
  permlink: string;
  title: string;
  body: string;
  tags: string[];
}

export function EditPost({ permlink, title, body, tags }: EditPostProps) {
  const { updatePost } = useUpdatePost();

  async function handleSubmit(post: {
    title: string;
    body: string;
    tags: string[];
  }) {
    await updatePost({
      permlink,
      ...post,
    });
  }

  return (
    <PostEditor
      initialTitle={title}
      initialBody={body}
      initialTags={tags}
      onSubmit={handleSubmit}
      submitLabel="Update Post"
    />
  );
}`,
  hook: `"use client";

import { useCallback } from "react";
import { useHiveChain } from "@/hooks/use-hive-chain";
import { useHiveAuth } from "@/hooks/use-hive-auth";

interface CreatePostParams {
  author: string;
  title: string;
  body: string;
  tags: string[];
  beneficiaries?: { account: string; weight: number }[];
}

export function useCreatePost() {
  const { chain } = useHiveChain();
  const { signTransaction } = useHiveAuth();

  const createPost = useCallback(async ({
    author,
    title,
    body,
    tags,
    beneficiaries = [],
  }: CreatePostParams) => {
    if (!chain) return;

    // Generate permlink from title
    const permlink = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 255);

    const tx = chain.createTransaction();

    // Main comment operation
    tx.pushOperation({
      comment: {
        parent_author: "",
        parent_permlink: tags[0] || "hive",
        author,
        permlink,
        title,
        body,
        json_metadata: JSON.stringify({
          tags,
          app: "hive-ui/1.0",
          format: "markdown",
        }),
      },
    });

    // Add beneficiaries if any
    if (beneficiaries.length > 0) {
      tx.pushOperation({
        comment_options: {
          author,
          permlink,
          max_accepted_payout: "1000000.000 HBD",
          percent_hbd: 10000,
          allow_votes: true,
          allow_curation_rewards: true,
          extensions: [
            [0, { beneficiaries: beneficiaries.sort((a, b) => a.account.localeCompare(b.account)) }],
          ],
        },
      });
    }

    await signTransaction(tx);

    return { author, permlink };
  }, [chain, signTransaction]);

  return { createPost };
}`,
};

export default async function PostEditorPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Post Editor</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Full-featured markdown editor for creating and editing Hive posts.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Posting on Hive</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Posts use the comment operation with empty parent_author. The first tag
              becomes the category (parent_permlink). Posts require the posting key.
            </p>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="rounded-lg border border-border">
          {/* Title */}
          <div className="px-4 py-3 border-b border-border">
            <span className="text-xl font-bold text-muted-foreground">Post title...</span>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-1 px-2 py-2 border-b border-border">
            <button className="p-2 rounded hover:bg-muted text-muted-foreground">
              <Bold className="h-4 w-4" />
            </button>
            <button className="p-2 rounded hover:bg-muted text-muted-foreground">
              <Italic className="h-4 w-4" />
            </button>
            <button className="p-2 rounded hover:bg-muted text-muted-foreground">
              <Link2 className="h-4 w-4" />
            </button>
            <button className="p-2 rounded hover:bg-muted text-muted-foreground">
              <Image className="h-4 w-4" />
            </button>
            <button className="p-2 rounded hover:bg-muted text-muted-foreground">
              <List className="h-4 w-4" />
            </button>
            <button className="p-2 rounded hover:bg-muted text-muted-foreground">
              <Quote className="h-4 w-4" />
            </button>
            <button className="p-2 rounded hover:bg-muted text-muted-foreground">
              <Code className="h-4 w-4" />
            </button>
            <div className="flex-1" />
            <button className="px-3 py-1 text-sm rounded hover:bg-muted">
              Preview
            </button>
          </div>

          {/* Editor */}
          <div className="p-4 min-h-[150px] text-muted-foreground font-mono text-sm">
            Write your post content here... (Markdown supported)
          </div>

          {/* Tags */}
          <div className="px-4 py-3 border-t border-border text-sm text-muted-foreground">
            Tags (space or comma separated)
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <button className="text-sm text-muted-foreground">Save Draft</button>
            <button className="px-4 py-2 rounded-lg bg-hive-red text-white text-sm font-medium">
              Publish
            </button>
          </div>
        </div>
      </section>

      {/* Component Code */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Component</h2>
        <CodeBlock
          filename="components/hive/post-editor.tsx"
          code={CODE.component}
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
                <td className="py-3 px-4"><code>initialTitle</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>&quot;&quot;</code></td>
                <td className="py-3 px-4 text-muted-foreground">Initial post title</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>initialBody</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>&quot;&quot;</code></td>
                <td className="py-3 px-4 text-muted-foreground">Initial post body (markdown)</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>initialTags</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string[]</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>[]</code></td>
                <td className="py-3 px-4 text-muted-foreground">Initial tags</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onSubmit</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>(post) =&gt; Promise&lt;void&gt;</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
                <td className="py-3 px-4 text-muted-foreground">Submit handler</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>submitLabel</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>&quot;Publish&quot;</code></td>
                <td className="py-3 px-4 text-muted-foreground">Submit button label</td>
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

      {/* Edit Post */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Edit Existing Post</h2>
        <CodeBlock code={CODE.editPost} language="typescript" />
      </section>

      {/* Hook */}
      <section>
        <h2 className="text-xl font-semibold mb-4">useCreatePost Hook</h2>
        <CodeBlock
          filename="hooks/use-create-post.ts"
          code={CODE.hook}
          language="typescript"
        />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Next</h2>
        <div className="flex gap-4">
          <Link
            href="/docs/components/post-summary"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            Post Summary
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
