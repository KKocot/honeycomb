# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hive UI is a shadcn/ui-style component library for Hive Blockchain applications. Components are meant to be copied into user projects, not installed as npm packages.

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

- `apps/docs` - Next.js 15 documentation site with App Router (port 3030)
- `apps/demo` - Interactive demo app to test all components (port 3031, default user: barddev)
- `packages/react` - React components (placeholder)
- `packages/cli` - CLI tool for adding components (placeholder)

### Demo App (`apps/demo`)

- `app/page.tsx` - Main demo page with all component demonstrations
- `components/hive/` - All Hive UI components (prefixed with `Hive`, e.g., `HiveAvatar`, `HiveUserCard`)
- `contexts/hive-context.tsx` - HiveProvider context using `@hiveio/wax` for blockchain interaction

Components are organized into sections: auth, social, content, wallet, community.

### Docs App (`apps/docs`)

**Key directories:**
- `app/docs/` - Documentation pages (file-based routing)
- `app/examples/page.tsx` - Interactive component showcase with live demos
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

## Adding New Components to Demo

1. Create component in `apps/demo/components/hive/` with `Hive` prefix
2. Export from `apps/demo/components/hive/index.ts`
3. Add demo in `apps/demo/app/page.tsx` under appropriate section
