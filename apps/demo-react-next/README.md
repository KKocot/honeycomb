# Honeycomb React Demo (Next.js)

Interactive demo of `@barddev/honeycomb-react` components with live Hive blockchain data.

**Dev server:** http://localhost:3031/demo/react-next

This guide shows how to integrate `@barddev/honeycomb-react` into a fresh Next.js project from scratch.

## Setup guide

### 1. Create a Next.js app

```bash
npx create-next-app@latest my-hive-app --typescript --tailwind --app
cd my-hive-app
```

### 2. Install honeycomb-react

```bash
npm install @barddev/honeycomb-react @hiveio/wax @radix-ui/react-popover
```

Peer dependencies:
- `@hiveio/wax` - Hive blockchain API client
- `@radix-ui/react-popover` - used by some components internally

### 3. Configure Next.js

Add `transpilePackages` so Webpack can process the package:

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@barddev/honeycomb-react"],
};

export default nextConfig;
```

### 4. Configure PostCSS

Replace the default PostCSS config with the Tailwind CSS 4 plugin:

```js
// postcss.config.js
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

### 5. Set up CSS

Replace the contents of `app/globals.css`:

```css
@import "tailwindcss";
@import "@barddev/honeycomb-react/theme.css";

@plugin "@tailwindcss/typography";
```

- `theme.css` registers `hive-*` color tokens in Tailwind (e.g. `bg-hive-card`, `text-hive-foreground`)
- `@tailwindcss/typography` is optional, needed only for `HiveContentRenderer`

### 6. Set up the root layout

```tsx
// app/layout.tsx
import { HiveProvider } from "@barddev/honeycomb-react";
import "@barddev/honeycomb-react/styles.css";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-hive-background text-hive-foreground">
        <HiveProvider>{children}</HiveProvider>
      </body>
    </html>
  );
}
```

**Import order matters:**

1. `styles.css` first - CSS variables, component styles, and pre-compiled Tailwind utilities for all components
2. `globals.css` second - your Tailwind setup with `theme.css` so you can use `hive-*` classes in your own code

### 7. Use components

```tsx
// app/page.tsx
"use client";

import {
  HiveAvatar,
  HiveUserCard,
  HiveBalanceCard,
} from "@barddev/honeycomb-react";

export default function Page() {
  return (
    <div className="space-y-6 p-8">
      <HiveAvatar username="blocktrades" size="lg" />
      <HiveUserCard username="blocktrades" />
      <HiveBalanceCard username="blocktrades" />
    </div>
  );
}
```

Components require `"use client"` because they fetch blockchain data via React hooks.

## CSS files explained

The package exports three CSS files for different use cases:

| File | Contents | When to use |
|------|----------|-------------|
| **`styles.css`** | CSS vars + component styles + pre-compiled Tailwind utilities + theme tokens | **Next.js / Webpack** - recommended default |
| `base.css` | CSS vars + component styles only | Vite projects (Vite scans packages automatically) |
| `theme.css` | `@theme inline` Tailwind token mappings only | Import in your `globals.css` for `hive-*` utility classes |

**Why `styles.css` for Next.js?** Webpack does not scan `node_modules` for Tailwind class names. `styles.css` includes pre-compiled utilities so component styles work out of the box. In Vite projects, you can use `base.css` instead because Vite resolves and scans package source files automatically.

## Dark mode

Add `className="dark"` to the `<html>` element. The CSS variables include both `:root` (light) and `.dark` overrides.

To switch themes dynamically, toggle the `dark` class on `document.documentElement`.

## Available components

| Component | Description |
|-----------|-------------|
| `HiveProvider` | Context provider, wraps app and connects to Hive API |
| `HiveAvatar` | User avatar with sizes (xs-xl) and optional border |
| `HiveUserCard` | Profile card with avatar, name, reputation, bio |
| `HiveBalanceCard` | HIVE, HBD, HP token balances |
| `HiveManabar` | Voting mana / resource credits progress bars |
| `HivePostCard` | Blog post card (card, compact, grid layouts) |
| `HivePostList` | Paginated post feed with sort and layout controls |
| `HiveContentRenderer` | Markdown renderer with mentions, embeds, sanitization |
| `HiveApiTracker` | Real-time API endpoint health monitoring |

## Available hooks

All hooks require `HiveProvider` as an ancestor component.

| Hook | Returns |
|------|---------|
| `useHive()` | API client instance and connection status |
| `useAccount(username)` | Account data (profile, balances, keys) |
| `useAccountReputation(username)` | Reputation score |
| `useFollowCount(username)` | Follower / following counts |
| `useGlobalProps()` | Blockchain global properties (head block, supply) |
| `useHeadBlock()` | Latest block info |
| `usePost(author, permlink)` | Single post data |
| `useDiscussions(query, sort)` | Paginated post lists |
