# SvelteKit — Project Reference

## Route Structure

```text
src/routes/
├── +layout.svelte       # Root: CSS, global meta, JSON-LD, design tokens
├── +layout.ts           # SSR disabled (Tauri)
├── +error.svelte
├── (main)/
│   ├── +layout.svelte   # Wraps pages in <main>
│   └── +page.svelte     # /
├── sitemap.xml/
├── robots.txt/
├── humans.txt/
├── llms.txt/
├── site.webmanifest/
└── .well-known/security.txt/
```

Add new pages under `(main)/`. Add new endpoints as `route-name/+server.ts`.

## Path Aliases

Defined in `svelte.config.js`:

| Alias | Path |
| ----- | ---- |
| `$components` | `src/lib/components` |
| `$data` | `src/lib/data` |
| `$assets` | `src/lib/assets` |
| `$scripts` | `src/lib/scripts` |
| `$types` | `src/lib/types` |
| `$styles` | `src/lib/styles` |

## Barrel Exports

Everything exported via `index.ts` files. Import from the directory, not the
file:

```typescript
import { Accordion, QuoteCard } from "$components/shared";
import { DesignTokens, SiteProperties } from "$data/shared";
```

## Server-Side Data Loading

Data goes in `+page.server.ts`, passed to the page via `PageProps`:

```typescript
// +page.server.ts
export const load: PageServerLoad = () => {
  return { items };
};
```

```svelte
<!-- +page.svelte -->
let { data }: PageProps = $props();
```

Access as `data.items` directly in the template — don't extract to local
variables.

## Meta / SEO

Global meta is set in `src/routes/+layout.svelte` via `<svelte:head>` using
`SiteProperties` and `DesignTokens`.

Per-page meta uses the `Meta` component:

```svelte
<Meta
  title="Page Title"
  description="Page description"
/>
```

## onMount

Root layout (`+layout.svelte`) runs three things on mount:

```typescript
onMount(() => {
  registerDesignTokens();
  document.documentElement.classList.add("document-loaded"); // remove shimmer
  registerServiceWorker();
});
```

Don't add data fetching here — use load functions for that.
