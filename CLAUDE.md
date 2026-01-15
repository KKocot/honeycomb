# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hive UI is a shadcn/ui-style component library for Hive Blockchain applications. Components are meant to be copied into user projects, not installed as npm packages.

## Development Commands

```bash
# Install dependencies
pnpm install

# Run docs dev server (port 3030)
pnpm dev:docs

# Run demo app (port 3031)
pnpm dev:demo

# Build docs
pnpm build:docs

# Build demo
pnpm build:demo

# Lint
pnpm lint

# Run all apps in dev mode
pnpm dev

# Build all
pnpm build
```

## Architecture

### Monorepo Structure (Turborepo + pnpm workspaces)

- `apps/docs` - Next.js 15 documentation site with App Router (port 3030)
- `apps/demo` - Interactive demo app to test all components (port 3031, default user: barddev)
- `packages/react` - React components (placeholder)
- `packages/cli` - CLI tool for adding components (placeholder)

### Docs App (`apps/docs`)

**Key directories:**
- `app/docs/` - Documentation pages (file-based routing)
- `app/examples/` - Interactive component showcase with live demos
- `components/` - Shared UI components for docs site
- `lib/` - Utilities (highlighter, docs-config, cn helper)

**Navigation structure defined in `lib/docs-config.ts`:**
- Getting Started: Introduction, Installation, Project Structure
- Configuration: Hive Provider, API Nodes, Theming
- Authentication: Smart Signer (All-in-One), Keychain, PeakVault, Hivesigner, HiveAuth, HB-Auth, WIF
- Social: Avatar, User Card, Follow Button, Mute Button, Badge List
- Content: Vote Button, Comment Form, Post Editor, Post Summary, Reblog Button
- Wallet: Balance Card, Transfer Dialog, Power Up/Down, Delegation Card, Trade Hive
- Community: Communities List, Witness Vote, Proposals, Authorities, Account Settings
- Hooks: useHiveChain, useHiveAuth, useHiveAccount, useVote

### Code Highlighting

Uses Shiki with singleton pattern (`lib/highlighter.ts`). The `CodeBlock` component wraps highlighted code with copy functionality.

### Styling

- Tailwind CSS with custom Hive colors (`hive-red: #E31337`, `hive-dark: #1A1A1A`)
- CSS variables for theming (border, background, foreground, muted, accent, card)
- `@tailwindcss/typography` for prose content
- `cn()` helper combining clsx + tailwind-merge

## Hive Blockchain Concepts

Components interact with Hive blockchain via `@hiveio/wax` library. Key concepts:
- **Keys**: Posting (social), Active (financial), Memo (encryption), Owner (recovery)
- **Tokens**: HIVE, HBD (stablecoin), HP (staked HIVE)
- **Resource Credits**: Replace transaction fees, regenerate over ~5 days

## Authentication Methods

The library provides 7 separate login components that can be used individually or combined via Smart Signer:
- **Keychain** - Hive Keychain browser extension
- **PeakVault** - PeakD's browser extension
- **Hivesigner** - OAuth-style redirect flow
- **HiveAuth** - Mobile QR code authentication via WebSocket
- **HB-Auth** - Encrypted local key storage with password (Safe Storage)
- **WIF** - Direct private key entry (least secure, for development)

## Adding New Documentation Pages

1. Create page in `app/docs/[category]/[component]/page.tsx`
2. Add entry to `lib/docs-config.ts`
3. Use `CodeBlock` component for code examples
4. Follow existing page structure (heading, description, preview, code, props table)

## Adding Interactive Examples

1. Create demo component function in `app/examples/page.tsx`
2. Add entry to `components` array with `demo` property
3. Choose appropriate category: auth, social, content, wallet, community
