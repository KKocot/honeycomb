# @barddev/honeycomb-vue

Vue 3 composables and components for Hive Blockchain applications. Read-only (passive) - displays blockchain data without auth or transaction signing.

## Installation

```bash
npm install @barddev/honeycomb-vue
# or
pnpm add @barddev/honeycomb-vue
# or
yarn add @barddev/honeycomb-vue
# or
bun add @barddev/honeycomb-vue
```

### Peer Dependencies

```bash
npm install @hiveio/wax vue
# or
pnpm add @hiveio/wax vue
# or
yarn add @hiveio/wax vue
# or
bun add @hiveio/wax vue
```

`radix-vue` is only required if you use the `ApiTracker` component (optional peer dependency).

### Styles

Import the bundled stylesheet in your entry file (e.g. `main.ts`):

```ts
import "@barddev/honeycomb-vue/styles.css";
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

```vue
<!-- App.vue -->
<script setup lang="ts">
import { HiveProvider } from "@barddev/honeycomb-vue";
import "@barddev/honeycomb-vue/styles.css";
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
import { useHive, HiveAvatar, UserCard } from "@barddev/honeycomb-vue";

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

## HiveProvider

Root provider component. Manages blockchain connection with automatic endpoint fallback and health monitoring. Uses Vue's `provide/inject` pattern.

```vue
<script setup lang="ts">
import { HiveProvider } from "@barddev/honeycomb-vue";
</script>

<template>
  <HiveProvider
    :api-endpoints="['https://api.hive.blog', 'https://api.deathwing.me']"
    :timeout="5000"
    :health-check-interval="30000"
    :on-endpoint-change="(endpoint) => console.log('Switched to:', endpoint)"
  >
    <slot />
  </HiveProvider>
</template>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiEndpoints` | `string[]` | `DEFAULT_API_ENDPOINTS` | API endpoints in priority order |
| `timeout` | `number` | `5000` | Request timeout in ms |
| `healthCheckInterval` | `number` | `30000` | Health check interval in ms (0 = disabled) |
| `onEndpointChange` | `(endpoint: string) => void` | - | Callback on endpoint switch |

### Vue Plugin

You can also register `HiveProvider` globally as a Vue plugin:

```ts
import { createApp } from "vue";
import { hivePlugin } from "@barddev/honeycomb-vue";
import App from "./App.vue";

const app = createApp(App);
app.use(hivePlugin, {
  endpoints: ["https://api.hive.blog"],
  timeout: 10000,
});
app.mount("#app");
```

## Composables

All composables must be used within a `HiveProvider`. Return values are Vue `Ref<>` -- they are reactive and can be used directly in templates or watched with `watch()`.

### useHive()

Full context access. Throws if used outside `HiveProvider`.

```ts
const {
  chain,              // Ref<IHiveChainInterface | null>
  isLoading,          // Ref<boolean>
  error,              // Ref<string | null>
  apiEndpoint,        // Ref<string | null>
  status,             // Ref<ConnectionStatus>
  endpoints,          // Ref<EndpointStatus[]>
  refreshEndpoints,   // () => Promise<void>
} = useHive();
```

### useHiveChain()

Returns Hive chain instance (`null` before connection).

```ts
const chain = useHiveChain(); // Ref<IHiveChainInterface | null>

const accounts = await chain.value?.api.database_api.find_accounts({
  accounts: ["blocktrades"],
});
```

### useApiEndpoint()

Returns currently connected API endpoint or `null`.

```ts
const endpoint = useApiEndpoint(); // Ref<string | null>
```

### useHiveStatus()

Returns connection status and endpoint health.

```ts
const { status, endpoints } = useHiveStatus();

const healthy_count = computed(() =>
  endpoints.value.filter((ep) => ep.healthy).length
);
```

### useHiveAccount(username)

Fetches account data including balances, HP, reputation, and savings. Accepts `string`, `Ref<string>`, or getter `() => string` -- changing the value automatically re-fetches account data.

```ts
// Static username
const { account, isLoading, error, refetch } = useHiveAccount("blocktrades");

// Reactive username (re-fetches when ref changes)
const username = ref("blocktrades");
const { account, isLoading, error, refetch } = useHiveAccount(username);
username.value = "arcange"; // triggers re-fetch

// account.value.balance       -> "1,234.567 HIVE"
// account.value.hbd_balance   -> "100.000 HBD"
// account.value.hive_power    -> "50,000.000 HP"
// account.value.effective_hp  -> "55,000.000 HP"
// account.value.reputation    -> 75
// account.value.post_count    -> 1234
// refetch()                   -> manually re-fetch account data
```

### useHivePost(author, permlink)

Fetches a single post via `condenser_api.get_content`.

```ts
const { post, isLoading, error } = useHivePost("barddev", "my-post-permlink");

// post.value.title, post.value.body, post.value.votes, post.value.comments
// post.value.payout, post.value.created, post.value.thumbnail
```

### useHivePostList(options?)

Paginated list of ranked posts via `bridge.get_ranked_posts`.

```ts
const {
  posts,       // Ref<RankedPost[]>
  isLoading,   // Ref<boolean>
  error,       // Ref<Error | null>
  sort,        // Ref<SortType>
  setSort,     // (sort: SortType) => void -- change sort (resets pagination)
  hasNext,     // Ref<boolean>
  hasPrev,     // Ref<boolean>
  nextPage,    // () => void
  prevPage,    // () => void
  page,        // Ref<number>
} = useHivePostList({ sort: "trending", tag: "hive", limit: 10 });
```

Sort types: `"trending"` | `"hot"` | `"created"` | `"payout"` | `"muted"`

## Components

### HiveAvatar

User avatar with automatic fallback to colored initials.

```vue
<HiveAvatar username="blocktrades" size="lg" show-border />
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

```vue
<UserCard username="blocktrades" variant="expanded" show-stats />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `username` | `string` | required | Hive username |
| `variant` | `"compact" \| "default" \| "expanded"` | `"default"` | Display style |
| `showStats` | `boolean` | `true` | Show post count and balances |
| `class` | `string` | - | Additional CSS classes |

### BalanceCard

Wallet balances display (HIVE, HBD, HP, savings, delegations).

```vue
<BalanceCard username="blocktrades" variant="expanded" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `username` | `string` | required | Hive username |
| `variant` | `"compact" \| "default" \| "expanded"` | `"default"` | Display style |
| `class` | `string` | - | Additional CSS classes |

### ApiTracker

Connection status indicator with endpoint health popover. Requires `radix-vue`.

```vue
<ApiTracker show-url side="bottom" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showUrl` | `boolean` | `false` | Show current endpoint hostname |
| `side` | `"top" \| "bottom"` | `"bottom"` | Popover position |
| `class` | `string` | - | Additional CSS classes |

### HiveManabar

Voting Power, Downvote Power, and Resource Credits as ring charts.

```vue
<HiveManabar username="blocktrades" variant="full" show-values show-cooldown />
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

```vue
<HivePostCard
  author="blocktrades"
  permlink="my-post"
  variant="card"
  :hide="['payout']"
/>
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

```vue
<HivePostList
  sort="trending"
  tag="hive"
  :limit="20"
  show-sort-controls
  variant="compact"
  :pinned-posts="[{ author: 'hiveio', permlink: 'announcement' }]"
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sort` | `SortType` | `"trending"` | Initial sort order |
| `tag` | `string` | - | Community or tag filter |
| `limit` | `number` | `20` | Posts per page |
| `pinnedPosts` | `{ author, permlink }[]` | - | Pinned posts at the top |
| `showSortControls` | `boolean` | `false` | Show sort buttons |
| `variant` | `"card" \| "compact" \| "grid"` | `"compact"` | Post card variant |
| `hide` | `PostHideOption[]` | `[]` | Hide elements on cards |
| `linkTarget` | `string` | `"https://blog.openhive.network"` | Base URL for post links |
| `class` | `string` | - | Additional CSS classes |

### HiveContentRenderer

Renders Hive post markdown/HTML body with plugin support (tables, embeds, syntax highlighting).

```vue
<script setup lang="ts">
import { HiveContentRenderer, DEFAULT_PLUGINS } from "@barddev/honeycomb-vue";
</script>

<template>
  <HiveContentRenderer
    :body="post.body"
    author="blocktrades"
    permlink="my-post"
    :plugins="DEFAULT_PLUGINS"
  />
</template>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `body` | `string` | required | Post body (markdown/HTML) |
| `author` | `string` | - | Post author (for image proxy) |
| `permlink` | `string` | - | Post permlink |
| `options` | `Partial<RendererOptions>` | - | Renderer options |
| `plugins` | `RendererPlugin[]` | `DEFAULT_PLUGINS` | Renderer plugins |
| `class` | `string` | - | Additional CSS classes |

Available plugins: `TablePlugin`, `TwitterPlugin`, `TwitterResizePlugin`, `InstagramPlugin`, `InstagramResizePlugin`, `HighlightPlugin`, `DEFAULT_PLUGINS` (all bundled). For advanced use cases, import `DefaultRenderer` directly to render HTML outside of Vue.

## SSR Compatibility

- `chain` ref is `null` during server-side rendering
- HiveProvider connects on `onMounted` (client-side only)
- Components render loading skeletons on server, fetch data on client
- Compatible with Nuxt 3

## Types

All types are exported for direct use:

```ts
import type {
  // Provider
  HiveContextValue,
  // Core
  HiveClientConfig,
  ConnectionStatus,
  EndpointStatus,
  EndpointError,
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
} from "@barddev/honeycomb-vue";
```

## License

MIT
