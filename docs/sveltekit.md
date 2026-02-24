# SvelteKit — Project Reference

## Route Structure

```text
src/routes/
├── +layout.svelte       # Root: CSS imports, onMount (removes loading shimmer)
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
import { DesignTokens, AppProperties } from "$data/shared";
```

## Data Loading

Since SSR is disabled (Tauri), use `+page.ts` for client-side data loading:

```typescript
// src/routes/(main)/+page.ts
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
  return { items };
};
```

```svelte
<!-- src/routes/(main)/+page.svelte -->
let { data }: { data: { items: Item[] } } = $props();
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
