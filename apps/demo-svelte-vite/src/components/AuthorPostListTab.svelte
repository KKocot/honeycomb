<script lang="ts">
  import { HiveAuthorPostList } from "@hiveio/honeycomb-svelte";
</script>

<div class="space-y-6">
  <!-- Default - full width -->
  <section class="border border-border rounded-lg p-4 sm:p-6 bg-muted/20">
    <h2 class="text-xl sm:text-2xl font-semibold mb-2">
      Default (account="barddev")
    </h2>
    <p class="text-sm text-muted-foreground mb-4">
      Default compact list. Browse top-level posts from a specific Hive author.
    </p>
    <HiveAuthorPostList account="barddev" limit={5} />
  </section>

  <!-- Two-column grid for smaller demos -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <section class="border border-border rounded-lg p-4 sm:p-6 bg-muted/20">
      <h3 class="text-lg sm:text-xl font-semibold mb-2">With Tag Filter</h3>
      <p class="text-sm text-muted-foreground mb-4">
        Posts from <code class="bg-muted px-1 rounded">thebeedevs</code>
        filtered by tag <code class="bg-muted px-1 rounded">wax</code>.
      </p>
      <HiveAuthorPostList account="thebeedevs" tag="wax" limit={5} />
    </section>

    <section class="border border-border rounded-lg p-4 sm:p-6 bg-muted/20">
      <h3 class="text-lg sm:text-xl font-semibold mb-2">
        Card Variant (account="gtg")
      </h3>
      <p class="text-sm text-muted-foreground mb-4">
        Full card layout with thumbnails and body preview.
      </p>
      <HiveAuthorPostList account="gtg" variant="card" limit={3} />
    </section>
  </div>

  <!-- Grid variant - full width, responsive grid inside -->
  <section class="border border-border rounded-lg p-4 sm:p-6 bg-muted/20">
    <h2 class="text-xl sm:text-2xl font-semibold mb-2">
      Grid Variant (account="thebeedevs")
    </h2>
    <p class="text-sm text-muted-foreground mb-4">
      Grid layout with thumbnail-first design.
    </p>
    <HiveAuthorPostList account="thebeedevs" variant="grid" limit={6} />
  </section>
</div>
