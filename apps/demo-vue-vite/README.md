# Honeycomb Vue Demo (Vite)

Interactive demo of `@hiveio/honeycomb-vue` components in a **Vite + Vue 3** SPA.

**Dev server:** http://localhost:3033/demo/vue-vite/

## Adding @hiveio/honeycomb-vue to a Vite + Vue project

### 1. Create a Vite app

```bash
npm create vite@latest my-hive-app -- --template vue-ts
cd my-hive-app
```

### 2. Install dependencies

```bash
npm install @hiveio/honeycomb-vue @kkocot/honeycomb-core highlight.js
npm install -D @tailwindcss/postcss @tailwindcss/typography postcss tailwindcss
```

Peer dependencies:
- `@kkocot/honeycomb-core` - core types and utilities
- `highlight.js` - optional, for code syntax highlighting in ContentRenderer

`radix-vue` is bundled as a dependency of `@hiveio/honeycomb-vue` and installed automatically.

### 3. Configure PostCSS

```js
// postcss.config.js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

### 4. Set up CSS

Replace `src/style.css`:

```css
@import "tailwindcss";
@import "@hiveio/honeycomb-vue/theme.css";

@plugin "@tailwindcss/typography";
```

- `theme.css` registers `hive-*` color tokens in Tailwind (e.g. `bg-hive-card`, `text-hive-foreground`)
- `@tailwindcss/typography` is optional, needed only for `HiveContentRenderer`

### 5. Set up the entry point

```ts
// src/main.ts
import { createApp } from "vue";
import App from "./App.vue";
import "@hiveio/honeycomb-vue/styles.css";
import "./style.css";

createApp(App).mount("#app");
```

**Import order matters:**

1. `styles.css` first - CSS variables, component styles, and pre-compiled Tailwind utilities
2. `style.css` second - your Tailwind setup with `theme.css` for `hive-*` utility classes

### 6. Wrap your app with HiveProvider

```vue
<!-- src/App.vue -->
<template>
  <HiveProvider>
    <HomePage />
  </HiveProvider>
</template>

<script setup lang="ts">
import { HiveProvider } from "@hiveio/honeycomb-vue";
import HomePage from "./pages/index.vue";
</script>
```

### 7. Use components in a page

```vue
<!-- src/pages/index.vue -->
<template>
  <div class="space-y-6 p-8">
    <p v-if="isLoading">Connecting...</p>
    <template v-else>
      <HiveAvatar username="blocktrades" size="lg" />
      <HiveUserCard username="blocktrades" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { HiveAvatar, HiveUserCard } from "@hiveio/honeycomb-vue";
import { useHive } from "@hiveio/honeycomb-vue";

const { isLoading } = useHive();
</script>
```

Vue uses `<script setup>` with auto-registration - imported components are available in the template automatically.

## Key differences vs React

| Aspect | React (Vite) | Vue 3 (Vite) |
|--------|-------------|--------------|
| Package | `@hiveio/honeycomb-react` | `@hiveio/honeycomb-vue` |
| Entry | `createRoot().render()` | `createApp().mount()` |
| Components | JSX functions | `.vue` SFC with `<template>` + `<script setup>` |
| Reactivity | `useState` / `useEffect` | `ref()` / `computed()` / `watch()` |
| Hooks/Composables | `useHive()`, `useAccount()` | `useHive()`, `useAccount()` (same API) |
| Vite plugin | `@vitejs/plugin-react` | `@vitejs/plugin-vue` |

## Scripts

```bash
pnpm dev        # Start dev server (port 3033)
pnpm build      # Production build (includes vue-tsc type check)
pnpm test       # Run Playwright tests
```
