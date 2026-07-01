# Architecture Decisions

Non-obvious implementation choices — stuff that might look weird but are
intentional.

## Svelte Component Patterns

### Accordion Content Lives Outside `<details>`

```svelte
<!-- The animated content is in {#if}, not inside <details> -->
{#if isOpen}
 <div transition:standard={slide}>Content</div>
{/if}
```

Browsers don't yet support discrete keyword interpolation — you can't animate
`display: none` → `display: block`. Putting content inside `<details>` would
make it un-animatable. The `{#if}` block lets Svelte mount/unmount the element
so `transition:standard` can run.

**Future cleanup:** Once `transition-behavior: allow-discrete` has broad
support, move content back inside `<details>` and use `@starting-style` for the
animation instead.

### `aria-expanded` and `aria-controls` on `<summary>`

```svelte
<summary aria-expanded={isOpen} aria-controls={contentId}>
  ...
</summary>
...
{#if isOpen}
  <div id={contentId}>Content</div>
{/if}
```

Because the animated content lives _outside_ `<details>` (see above), the native
disclosure widget's open/closed state is not communicated to assistive
technology for the visible content. `aria-expanded` on `<summary>` fills that
gap explicitly.

`aria-controls` pointing to a conditionally-rendered element is intentional —
the target exists in the DOM while open (valid reference) and is absent while
closed (stale reference, but harmless: assistive technology ignores missing
`aria-controls` targets rather than erroring). Don't move the `id` inside
`<details>` to "fix" this.

### Route Change Closes Mobile Menu

```typescript
$effect(() => {
  page.url.pathname;
  isMenuOpen = false;
});
```

Reading `page.url.pathname` without using it isn't accidental — `$effect` tracks
reactive reads, so this line makes the effect re-run on every navigation. Don't
remove it.

### Curried Transition Function

```svelte
<div transition:standard={[slide]}>
```

Everything goes through `standard()` instead of using transitions directly. It
injects consistent easing/duration from design tokens and auto-disables
animations for `prefers-reduced-motion`.

### Color Cycling with `cycleColorScale()`

```typescript
// utils.ts
export function cycleColorScale(index: number): ColorDegrees {
  return ColorScale[index % 5] ?? 500;
}
```

```svelte
<!-- ButtonGrid.svelte -->
style="--_background: {colorSet[cycleColorScale(i)]}"
```

Cycles through `[100, 300, 500, 700, 900]` by index. Add a new item and it
automatically picks the next color in the sequence — no manual assignment.

### NavLinks `isMobile` Initialized as `null`

```typescript
let isMobile = $state<boolean | null>(null);
```

Initialized as `null` (not `false`) so the template guard `isMobile !== null`
prevents rendering before the DOM is ready. At module scope, `matchMedia`
doesn't work yet — Svelte's `MediaQuery` from `svelte/reactivity` would need
SSR-safe initialization but `adapter-static` skips SSR. This avoids a flash of
incorrect layout on initial paint.

## Rust Backend Decisions

### `Resolution` Now in Use

`Resolution(u32, u32)` with regex parser `^(\d+)x(\d+)$` is the actual type of
`AppSettings.resolution`. The regex captures width/height into a typed tuple at
construction time. Serde serializes as `[width, height]`.

### `short_description` / `long_description` Replaced

Removed from `AppMetaData`. Tauri v2's `ToTokens` impl hardcodes these to `None`
(see `tauri-utils-2.9.3/src/config.rs:4034`), so `expect()` panics at runtime
despite valid values in `tauri.conf.json`. Replaced with a single hardcoded
`description: String` field.

### `AppError` via `thiserror`

All internal Rust errors use `AppError` enum:

- `Io(String)` — wraps `std::io::Error`
- `Json(String)` — wraps `serde_json::Error`
- `Config(String)` — general config errors
- `Validation(String)` — type validation errors

`From` impls for `io::Error` and `serde_json::Error` enable `?` throughout.
Commands return `Result<T, AppError>` for typed errors at the IPC boundary.

### Settings Mutation with `Mutex`

`app_settings` command stores `Mutex<AppSettings>` via `app.manage()`.
`save_settings` command writes to disk and updates the Mutex in one atomic
operation. This avoids stale in-memory state after writes.

### Read/Write Pattern

`config/init.rs` was replaced by `config/serialize.rs` with two public
functions:

- `read_settings()` — if file missing, creates with defaults and returns them
- `write_settings()` — serializes to file

Both share a private `config_path()` helper. No more `open_settings_file` or
per-field read functions.

## Build & Tooling

### `NO_STRIP=true` Required for Tauri Builds

```bash
NO_STRIP=true bun tauri build
```

The build fails without this. The stripping step (which removes debug symbols to
reduce binary size) errors out; known issue on github. `NO_STRIP=true` skips it.
The resulting binary is larger but otherwise identical. Make sure to remove it
when fixed.

### Tauri Capabilities Configured

Capability sets are defined in `src-tauri/capabilities/default.json` with
permissions for `core:default`, `opener:default`, and `store:default`. The
`@tauri-apps/plugin-opener` and `@tauri-apps/plugin-store` plugins are
registered in `setup.rs`.

See `src-tauri/capabilities/default.json` and `src-tauri/src/setup.rs`.

### WebdriverIO + Platform-Aware Browser Selection

E2E tests use WebdriverIO with the Tauri service. Browser capabilities are
selected via `getBuildTarget()` from `vite.config.ts`, which picks Chrome on
Windows/Android and Safari on Linux/macOS/iOS.

### Storybook Standalone

Storybook is configured for component development (`bun run storybook`) but the
vitest integration (`@storybook/addon-vitest`) is removed due to a Bun
compatibility issue with `@storybook/builder-vite`'s `file:` protocol preset
resolution.

### Version Alignment

| File              | Version |
| ----------------- | ------- |
| `Cargo.toml`      | `1.2.0` |
| `tauri.conf.json` | `1.2.0` |
| `package.json`    | `1.2.0` |

All three sources match. `Cargo.toml` is the canonical source — update it first,
then sync the others. The `AppMetaData.app_version` field reads from
`config.version` in `tauri.conf.json` at runtime, not from `Cargo.toml`.

## Phase 1 Decisions

### Console Logging via `forwardConsole`, Not `attachConsole`

```
forwardConsole("log", trace);
// NOT: await attachConsole();
```

Both `forwardConsole` (manual wrapper) and `attachConsole()` (plugin helper) try
to forward `console.*` calls to the Tauri logger. Running both creates a cycle —
each wrapper patches console methods, so the second wraps the already-wrapped
version, and the Tauri logger's internal console calls get re-forwarded in an
infinite loop.

Additionally, `forwardConsole` applies `String(message)` coercion (fixes
`console.error(errorObj)` sending a non-string), while `attachConsole()` passes
the raw argument. Rather than patching `attachConsole`, the manual wrapper is
kept for explicit control.

Two log targets configured: `Stdout` + `LogDir { file_name: "log" }`.

### Isolation Pattern + CSP Strategy

The isolation pattern is enabled for defense-in-depth beyond CSP:

```json
"app": {
  "security": {
    "pattern": {
      "use": "isolation",
      "options": { "dir": "../.isolation" }
    },
    "csp": {
      "default-src": "'self' asset:",
      "connect-src": "ipc: http://ipc.localhost"
    }
  }
}
```

On each build, Tauri generates a random UUID as the isolation protocol scheme
(e.g. `isolation-<uuid>://localhost/`). In production, Tauri's runtime
auto-appends this origin to `default-src` in `get_asset()`. The placedholder
`customprotocol:` from Tauri docs is **not** a real CSP keyword — it's a docs
convention meaning "replace with your actual scheme". We use `'self' asset:`
which covers the custom protocol in production via Tauri's runtime patching.

The isolation iframe (`isolation-<uuid>://localhost/`) serves isolation
JavaScript from `.isolation/index.js` via Tauri's custom protocol handler. The
iframe performs AES-GCM encryption of IPC messages using runtime-generated keys.

Dev mode uses CSP from config (`csp` field) since `devCsp` is not set. The Tauri
runtime does not patch CSP for pages loaded via `devUrl`, so isolation iframe
loading relies on the configured CSP being sufficient.

### Custom TOML Permissions for App Commands

Tauri v2 requires explicit permission grants for app-defined commands. Inline
arrays in `capabilities/default.json` work for plugin permissions, but app
commands use TOML files in `src-tauri/permissions/`:

**`allow-commands.toml`** — grants the 3 app commands:

```toml
[[permission]]
identifier = "allow-commands"
commands.allow = ["app_settings", "app_metadata", "save_settings"]
```

Referenced in capabilities as `"allow-commands"`.

**`scope-applocaldata.toml`** — custom permission set combining deny-rule for
webview data with `fs:read-files`:

```toml
[[set]]
identifier = "safe-read-applocaldata"
permissions = ["deny-webview-data", "fs:read-files"]
```

This pattern separates permission definitions from capability assignments,
making it easy to reuse across multiple capabilities or windows.
