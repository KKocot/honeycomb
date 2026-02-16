export const CODE = {
  basic: {
    react: `import { HivePostList } from "@kkocot/honeycomb-react";

function TrendingFeed() {
  return <HivePostList sort="trending" limit={10} />;
}`,
    solid: `import { HivePostList } from "@kkocot/honeycomb-solid";

function TrendingFeed() {
  return <HivePostList sort="trending" limit={10} />;
}`,
    vue: `<template>
  <HivePostList sort="trending" :limit="10" />
</template>

<script setup lang="ts">
import { HivePostList } from "@kkocot/honeycomb-vue";
</script>`,
  },
  sortControls: {
    react: `import { HivePostList } from "@kkocot/honeycomb-react";

// Show sort buttons (trending, hot, created, payout, muted)
function FeedWithControls() {
  return (
    <HivePostList
      sort="trending"
      tag="hive"
      show_sort_controls
    />
  );
}`,
    solid: `import { HivePostList } from "@kkocot/honeycomb-solid";

// Show sort buttons (trending, hot, created, payout, muted)
function FeedWithControls() {
  return (
    <HivePostList
      sort="trending"
      tag="hive"
      show_sort_controls
    />
  );
}`,
    vue: `<template>
  <HivePostList
    sort="trending"
    tag="hive"
    show_sort_controls
  />
</template>

<script setup lang="ts">
import { HivePostList } from "@kkocot/honeycomb-vue";
</script>`,
  },
  pinnedPosts: {
    react: `import { HivePostList } from "@kkocot/honeycomb-react";

// Pin specific posts to the top of the list
function FeedWithPinned() {
  return (
    <HivePostList
      sort="created"
      pinned_posts={[
        { author: "hiveio", permlink: "welcome-to-hive" },
        { author: "barddev", permlink: "hive-ui-announcement" },
      ]}
    />
  );
}`,
    solid: `import { HivePostList } from "@kkocot/honeycomb-solid";

// Pin specific posts to the top of the list
function FeedWithPinned() {
  return (
    <HivePostList
      sort="created"
      pinned_posts={[
        { author: "hiveio", permlink: "welcome-to-hive" },
        { author: "barddev", permlink: "hive-ui-announcement" },
      ]}
    />
  );
}`,
    vue: `<template>
  <HivePostList
    sort="created"
    :pinned_posts="pinned"
  />
</template>

<script setup lang="ts">
import { HivePostList } from "@kkocot/honeycomb-vue";

const pinned = [
  { author: "hiveio", permlink: "welcome-to-hive" },
  { author: "barddev", permlink: "hive-ui-announcement" },
];
</script>`,
  },
  variants: {
    react: `// Compact (default) - single-line rows
<HivePostList sort="trending" variant="compact" />

// Card - full post cards with body preview
<HivePostList sort="trending" variant="card" />

// Grid - responsive image grid
<HivePostList sort="trending" variant="grid" />`,
    solid: `// Compact (default) - single-line rows
<HivePostList sort="trending" variant="compact" />

// Card - full post cards with body preview
<HivePostList sort="trending" variant="card" />

// Grid - responsive image grid
<HivePostList sort="trending" variant="grid" />`,
    vue: `<template>
  <!-- Compact (default) - single-line rows -->
  <HivePostList sort="trending" variant="compact" />

  <!-- Card - full post cards with body preview -->
  <HivePostList sort="trending" variant="card" />

  <!-- Grid - responsive image grid -->
  <HivePostList sort="trending" variant="grid" />
</template>`,
  },
  hideElements: {
    react: `// Hide specific elements from post items
<HivePostList
  sort="trending"
  hide={["thumbnail", "payout", "time"]}
/>

// Available: "author" | "thumbnail" | "payout" | "votes" | "comments" | "time"`,
    solid: `// Hide specific elements from post items
<HivePostList
  sort="trending"
  hide={["thumbnail", "payout", "time"]}
/>

// Available: "author" | "thumbnail" | "payout" | "votes" | "comments" | "time"`,
    vue: `<template>
  <!-- Hide specific elements from post items -->
  <HivePostList
    sort="trending"
    :hide="['thumbnail', 'payout', 'time']"
  />

  <!-- Available: "author" | "thumbnail" | "payout" | "votes" | "comments" | "time" -->
</template>`,
  },
  communityPosts: {
    react: `import { HivePostList } from "@kkocot/honeycomb-react";

// Show posts from a specific community
function LeoFinanceFeed() {
  return (
    <HivePostList
      tag="hive-167922"
      sort="trending"
      show_sort_controls
      limit={10}
    />
  );
}`,
    solid: `import { HivePostList } from "@kkocot/honeycomb-solid";

// Show posts from a specific community
function LeoFinanceFeed() {
  return (
    <HivePostList
      tag="hive-167922"
      sort="trending"
      show_sort_controls
      limit={10}
    />
  );
}`,
    vue: `<template>
  <!-- Show posts from a specific community -->
  <HivePostList
    tag="hive-167922"
    sort="trending"
    show_sort_controls
    :limit="10"
  />
</template>

<script setup lang="ts">
import { HivePostList } from "@kkocot/honeycomb-vue";
</script>`,
  },
  tagFilter: {
    react: `import { HivePostList } from "@kkocot/honeycomb-react";

// Filter posts by a specific tag
function PhotographyFeed() {
  return (
    <HivePostList
      tag="photography"
      sort="created"
      limit={10}
    />
  );
}`,
    solid: `import { HivePostList } from "@kkocot/honeycomb-solid";

// Filter posts by a specific tag
function PhotographyFeed() {
  return (
    <HivePostList
      tag="photography"
      sort="created"
      limit={10}
    />
  );
}`,
    vue: `<template>
  <HivePostList
    tag="photography"
    sort="created"
    :limit="10"
  />
</template>

<script setup lang="ts">
import { HivePostList } from "@kkocot/honeycomb-vue";
</script>`,
  },
  hookUsage: {
    react: `import { useHivePostList } from "@kkocot/honeycomb-react";

function CustomFeed() {
  const {
    posts,
    is_loading,
    error,
    sort,
    set_sort,
    has_next,
    has_prev,
    next_page,
    prev_page,
    page,
  } = useHivePostList({ sort: "trending", tag: "hive", limit: 10 });

  if (is_loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {["trending", "hot", "created"].map((s) => (
          <button
            key={s}
            onClick={() => set_sort(s)}
            className={sort === s ? "font-bold" : ""}
          >
            {s}
          </button>
        ))}
      </div>

      {posts.map((post) => (
        <article key={\`\${post.author}/\${post.permlink}\`}>
          <h3>{post.title}</h3>
          <p>by @{post.author} - {post.payout_value}</p>
        </article>
      ))}

      <div className="flex gap-2 mt-4">
        <button onClick={prev_page} disabled={!has_prev}>Previous</button>
        <span>Page {page}</span>
        <button onClick={next_page} disabled={!has_next}>Next</button>
      </div>
    </div>
  );
}`,
    solid: `import { useHivePostList } from "@kkocot/honeycomb-solid";
import { For, Show } from "solid-js";

function CustomFeed() {
  const feed = useHivePostList({ sort: "trending", tag: "hive", limit: 10 });

  return (
    <Show when={!feed.is_loading} fallback={<p>Loading...</p>}>
      <div>
        <div class="flex gap-2 mb-4">
          <For each={["trending", "hot", "created"]}>
            {(s) => (
              <button
                onClick={() => feed.set_sort(s)}
                classList={{ "font-bold": feed.sort === s }}
              >
                {s}
              </button>
            )}
          </For>
        </div>

        <For each={feed.posts}>
          {(post) => (
            <article>
              <h3>{post.title}</h3>
              <p>by @{post.author} - {post.payout_value}</p>
            </article>
          )}
        </For>

        <div class="flex gap-2 mt-4">
          <button onClick={feed.prev_page} disabled={!feed.has_prev}>Previous</button>
          <span>Page {feed.page}</span>
          <button onClick={feed.next_page} disabled={!feed.has_next}>Next</button>
        </div>
      </div>
    </Show>
  );
}`,
    vue: `<template>
  <p v-if="feed.is_loading">Loading...</p>
  <div v-else>
    <div class="flex gap-2 mb-4">
      <button
        v-for="s in sorts"
        :key="s"
        :class="{ 'font-bold': feed.sort === s }"
        @click="feed.set_sort(s)"
      >
        {{ s }}
      </button>
    </div>

    <article v-for="post in feed.posts" :key="\`\${post.author}/\${post.permlink}\`">
      <h3>{{ post.title }}</h3>
      <p>by @{{ post.author }} - {{ post.payout_value }}</p>
    </article>

    <div class="flex gap-2 mt-4">
      <button :disabled="!feed.has_prev" @click="feed.prev_page">Previous</button>
      <span>Page {{ feed.page }}</span>
      <button :disabled="!feed.has_next" @click="feed.next_page">Next</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHivePostList } from "@kkocot/honeycomb-vue";

const sorts = ["trending", "hot", "created"];
const feed = useHivePostList({ sort: "trending", tag: "hive", limit: 10 });
</script>`,
  },
};
