# Honeycomb React Demo (Vite)

Interactive demo of `@barddev/honeycomb-react` components in a **Vite + React** SPA.

**Dev server:** http://localhost:3034/demo/react-vite/

## Adding @barddev/honeycomb-react to a Vite + React project

### 1. Create a Vite app

```bash
npm create vite@latest my-hive-app -- --template react-ts
cd my-hive-app
```

### 2. Install dependencies

```bash
npm install @barddev/honeycomb-react @kkocot/honeycomb-core @radix-ui/react-popover highlight.js
npm install -D @tailwindcss/postcss @tailwindcss/typography postcss tailwindcss
```

Peer dependencies:
- `@kkocot/honeycomb-core` - core types and utilities
- `@radix-ui/react-popover` - used by ApiTracker component
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

Replace `src/index.css`:

```css
@import "tailwindcss";
@import "@barddev/honeycomb-react/theme.css";

@plugin "@tailwindcss/typography";
```

- `theme.css` registers `hive-*` color tokens in Tailwind (e.g. `bg-hive-card`, `text-hive-foreground`)
- `@tailwindcss/typography` is optional, needed only for `HiveContentRenderer`

### 5. Set up the entry point

```tsx
// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HiveProvider } from "@barddev/honeycomb-react";
import "@barddev/honeycomb-react/styles.css";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HiveProvider>
      <App />
    </HiveProvider>
  </StrictMode>,
);
```

**Import order matters:**

1. `styles.css` first - CSS variables, component styles, and pre-compiled Tailwind utilities
2. `index.css` second - your Tailwind setup with `theme.css` for `hive-*` utility classes

### 6. Use components

```tsx
// src/App.tsx
import { HiveAvatar, UserCard, useHive } from "@barddev/honeycomb-react";

export default function App() {
  const { status } = useHive();
  return (
    <div className="space-y-6 p-8">
      <p>Status: {status}</p>
      <HiveAvatar username="blocktrades" size="lg" />
      <UserCard username="blocktrades" />
    </div>
  );
}
```

No `"use client"` directive needed - Vite does not use RSC.

## Key differences vs Next.js

| Aspect | Next.js | Vite SPA |
|--------|---------|----------|
| CSS import | `styles.css` (pre-compiled utilities required for Webpack) | `styles.css` works, `base.css` also works (Vite scans packages) |
| `"use client"` | Required on components using hooks | Not needed |
| HiveProvider | In `layout.tsx` | In `main.tsx` |
| Routing | `useSearchParams` from `next/navigation` | `window.history.pushState` or any router |
| SSR | Built-in, components need `Suspense` | None (pure SPA) |

## Scripts

```bash
pnpm dev        # Start dev server (port 3034)
pnpm build      # Production build
pnpm test       # Run Playwright tests
```
