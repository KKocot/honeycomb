<script lang="ts">
  import { HiveAuthorPostList } from "@hiveio/honeycomb-svelte";
</script>

<section id="author-post-list" class="scroll-mt-20">
  <div class="mb-6">
    <h2 class="text-3xl font-bold mb-2">HiveAuthorPostList</h2>
    <p class="text-muted-foreground">
      Paginated list of posts from a specific Hive author with optional tag
      filtering and multiple layout variants.
    </p>
  </div>

  <div class="space-y-6">
    <!-- Default -->
    <div class="border border-border rounded-lg p-6 bg-muted/20">
      <h3 class="text-lg font-semibold mb-4">Default (account="barddev")</h3>
      <HiveAuthorPostList account="barddev" limit={5} />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Tag Filter -->
      <div class="border border-border rounded-lg p-6 bg-muted/20">
        <h3 class="text-lg font-semibold mb-4">With Tag Filter</h3>
        <p class="text-sm text-muted-foreground mb-3">
          Posts from <code class="bg-muted px-1 rounded">thebeedevs</code>
          filtered by tag <code class="bg-muted px-1 rounded">wax</code>.
        </p>
        <HiveAuthorPostList account="thebeedevs" tag="wax" limit={5} />
      </div>

      <!-- Card Variant -->
      <div class="border border-border rounded-lg p-6 bg-muted/20">
        <h3 class="text-lg font-semibold mb-4">Card Variant (account="gtg")</h3>
        <p class="text-sm text-muted-foreground mb-3">
          Full card layout with thumbnails and body preview.
        </p>
        <HiveAuthorPostList account="gtg" variant="card" limit={3} />
      </div>
    </div>

    <!-- Grid Variant -->
    <div class="border border-border rounded-lg p-6 bg-muted/20">
      <h3 class="text-lg font-semibold mb-4">
        Grid Variant (account="thebeedevs")
      </h3>
      <HiveAuthorPostList account="thebeedevs" variant="grid" limit={6} />
    </div>
  </div>
</section>
