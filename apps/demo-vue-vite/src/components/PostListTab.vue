<template>
  <div class="space-y-6">
    <!-- Sort controls - full width, interactive -->
    <section class="border border-border rounded-lg p-4 sm:p-6 bg-muted/20">
      <h2 class="text-xl sm:text-2xl font-semibold mb-2">Sort Controls</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Interactive sort controls to browse different post rankings.
      </p>
      <HivePostList :show-sort-controls="true" :limit="5" />
    </section>

    <!-- Two-column grid for smaller demos -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <section
        class="border border-border rounded-lg p-4 sm:p-6 bg-muted/20"
      >
        <h2 class="text-xl sm:text-2xl font-semibold mb-2">
          Compact Variant
        </h2>
        <p class="text-sm text-muted-foreground mb-4">
          Default compact list ideal for post feeds.
        </p>
        <HivePostList variant="compact" :limit="5" />
      </section>

      <section
        class="border border-border rounded-lg p-4 sm:p-6 bg-muted/20"
      >
        <h2 class="text-xl sm:text-2xl font-semibold mb-2">
          Community Posts
        </h2>
        <p class="text-sm text-muted-foreground mb-4">
          Posts from a specific community (LeoFinance). Pass a community name
          as the <code class="bg-muted px-1 rounded">tag</code> prop.
        </p>
        <HivePostList tag="hive-167922" :limit="5" variant="compact" />
      </section>

      <section
        class="border border-border rounded-lg p-4 sm:p-6 bg-muted/20"
      >
        <h2 class="text-xl sm:text-2xl font-semibold mb-2">Tag Filter</h2>
        <p class="text-sm text-muted-foreground mb-4">
          Posts filtered by tag (photography). Works with any Hive tag.
        </p>
        <HivePostList tag="photography" sort="created" :limit="5" />
      </section>

      <section
        class="border border-border rounded-lg p-4 sm:p-6 bg-muted/20"
      >
        <h2 class="text-xl sm:text-2xl font-semibold mb-2">Pinned Posts</h2>
        <p class="text-sm text-muted-foreground mb-4">
          Pinned posts appear at the top with a badge.
        </p>
        <HivePostList
          :pinned-posts="PINNED_POSTS"
          :limit="5"
          variant="compact"
        />
      </section>

      <section
        class="border border-border rounded-lg p-4 sm:p-6 bg-muted/20"
      >
        <h2 class="text-xl sm:text-2xl font-semibold mb-2">
          Hidden Elements
        </h2>
        <p class="text-sm text-muted-foreground mb-4">
          Hide specific elements from post cards.
        </p>
        <HivePostList :hide="['thumbnail', 'payout']" :limit="5" />
      </section>
    </div>

    <!-- Card variant - full width -->
    <section class="border border-border rounded-lg p-4 sm:p-6 bg-muted/20">
      <h2 class="text-xl sm:text-2xl font-semibold mb-2">Card Variant</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Full card layout with thumbnails and body preview.
      </p>
      <HivePostList variant="card" :limit="3" />
    </section>

    <!-- Grid variant - full width -->
    <section class="border border-border rounded-lg p-4 sm:p-6 bg-muted/20">
      <h2 class="text-xl sm:text-2xl font-semibold mb-2">Grid Variant</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Grid layout with thumbnail-first design.
      </p>
      <HivePostList variant="grid" :limit="6" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { HivePostList } from "@barddev/honeycomb-vue";

const PINNED_POSTS = [
  { author: "gtg", permlink: "hive-hardfork-28-jump-starter-kit" },
];
</script>
