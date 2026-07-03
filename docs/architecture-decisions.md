# Architecture Decisions

Non-obvious implementation choices — stuff that might look weird but are
intentional.

## Svelte Component Patterns

### Accordion: Content Outside `<details>`

Content lives in `{#if}` (not inside `<details>`) because browsers can't animate
`display: none → block`. `{#if}` lets Svelte mount/unmount so `transition:` can
run.

**Future cleanup:** Once `transition-behavior: allow-discrete` has broad
support, move content back inside `<details>` and use `@starting-style` for the
animation instead.

### `aria-controls` on a Conditionally-Rendered Element

Points to an `id` that exists only while open. Harmless when closed — assistive
tech ignores missing targets rather than erroring.

### `isMobile` Initialized as `null`

```typescript
let isMobile = $state<boolean | null>(null);
```

Not `false` — `null` lets the template guard `isMobile !== null` defer rendering
until the DOM is ready for `matchMedia`.

## Rust Backend Decisions

### Settings: `tauri-plugin-store`

Settings stored in `settings.json` via the plugin. `kv_as_tuple` / `tuple_as_kv`
convert between `AppSettingsKey` (Rust) and store entries.
`if_empty_write_default()` seeds defaults on first launch. No managed
`Mutex<AppSettings>` — every command opens the same `Arc<Store>`.

## Build & Tooling

### `NO_STRIP=true` Required

```bash
NO_STRIP=true bun tauri build
```

Strip step errors on this platform. Known GitHub issue. Remove when fixed.

### Console Logging: Release Only

`tauri-plugin-log` with `Stdout + LogDir` registered only in release builds
(`#[cfg(not(debug_assertions))]`). Dev builds keep frontend and Rust logs
separate — Tauri's documented `forwardConsole` / `attachConsole` pattern causes
stacks overflowed from the frontend ↔ Rust cycle.

### Isolation + CSP

Only `default-src` is set — it cascades to all directives not explicitly
defined, and minimises attack surface. The isolation pattern (AES-GCM encrypted
IPC) provides defense-in-depth beyond CSP alone.

### Custom TOML Permissions

App commands use TOML files in `src-tauri/permissions/` (not inline in
capabilities). Pattern: define named permissions there, reference by identifier
from `capabilities/default.json`. Separates definition from assignment.
