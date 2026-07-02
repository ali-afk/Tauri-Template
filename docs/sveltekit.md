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

1. Calls `commands.appMetadata()` via specta IPC
2. Populates `AppMetadata` Svelte writable store
3. Shows a shimmer loading screen (`loading-item` class) until it resolves

Settings are no longer loaded at the layout level — pages fetch them on demand
via `readSettings()` / `readSettingsField()` from `$tauri/config-serialization`.

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
| `$tauri`      | `src/lib/tauri`      |

`$scripts` only covers `src/lib/scripts/` — `scripts/gen/` scripts use relative
imports or resolve `$data`/`$types` through tsconfig paths.

### TypeScript Config Extension

`svelte.config.ts` customizes the auto-generated `.svelte-kit/tsconfig.json`:

```ts
typescript: {
  config(config) {
    config.exclude.push("../src/lib/tauri/bindings.ts");
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

1. **Rust:** `config/serialize.rs` reads/writes settings via
   `tauri-plugin-store` (`settings.json`). Metadata sourced from
   `tauri.conf.json` at startup.
2. **TypeScript:** Auto-generated `src/lib/tauri/bindings.ts` exposes typed
   commands (`readSettings`, `writeSettings`, etc.)
3. **Helpers:** `config-serialization.ts` wraps raw commands with `handleResult`
   for clean async/error handling
4. **Component access:** Use `readSettingsField(key)` on individual pages, or
   the bulk `readSettings()` for the full `AppSettings` object

### Adding a New Backend Command

1. Add command function in `src-tauri/src/commands.rs` with both
   `#[tauri::command]` and `#[specta::specta]` attributes
2. Register in `collect_commands![]` in `lib.rs`
3. Add to `src-tauri/permissions/allow-commands.toml`
4. Rebuild (`bun tauri:dev`), which regenerates `src/lib/tauri/bindings.ts`
5. Import `commands` from `$tauri/bindings` in frontend

## Window Title

The `Meta` component sets the window title (`<title>` in `<svelte:head>`),
formatted as `"Page | SiteName"`. Use it on every page:

```svelte
<Meta title="Home" />
```

Pass a `children` snippet for any extra head tags you need.
