<template>
  <main class="container mx-auto p-8 max-w-4xl">
    <h1 class="text-4xl font-bold mb-8 text-hive-red">
      Honeycomb Vue Demo
    </h1>

    <nav role="tablist" class="flex border-b border-border mb-6">
      <button
        v-for="tab in TABS"
        :key="tab.id"
        role="tab"
        :id="`tab-${tab.id}`"
        :aria-selected="active_tab === tab.id"
        :aria-controls="`tabpanel-${tab.id}`"
        :class="[
          'px-4 py-2.5 text-sm font-medium transition-colors',
          active_tab === tab.id
            ? 'border-b-2 border-hive-red text-hive-red'
            : 'text-muted-foreground hover:text-foreground',
        ]"
        @click="active_tab = tab.id"
      >
        {{ tab.label }}
      </button>
    </nav>

    <div
      role="tabpanel"
      :id="`tabpanel-${active_tab}`"
      :aria-labelledby="`tab-${active_tab}`"
    >
      <ApiTrackerTab v-if="active_tab === 'api-tracker'" />
      <HooksTab v-else-if="active_tab === 'hooks'" />
      <AvatarTab v-else-if="active_tab === 'avatar'" />
      <UserCardTab v-else-if="active_tab === 'user-card'" />
      <BalanceCardTab v-else-if="active_tab === 'balance-card'" />
      <ManabarTab v-else-if="active_tab === 'manabar'" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ApiTrackerTab from "./ApiTrackerTab.vue";
import HooksTab from "./HooksTab.vue";
import AvatarTab from "./AvatarTab.vue";
import UserCardTab from "./UserCardTab.vue";
import BalanceCardTab from "./BalanceCardTab.vue";
import ManabarTab from "./ManabarTab.vue";

type TabId = "api-tracker" | "hooks" | "avatar" | "user-card" | "balance-card" | "manabar";

const TABS: readonly { id: TabId; label: string }[] = [
  { id: "api-tracker", label: "API Tracker" },
  { id: "hooks", label: "Hooks" },
  { id: "avatar", label: "Avatar" },
  { id: "user-card", label: "User Card" },
  { id: "balance-card", label: "Balance Card" },
  { id: "manabar", label: "Manabar" },
];

const active_tab = ref<TabId>("api-tracker");
</script>
