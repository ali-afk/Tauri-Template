# Tauri + SvelteKit Template

Desktop app template. Minimal by design — infrastructure without opinions.

## Features

- 🎨 Design token system (CSS.registerProperty)
- 🌈 Auto-contrast OKLCH colors
- 🧩 Component primitives (Accordion, QuoteCard, ItemCard, CardSection, etc.)
- ♿ Accessibility (ARIA, keyboard nav, skip links)
- 🖥️ Tauri desktop app (cross-platform, 3-5MB binaries)

## Stack

SvelteKit 2 • Svelte 5 (runes) • TypeScript • Vite • LightningCSS • Biome • Bun

## Quick Start

```bash
bun install
bun tauri:dev   # desktop app + hot reload
bun tauri:build # production binary
```

## Docs

- [Architecture Decisions](docs/architecture-decisions.md) - Why things are the way they are
- [CSS System](docs/css.md) - Design tokens, CSS layers
- [Color System](docs/color-system.md) - OKLCH auto-contrast
- [SvelteKit Patterns](docs/sveltekit.md) - Svelte 5 component patterns
