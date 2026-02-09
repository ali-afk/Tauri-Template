# SvelteKit Personal Template

Personal starter template extracted from production. Minimal by design - infrastructure without opinions.

## Features

- 🎨 Design token system (CSS.registerProperty)
- 🌈 Auto-contrast OKLCH colors
- 🧩 Component primitives (Accordion, QuoteCard, ItemCard, CardSection, etc.)
- 📱 PWA (service worker, manifest, offline)
- 🔍 SEO (meta tags, JSON-LD, sitemap, robots.txt, llms.txt)
- ♿ Accessibility (ARIA, keyboard nav, skip links)
- 🖥️ Tauri-ready (desktop apps, 3-5MB binaries)

## Stack

SvelteKit 2 • Svelte 5 (runes) • TypeScript • Vite • LightningCSS • Biome • Bun

## Quick Start

```bash
bun install
bun dev        # http://localhost:5173
bun run build
```

## Docs

- [Architecture Decisions](docs/architecture-decisions.md) - Why things are the way they are
- [CSS System](docs/css.md) - Design tokens, CSS layers
- [Color System](docs/color-system.md) - OKLCH auto-contrast
- [SvelteKit Patterns](docs/sveltekit.md) - Svelte 5 component patterns
- [Quick Notes](docs/NOTES.md) - Essential references

## Project Structure

```
src/
├── routes/              # Pages + SEO endpoints
│   ├── +layout.svelte   # Root layout
│   └── (main)/          # Main site
├── lib/
│   ├── components/      # Reusable components
│   │   └── shared/      # Primitives
│   ├── data/            # Config & content
│   │   └── shared/      # Site properties, tokens
│   ├── types/           # TypeScript definitions
│   ├── scripts/         # Utils
│   ├── assets/          # Images
│   └── styles/          # Global CSS
└── app.html
```

## Key Concepts

**Design Tokens**: Centralized in `design-tokens.ts`, auto-registered as CSS custom properties

**Auto-Contrast**: Set `--_background` on `.card`/`.btn`, text/border colors calculate for WCAG compliance

**Component Primitives**: Building blocks, not pre-built pages. Compose as needed.

**Tauri Ready**: Use separate branch for desktop builds. See [NOTES.md](docs/NOTES.md).

## Customization

1. `src/lib/data/shared/site-properties.ts` - Update metadata
2. `src/lib/data/shared/design-tokens.ts` - Change colors ([oklch.com](https://oklch.com))
3. `src/routes/(main)/+page.svelte` - Build homepage
4. `src/lib/assets/shared/` - Replace logo
5. `static/` - Replace favicons/icons

## Deployment

**Netlify** (current adapter):
- Push to GitHub
- Connect repo
- Auto-deploys on push

**Others**: Install Bun, build with `bun run build`, deploy `build/`

## License

Personal template - use however you want.
