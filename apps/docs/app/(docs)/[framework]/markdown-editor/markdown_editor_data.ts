export const CODE = {
  install: `pnpm add md-editor-rt @vavt/rt-extension @vavt/cm-extension lucide-react`,
  basic: {
    react: `import { HiveMarkdownEditor } from "@/components/hive/content";
import { useState } from "react";

function Editor() {
  const [content, setContent] = useState("");

  return (
    <HiveMarkdownEditor
      value={content}
      onChange={setContent}
    />
  );
}`,
    solid: `import { HiveMarkdownEditor } from "@/components/hive/content";
import { createSignal } from "solid-js";

function Editor() {
  const [content, setContent] = createSignal("");

  return (
    <HiveMarkdownEditor
      value={content()}
      onChange={setContent}
    />
  );
}`,
    vue: `<template>
  <HiveMarkdownEditor
    v-model="content"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { HiveMarkdownEditor } from "@/components/hive/content";

const content = ref("");
</script>`,
  },
  withTheme: {
    react: `// Sync with your app's theme
import { useTheme } from "next-themes";

function ThemedEditor() {
  const [content, setContent] = useState("");
  const { resolvedTheme } = useTheme();

  return (
    <HiveMarkdownEditor
      value={content}
      onChange={setContent}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  );
}`,
    solid: `// Sync with your app's theme
import { createSignal } from "solid-js";

function ThemedEditor() {
  const [content, setContent] = createSignal("");
  // Use your preferred theme detection method
  const theme = () => document.documentElement.classList.contains("dark") ? "dark" : "light";

  return (
    <HiveMarkdownEditor
      value={content()}
      onChange={setContent}
      theme={theme()}
    />
  );
}`,
    vue: `<template>
  <HiveMarkdownEditor
    v-model="content"
    :theme="resolvedTheme === 'dark' ? 'dark' : 'light'"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useColorMode } from "@vueuse/core";

const content = ref("");
const { store: resolvedTheme } = useColorMode();
</script>`,
  },
  fullHeight: {
    react: `// Full height editor
<div className="h-[500px]">
  <HiveMarkdownEditor
    value={content}
    onChange={setContent}
    className="!h-full"
  />
</div>`,
    solid: `// Full height editor
<div class="h-[500px]">
  <HiveMarkdownEditor
    value={content()}
    onChange={setContent}
    class="!h-full"
  />
</div>`,
    vue: `<template>
  <!-- Full height editor -->
  <div class="h-[500px]">
    <HiveMarkdownEditor
      v-model="content"
      class="!h-full"
    />
  </div>
</template>`,
  },
  withRenderer: {
    react: `// Editor with live preview using ContentRenderer
import { HiveMarkdownEditor, HiveContentRenderer } from "@/components/hive/content";

function EditorWithPreview() {
  const [content, setContent] = useState("");

  return (
    <div className="grid grid-cols-2 gap-4 h-[600px]">
      <HiveMarkdownEditor value={content} onChange={setContent} />
      <div className="overflow-auto border rounded-lg p-4">
        <HiveContentRenderer content={content} />
      </div>
    </div>
  );
}`,
    solid: `// Editor with live preview using ContentRenderer
import { HiveMarkdownEditor, HiveContentRenderer } from "@/components/hive/content";
import { createSignal } from "solid-js";

function EditorWithPreview() {
  const [content, setContent] = createSignal("");

  return (
    <div class="grid grid-cols-2 gap-4 h-[600px]">
      <HiveMarkdownEditor value={content()} onChange={setContent} />
      <div class="overflow-auto border rounded-lg p-4">
        <HiveContentRenderer content={content()} />
      </div>
    </div>
  );
}`,
    vue: `<template>
  <div class="grid grid-cols-2 gap-4 h-[600px]">
    <HiveMarkdownEditor v-model="content" />
    <div class="overflow-auto border rounded-lg p-4">
      <HiveContentRenderer :content="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { HiveMarkdownEditor, HiveContentRenderer } from "@/components/hive/content";

const content = ref("");
</script>`,
  },
};
