# @barddev/honeycomb-solid

Solid.js components and hooks for Hive Blockchain applications. Read-only (passive) - displays blockchain data without auth or transaction signing. SSR-compatible, works with SolidStart and Astro.

## Installation

```bash
npm install @barddev/honeycomb-solid
# or
pnpm add @barddev/honeycomb-solid
# or
yarn add @barddev/honeycomb-solid
# or
bun add @barddev/honeycomb-solid
```

### Peer Dependencies

```bash
npm install @hiveio/wax @kobalte/core solid-js
# or
pnpm add @hiveio/wax @kobalte/core solid-js
# or
yarn add @hiveio/wax @kobalte/core solid-js
# or
bun add @hiveio/wax @kobalte/core solid-js
```

`@kobalte/core` is only required if you use the `ApiTracker` component.

### Styles

Import the bundled stylesheet in your entry file (e.g. `index.tsx`, `root.tsx`):

```tsx
import "@barddev/honeycomb-solid/styles.css";
```

That's it. The file includes everything: CSS variables, component styles, pre-compiled Tailwind utilities, and `@theme inline` tokens. Works with or without your own Tailwind CSS 4 setup. You can use `hive-*` classes in your own code (e.g. `bg-hive-card`, `text-hive-red`) without any extra configuration.

Dark mode requires `class="dark"` on the `<html>` element.

#### Alternative imports

| Import | Contains | Use when |
|--------|----------|----------|
| `styles.css` | Everything (CSS vars + styles + utilities + theme tokens) | Default |
| `base.css` | CSS vars + component styles only | Projects without Tailwind CSS |
| `theme.css` | `@theme inline` tokens only | Standalone theme tokens (advanced) |

## Quick Start

```tsx
// src/index.tsx (Vite + Solid)
import { render } from "solid-js/web";
import { HiveProvider } from "@barddev/honeycomb-solid";
import "@barddev/honeycomb-solid/styles.css";
import App from "./App";

render(
  () => (
    <HiveProvider>
      <App />
    </HiveProvider>
  ),
  document.getElementById("root")!,
);
```

```tsx
// src/App.tsx
import { Show } from "solid-js";
import { useHive, HiveAvatar, UserCard } from "@barddev/honeycomb-solid";

export default function App() {
  const { chain, is_loading, error, status } = useHive();

  return (
    <Show when={!is_loading()} fallback={<div>Connecting to Hive...</div>}>
      <Show when={!error()} fallback={<div>Error: {error()}</div>}>
        <p>Status: {status()}</p>
        <HiveAvatar username="blocktrades" size="lg" />
        <UserCard username="blocktrades" variant="expanded" />
      </Show>
    </Show>
  );
}
```

## HiveProvider

Root provider component. Manages blockchain connection with automatic endpoint fallback and health monitoring.

```tsx
<HiveProvider
  apiEndpoints={["https://api.hive.blog", "https://api.deathwing.me"]}
  timeout={5000}
  healthCheckInterval={30000}
  onEndpointChange={(endpoint) => console.log("Switched to:", endpoint)}
>
  {children}
</HiveProvider>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiEndpoints` | `string[]` | `DEFAULT_API_ENDPOINTS` | API endpoints in priority order |
| `timeout` | `number` | `5000` | Request timeout in ms |
| `healthCheckInterval` | `number` | `30000` | Health check interval in ms (0 = disabled) |
| `onEndpointChange` | `(endpoint: string) => void` | - | Callback on endpoint switch |

## Hooks

All hooks return signal getters (functions). Call them inside JSX or `createEffect` / `createMemo` to track reactivity.

### useHive()

Full context access. Throws if used outside `HiveProvider`.

```tsx
const {
  chain,              // () => IHiveChainInterface | null
  is_loading,         // () => boolean
  error,              // () => string | null
  is_client,          // () => boolean
  api_endpoint,       // () => string | null
  status,             // () => ConnectionStatus
  endpoints,          // () => EndpointStatus[]
  refresh_endpoints,  // () => Promise<void>
} = useHive();
```

### useHiveChain()

Returns a signal getter for the Hive chain instance (`null` during SSR / before connection).

```tsx
const chain = useHiveChain();

const accounts = await chain()?.api.database_api.find_accounts({
  accounts: ["blocktrades"],
});
```

### useApiEndpoint()

Returns a signal getter for the currently connected API endpoint or `null`.

```tsx
const endpoint = useApiEndpoint();
// endpoint() -> "https://api.hive.blog" | null
```

### useHiveStatus()

Returns a signal getter for connection status and endpoint health.

```tsx
const hiveStatus = useHiveStatus();
// hiveStatus().status    -> "connected" | "connecting" | ...
// hiveStatus().endpoints -> EndpointStatus[]
```

### useHiveAccount(username)

Fetches account data including balances, HP, reputation, and savings. Accepts a `string` or an `Accessor<string>` for reactive username tracking.

```tsx
const { account, is_loading, error, refetch } = useHiveAccount("blocktrades");

// account()?.balance       -> "1,234.567 HIVE"
// account()?.hbd_balance   -> "100.000 HBD"
// account()?.hive_power    -> "50,000.000 HP"
// account()?.effective_hp  -> "55,000.000 HP"
// account()?.reputation    -> 75
// account()?.post_count    -> 1234
// refetch()                -> manually re-fetch account data
```

With a reactive accessor:

```tsx
const [username, setUsername] = createSignal("blocktrades");
const { account, is_loading, error } = useHiveAccount(username);
// Account re-fetches automatically when username() changes
```

### useHivePost(author, permlink)

Fetches a single post via `condenser_api.get_content`.

```tsx
const { post, is_loading, error } = useHivePost("barddev", "my-post-permlink");

// post()?.title, post()?.body, post()?.votes, post()?.comments, post()?.payout, post()?.created, post()?.thumbnail
```

### useHivePostList(options?)

Paginated list of ranked posts via `bridge.get_ranked_posts`.

```tsx
const {
  posts,       // () => RankedPost[]
  is_loading,  // () => boolean
  error,       // () => Error | null
  sort,        // () => SortType
  set_sort,    // (sort: SortType) => void - resets pagination
  has_next,    // () => boolean
  has_prev,    // () => boolean
  next_page,   // () => void
  prev_page,   // () => void
  page,        // () => number
} = useHivePostList({ sort: "trending", tag: "hive", limit: 10 });
```

Sort types: `"trending"` | `"hot"` | `"created"` | `"payout"` | `"muted"`

## Components

### HiveAvatar

User avatar with automatic fallback to colored initials.

```tsx
<HiveAvatar username="blocktrades" size="lg" showBorder />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `username` | `string` | required | Hive username |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` | Avatar size |
| `showBorder` | `boolean` | `false` | Show ring border |
| `fallbackColor` | `string` | auto-generated | Custom fallback background color |
| `class` | `string` | - | Additional CSS classes |

### UserCard

User profile card with reputation, stats, and metadata.

```tsx
<UserCard username="blocktrades" variant="expanded" showStats />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `username` | `string` | required | Hive username |
| `variant` | `"compact" \| "default" \| "expanded"` | `"default"` | Display style |
| `showStats` | `boolean` | `true` | Show post count and balances |
| `class` | `string` | - | Additional CSS classes |

### BalanceCard

Wallet balances display (HIVE, HBD, HP, savings, delegations).

```tsx
<BalanceCard username="blocktrades" variant="expanded" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `username` | `string` | required | Hive username |
| `variant` | `"compact" \| "default" \| "expanded"` | `"default"` | Display style |
| `class` | `string` | - | Additional CSS classes |

### ApiTracker

Connection status indicator with endpoint health popover. Requires `@kobalte/core`.

```tsx
<ApiTracker showUrl side="bottom" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showUrl` | `boolean` | `false` | Show current endpoint hostname |
| `side` | `"top" \| "bottom"` | `"bottom"` | Popover position |
| `class` | `string` | - | Additional CSS classes |

### HiveManabar

Voting Power, Downvote Power, and Resource Credits as ring charts.

```tsx
<HiveManabar username="blocktrades" variant="full" showValues showCooldown />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `username` | `string` | required | Hive username |
| `variant` | `"full" \| "compact" \| "ring"` | `"full"` | Display style (`ring` = RC only) |
| `showLabels` | `boolean` | `true` | Show manabar labels |
| `showValues` | `boolean` | `false` | Show current/max values |
| `showCooldown` | `boolean` | `true` | Show time to full recharge |
| `class` | `string` | - | Additional CSS classes |

### HivePostCard

Single post card with thumbnail, author, stats, and content preview.

```tsx
<HivePostCard author="blocktrades" permlink="my-post" variant="card" hide={["payout"]} />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `author` | `string` | required | Post author |
| `permlink` | `string` | required | Post permlink |
| `variant` | `"card" \| "compact" \| "grid"` | `"card"` | Display style |
| `hide` | `PostHideOption[]` | `[]` | Hide elements: `"author"`, `"thumbnail"`, `"payout"`, `"votes"`, `"comments"`, `"time"` |
| `linkTarget` | `string` | `"https://blog.openhive.network"` | Base URL for post links |
| `class` | `string` | - | Additional CSS classes |

### HivePostList

Paginated post feed with sort controls and pinned posts.

```tsx
<HivePostList
  sort="trending"
  tag="hive"
  limit={20}
  show_sort_controls
  variant="compact"
  pinned_posts={[{ author: "hiveio", permlink: "announcement" }]}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sort` | `SortType` | `"trending"` | Initial sort order |
| `tag` | `string` | - | Community or tag filter |
| `limit` | `number` | `20` | Posts per page |
| `pinned_posts` | `{ author, permlink }[]` | - | Pinned posts at the top |
| `show_sort_controls` | `boolean` | `false` | Show sort buttons |
| `variant` | `"card" \| "compact" \| "grid"` | `"compact"` | Post card variant |
| `hide` | `PostHideOption[]` | `[]` | Hide elements on cards |
| `linkTarget` | `string` | `"https://blog.openhive.network"` | Base URL for post links |
| `class` | `string` | - | Additional CSS classes |

### HiveContentRenderer

Renders Hive post markdown/HTML body with plugin support (tables, embeds, syntax highlighting).

```tsx
import { HiveContentRenderer, DEFAULT_PLUGINS } from "@barddev/honeycomb-solid";

<HiveContentRenderer
  body={post.body}
  author="blocktrades"
  permlink="my-post"
  plugins={DEFAULT_PLUGINS}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `body` | `string` | required | Post body (markdown/HTML) |
| `author` | `string` | - | Post author (for image proxy) |
| `permlink` | `string` | - | Post permlink |
| `options` | `Partial<RendererOptions>` | - | Renderer options |
| `plugins` | `RendererPlugin[]` | `DEFAULT_PLUGINS` | Renderer plugins |
| `class` | `string` | - | Additional CSS classes |

Available plugins: `TablePlugin`, `TwitterPlugin`, `TwitterResizePlugin`, `InstagramPlugin`, `InstagramResizePlugin`, `HighlightPlugin`, `DEFAULT_PLUGINS` (all bundled). For advanced use cases, import `DefaultRenderer` directly to render HTML outside of Solid.

## SSR Compatibility

- `chain` signal getter returns `null` during server-side rendering
- `is_client` signal getter indicates client-side hydration
- No `localStorage` / `window` access during SSR
- Components render loading skeletons on server, fetch data on client
- Safe to use in SolidStart and Astro with Solid integration

## Types

All types are exported for direct use:

```tsx
import type {
  // Provider
  HiveContextValue,
  HiveProviderProps,
  // Core
  ConnectionStatus,
  EndpointStatus,
  EndpointError,
  HiveClientConfig,
  HiveClientState,
  StateListener,
  // Account
  HiveAccount,
  UseHiveAccountResult,
  // Posts
  HivePost,
  UseHivePostResult,
  UseHivePostListOptions,
  UseHivePostListResult,
  SortType,
  PaginationCursor,
  RankedPost,
  RankedPostsResult,
  // Components
  HiveAvatarProps,
  AvatarSize,
  UserCardProps,
  UserCardVariant,
  BalanceCardProps,
  BalanceCardVariant,
  ApiTrackerProps,
  HiveManabarProps,
  ManabarVariant,
  HivePostCardProps,
  PostVariant,
  PostHideOption,
  HivePostListProps,
  HiveContentRendererProps,
  // Renderer
  RendererOptions,
  RendererPlugin,
  PostContext,
} from "@barddev/honeycomb-solid";
```

## License

MIT
