# Honeycomb - Multi-Framework UI Library for Hive Blockchain

Building applications on Hive blockchain means writing the same things from scratch every time - connecting to the API, displaying user data, rendering posts, handling endpoints. Honeycomb is a component library that solves this problem - ready-made building blocks for Hive applications, working with four of the most popular frontend frameworks.

## Why was it created?

Anyone who has built a frontend for Hive knows the pattern: connect to the API, write fallback logic between endpoints, format account data, render Markdown from posts, handle media embedded in content. And every time, you write it all over again.

Honeycomb gathers these repetitive patterns into one place - as an npm package you install and use. No need to copy code between projects or write your own wrappers around `@hiveio/wax`.

## What does it offer?

### Four frameworks, one API

Honeycomb supports:

- **React 19** (`@hiveio/honeycomb-react`)
- **Solid.js 1.9** (`@hiveio/honeycomb-solid`)
- **Vue 3** (`@hiveio/honeycomb-vue`)
- **Svelte 5** (`@hiveio/honeycomb-svelte`)

Each package has an identical API adapted to the conventions of its framework - hooks in React, composables in Vue, runes in Svelte. The logic underneath is shared (core package), so behavior is identical regardless of your technology choice.

### Components

**User display:**

- `HiveAvatar` - Hive user avatar with automatic fetching
- `UserCard` - profile card with reputation, join date, post count

**Wallet:**

- `BalanceCard` - HIVE, HBD, HP balances in a readable format
- `HiveManabar` - Resource Credits and Voting Power bar with percentage visualization

**Posts:**

- `HivePostCard` - single post card with thumbnail, author, payout
- `HivePostList` - post list with sorting (trending, hot, created, promoted)
- `HiveContentRenderer` - Markdown content rendering with embed support (YouTube, 3Speak, Twitter) and XSS sanitization

**Editor:**

- `MdEditor` - Markdown editor with live preview, toolbar, and draft support

**Infrastructure:**

- `HiveProvider` - configuration wrapper for the entire application
- `ApiTracker` - API connection status visualization
- `HealthChecker` - API endpoint monitoring and management with automatic fallback

> ![image.png](https://images.hive.blog/DQmc5DfjhuYFMEpjuRPyUrGL4UinfEiSjGYBsQMB8nmpeUZ/image.png) > ![image.png](https://images.hive.blog/DQmSJn7a8hdRLW1gkZXrje15QgD8LguQKVRc4EeHSGqC6Qd/image.png) > ![image.png](https://images.hive.blog/DQmNQezyMwwpxfsodxHdCL7VfRb8pdLV6wpSsw8eFXbPpPX/image.png)

### Hooks / Composables

```
useHiveAccount("username")   // account data
useHivePost("author", "permlink")  // single post
useHivePostList("trending")  // post list
useHiveStatus()              // connection status
```

Data is fetched directly from the blockchain via `@hiveio/wax`. No intermediaries, no custom backend.

```
import { useHiveAccount } from "@hiveio/honeycomb-react";

function UserProfile({ username }: { username: string }) {
  const { account, is_loading, error, refetch } = useHiveAccount(username);

  if (is_loading) return <p>Loading account...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!account) return <p>Account not found</p>;

  return (
    <div>
      <h2>{account.name}</h2>
      <p>Balance: {account.balance}</p>
      <p>HBD: {account.hbd_balance}</p>
      <p>Posts: {account.post_count}</p>
      <p>Joined: {account.created}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### Endpoint management

One of the bigger challenges when working with the Hive API is the instability of individual nodes. Honeycomb solves this with a built-in mechanism:

- automatic background health checks of endpoints
- fallback to the next endpoint when the current one stops responding
- callbacks for endpoint changes, errors, and situations where all nodes are unavailable
- configurable intervals and timeouts

No need to write your own retry logic - the library handles it for you.

![Screenshot 2026-03-12 at 08.06.44.png](https://images.hive.blog/DQmbLqZGqenAMUaAAFqwtpEgPjHiEcX5m37Gfqks5DCbaQi/Screenshot%202026-03-12%20at%2008.06.44.png)

## Getting started

Installation (React example):

```bash
npm install @hiveio/honeycomb-react @hiveio/wax
```

Usage:

```tsx
import { HiveProvider, UserCard, BalanceCard } from "@hiveio/honeycomb-react";

function App() {
  return (
    <HiveProvider>
      <UserCard username="gtg" />
      <BalanceCard username="gtg" />
    </HiveProvider>
  );
}
```

For other frameworks, only the import changes - the API stays the same.

## Documentation and demos

Documentation is available at **honeycomb.bard-dev.com** - it contains a description of every component, code examples for all four frameworks, and interactive previews.

The project includes 13 demo applications showcasing integrations with various tech stacks:

| Framework | Integrations                         |
| --------- | ------------------------------------ |
| React     | Next.js, Vite, Astro, React Router 7 |
| Solid.js  | Vite, Astro, SolidStart              |
| Svelte 5  | Vite, SvelteKit, Astro               |
| Vue 3     | Vite, Nuxt, Astro                    |

No matter which stack you choose - there's a demo showing how to plug it in.

![image.png](https://images.hive.blog/DQmYAQwS64QjD84fmLXjVspiFUunCgud5YMVWQDEmPNsqLr/image.png)

## Technical details

- **TypeScript** - full typing, zero `any`
- **SSR compatible** - works with Next.js, Nuxt, SvelteKit, SolidStart, Astro
- **Theming** - CSS variables, optional Tailwind CSS integration
- **Tree-shakeable** - import only what you use
- **MIT License** - open source, no restrictions

Source code: **https://github.com/KKocot/honeycomb**

## What's next?

The project is actively developed. More components and features are planned - including potentially active components (not just displaying data, but also allowing interaction with the blockchain).

If you're building something on Hive and have ideas for what should be in the library - let me know in the comments or open an issue on GitHub.
