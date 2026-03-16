# Honeycomb Vue

[![npm version](https://img.shields.io/npm/v/@hiveio/honeycomb-vue)](https://www.npmjs.com/package/@hiveio/honeycomb-vue) [![license](https://img.shields.io/npm/l/@hiveio/honeycomb-vue)](https://github.com/KKocot/honeycomb/blob/main/LICENSE)

Vue 3 composables and components for Hive Blockchain applications. Read-only (passive) - displays blockchain data without auth or transaction signing.

[Documentation](https://honeycomb.bard-dev.com/docs/vue/introduction) | [GitHub](https://github.com/KKocot/honeycomb) | [npm](https://www.npmjs.com/package/@hiveio/honeycomb-vue)

## Installation

```bash
npm install @hiveio/honeycomb-vue
# or
pnpm add @hiveio/honeycomb-vue
# or
yarn add @hiveio/honeycomb-vue
# or
bun add @hiveio/honeycomb-vue
```

### Peer Dependencies

```bash
npm install @hiveio/wax radix-vue vue
# or
pnpm add @hiveio/wax radix-vue vue
# or
yarn add @hiveio/wax radix-vue vue
# or
bun add @hiveio/wax radix-vue vue
```

`radix-vue` is only required if you use the `ApiTracker` component (optional peer dependency).

### Styles

Import the bundled stylesheet in your entry file (e.g. `main.ts`):

```ts
import "@hiveio/honeycomb-vue/styles.css";
```

Includes CSS variables, component styles, Tailwind utilities, and theme tokens.

## Quick Start

```vue
<!-- App.vue -->
<script setup lang="ts">
import { HiveProvider } from "@hiveio/honeycomb-vue";
import "@hiveio/honeycomb-vue/styles.css";
</script>

<template>
  <HiveProvider>
    <router-view />
  </HiveProvider>
</template>
```

```vue
<!-- Page.vue -->
<script setup lang="ts">
import { useHive, HiveAvatar, UserCard } from "@hiveio/honeycomb-vue";

const { chain, isLoading, error, status } = useHive();
</script>

<template>
  <div v-if="isLoading">Connecting to Hive...</div>
  <div v-else-if="error">Error: {{ error }}</div>
  <div v-else>
    <p>Status: {{ status }}</p>
    <HiveAvatar username="blocktrades" size="lg" />
    <UserCard username="blocktrades" variant="expanded" />
  </div>
</template>
```

## Documentation

Full API reference, live examples, and guides:

**[honeycomb.bard-dev.com/docs/vue/introduction](https://honeycomb.bard-dev.com/docs/vue/introduction)**

- HiveProvider configuration
- Composables API
- Components (HiveAvatar, UserCard, BalanceCard, ApiTracker, HiveManabar, HivePostCard, HivePostList, HiveContentRenderer)
- SSR compatibility
- TypeScript types

## License

MIT
