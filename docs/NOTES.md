# Quick Reference

## Tauri (Separate Branch)

Use branches: pure SvelteKit on `main`, Tauri on `tauri` branch.

**Tauri branch changes:**
- `svelte.config.js`: `@sveltejs/adapter-static` with `fallback: "index.html"`
- `src/routes/+layout.ts`: `export const ssr = false`
- Add scripts: `tauri:dev`, `tauri:build`
- Generate icons: `bunx tauri icon static/icon-512.png`
- Config: `src-tauri/tauri.conf.json`

## Key Files

- `src/lib/data/shared/site-properties.ts` - Site metadata
- `src/lib/data/shared/design-tokens.ts` - Design system tokens
- `src/lib/data/shared/meta.ts` - JSON-LD structured data
- `src/routes/sitemap.xml/+server.ts` - Add pages here

## Component Primitives

Svelte 5 runes (`$props`, `$state`, `$derived`, `$effect`)

- **QuoteCard** - Testimonials with avatars, alternating directions
- **ItemCard/ItemCategory** - Portfolio/showcase items
- **Accordion** - Collapsible sections (FAQs)
- **CardSection** - Grid layout with heading
- **Meta** - Per-page SEO

## Commands

```bash
bun dev              # Dev server
bun run build        # Production
bun run watch        # Type checking
```
