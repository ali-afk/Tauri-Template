# SvelteKit — Project Reference

## Route Structure

```text
src/routes/
├── +layout.svelte       # Root: CSS, design tokens, onMount
├── +layout.ts           # SSR disabled (Tauri)
├── +error.svelte
└── (main)/
    ├── +layout.svelte   # Wraps pages in <main>
    └── +page.svelte     # /
```

Add new pages under `(main)/`. Add new endpoints as `route-name/+server.ts`.

## Path Aliases

Defined in `svelte.config.js`:

| Alias         | Path                 |
| ------------- | -------------------- |
| `$components` | `src/lib/components` |
| `$data`       | `src/lib/data`       |
| `$assets`     | `src/lib/assets`     |
| `$scripts`    | `src/lib/scripts`    |
| `$types`      | `src/lib/types`      |
| `$styles`     | `src/lib/styles`     |

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

```typescript
<!-- +page.svelte -->
let { data }: PageProps = $props();
```

Access as `data.items` directly in the template — don't extract to local
variables.

## Window Title

The `Meta` component sets the window title (`<title>` in `<svelte:head>`),
formatted as `"Page | SiteName"`. Use it on every page:

```svelte
<Meta title="Home" />
```

Pass a `children` snippet for any extra head tags you need.

## onMount

Root layout (`+layout.svelte`) runs one thing on mount:

```typescript
onMount(() => {
  document.documentElement.classList.add("document-loaded"); // remove shimmer
});
```

Design tokens are registered at build time by `gen.ts` — no runtime call needed.
Don't add data fetching here — use load functions for that.
