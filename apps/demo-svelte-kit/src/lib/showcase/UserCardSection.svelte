<script lang="ts">
  import { UserCard } from "@barddev/honeycomb-svelte";

  const DEMO_USERS = ["barddev", "blocktrades", "good-karma", "arcange"];
</script>

<section id="user-card" class="scroll-mt-20">
  <div class="mb-6">
    <h2 class="text-3xl font-bold mb-2">UserCard</h2>
    <p class="text-muted-foreground">
      Displays Hive user profile information in compact, default, and expanded
      variants.
    </p>
  </div>

  <div class="space-y-6">
    <!-- Compact -->
    <div class="border border-border rounded-lg p-6 bg-muted/20">
      <h3 class="text-lg font-semibold mb-4">Compact Variant</h3>
      <div class="space-y-2">
        {#each DEMO_USERS as user}
          <UserCard username={user} variant="compact" />
        {/each}
      </div>
    </div>

    <!-- Default Grid -->
    <div class="border border-border rounded-lg p-6 bg-muted/20">
      <h3 class="text-lg font-semibold mb-4">Default Variant</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {#each DEMO_USERS as user}
          <UserCard username={user} />
        {/each}
      </div>
    </div>

    <!-- Expanded -->
    <div class="border border-border rounded-lg p-6 bg-muted/20">
      <h3 class="text-lg font-semibold mb-4">Expanded Variant</h3>
      <div class="max-w-md">
        <UserCard username="blocktrades" variant="expanded" />
      </div>
    </div>

    <!-- Without Stats -->
    <div class="border border-border rounded-lg p-6 bg-muted/20">
      <h3 class="text-lg font-semibold mb-4">Without Stats</h3>
      <div class="max-w-sm">
        <UserCard username="barddev" showStats={false} />
      </div>
    </div>
  </div>
</section>
