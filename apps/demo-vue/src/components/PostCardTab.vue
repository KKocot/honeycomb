<template>
  <div class="space-y-6">
    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">Card Variant</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Default card with author avatar, title, content preview, and stats.
      </p>
      <div class="max-w-lg">
        <HivePostCard
          author="barddev"
          permlink="honeycomb-hive-ui-library"
        />
      </div>
    </section>

    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">Compact Variant</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Inline row with thumbnail, title, and stats. Suitable for lists.
      </p>
      <div class="space-y-3 max-w-lg">
        <HivePostCard
          v-for="post in DEMO_POSTS"
          :key="post.permlink"
          :author="post.author"
          :permlink="post.permlink"
          variant="compact"
        />
      </div>
    </section>

    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">Grid Variant</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Card optimized for grid layouts with prominent thumbnail.
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <HivePostCard
          v-for="post in DEMO_POSTS"
          :key="post.permlink"
          :author="post.author"
          :permlink="post.permlink"
          variant="grid"
        />
      </div>
    </section>

    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">Hidden Elements</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Use the hide prop to selectively remove author info and thumbnail.
      </p>
      <div class="max-w-lg">
        <HivePostCard
          author="barddev"
          permlink="honeycomb-hive-ui-library"
          :hide="['author', 'thumbnail']"
        />
      </div>
    </section>

    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">Custom Link Target</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Override the default link base URL with linkTarget prop. Links will
        point to PeakD instead of the default OpenHive blog.
      </p>
      <div class="max-w-lg">
        <HivePostCard
          author="blocktrades"
          permlink="updates-for-hive-roadmap-from-the-blocktrades-team"
          link-target="https://peakd.com"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { HivePostCard } from "@kkocot/honeycomb-vue";

const DEMO_POSTS = [
  { author: "barddev", permlink: "honeycomb-hive-ui-library" },
  {
    author: "blocktrades",
    permlink: "updates-for-hive-roadmap-from-the-blocktrades-team",
  },
];
</script>
