import type { Framework } from "@/lib/framework";

type FrameworkCode = Record<Framework, string>;

export const CODE: {
  basic: FrameworkCode;
  importStyles: string;
  tailwindConfig: string;
  wrapperClasses: FrameworkCode;
  customOptions: FrameworkCode;
  programmatic: string;
} = {
  basic: {
    react: `import { HiveContentRenderer } from "@barddev/honeycomb-react";

function PostContent({ body, author, permlink }: {
  body: string;
  author: string;
  permlink: string;
}) {
  return (
    <div className="prose dark:prose-invert hive-renderer max-w-none">
      <HiveContentRenderer
        body={body}
        author={author}
        permlink={permlink}
      />
    </div>
  );
}`,
    solid: `import { HiveContentRenderer } from "@kkocot/honeycomb-solid";

function PostContent(props: {
  body: string;
  author: string;
  permlink: string;
}) {
  return (
    <div class="prose dark:prose-invert hive-renderer max-w-none">
      <HiveContentRenderer
        body={props.body}
        author={props.author}
        permlink={props.permlink}
      />
    </div>
  );
}`,
    vue: `<template>
  <div class="prose dark:prose-invert hive-renderer max-w-none">
    <HiveContentRenderer
      :body="body"
      :author="author"
      :permlink="permlink"
    />
  </div>
</template>

<script setup lang="ts">
import { HiveContentRenderer } from "@kkocot/honeycomb-vue";

defineProps<{
  body: string;
  author: string;
  permlink: string;
}>();
</script>`,
  },

  importStyles: `/* globals.css */
@import "@kkocot/honeycomb-renderer/styles.css";`,

  tailwindConfig: `// tailwind.config.ts
import typography from "@tailwindcss/typography";

export default {
  plugins: [typography],
};`,

  wrapperClasses: {
    react: `{/* Wrap the renderer with prose + hive-renderer classes */}
<div className="prose dark:prose-invert hive-renderer max-w-none">
  <HiveContentRenderer body={body} />
</div>`,
    solid: `{/* Wrap the renderer with prose + hive-renderer classes */}
<div class="prose dark:prose-invert hive-renderer max-w-none">
  <HiveContentRenderer body={body} />
</div>`,
    vue: `<template>
  <!-- Wrap the renderer with prose + hive-renderer classes -->
  <div class="prose dark:prose-invert hive-renderer max-w-none">
    <HiveContentRenderer :body="body" />
  </div>
</template>`,
  },

  customOptions: {
    react: `import { HiveContentRenderer } from "@barddev/honeycomb-react";

<HiveContentRenderer
  body={body}
  author="barddev"
  permlink="hello-hive"
  options={{
    baseUrl: "https://hive.blog/",
    cssClassForExternalLinks: "link-external",
    imageProxyFn: (url) => \`https://images.hive.blog/0x0/\${url}\`,
    usertagUrlFn: (account) => \`/user/\${account}\`,
    hashtagUrlFn: (tag) => \`/tag/\${tag}\`,
  }}
/>`,
    solid: `import { HiveContentRenderer } from "@kkocot/honeycomb-solid";

<HiveContentRenderer
  body={body}
  author="barddev"
  permlink="hello-hive"
  options={{
    baseUrl: "https://hive.blog/",
    cssClassForExternalLinks: "link-external",
    imageProxyFn: (url) => \`https://images.hive.blog/0x0/\${url}\`,
    usertagUrlFn: (account) => \`/user/\${account}\`,
    hashtagUrlFn: (tag) => \`/tag/\${tag}\`,
  }}
/>`,
    vue: `<template>
  <HiveContentRenderer
    :body="body"
    author="barddev"
    permlink="hello-hive"
    :options="rendererOptions"
  />
</template>

<script setup lang="ts">
import { HiveContentRenderer } from "@kkocot/honeycomb-vue";

const rendererOptions = {
  baseUrl: "https://hive.blog/",
  cssClassForExternalLinks: "link-external",
  imageProxyFn: (url: string) => \`https://images.hive.blog/0x0/\${url}\`,
  usertagUrlFn: (account: string) => \`/user/\${account}\`,
  hashtagUrlFn: (tag: string) => \`/tag/\${tag}\`,
};
</script>`,
  },

  programmatic: `import {
  DefaultRenderer,
  build_default_options,
} from "@kkocot/honeycomb-renderer";

const renderer = new DefaultRenderer(
  build_default_options({
    baseUrl: "https://hive.blog/",
    breaks: true,
  })
);

const html = renderer.render(markdown, {
  author: "barddev",
  permlink: "hello-hive",
});`,
};
