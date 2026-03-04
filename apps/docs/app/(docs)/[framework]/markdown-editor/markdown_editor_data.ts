import type { Framework } from "@/lib/framework";

type FrameworkCode = Record<Framework, string>;

interface PropDef {
  name: string;
  /** Use a callback when the name depends on framework */
  nameFn?: (fw: Framework) => string;
  type: string;
  default: string;
  description: string;
}

export const PROPS: PropDef[] = [
  { name: "value", type: "string", default: "-", description: "Markdown content (controlled)" },
  { name: "onChange", type: "(value: string) => void", default: "-", description: "Called on content change" },
  { name: "config", type: "Partial<MdEditorConfig>", default: "See config table", description: "Editor configuration" },
  { name: "", nameFn: (fw) => (fw === "react" ? "className" : "class"), type: "string", default: "-", description: "CSS class on wrapper element" },
  { name: "rendererOptions", type: "Partial<RendererOptions>", default: "-", description: "Options passed to the preview renderer" },
  { name: "onFocus", type: "() => void", default: "-", description: "Called when editor gains focus" },
  { name: "onBlur", type: "() => void", default: "-", description: "Called when editor loses focus" },
  { name: "onUploadStart", type: "(file: File) => void", default: "-", description: "Called when image upload starts" },
  { name: "onUploadComplete", type: "(result: UploadResult) => void", default: "-", description: "Called when upload succeeds" },
  { name: "onUploadError", type: "(error: Error) => void", default: "-", description: "Called when upload fails" },
  { name: "onDraftSave", type: "(draft: DraftData) => void", default: "-", description: "Called when draft is saved" },
  { name: "onDraftRestore", type: "(draft: DraftData) => void", default: "-", description: "Called when draft is restored on mount" },
];

export const CONFIG_FIELDS: PropDef[] = [
  { name: "placeholder", type: "string", default: "-", description: "Placeholder text" },
  { name: "minHeight", type: "number", default: "300", description: "Minimum height in pixels" },
  { name: "maxHeight", type: "number", default: "-", description: "Maximum height in pixels" },
  { name: "autoFocus", type: "boolean", default: "false", description: "Focus editor on mount" },
  { name: "toolbar", type: "ToolbarItem[]", default: "DEFAULT_TOOLBAR", description: "Custom toolbar actions" },
  { name: "plugins", type: "EditorPlugin[]", default: "[]", description: "Editor plugins (toolbar items, shortcuts, paste handlers)" },
  { name: "uploadHandler", type: "UploadHandler", default: "-", description: "Image upload handler (enables upload button)" },
  { name: "draftConfig", type: "DraftConfig", default: "-", description: "Auto-save draft configuration" },
  { name: "previewMode", type: '"split" | "tab" | "off"', default: '"off"', description: "Initial preview mode" },
  { name: "theme", type: '"light" | "dark" | "auto"', default: '"auto"', description: "Editor color theme" },
  { name: "convertHiveUrls", type: "boolean", default: "false", description: "Auto-convert Hive blog URLs to @mention/permlink format" },
];

export const TOOLBAR_ACTIONS: { label: string; type: string; shortcut: string }[] = [
  { label: "Bold", type: "bold", shortcut: "Mod-B" },
  { label: "Italic", type: "italic", shortcut: "Mod-I" },
  { label: "Strikethrough", type: "strikethrough", shortcut: "Mod-Shift-S" },
  { label: "Inline Code", type: "code", shortcut: "Mod-E" },
  { label: "Heading", type: "heading", shortcut: "-" },
  { label: "Quote", type: "quote", shortcut: "-" },
  { label: "Horizontal Rule", type: "horizontal_rule", shortcut: "-" },
  { label: "Code Block", type: "code_block", shortcut: "-" },
  { label: "Table", type: "table", shortcut: "-" },
  { label: "Link", type: "link", shortcut: "Mod-K" },
  { label: "Image", type: "image", shortcut: "-" },
  { label: "Spoiler", type: "spoiler", shortcut: "-" },
  { label: "Unordered List", type: "unordered_list", shortcut: "-" },
  { label: "Ordered List", type: "ordered_list", shortcut: "-" },
  { label: "Task List", type: "task_list", shortcut: "-" },
];

export const CODE: {
  install: string;
  basic: FrameworkCode;
  withUpload: FrameworkCode;
  previewSplit: FrameworkCode;
  customToolbar: FrameworkCode;
  draftAutoSave: FrameworkCode;
  darkMode: FrameworkCode;
} = {
  install: `pnpm add @codemirror/state @codemirror/view @codemirror/language @codemirror/lang-markdown @codemirror/commands @codemirror/theme-one-dark`,

  basic: {
    react: `import { useState } from "react";
import { MdEditor } from "@barddev/honeycomb-react";

function PostEditor() {
  const [content, set_content] = useState("");

  return <MdEditor value={content} onChange={set_content} />;
}`,
    solid: `import { createSignal } from "solid-js";
import { MdEditor } from "@barddev/honeycomb-solid";

function PostEditor() {
  const [content, set_content] = createSignal("");

  return <MdEditor value={content()} onChange={set_content} />;
}`,
    vue: `<template>
  <MdEditor :value="content" @change="(val) => (content = val)" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { MdEditor } from "@barddev/honeycomb-vue";

const content = ref("");
</script>`,
    svelte: `<script lang="ts">
  import { MdEditor } from "@barddev/honeycomb-svelte";

  let content = $state("");
</script>

<MdEditor value={content} onChange={(val) => (content = val)} />`,
  },

  withUpload: {
    react: `import { useState, useMemo } from "react";
import { MdEditor, create_hive_upload_handler } from "@barddev/honeycomb-react";

function PostEditor({ username }: { username: string }) {
  const [content, set_content] = useState("");

  const upload_handler = useMemo(
    () =>
      create_hive_upload_handler({
        imageEndpoint: "https://images.hive.blog/",
        username,
        signChallenge: async (challenge) => {
          // Sign with Hive Keychain or other method
          return await keychain.requestSignBuffer(username, challenge);
        },
      }),
    [username],
  );

  return (
    <MdEditor
      value={content}
      onChange={set_content}
      config={{ uploadHandler: upload_handler }}
      onUploadStart={(file) => console.info("Uploading:", file.name)}
      onUploadComplete={(result) => console.info("Uploaded:", result.url)}
      onUploadError={(error) => console.error("Upload failed:", error)}
    />
  );
}`,
    solid: `import { createSignal, createMemo } from "solid-js";
import { MdEditor, create_hive_upload_handler } from "@barddev/honeycomb-solid";

function PostEditor(props: { username: string }) {
  const [content, set_content] = createSignal("");

  const upload_handler = createMemo(() =>
    create_hive_upload_handler({
      imageEndpoint: "https://images.hive.blog/",
      username: props.username,
      signChallenge: async (challenge) => {
        return await keychain.requestSignBuffer(props.username, challenge);
      },
    }),
  );

  return (
    <MdEditor
      value={content()}
      onChange={set_content}
      config={{ uploadHandler: upload_handler() }}
    />
  );
}`,
    vue: `<template>
  <MdEditor
    :value="content"
    @change="(val) => (content = val)"
    :config="{ uploadHandler: upload_handler }"
  />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { MdEditor, create_hive_upload_handler } from "@barddev/honeycomb-vue";

const props = defineProps<{ username: string }>();
const content = ref("");

const upload_handler = computed(() =>
  create_hive_upload_handler({
    imageEndpoint: "https://images.hive.blog/",
    username: props.username,
    signChallenge: async (challenge) => {
      return await keychain.requestSignBuffer(props.username, challenge);
    },
  }),
);
</script>`,
    svelte: `<script lang="ts">
  import { MdEditor, create_hive_upload_handler } from "@barddev/honeycomb-svelte";

  let { username }: { username: string } = $props();
  let content = $state("");

  const upload_handler = $derived(
    create_hive_upload_handler({
      imageEndpoint: "https://images.hive.blog/",
      username,
      signChallenge: async (challenge) => {
        return await keychain.requestSignBuffer(username, challenge);
      },
    }),
  );
</script>

<MdEditor
  value={content}
  onChange={(val) => (content = val)}
  config={{ uploadHandler: upload_handler }}
/>`,
  },

  previewSplit: {
    react: `<MdEditor
  value={content}
  onChange={set_content}
  config={{ previewMode: "split" }}
/>

{/* "tab" - switchable Write/Preview tabs */}
<MdEditor
  value={content}
  onChange={set_content}
  config={{ previewMode: "tab" }}
/>

{/* "off" - editor only (default) */}
<MdEditor
  value={content}
  onChange={set_content}
  config={{ previewMode: "off" }}
/>`,
    solid: `<MdEditor
  value={content()}
  onChange={set_content}
  config={{ previewMode: "split" }}
/>

{/* "tab" - switchable Write/Preview tabs */}
<MdEditor
  value={content()}
  onChange={set_content}
  config={{ previewMode: "tab" }}
/>`,
    vue: `<template>
  <!-- Side-by-side editor and preview -->
  <MdEditor
    :value="content"
    @change="(val) => (content = val)"
    :config="{ previewMode: 'split' }"
  />

  <!-- Switchable Write/Preview tabs -->
  <MdEditor
    :value="content"
    @change="(val) => (content = val)"
    :config="{ previewMode: 'tab' }"
  />
</template>`,
    svelte: `<!-- Side-by-side editor and preview -->
<MdEditor
  value={content}
  onChange={(val) => (content = val)}
  config={{ previewMode: "split" }}
/>

<!-- Switchable Write/Preview tabs -->
<MdEditor
  value={content}
  onChange={(val) => (content = val)}
  config={{ previewMode: "tab" }}
/>`,
  },

  customToolbar: {
    react: `import { MdEditor, DEFAULT_TOOLBAR } from "@barddev/honeycomb-react";
import type { ToolbarItem } from "@barddev/honeycomb-react";

// Use only formatting actions
const minimal_toolbar: ToolbarItem[] = DEFAULT_TOOLBAR.filter(
  (item) =>
    item.type === "bold" ||
    item.type === "italic" ||
    item.type === "link" ||
    item.type === "image" ||
    item.type === "separator",
);

function MinimalEditor() {
  const [content, set_content] = useState("");

  return (
    <MdEditor
      value={content}
      onChange={set_content}
      config={{ toolbar: minimal_toolbar }}
    />
  );
}`,
    solid: `import { MdEditor, DEFAULT_TOOLBAR } from "@barddev/honeycomb-solid";
import type { ToolbarItem } from "@barddev/honeycomb-solid";

const minimal_toolbar: ToolbarItem[] = DEFAULT_TOOLBAR.filter(
  (item) =>
    item.type === "bold" ||
    item.type === "italic" ||
    item.type === "link" ||
    item.type === "image" ||
    item.type === "separator",
);

function MinimalEditor() {
  const [content, set_content] = createSignal("");

  return (
    <MdEditor
      value={content()}
      onChange={set_content}
      config={{ toolbar: minimal_toolbar }}
    />
  );
}`,
    vue: `<template>
  <MdEditor
    :value="content"
    @change="(val) => (content = val)"
    :config="{ toolbar: minimal_toolbar }"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { MdEditor, DEFAULT_TOOLBAR } from "@barddev/honeycomb-vue";

const content = ref("");

const minimal_toolbar = DEFAULT_TOOLBAR.filter(
  (item) =>
    item.type === "bold" ||
    item.type === "italic" ||
    item.type === "link" ||
    item.type === "image" ||
    item.type === "separator",
);
</script>`,
    svelte: `<script lang="ts">
  import { MdEditor, DEFAULT_TOOLBAR } from "@barddev/honeycomb-svelte";

  let content = $state("");

  const minimal_toolbar = DEFAULT_TOOLBAR.filter(
    (item) =>
      item.type === "bold" ||
      item.type === "italic" ||
      item.type === "link" ||
      item.type === "image" ||
      item.type === "separator",
  );
</script>

<MdEditor
  value={content}
  onChange={(val) => (content = val)}
  config={{ toolbar: minimal_toolbar }}
/>`,
  },

  draftAutoSave: {
    react: `<MdEditor
  value={content}
  onChange={set_content}
  config={{
    draftConfig: {
      enabled: true,
      key: "post-draft-my-post",
      debounceMs: 1000,
      ttlMs: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  }}
  onDraftSave={(draft) => console.info("Draft saved:", draft.savedAt)}
  onDraftRestore={(draft) => console.info("Draft restored:", draft.content.length, "chars")}
/>`,
    solid: `<MdEditor
  value={content()}
  onChange={set_content}
  config={{
    draftConfig: {
      enabled: true,
      key: "post-draft-my-post",
      debounceMs: 1000,
      ttlMs: 7 * 24 * 60 * 60 * 1000,
    },
  }}
/>`,
    vue: `<template>
  <MdEditor
    :value="content"
    @change="(val) => (content = val)"
    :config="{
      draftConfig: {
        enabled: true,
        key: 'post-draft-my-post',
        debounceMs: 1000,
        ttlMs: 7 * 24 * 60 * 60 * 1000,
      },
    }"
  />
</template>`,
    svelte: `<MdEditor
  value={content}
  onChange={(val) => (content = val)}
  config={{
    draftConfig: {
      enabled: true,
      key: "post-draft-my-post",
      debounceMs: 1000,
      ttlMs: 7 * 24 * 60 * 60 * 1000,
    },
  }}
/>`,
  },

  darkMode: {
    react: `// "auto" follows system preference (default)
<MdEditor value={content} onChange={set_content} config={{ theme: "auto" }} />

// Force light or dark
<MdEditor value={content} onChange={set_content} config={{ theme: "light" }} />
<MdEditor value={content} onChange={set_content} config={{ theme: "dark" }} />

// Sync with next-themes
import { useTheme } from "next-themes";

function ThemedEditor() {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark" : "light";

  return (
    <MdEditor
      value={content}
      onChange={set_content}
      config={{ theme }}
    />
  );
}`,
    solid: `// "auto" follows system preference (default)
<MdEditor value={content()} onChange={set_content} config={{ theme: "auto" }} />

// Force light or dark
<MdEditor value={content()} onChange={set_content} config={{ theme: "dark" }} />`,
    vue: `<template>
  <!-- "auto" follows system preference (default) -->
  <MdEditor
    :value="content"
    @change="(val) => (content = val)"
    :config="{ theme: 'auto' }"
  />

  <!-- Force dark -->
  <MdEditor
    :value="content"
    @change="(val) => (content = val)"
    :config="{ theme: 'dark' }"
  />
</template>`,
    svelte: `<!-- "auto" follows system preference (default) -->
<MdEditor
  value={content}
  onChange={(val) => (content = val)}
  config={{ theme: "auto" }}
/>

<!-- Force dark -->
<MdEditor
  value={content}
  onChange={(val) => (content = val)}
  config={{ theme: "dark" }}
/>`,
  },
};
