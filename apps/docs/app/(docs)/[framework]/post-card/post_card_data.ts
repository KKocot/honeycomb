export const CODE = {
  basic: {
    react: `import { HivePostCard } from "@barddev/honeycomb-react";

function PostFeed() {
  return (
    <HivePostCard
      author="barddev"
      permlink="my-first-post"
    />
  );
}`,
    solid: `import { HivePostCard } from "@kkocot/honeycomb-solid";

function PostFeed() {
  return (
    <HivePostCard
      author="barddev"
      permlink="my-first-post"
    />
  );
}`,
    vue: `<template>
  <HivePostCard
    author="barddev"
    permlink="my-first-post"
  />
</template>

<script setup lang="ts">
import { HivePostCard } from "@barddev/honeycomb-vue";
</script>`,
  },
  variants: {
    react: `// Card (default)
<HivePostCard author="barddev" permlink="post" variant="card" />

// Compact
<HivePostCard author="barddev" permlink="post" variant="compact" />

// Grid
<HivePostCard author="barddev" permlink="post" variant="grid" />`,
    solid: `// Card (default)
<HivePostCard author="barddev" permlink="post" variant="card" />

// Compact
<HivePostCard author="barddev" permlink="post" variant="compact" />

// Grid
<HivePostCard author="barddev" permlink="post" variant="grid" />`,
    vue: `<template>
  <!-- Card (default) -->
  <HivePostCard author="barddev" permlink="post" variant="card" />

  <!-- Compact -->
  <HivePostCard author="barddev" permlink="post" variant="compact" />

  <!-- Grid -->
  <HivePostCard author="barddev" permlink="post" variant="grid" />
</template>`,
  },
  hideElements: {
    react: `// Hide specific elements
<HivePostCard
  author="barddev"
  permlink="my-post"
  hide={["author", "thumbnail", "payout"]}
/>

// Available options: "author" | "thumbnail" | "payout" | "votes" | "comments" | "time"`,
    solid: `// Hide specific elements
<HivePostCard
  author="barddev"
  permlink="my-post"
  hide={["author", "thumbnail", "payout"]}
/>

// Available options: "author" | "thumbnail" | "payout" | "votes" | "comments" | "time"`,
    vue: `<template>
  <!-- Hide specific elements -->
  <HivePostCard
    author="barddev"
    permlink="my-post"
    :hide="['author', 'thumbnail', 'payout']"
  />

  <!-- Available options: "author" | "thumbnail" | "payout" | "votes" | "comments" | "time" -->
</template>`,
  },
  customStyle: {
    react: `// Custom styling with className
<HivePostCard
  author="barddev"
  permlink="my-post"
  className="max-w-xl shadow-lg rounded-2xl"
/>`,
    solid: `// Custom styling with class
<HivePostCard
  author="barddev"
  permlink="my-post"
  class="max-w-xl shadow-lg rounded-2xl"
/>`,
    vue: `<template>
  <!-- Custom styling with class -->
  <HivePostCard
    author="barddev"
    permlink="my-post"
    class="max-w-xl shadow-lg rounded-2xl"
  />
</template>`,
  },
  postList: {
    react: `import { HivePostCard } from "@barddev/honeycomb-react";

// Render a list of posts
function PostList({ posts }: { posts: Array<{ author: string; permlink: string }> }) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <HivePostCard
          key={\`\${post.author}/\${post.permlink}\`}
          author={post.author}
          permlink={post.permlink}
        />
      ))}
    </div>
  );
}`,
    solid: `import { For } from "solid-js";
import { HivePostCard } from "@kkocot/honeycomb-solid";

// Render a list of posts
function PostList(props: { posts: Array<{ author: string; permlink: string }> }) {
  return (
    <div class="space-y-4">
      <For each={props.posts}>
        {(post) => (
          <HivePostCard
            author={post.author}
            permlink={post.permlink}
          />
        )}
      </For>
    </div>
  );
}`,
    vue: `<template>
  <div class="space-y-4">
    <HivePostCard
      v-for="post in posts"
      :key="\`\${post.author}/\${post.permlink}\`"
      :author="post.author"
      :permlink="post.permlink"
    />
  </div>
</template>

<script setup lang="ts">
import { HivePostCard } from "@barddev/honeycomb-vue";

defineProps<{
  posts: Array<{ author: string; permlink: string }>;
}>();
</script>`,
  },
};
