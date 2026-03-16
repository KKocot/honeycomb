<script lang="ts">
  import { HiveAvatar } from "@hiveio/honeycomb-svelte";
  import type { AvatarSize } from "@hiveio/honeycomb-svelte";

  const DEMO_USERS = [
    "barddev",
    "blocktrades",
    "arcange",
    "good-karma",
    "therealwolf",
  ];
  const SIZES: readonly AvatarSize[] = ["xs", "sm", "md", "lg", "xl"];
</script>

<section id="avatar" class="scroll-mt-20">
  <div class="mb-6">
    <h2 class="text-3xl font-bold mb-2">HiveAvatar</h2>
    <p class="text-muted-foreground">
      User avatars fetched from Hive blockchain with multiple sizes, borders,
      and fallback initials.
    </p>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Sizes -->
    <div class="border border-border rounded-lg p-6 bg-muted/20">
      <h3 class="text-lg font-semibold mb-4">Sizes</h3>
      <div class="flex items-end gap-6">
        {#each SIZES as size}
          <div class="flex flex-col items-center gap-2">
            <HiveAvatar username="blocktrades" {size} />
            <span class="text-xs text-muted-foreground">{size}</span>
          </div>
        {/each}
      </div>
    </div>

    <!-- With Border -->
    <div class="border border-border rounded-lg p-6 bg-muted/20">
      <h3 class="text-lg font-semibold mb-4">With Border</h3>
      <div class="flex items-center gap-6">
        <div class="flex flex-col items-center gap-2">
          <HiveAvatar username="blocktrades" size="lg" />
          <span class="text-xs text-muted-foreground">default</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <HiveAvatar username="blocktrades" size="lg" showBorder />
          <span class="text-xs text-muted-foreground">showBorder</span>
        </div>
      </div>
    </div>

    <!-- Overlapping Stack -->
    <div class="border border-border rounded-lg p-6 bg-muted/20">
      <h3 class="text-lg font-semibold mb-4">Overlapping Stack</h3>
      <div class="flex -space-x-3">
        {#each DEMO_USERS as user}
          <HiveAvatar
            username={user}
            size="lg"
            showBorder
            class="ring-background"
          />
        {/each}
      </div>
    </div>

    <!-- Fallback Colors -->
    <div class="border border-border rounded-lg p-6 bg-muted/20">
      <h3 class="text-lg font-semibold mb-4">Fallback Colors</h3>
      <div class="flex items-center gap-4">
        <HiveAvatar
          username="no-avatar-user-a"
          size="lg"
          fallbackColor="#E31337"
        />
        <HiveAvatar
          username="no-avatar-user-b"
          size="lg"
          fallbackColor="#3B82F6"
        />
        <HiveAvatar
          username="no-avatar-user-c"
          size="lg"
          fallbackColor="#10B981"
        />
        <HiveAvatar
          username="no-avatar-user-d"
          size="lg"
          fallbackColor="#8B5CF6"
        />
      </div>
    </div>

    <!-- Avatar Group -->
    <div class="border border-border rounded-lg p-6 bg-muted/20">
      <h3 class="text-lg font-semibold mb-4">Avatar Group</h3>
      <div class="flex -space-x-2 items-center">
        {#each DEMO_USERS.slice(0, 3) as user}
          <HiveAvatar
            username={user}
            size="md"
            showBorder
            class="ring-background"
          />
        {/each}
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground ring-2 ring-background"
        >
          +{DEMO_USERS.length - 3}
        </div>
      </div>
    </div>

    <!-- Fallback Initials -->
    <div class="border border-border rounded-lg p-6 bg-muted/20">
      <h3 class="text-lg font-semibold mb-4">Fallback Initials</h3>
      <div class="flex items-end gap-6">
        {#each SIZES as size}
          <div class="flex flex-col items-center gap-2">
            <HiveAvatar username="this-user-does-not-exist-xyz" {size} />
            <span class="text-xs text-muted-foreground">{size}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
