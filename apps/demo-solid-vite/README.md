# Honeycomb Solid Demo (Vite)

Interactive demo of `@hiveio/honeycomb-solid` components in a **Vite + Solid.js** SPA.

**Dev server:** http://localhost:3032/demo/solid-vite/

## Adding @hiveio/honeycomb-solid to a Vite + Solid.js project

### 1. Create a Vite app

```bash
npx degit solidjs/templates/ts my-hive-app
cd my-hive-app
npm install
```

### 2. Install dependencies

```bash
npm install @hiveio/honeycomb-solid @kkocot/honeycomb-core highlight.js
npm install -D @tailwindcss/postcss @tailwindcss/typography postcss tailwindcss vite-plugin-solid
```

Peer dependencies:
- `@kkocot/honeycomb-core` - core types and utilities
- `highlight.js` - optional, for code syntax highlighting in ContentRenderer

### 3. Configure Vite

```ts
// vite.config.ts
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  server: {
    port: 3032,
  },
});
```

### 4. Configure PostCSS

```js
// postcss.config.js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

### 5. Set up CSS

Replace `src/index.css`:

```css
@import "tailwindcss";
@import "@hiveio/honeycomb-solid/theme.css";

@plugin "@tailwindcss/typography";
```

- `theme.css` registers `hive-*` color tokens in Tailwind (e.g. `bg-hive-card`, `text-hive-foreground`)
- `@tailwindcss/typography` is optional, needed only for `HiveContentRenderer`

### 6. Set up the entry point

```tsx
// src/index.tsx
import { render } from "solid-js/web";
import App from "./App";
import "@hiveio/honeycomb-solid/styles.css";
import "./index.css";

const root_element = document.getElementById("root");

if (!root_element) {
  throw new Error("Root element not found");
}

render(() => <App />, root_element);
```

**Import order matters:**

1. `styles.css` first - CSS variables, component styles, and pre-compiled Tailwind utilities
2. `index.css` second - your Tailwind setup with `theme.css` for `hive-*` utility classes

### 7. Use components

```tsx
// src/App.tsx
import { HiveProvider, HiveAvatar, HiveUserCard } from "@hiveio/honeycomb-solid";

export default function App() {
  return (
    <HiveProvider>
      <div class="space-y-6 p-8">
        <HiveAvatar username="blocktrades" size="lg" />
        <HiveUserCard username="blocktrades" />
      </div>
    </HiveProvider>
  );
}
```

Solid.js uses `class` instead of `className` for HTML attributes.

## Key differences vs React

| Aspect | React (Vite) | Solid.js (Vite) |
|--------|-------------|-----------------|
| Package | `@hiveio/honeycomb-react` | `@hiveio/honeycomb-solid` |
| Entry | `createRoot().render()` | `render(() => <App />, el)` |
| HTML classes | `className` | `class` |
| Reactivity | Hooks re-render component | Fine-grained signals, no re-renders |
| Vite plugin | `@vitejs/plugin-react` | `vite-plugin-solid` |

## Scripts

```bash
pnpm dev        # Start dev server (port 3032)
pnpm build      # Production build
pnpm test       # Run Playwright tests
```
