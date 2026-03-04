import { createSignal } from "solid-js";
import { MdEditor } from "@barddev/honeycomb-solid";

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

export default function MdEditorTab() {
  const [basic_content, set_basic_content] = createSignal(INITIAL_CONTENT);
  const [split_content, set_split_content] = createSignal(
    "# Split Preview\n\nEdit on the left, preview on the right.\n\n- Item one\n- Item two\n- Item three\n",
  );
  const [tab_content, set_tab_content] = createSignal(
    "# Tab Preview\n\nSwitch between **Write** and **Preview** tabs.\n\n| Column A | Column B |\n|----------|----------|\n| Cell 1   | Cell 2   |\n",
  );
  const [custom_content, set_custom_content] = createSignal("");

  return (
    <div class="space-y-8">
      <section class="border border-border rounded-lg p-4 sm:p-6 bg-muted/20">
        <h2 class="text-xl sm:text-2xl font-semibold mb-2">Basic Editor</h2>
        <p class="text-sm text-muted-foreground mb-4">
          Default configuration with no preview. Use the toolbar eye icon to
          toggle preview modes.
        </p>
        <MdEditor value={basic_content()} onChange={set_basic_content} />
      </section>

      <section class="border border-border rounded-lg p-4 sm:p-6 bg-muted/20">
        <h2 class="text-xl sm:text-2xl font-semibold mb-2">Split Preview</h2>
        <p class="text-sm text-muted-foreground mb-4">
          Side-by-side editor and rendered preview. Useful for longer content
          where you want instant visual feedback.
        </p>
        <MdEditor
          value={split_content()}
          onChange={set_split_content}
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
          value={tab_content()}
          onChange={set_tab_content}
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
          value={custom_content()}
          onChange={set_custom_content}
          config={{
            previewMode: "split",
            theme: "auto",
            placeholder: "Write your post here...",
            minHeight: 400,
          }}
        />
      </section>
    </div>
  );
}
