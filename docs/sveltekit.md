# SvelteKit — Project Reference

## Route Structure

```text
src/routes/
├── +layout.svelte       # Root: CSS imports, config init via IPC
├── +layout.ts           # SSR disabled + prerender for adapter-static
├── +error.svelte
└── (main)/
    ├── +layout.svelte   # Wraps pages in <main>
    └── +page.svelte     # /
```

The root `+layout.svelte` does two things on mount:

1. Calls `commands.appSettings()` and `commands.appMetadata()` via specta IPC
2. Populates `AppSettings` and `AppMetaData` Svelte writable stores
3. Shows a shimmer loading screen (`loading-item` class) until both resolve

Add new pages under `(main)/`. Add new endpoints as `route-name/+server.ts`.
(Tauri desktop uses adapter-static — API calls go through IPC, not HTTP.)

## Path Aliases

Defined in `svelte.config.ts` under `kit.alias`, exposed via
`.svelte-kit/tsconfig.json`:

| Alias         | Path                 |
| ------------- | -------------------- |
| `$components` | `src/lib/components` |
| `$data`       | `src/lib/data`       |
| `$assets`     | `src/lib/assets`     |
| `$scripts`    | `src/lib/scripts`    |
| `$types`      | `src/lib/types`      |
| `$styles`     | `src/lib/styles`     |
| `$bindings`   | `src/lib/bindings`   |

`$scripts` only covers `src/lib/scripts/` — `scripts/gen/` scripts use relative
imports or resolve `$data`/`$types` through tsconfig paths.

### TypeScript Config Extension

`svelte.config.ts` customizes the auto-generated `.svelte-kit/tsconfig.json`:

```ts
typescript: {
  config(config) {
    config.exclude.push("../src/lib/bindings.ts");
    config.include.push("../scripts/**/*.ts");
  },
}
```

- `exclude` — prevents `svelte-check` from errors on the auto-generated specta
  bindings
- `include` — adds `scripts/gen/` and `scripts/commit-msg/` to type-checking
  scope

## Barrel Exports

Everything exported via `index.ts` files. Import from the directory, not the
file:

```typescript
import { Accordion, QuoteCard } from "$components";
import { DesignTokens } from "$data";
```

Helpers and layout sub-components have their own `index.ts`:

```typescript
import { NavLinks, SkipLink } from "$components/helpers";
import { ButtonGrid, CardSection } from "$components/layout";
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

## App Configuration

Config flows from Rust → frontend via specta IPC:

1. **Rust:** `config/init.rs` reads `tauri.conf.json` metadata + `config.json`
   from `BaseDirectory::AppConfig` (persisted user settings)
2. **TypeScript:** Auto-generated `bindings.ts` exposes typed
   `commands.appSettings()` and `commands.appMetadata()`
3. **Svelte stores:** `data/config.ts` holds `AppSettings` and `AppMetaData`
   writable stores populated in root `+layout.svelte` on mount
4. **Component access:** Auto-subscribe via `$AppSettings`/`$AppMetaData` syntax

### Adding a New Backend Command

1. Add command function in `src-tauri/src/commands.rs` with both
   `#[tauri::command]` and `#[specta::specta]` attributes
2. Register in `collect_commands![]` in `lib.rs`
3. Rebuild (`bun tauri:dev`), which regenerates `src/lib/bindings.ts`
4. Import `commands` from `$bindings` in frontend

## Window Title

The `Meta` component sets the window title (`<title>` in `<svelte:head>`),
formatted as `"Page | SiteName"`. Use it on every page:

```svelte
<Meta title="Home" />
```

Pass a `children` snippet for any extra head tags you need.
