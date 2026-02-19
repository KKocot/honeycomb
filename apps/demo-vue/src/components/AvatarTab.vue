<template>
  <div class="space-y-6">
    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">Sizes</h2>
      <p class="text-sm text-muted-foreground mb-4">
        All available avatar sizes from xs to xl.
      </p>
      <div class="flex items-end gap-6">
        <div
          v-for="size in SIZES"
          :key="size"
          class="flex flex-col items-center gap-2"
        >
          <HiveAvatar username="blocktrades" :size="size" />
          <span class="text-xs text-muted-foreground">{{ size }}</span>
        </div>
      </div>
    </section>

    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">With Border</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Ring border for emphasis or selection state.
      </p>
      <div class="flex items-center gap-6">
        <HiveAvatar username="blocktrades" size="lg" />
        <HiveAvatar username="blocktrades" size="lg" :showBorder="true" />
      </div>
    </section>

    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">Overlapping Stack</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Avatars stacked with overlap, commonly used for team members or PR
        reviewers.
      </p>
      <div class="flex -space-x-3">
        <HiveAvatar
          v-for="user in DEMO_USERS"
          :key="user"
          :username="user"
          size="lg"
          :showBorder="true"
          class="ring-background"
        />
      </div>
    </section>

    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">With Status Indicator</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Wrap avatar in a relative container to add online/offline indicators.
      </p>
      <div class="flex items-center gap-6">
        <div class="relative">
          <HiveAvatar username="blocktrades" size="lg" />
          <span
            class="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-background"
          />
        </div>
        <div class="relative">
          <HiveAvatar username="barddev" size="lg" />
          <span
            class="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-muted-foreground ring-2 ring-background"
          />
        </div>
        <div class="relative">
          <HiveAvatar username="arcange" size="lg" />
          <span
            class="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-yellow-500 ring-2 ring-background"
          />
        </div>
      </div>
    </section>

    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">Avatar Group</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Stacked avatars with a "+N more" counter badge.
      </p>
      <div class="flex -space-x-2 items-center">
        <HiveAvatar
          v-for="user in DEMO_USERS.slice(0, 3)"
          :key="user"
          :username="user"
          size="md"
          :showBorder="true"
          class="ring-background"
        />
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground ring-2 ring-background"
        >
          +{{ DEMO_USERS.length - 3 }}
        </div>
      </div>
    </section>

    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">Custom Fallback Colors</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Override auto-generated fallback color with the fallbackColor prop.
      </p>
      <div class="flex items-center gap-4">
        <HiveAvatar username="no-avatar-user-a" size="lg" fallbackColor="#E31337" />
        <HiveAvatar username="no-avatar-user-b" size="lg" fallbackColor="#3B82F6" />
        <HiveAvatar username="no-avatar-user-c" size="lg" fallbackColor="#10B981" />
        <HiveAvatar username="no-avatar-user-d" size="lg" fallbackColor="#8B5CF6" />
      </div>
    </section>

    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">Fallback Initials</h2>
      <p class="text-sm text-muted-foreground mb-4">
        When profile image is unavailable, avatar shows user initials with
        auto-generated color.
      </p>
      <div class="flex items-end gap-6">
        <div
          v-for="size in SIZES"
          :key="size"
          class="flex flex-col items-center gap-2"
        >
          <HiveAvatar username="this-user-does-not-exist-xyz" :size="size" />
          <span class="text-xs text-muted-foreground">{{ size }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { HiveAvatar } from "@barddev/honeycomb-vue";
import type { AvatarSize } from "@barddev/honeycomb-vue";

const DEMO_USERS = ["blocktrades", "barddev", "arcange", "good-karma", "therealwolf"];
const SIZES: readonly AvatarSize[] = ["xs", "sm", "md", "lg", "xl"];
</script>
