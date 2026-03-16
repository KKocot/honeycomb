<script lang="ts">
  import {
    HiveContentRenderer,
    DEFAULT_PLUGINS,
    HighlightPlugin,
  } from "@hiveio/honeycomb-svelte";
  import hljs from "highlight.js";
  import "highlight.js/styles/github-dark.css";

  const plugins = [...DEFAULT_PLUGINS, new HighlightPlugin(hljs)];

  const SAMPLE_BODY = `# Heading 1
## Heading 2
### Heading 3

*italic* **bold** ***bold-italic*** ~~strikethrough~~

[link](http://example.com) and a #hive hashtag

Lists:
- Milk
- Bread
    - Wholegrain
- Butter

1. Tidy the kitchen
2. Prepare ingredients
3. Cook delicious things

---

Blockquote:
> To be or not to be, that is the question.

Table:

One   | Two   | Three
------|-------|------
four  | five  | six
seven | eight | nine

\`\`\`typescript
interface HivePost {
  author: string;
  permlink: string;
  title: string;
  body: string;
}

function get_post_url(post: HivePost): string {
  return \`/@\${post.author}/\${post.permlink}\`;
}
\`\`\`

Hive User links:
Hello Mr. @sketch.and.jam, how are you?`;
</script>

<section id="renderer" class="scroll-mt-20">
  <div class="mb-6">
    <h2 class="text-3xl font-bold mb-2">HiveContentRenderer</h2>
    <p class="text-muted-foreground">
      Renders Hive markdown content with mentions, hashtags, embeds, and
      sanitization.
    </p>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div class="border border-border rounded-lg p-4 sm:p-6 bg-muted/20">
      <h3 class="text-lg font-semibold mb-4">Raw Markdown</h3>
      <pre
        class="text-xs bg-background rounded-lg p-4 overflow-x-auto border border-border whitespace-pre-wrap break-words">{SAMPLE_BODY}</pre>
    </div>

    <div class="border border-border rounded-lg p-4 sm:p-6 bg-muted/20">
      <h3 class="text-lg font-semibold mb-4">Live Preview</h3>
      <div class="prose dark:prose-invert hive-renderer max-w-none">
        <HiveContentRenderer
          body={SAMPLE_BODY}
          author="guest4test2"
          permlink="test-template"
          {plugins}
        />
      </div>
    </div>
  </div>
</section>
