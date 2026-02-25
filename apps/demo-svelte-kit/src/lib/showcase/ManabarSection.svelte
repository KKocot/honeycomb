<script lang="ts">
  import { HiveManabar } from "@barddev/honeycomb-svelte";

  const USERS = ["barddev", "blocktrades", "arcange"];
</script>

<section id="manabar" class="scroll-mt-20">
  <div class="mb-6">
    <h2 class="text-3xl font-bold mb-2">HiveManabar</h2>
    <p class="text-muted-foreground">
      Resource Credits and voting mana visualization in full, compact, and ring
      variants.
    </p>
  </div>

  <div class="space-y-6">
    <!-- Full -->
    <div class="border border-border rounded-lg p-6 bg-muted/20">
      <h3 class="text-lg font-semibold mb-4">Full Variant</h3>
      <p class="text-sm text-muted-foreground mb-4">
        Three rings showing Voting Power, Downvote, and Resource Credits.
      </p>
      <HiveManabar username="blocktrades" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Compact -->
      <div class="border border-border rounded-lg p-6 bg-muted/20">
        <h3 class="text-lg font-semibold mb-4">Compact Variant</h3>
        <HiveManabar username="blocktrades" variant="compact" />
      </div>

      <!-- Ring -->
      <div class="border border-border rounded-lg p-6 bg-muted/20">
        <h3 class="text-lg font-semibold mb-4">Ring Variant</h3>
        <HiveManabar username="blocktrades" variant="ring" />
      </div>
    </div>

    <!-- With Values -->
    <div class="border border-border rounded-lg p-6 bg-muted/20">
      <h3 class="text-lg font-semibold mb-4">With Values</h3>
      <HiveManabar username="blocktrades" showValues />
    </div>

    <!-- Multiple Users -->
    <div class="border border-border rounded-lg p-6 bg-muted/20">
      <h3 class="text-lg font-semibold mb-4">Multiple Users</h3>
      <div class="space-y-3">
        {#each USERS as user}
          <div class="flex items-center gap-3">
            <span class="text-sm font-medium w-28">@{user}</span>
            <HiveManabar username={user} variant="compact" />
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
