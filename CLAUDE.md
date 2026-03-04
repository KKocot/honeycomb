# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Location in Projects

```
projects/hive/honeycomb/   <-- JESTEŚ TUTAJ
```

**Inne projekty Hive w repozytorium:**
- `../denser/` - frontend Hive (blog/wallet)
- `../my-honey-pot/` - blog na Hive blockchain

## Project Overview

Honeycomb is a component library for Hive Blockchain applications. Install the framework-specific package from npm and wrap your app with HiveProvider.

## Development Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Run all apps in dev mode
pnpm dev:docs         # Run docs dev server (port 3030)
pnpm dev:demo         # Run demo app (port 3031)
pnpm build            # Build all
pnpm lint             # Lint all
```

## Architecture

### Monorepo Structure (Turborepo + pnpm workspaces)

**Apps:**
- `apps/docs` - Next.js 15 documentation site with App Router (port 3030)
- `apps/demo-react-next` - Next.js demo (port 3031)
- `apps/demo-react-vite` - Vite + React SPA demo
- `apps/demo-react-astro` - Astro + React islands demo
- `apps/demo-react-remix` - React Router 7 demo
- `apps/demo-solid-vite` - Solid.js + Vite demo
- `apps/demo-solid-astro` - Astro + Solid.js islands demo
- `apps/demo-solid-start` - SolidStart demo
- `apps/demo-svelte-vite` - Vite + Svelte 5 SPA demo
- `apps/demo-svelte-kit` - SvelteKit 2 demo
- `apps/demo-svelte-astro` - Astro + Svelte islands demo
- `apps/demo-vue-vite` - Vue 3 + Vite demo
- `apps/demo-vue-nuxt` - Nuxt 3 demo
- `apps/demo-vue-astro` - Astro + Vue islands demo

**Packages:**
- `packages/core` - Core logic and types
- `packages/react` - React components and hooks
- `packages/solid` - Solid.js components and hooks
- `packages/svelte` - Svelte 5 components and hooks
- `packages/vue` - Vue 3 components and composables

### Docs App (`apps/docs`)

**Key directories:**
- `app/(docs)/[framework]/` - Documentation pages (file-based routing with framework param)
- `components/` - Shared UI components for docs site (CodeBlock, InstallationTabs, etc.)
- `lib/docs-config.ts` - Navigation structure
- `lib/highlighter.ts` - Shiki code highlighting (singleton pattern, theme: one-dark-pro)

### Styling

- Tailwind CSS with custom Hive colors (`hive-red: #E31337`, `hive-dark: #1A1A1A`)
- CSS variables for theming (border, background, foreground, muted, accent, card)
- `@tailwindcss/typography` for prose content
- `cn()` helper in `lib/utils.ts` combining clsx + tailwind-merge

## Hive Blockchain Concepts

Components interact with Hive blockchain via `@hiveio/wax` library. Key concepts:
- **Keys**: Posting (social), Active (financial), Memo (encryption), Owner (recovery)
- **Tokens**: HIVE, HBD (stablecoin), HP (staked HIVE)
- **Resource Credits**: Replace transaction fees, regenerate over ~5 days

## Authentication Methods

The library provides login components that can be used individually:
- **Keychain** - Hive Keychain browser extension
- **PeakVault** - PeakD's browser extension
- **HiveAuth** - Mobile QR code authentication via WebSocket
- **HB-Auth** - Encrypted local key storage with password (Safe Storage)
- **WIF** - Direct private key entry (least secure, for development)

## Adding New Documentation Pages

1. Create page in `app/docs/[category]/[component]/page.tsx`
2. Add entry to `lib/docs-config.ts`
3. Use `CodeBlock` component for code examples
4. Follow existing page structure (heading, description, preview, code, props table)
