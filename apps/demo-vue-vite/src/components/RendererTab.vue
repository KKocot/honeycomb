<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <section class="border border-border rounded-lg p-4 sm:p-6 bg-muted/20">
      <h2 class="text-xl sm:text-2xl font-semibold mb-2">Raw Markdown</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Source markdown used for the preview on the right.
      </p>
      <pre
        class="text-xs bg-background rounded-lg p-4 overflow-x-auto border border-border whitespace-pre-wrap break-words"
      >{{ SAMPLE_BODY }}</pre>
    </section>

    <section class="border border-border rounded-lg p-4 sm:p-6 bg-muted/20">
      <h2 class="text-xl sm:text-2xl font-semibold mb-2">Live Preview</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Renders Hive markdown with mentions, hashtags, embeds, and
        sanitization.
      </p>
      <div class="prose dark:prose-invert hive-renderer max-w-none">
        <HiveContentRenderer
          :body="SAMPLE_BODY"
          author="guest4test2"
          permlink="test-template"
          :plugins="plugins"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  HiveContentRenderer,
  DEFAULT_PLUGINS,
  HighlightPlugin,
} from "@barddev/honeycomb-vue";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

const plugins = [...DEFAULT_PLUGINS, new HighlightPlugin(hljs)];

const SAMPLE_BODY = `# Heading 1
## Heading 2
### Heading 3
#### Heading 4

*italic* **bold** Love**is**bold ***bold-italic*** ~~strikethrough~~

[link](http://example.com) and a #hive hashtag

Lists:
- Milk
- Bread
    - Wholegrain
- Butter

1. Tidy the kitchen
2. Prepare ingredients
3. Cook delicious things

![hive logo](https://cryptologos.cc/logos/hive-blockchain-hive-logo.png?v=035)

---

Blockquote:
> To be or not to be, that is the question.

Nested blockquote:
> Dorothy followed her through many of the beautiful rooms in her castle.
>
>> The Witch bade her clean the pots and kettles and sweep the floor and keep the fire fed with wood.

Complex blockquote:
> #### The quarterly results look great!
>
> - Revenue was off the chart.
> - Profits were higher than ever.
>
>  *Everything* is going according to **plan**.

Table:

One   | Two   | Three
------|-------|------
four  | five  | six
seven | eight | nine

Sample code: At the command prompt, type \`nano\`.

\`\`\`typescript
interface HivePost {
  author: string;
  permlink: string;
  title: string;
  body: string;
  created: string;
}

function get_post_url(post: HivePost): string {
  return \`/@\${post.author}/\${post.permlink}\`;
}
\`\`\`

\`\`\`css
.hive-renderer h1 {
  font-size: 1.6em;
  font-weight: 600;
}
\`\`\`

Links:
<https://www.markdownguide.org>

YouTube embed:
https://www.youtube.com/watch?v=a3ICNMQW7Ok

<details>
<summary>Click to expand</summary>

These details <em>remain</em> <strong>hidden</strong> until expanded.

<pre><code>PASTE LOGS HERE</code></pre>

</details>

<center>This text is centered using the center tag.</center>

Blockquote with link:
> Check out this post about precious metals on Hive. [source](https://peakd.com/silvergoldstackers/@silverd510/on-the-first-day-of)

Hive User links:
Hello Mr. @sketch.and.jam, how are you?`;
</script>
