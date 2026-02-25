<script lang="ts">
  import { HivePostList } from "@barddev/honeycomb-svelte";

  const PINNED_POSTS = [
    { author: "gtg", permlink: "hive-hardfork-28-jump-starter-kit" },
  ];
</script>

<section id="post-list" class="scroll-mt-20">
  <div class="mb-6">
    <h2 class="text-3xl font-bold mb-2">HivePostList</h2>
    <p class="text-muted-foreground">
      Paginated list of ranked Hive posts with sort controls, pinned posts, and
      multiple layout variants.
    </p>
  </div>

  <div class="space-y-6">
    <!-- Sort Controls -->
    <div class="border border-border rounded-lg p-6 bg-muted/20">
      <h3 class="text-lg font-semibold mb-4">With Sort Controls</h3>
      <HivePostList show_sort_controls={true} limit={5} />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Compact -->
      <div class="border border-border rounded-lg p-6 bg-muted/20">
        <h3 class="text-lg font-semibold mb-4">Compact Variant</h3>
        <HivePostList variant="compact" limit={5} />
      </div>

      <!-- Pinned Posts -->
      <div class="border border-border rounded-lg p-6 bg-muted/20">
        <h3 class="text-lg font-semibold mb-4">Pinned Posts</h3>
        <HivePostList
          pinned_posts={PINNED_POSTS}
          limit={5}
          variant="compact"
        />
      </div>

      <!-- Community Posts -->
      <div class="border border-border rounded-lg p-6 bg-muted/20">
        <h3 class="text-lg font-semibold mb-4">Community Posts</h3>
        <p class="text-sm text-muted-foreground mb-3">
          Filtered by LeoFinance community tag.
        </p>
        <HivePostList tag="hive-167922" limit={5} variant="compact" />
      </div>

      <!-- Tag Filter -->
      <div class="border border-border rounded-lg p-6 bg-muted/20">
        <h3 class="text-lg font-semibold mb-4">Tag Filter</h3>
        <p class="text-sm text-muted-foreground mb-3">
          Posts filtered by "photography" tag.
        </p>
        <HivePostList tag="photography" sort="created" limit={5} />
      </div>
    </div>

    <!-- Grid Variant -->
    <div class="border border-border rounded-lg p-6 bg-muted/20">
      <h3 class="text-lg font-semibold mb-4">Grid Variant</h3>
      <HivePostList variant="grid" limit={6} />
    </div>
  </div>
</section>
