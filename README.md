# Honeycomb

**A multi-framework component library for Hive Blockchain applications.**

![npm react](https://img.shields.io/npm/v/@hiveio/honeycomb-react)
![npm solid](https://img.shields.io/npm/v/@hiveio/honeycomb-solid)
![npm vue](https://img.shields.io/npm/v/@hiveio/honeycomb-vue)
![npm svelte](https://img.shields.io/npm/v/@hiveio/honeycomb-svelte)
![license](https://img.shields.io/badge/license-MIT-blue)

Honeycomb provides ready-to-use UI components, data hooks, and blockchain connectivity for Hive applications. It ships framework-specific packages for React, Solid.js, Vue 3, and Svelte 5 -- all sharing a common core with consistent APIs.

**Documentation:** [honeycomb.bard-dev.com](https://honeycomb.bard-dev.com)
**npm:** [@hiveio/honeycomb-react](https://www.npmjs.com/package/@hiveio/honeycomb-react) | [@hiveio/honeycomb-solid](https://www.npmjs.com/package/@hiveio/honeycomb-solid) | [@hiveio/honeycomb-vue](https://www.npmjs.com/package/@hiveio/honeycomb-vue) | [@hiveio/honeycomb-svelte](https://www.npmjs.com/package/@hiveio/honeycomb-svelte)

---

## Features

- **Multi-framework** -- React 19, Solid.js 1.9, Vue 3, Svelte 5
- **UI components** -- Avatar, UserCard, BalanceCard, Manabar, PostCard, PostList, ContentRenderer
- **Data hooks / composables** -- useHiveAccount, useHivePost, useHivePostList
- **API endpoint health checking** with automatic fallback
- **Content rendering** with Markdown support, media embeds, XSS sanitization
- **Theming** via CSS variables (Tailwind CSS optional)
- **SSR compatible**
- **TypeScript first**

---

## Quick Start

### React

```bash
npm install @hiveio/honeycomb-react @hiveio/wax
```

```tsx
import { HiveProvider, useHiveAccount, HiveAvatar } from "@hiveio/honeycomb-react";
import "@hiveio/honeycomb-react/styles.css";

function App() {
  return (
    <HiveProvider>
      <Profile username="blocktrades" />
    </HiveProvider>
  );
}

function Profile({ username }: { username: string }) {
  const { account, is_loading } = useHiveAccount(username);
  if (is_loading) return <p>Loading...</p>;
  return (
    <div>
      <HiveAvatar username={username} size="lg" />
      <p>{account?.name} (rep: {account?.reputation})</p>
    </div>
  );
}
```

[Full React documentation](https://honeycomb.bard-dev.com/docs/react/introduction)

### Solid

```bash
npm install @hiveio/honeycomb-solid @hiveio/wax
```

```tsx
import { HiveProvider, useHiveAccount, HiveAvatar } from "@hiveio/honeycomb-solid";
import "@hiveio/honeycomb-solid/styles.css";
import { Show } from "solid-js";

function App() {
  return (
    <HiveProvider>
      <Profile username="blocktrades" />
    </HiveProvider>
  );
}

function Profile(props: { username: string }) {
  const { account, is_loading } = useHiveAccount(() => props.username);
  return (
    <div>
      <HiveAvatar username={props.username} size="lg" />
      <Show when={!is_loading()} fallback={<p>Loading...</p>}>
        <p>{account()?.name} (rep: {account()?.reputation})</p>
      </Show>
    </div>
  );
}
```

[Full Solid documentation](https://honeycomb.bard-dev.com/docs/solid/introduction)

### Vue

```bash
npm install @hiveio/honeycomb-vue @hiveio/wax
```

**App.vue:**

```vue
<script setup lang="ts">
import { HiveProvider } from "@hiveio/honeycomb-vue";
import "@hiveio/honeycomb-vue/styles.css";
import Profile from "./Profile.vue";
</script>

<template>
  <HiveProvider>
    <Profile username="blocktrades" />
  </HiveProvider>
</template>
```

**Profile.vue:**

```vue
<script setup lang="ts">
import { useHiveAccount, HiveAvatar } from "@hiveio/honeycomb-vue";

const props = defineProps<{ username: string }>();
const { account, isLoading } = useHiveAccount(() => props.username);
</script>

<template>
  <div>
    <HiveAvatar :username="username" size="lg" />
    <p v-if="isLoading">Loading...</p>
    <p v-else>{{ account?.name }} (rep: {{ account?.reputation }})</p>
  </div>
</template>
```

[Full Vue documentation](https://honeycomb.bard-dev.com/docs/vue/introduction)

### Svelte

```bash
npm install @hiveio/honeycomb-svelte @hiveio/wax
```

**App.svelte:**

```svelte
<script lang="ts">
  import { HiveProvider } from "@hiveio/honeycomb-svelte";
  import "@hiveio/honeycomb-svelte/styles.css";
  import Profile from "./Profile.svelte";
</script>

<HiveProvider>
  <Profile username="blocktrades" />
</HiveProvider>
```

**Profile.svelte:**

```svelte
<script lang="ts">
  import { useHiveAccount, HiveAvatar } from "@hiveio/honeycomb-svelte";

  const { username } = $props<{ username: string }>();
  const hive_account = useHiveAccount(username);
</script>

<HiveAvatar {username} size="lg" />
{#if hive_account.is_loading}
  <p>Loading...</p>
{:else}
  <p>{hive_account.account?.name} (rep: {hive_account.account?.reputation})</p>
{/if}
```

[Full Svelte documentation](https://honeycomb.bard-dev.com/docs/svelte/introduction)

---

## Packages

| Package | Version | Description |
|---------|---------|-------------|
| [@hiveio/honeycomb-react](https://www.npmjs.com/package/@hiveio/honeycomb-react) | ![npm](https://img.shields.io/npm/v/@hiveio/honeycomb-react) | React 19 components and hooks |
| [@hiveio/honeycomb-solid](https://www.npmjs.com/package/@hiveio/honeycomb-solid) | ![npm](https://img.shields.io/npm/v/@hiveio/honeycomb-solid) | Solid.js components and hooks |
| [@hiveio/honeycomb-vue](https://www.npmjs.com/package/@hiveio/honeycomb-vue) | ![npm](https://img.shields.io/npm/v/@hiveio/honeycomb-vue) | Vue 3 composables and components |
| [@hiveio/honeycomb-svelte](https://www.npmjs.com/package/@hiveio/honeycomb-svelte) | ![npm](https://img.shields.io/npm/v/@hiveio/honeycomb-svelte) | Svelte 5 components and hooks (runes) |
| @kkocot/honeycomb-core | -- | Framework-agnostic core (internal) |
| @kkocot/honeycomb-renderer | -- | Content renderer with plugin system (internal) |

---

## Components and Hooks

### Components

| Component | Description |
|-----------|-------------|
| HiveProvider | Context provider -- manages blockchain connection |
| HiveAvatar | User avatar from Hive CDN |
| UserCard | User profile card (avatar, name, reputation) |
| BalanceCard | Token balances (HIVE, HBD, HP) |
| HiveManabar | Resource Credits / Voting Power bar |
| HivePostCard | Blog post card (thumbnail, title, author, payout) |
| HivePostList | Paginated post list with sorting |
| HiveContentRenderer | Markdown/HTML renderer with media embeds and XSS sanitization |
| ApiTracker | API endpoint status display |
| HealthCheckerComponent | Health checker management panel (React only) |

### Hooks

| Hook | Description |
|------|-------------|
| useHive | Full context (chain, status, endpoints) |
| useHiveChain | Wax chain instance |
| useApiEndpoint | Current API endpoint URL |
| useHiveStatus | Connection status and endpoints |
| useHiveAccount | Fetch account data (balance, reputation, HP) |
| useHivePost | Fetch single post |
| useHivePostList | Paginated post list with cursor navigation |

React, Solid.js, and Svelte use snake_case naming (e.g. `is_loading`, `post_count`). Vue uses camelCase (e.g. `isLoading`, `postCount`) following Vue ecosystem conventions. See the [documentation](https://honeycomb.bard-dev.com) for framework-specific API details.

---

## Demo Apps

| Demo | Framework | Live |
|------|-----------|------|
| demo-react-next | Next.js 15 | [View](https://honeycomb.bard-dev.com/demo/react-next) |
| demo-react-vite | Vite + React | [View](https://honeycomb.bard-dev.com/demo/react-vite) |
| demo-react-astro | Astro + React | [View](https://honeycomb.bard-dev.com/demo/react-astro) |
| demo-react-remix | React Router 7 | [View](https://honeycomb.bard-dev.com/demo/react-remix) |
| demo-solid-vite | Vite + Solid.js | [View](https://honeycomb.bard-dev.com/demo/solid-vite) |
| demo-solid-astro | Astro + Solid.js | [View](https://honeycomb.bard-dev.com/demo/solid-astro) |
| demo-solid-start | SolidStart | [View](https://honeycomb.bard-dev.com/demo/solid-start) |
| demo-svelte-vite | Vite + Svelte 5 | [View](https://honeycomb.bard-dev.com/demo/svelte-vite) |
| demo-svelte-kit | SvelteKit 2 | [View](https://honeycomb.bard-dev.com/demo/svelte-kit) |
| demo-svelte-astro | Astro + Svelte 5 | [View](https://honeycomb.bard-dev.com/demo/svelte-astro) |
| demo-vue-vite | Vite + Vue 3 | [View](https://honeycomb.bard-dev.com/demo/vue-vite) |
| demo-vue-nuxt | Nuxt 3 | [View](https://honeycomb.bard-dev.com/demo/vue-nuxt) |
| demo-vue-astro | Astro + Vue 3 | [View](https://honeycomb.bard-dev.com/demo/vue-astro) |

---

## Monorepo Structure

```
honeycomb/
├── apps/
│   ├── docs/                  # Next.js 15 documentation site
│   ├── demo-react-next/       # Next.js demo
│   ├── demo-react-vite/       # Vite + React demo
│   ├── demo-react-astro/      # Astro + React demo
│   ├── demo-react-remix/      # React Router 7 demo
│   ├── demo-solid-vite/       # Vite + Solid demo
│   ├── demo-solid-astro/      # Astro + Solid demo
│   ├── demo-solid-start/      # SolidStart demo
│   ├── demo-svelte-vite/      # Vite + Svelte demo
│   ├── demo-svelte-kit/       # SvelteKit demo
│   ├── demo-svelte-astro/     # Astro + Svelte demo
│   ├── demo-vue-vite/         # Vite + Vue demo
│   ├── demo-vue-nuxt/         # Nuxt 3 demo
│   └── demo-vue-astro/        # Astro + Vue demo
├── packages/
│   ├── core/                  # Framework-agnostic core (HiveClient, types, utils)
│   ├── renderer/              # Content renderer (Markdown, sanitization, plugins)
│   ├── react/                 # React 19 package
│   ├── solid/                 # Solid.js package
│   ├── vue/                   # Vue 3 package
│   └── svelte/                # Svelte 5 package
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## Development

```bash
# Install dependencies
pnpm install

# Run everything in dev mode
pnpm dev

# Run specific apps
pnpm dev:docs              # Documentation (port 3030)
pnpm dev:demo-react-next   # React Next.js demo (port 3031)

# Build all packages and apps
pnpm build

# Lint
pnpm lint
```

### Versioning (Changesets)

```bash
pnpm changeset             # Create a changeset
pnpm version-packages      # Bump versions
pnpm release               # Publish to npm
```

All four framework packages are version-linked -- bumping one bumps all.

---

## License

[MIT](./LICENSE)
