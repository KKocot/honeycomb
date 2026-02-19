# Honeycomb React Demo (Astro)

Interactive demo of `@barddev/honeycomb-react` components in an **Astro 5** project using React islands.

**Dev server:** http://localhost:3035/demo/react-astro/

## Adding @barddev/honeycomb-react to an Astro project

### 1. Create an Astro app

```bash
npm create astro@latest my-hive-app
cd my-hive-app
npx astro add react
```

### 2. Install dependencies

```bash
npm install @barddev/honeycomb-react @kkocot/honeycomb-core @radix-ui/react-popover highlight.js
npm install -D @tailwindcss/postcss @tailwindcss/typography postcss tailwindcss
```

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

Create `src/styles/global.css`:

```css
@import "tailwindcss";
@import "@barddev/honeycomb-react/theme.css";

@plugin "@tailwindcss/typography";
```

### 5. Create the Astro layout

```astro
---
// src/layouts/BaseLayout.astro
import "@barddev/honeycomb-react/styles.css";
import "../styles/global.css";

interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
  </head>
  <body class="min-h-screen antialiased bg-hive-background text-hive-foreground">
    <slot />
  </body>
</html>
```

### 6. Create a React island component

**Important:** `HiveProvider` must be inside the React component, not in `.astro` files. Astro renders `.astro` files on the server where browser APIs are not available.

```tsx
// src/components/HiveApp.tsx
import { HiveProvider, HiveAvatar, UserCard } from "@barddev/honeycomb-react";

export default function HiveApp() {
  return (
    <HiveProvider>
      <div className="space-y-6 p-8">
        <HiveAvatar username="blocktrades" size="lg" />
        <UserCard username="blocktrades" />
      </div>
    </HiveProvider>
  );
}
```

### 7. Use in an Astro page

```astro
---
// src/pages/index.astro
import BaseLayout from "../layouts/BaseLayout.astro";
import HiveApp from "../components/HiveApp";
---

<BaseLayout title="My Hive App">
  <HiveApp client:only="react" />
</BaseLayout>
```

**Use `client:only="react"` instead of `client:load`.** The Honeycomb components use browser APIs (`window`, WASM) that are not available during Astro's SSR build. `client:only` skips server rendering entirely and mounts the component only on the client.

## Key differences vs Next.js

| Aspect | Next.js | Astro + React |
|--------|---------|---------------|
| Rendering | RSC + client components | Static HTML + React islands |
| HiveProvider | In `layout.tsx` (server-rendered shell) | Inside React island (client-only) |
| Hydration | `client:load` equivalent built-in | Must use `client:only="react"` |
| `"use client"` | Required on hook-using components | Not needed (all island code is client) |
| Routing | Next.js App Router | Astro file-based routing |
| CSS imports | In layout.tsx | In `.astro` layout frontmatter |

## Scripts

```bash
pnpm dev        # Start dev server (port 3035)
pnpm build      # Production build
pnpm test       # Run Playwright tests
```
