import type { Framework } from "@/lib/framework";

export const SUPPORTED_FRAMEWORKS: ReadonlySet<Framework> = new Set([
  "react",
  "solid",
  "svelte",
  "vue",
]);

export const CODE = {
  basic: {
    react: `import { HiveAuthorPostList } from "@hiveio/honeycomb-react";

function AuthorBlog() {
  return <HiveAuthorPostList account="hiveio" />;
}`,
    solid: `import { HiveAuthorPostList } from "@hiveio/honeycomb-solid";

function AuthorBlog() {
  return <HiveAuthorPostList account="hiveio" />;
}`,
    vue: `<template>
  <HiveProvider>
    <HiveAuthorPostList account="hiveio" />
  </HiveProvider>
</template>

<script setup lang="ts">
import { HiveProvider, HiveAuthorPostList } from "@hiveio/honeycomb-vue";
</script>`,
    svelte: `<script lang="ts">
  import { HiveAuthorPostList } from "@hiveio/honeycomb-svelte";
</script>

<HiveAuthorPostList account="hiveio" />`,
  },
  tagFilter: {
    react: `import { HiveAuthorPostList } from "@hiveio/honeycomb-react";

// Filter posts by an author and a specific tag.
function HiveDevPosts() {
  return (
    <HiveAuthorPostList
      account="hiveio"
      tag="hivedev"
    />
  );
}`,
    solid: `import { HiveAuthorPostList } from "@hiveio/honeycomb-solid";

// Filter posts by an author and a specific tag.
function HiveDevPosts() {
  return (
    <HiveAuthorPostList
      account="hiveio"
      tag="hivedev"
    />
  );
}`,
    vue: `<template>
  <!-- Filter posts by an author and a specific tag. -->
  <HiveAuthorPostList
    account="hiveio"
    tag="hivedev"
  />
</template>

<script setup lang="ts">
import { HiveAuthorPostList } from "@hiveio/honeycomb-vue";
</script>`,
    svelte: `<script lang="ts">
  import { HiveAuthorPostList } from "@hiveio/honeycomb-svelte";
</script>

<!-- Filter posts by an author and a specific tag. -->
<HiveAuthorPostList
  account="hiveio"
  tag="hivedev"
/>`,
  },
  pinnedExample: {
    react: `import { HiveAuthorPostList } from "@hiveio/honeycomb-react";
import type { AccountPost } from "@hiveio/honeycomb-core";

// Unlike HivePostList, pinned posts here are full AccountPost objects
// (no extra fetch — rendered directly).
const pinned: AccountPost[] = [
  /* full AccountPost objects from a previous fetch */
];

function PinnedAuthorFeed() {
  return (
    <HiveAuthorPostList
      account="hiveio"
      pinned_posts={pinned}
    />
  );
}`,
    solid: `import { HiveAuthorPostList } from "@hiveio/honeycomb-solid";
import type { AccountPost } from "@hiveio/honeycomb-core";

// Unlike HivePostList, pinned posts here are full AccountPost objects
// (no extra fetch — rendered directly).
const pinned: AccountPost[] = [
  /* full AccountPost objects from a previous fetch */
];

function PinnedAuthorFeed() {
  return (
    <HiveAuthorPostList
      account="hiveio"
      pinned_posts={pinned}
    />
  );
}`,
    vue: `<template>
  <HiveAuthorPostList
    account="hiveio"
    :pinned-posts="pinned"
  />
</template>

<script setup lang="ts">
import { HiveAuthorPostList } from "@hiveio/honeycomb-vue";
import type { AccountPost } from "@hiveio/honeycomb-core";

// Unlike HivePostList, pinned posts here are full AccountPost objects
// (no extra fetch — rendered directly).
const pinned: AccountPost[] = [
  /* full AccountPost objects from a previous fetch */
];
</script>`,
    svelte: `<script lang="ts">
  import { HiveAuthorPostList } from "@hiveio/honeycomb-svelte";
  import type { AccountPost } from "@hiveio/honeycomb-core";

  // Unlike HivePostList, pinned posts here are full AccountPost objects
  // (no extra fetch — rendered directly).
  const pinned: AccountPost[] = [
    /* full AccountPost objects from a previous fetch */
  ];
</script>

<HiveAuthorPostList
  account="hiveio"
  pinned_posts={pinned}
/>`,
  },
  hookUsage: {
    react: `import { useHiveAuthorPostList } from "@hiveio/honeycomb-react";

function CustomAuthorFeed() {
  const {
    posts,
    is_loading,
    error,
    has_next,
    has_prev,
    next_page,
    prev_page,
    page,
  } = useHiveAuthorPostList({
    account: "hiveio",
    limit: 10,
  });

  if (is_loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <p>Page {page}</p>
      <ul>
        {posts.map((p) => (
          <li key={\`\${p.author}/\${p.permlink}\`}>{p.title}</li>
        ))}
      </ul>
      <button onClick={prev_page} disabled={!has_prev}>Prev</button>
      <button onClick={next_page} disabled={!has_next}>Next</button>
    </div>
  );
}`,
    solid: `import { useHiveAuthorPostList } from "@hiveio/honeycomb-solid";
import { Show, For } from "solid-js";

function CustomAuthorFeed() {
  const feed = useHiveAuthorPostList({
    account: "hiveio",
    limit: 10,
  });

  return (
    <Show when={!feed.is_loading()} fallback={<p>Loading...</p>}>
      <Show when={!feed.error()} fallback={<p>Error: {feed.error()?.message}</p>}>
        <div>
          <p>Page {feed.page()}</p>
          <ul>
            <For each={feed.posts()}>
              {(p) => <li>{p.title}</li>}
            </For>
          </ul>
          <button onClick={feed.prev_page} disabled={!feed.has_prev()}>Prev</button>
          <button onClick={feed.next_page} disabled={!feed.has_next()}>Next</button>
        </div>
      </Show>
    </Show>
  );
}`,
    vue: `<template>
  <p v-if="feed.isLoading">Loading...</p>
  <p v-else-if="feed.error">Error: {{ feed.error.message }}</p>
  <div v-else>
    <p>Page {{ feed.page }}</p>
    <ul>
      <li
        v-for="p in feed.posts"
        :key="\`\${p.author}/\${p.permlink}\`"
      >
        {{ p.title }}
      </li>
    </ul>
    <button :disabled="!feed.hasPrev" @click="feed.prevPage()">Prev</button>
    <button :disabled="!feed.hasNext" @click="feed.nextPage()">Next</button>
  </div>
</template>

<script setup lang="ts">
import { useHiveAuthorPostList } from "@hiveio/honeycomb-vue";

const feed = useHiveAuthorPostList({
  account: "hiveio",
  limit: 10,
});
</script>`,
    svelte: `<script lang="ts">
  import { useHiveAuthorPostList } from "@hiveio/honeycomb-svelte";

  const feed = useHiveAuthorPostList({
    account: "hiveio",
    limit: 10,
  });
</script>

{#if feed.is_loading}
  <p>Loading...</p>
{:else if feed.error}
  <p>Error: {feed.error.message}</p>
{:else}
  <div>
    <p>Page {feed.page}</p>
    <ul>
      {#each feed.posts as p (\`\${p.author}/\${p.permlink}\`)}
        <li>{p.title}</li>
      {/each}
    </ul>
    <button onclick={feed.prev_page} disabled={!feed.has_prev}>Prev</button>
    <button onclick={feed.next_page} disabled={!feed.has_next}>Next</button>
  </div>
{/if}`,
  },
} as const;

export type SupportedFramework = "react" | "solid" | "svelte" | "vue";

export function isSupportedFramework(
  framework: Framework,
): framework is SupportedFramework {
  return SUPPORTED_FRAMEWORKS.has(framework);
}
