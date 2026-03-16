# Honeycomb Svelte Demo (Vite)

Interactive demo of `@hiveio/honeycomb-svelte` components in a **Vite + Svelte 5** SPA.

**Dev server:** http://localhost:3041/demo/svelte-vite/

## Adding @hiveio/honeycomb-svelte to a Vite + Svelte project

### 1. Create a Vite app

```bash
npm create vite@latest my-hive-app -- --template svelte-ts
cd my-hive-app
```

### 2. Install dependencies

```bash
npm install @hiveio/honeycomb-svelte @kkocot/honeycomb-core highlight.js
npm install -D @tailwindcss/postcss @tailwindcss/typography postcss tailwindcss
```

Peer dependencies:
- `@kkocot/honeycomb-core` - core types and utilities
- `highlight.js` - optional, for code syntax highlighting in ContentRenderer

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

Replace `src/app.css`:

```css
@import "tailwindcss";
@import "@hiveio/honeycomb-svelte/theme.css";

@plugin "@tailwindcss/typography";
```

- `theme.css` registers `hive-*` color tokens in Tailwind (e.g. `bg-hive-card`, `text-hive-foreground`)
- `@tailwindcss/typography` is optional, needed only for `HiveContentRenderer`

### 5. Set up the entry point

```ts
// src/main.ts
import { mount } from "svelte";
import App from "./App.svelte";
import "@hiveio/honeycomb-svelte/styles.css";
import "./app.css";

const root_element = document.getElementById("root");

if (!root_element) {
  throw new Error("Root element not found");
}

mount(App, { target: root_element });
```

**Import order matters:**

1. `styles.css` first - CSS variables, component styles, and pre-compiled Tailwind utilities
2. `app.css` second - your Tailwind setup with `theme.css` for `hive-*` utility classes

Svelte 5 uses `mount()` instead of the old `new App({ target })` constructor.

### 6. Use components

```svelte
<!-- src/App.svelte -->
<script lang="ts">
  import { HiveProvider, HiveAvatar, HiveUserCard } from "@hiveio/honeycomb-svelte";
</script>

<HiveProvider>
  <div class="space-y-6 p-8">
    <HiveAvatar username="blocktrades" size="lg" />
    <HiveUserCard username="blocktrades" />
  </div>
</HiveProvider>
```

## Key differences vs React

| Aspect | React (Vite) | Svelte 5 (Vite) |
|--------|-------------|------------------|
| Package | `@hiveio/honeycomb-react` | `@hiveio/honeycomb-svelte` |
| Entry | `createRoot().render()` | `mount(App, { target })` |
| Components | JSX functions | `.svelte` SFC with `<script>` + template |
| Reactivity | `useState` / `useEffect` | `$state` / `$derived` / `$effect` |
| Vite plugin | `@vitejs/plugin-react` | `@sveltejs/vite-plugin-svelte` |

## Scripts

```bash
pnpm dev        # Start dev server (port 3041)
pnpm build      # Production build
pnpm test       # Run Playwright tests
```
