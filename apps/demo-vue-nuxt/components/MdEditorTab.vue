<template>
  <div class="space-y-6">
    <MdEditor
      :value="content"
      :config="editor_config"
      @update:value="content = $event"
    />

    <section class="border border-border rounded-lg p-4 bg-muted/20">
      <h3 class="text-lg font-semibold mb-2">Raw Output</h3>
      <pre
        class="text-xs bg-background rounded-lg p-4 overflow-x-auto border border-border whitespace-pre-wrap break-words"
      >{{ content }}</pre>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { MdEditor } from "@barddev/honeycomb-vue";
import type { MdEditorConfig } from "@barddev/honeycomb-vue";

const INITIAL_CONTENT = `# Hello from Honeycomb Vue Editor

This is a **Markdown editor** built with CodeMirror 6.

## Features

- Toolbar with formatting actions
- Split / tab preview modes
- Dark mode support
- Draft auto-save

### Code example

\`\`\`typescript
import { MdEditor } from "@barddev/honeycomb-vue";
\`\`\`

> Try the toolbar buttons above or toggle the preview mode.
`;

const content = ref(INITIAL_CONTENT);

const editor_config: Partial<MdEditorConfig> = {
  placeholder: "Write your markdown here...",
  previewMode: "split",
  theme: "auto",
  convertHiveUrls: true,
  minHeight: 400,
  draftConfig: {
    enabled: true,
    key: "honeycomb-vue-nuxt-demo-draft",
  },
};
</script>
