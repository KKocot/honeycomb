<script lang="ts">
  import { MdEditor } from "@hiveio/honeycomb-svelte";

  const INITIAL_CONTENT = `# Hello Hive!

Write your **markdown** content here.

## Features

- Bold, italic, strikethrough
- Code blocks with syntax highlighting
- Lists (ordered, unordered, task)
- Tables, links, images
- Hive-specific URL conversion

\`\`\`typescript
const greeting = "Hello from Honeycomb!";
console.log(greeting);
\`\`\`

> This is a blockquote example.
`;

  let basic_content = $state(INITIAL_CONTENT);
  let split_content = $state(
    "# Split Preview\n\nEdit on the left, preview on the right.\n\n- Item one\n- Item two\n- Item three\n",
  );
  let tab_content = $state(
    "# Tab Preview\n\nSwitch between **Write** and **Preview** tabs.\n\n| Column A | Column B |\n|----------|----------|\n| Cell 1   | Cell 2   |\n",
  );
  let custom_content = $state("");
</script>

<div class="space-y-8">
  <section class="border border-border rounded-lg p-4 sm:p-6 bg-muted/20">
    <h2 class="text-xl sm:text-2xl font-semibold mb-2">Basic Editor</h2>
    <p class="text-sm text-muted-foreground mb-4">
      Default configuration with no preview. Use the toolbar eye icon to
      toggle preview modes.
    </p>
    <MdEditor
      value={basic_content}
      onchange={(v) => {
        basic_content = v;
      }}
    />
  </section>

  <section class="border border-border rounded-lg p-4 sm:p-6 bg-muted/20">
    <h2 class="text-xl sm:text-2xl font-semibold mb-2">Split Preview</h2>
    <p class="text-sm text-muted-foreground mb-4">
      Side-by-side editor and rendered preview. Useful for longer content
      where you want instant visual feedback.
    </p>
    <MdEditor
      value={split_content}
      onchange={(v) => {
        split_content = v;
      }}
      config={{ previewMode: "split" }}
    />
  </section>

  <section class="border border-border rounded-lg p-4 sm:p-6 bg-muted/20">
    <h2 class="text-xl sm:text-2xl font-semibold mb-2">Tab Preview</h2>
    <p class="text-sm text-muted-foreground mb-4">
      Write/Preview tabs for a compact layout. Click the tabs below the
      toolbar to switch.
    </p>
    <MdEditor
      value={tab_content}
      onchange={(v) => {
        tab_content = v;
      }}
      config={{ previewMode: "tab" }}
    />
  </section>

  <section class="border border-border rounded-lg p-4 sm:p-6 bg-muted/20">
    <h2 class="text-xl sm:text-2xl font-semibold mb-2">
      Custom Configuration
    </h2>
    <p class="text-sm text-muted-foreground mb-4">
      Split preview, auto theme, custom placeholder, and 400px minimum
      height.
    </p>
    <MdEditor
      value={custom_content}
      onchange={(v) => {
        custom_content = v;
      }}
      config={{
        previewMode: "split",
        theme: "auto",
        placeholder: "Write your post here...",
        minHeight: 400,
      }}
    />
  </section>
</div>
