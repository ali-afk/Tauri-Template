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

### Read/Write Pattern (replaced `init.rs`)

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

### Tauri Capabilities Not Yet Configured

`src-tauri/gen/schemas/capabilities.json` is empty `{}` and no capability
configs exist under `src-tauri/capabilities/`. The app currently runs with
default permissions. **TODO:** Define capability sets per platform before
production deployment.

### Version Alignment

| File              | Version |
| ----------------- | ------- |
| `Cargo.toml`      | `1.0.0` |
| `tauri.conf.json` | `1.0.0` |
| `package.json`    | `1.0.0` |

All three sources match. `Cargo.toml` is the canonical source — update it first,
then sync the others. The `AppMetaData.app_version` field reads from
`config.version` in `tauri.conf.json` at runtime, not from `Cargo.toml`.

## Improvement Plan

### CI & Build

1. **Tauri capabilities** — define permission sets in `src-tauri/capabilities/`.
   App currently runs with default permissions. Required before production.
2. ~~CI cache key — fixed: includes `${{ github.repository }}` to prevent stale
   caches on repo rename.~~

### Rust Backend

1. ~~**Error types** — done: `thiserror` + `AppError` enum.~~
2. ~~**Settings mutation** — done: `save_settings` IPC command +
   `config/serialize.rs`.~~
3. **Test suite** — unit tests for config/types, integration tests for commands.
   Zero Rust tests exist.
4. **Async patterns** — add Tokio for background tasks.
5. **Property-based testing** — `proptest` or `quickcheck` for fuzz-style
   assertions.
6. **Runtime resolution validation** — check monitor support before applying
   settings.

### Frontend Fixes

1. **`HeroImage` alt prop** — the `<img>` always uses `{title}` as alt text
   instead of the separately defined `{alt}` prop. Wire `alt` prop correctly.
2. **`+error.svelte` fallback** — button uses
   `--_background:
   var(--color-status-info)` with no fallback. If that
   variable fails, the auto-contrast system produces invisible text.
3. **Component integration tests** — `@testing-library/svelte` is installed but
   unused. Mount components and assert rendered output.
4. **CSS alias verification** — `accessibility.css` uses
   `mask: url("$assets/externalLinkIcon.svg")`. Vite resolves aliases in CSS
   `url()` — verify this works at build time.
5. **Loading screen** — currently just a shimmer (`loading-item`). Consider
   branding or progress text during IPC init.

### Known Bugs / Typos

1. `transtionParams` → `transitionParams` in `src/lib/scripts/transition.ts:232`
2. `initalised` → `initialised` in
   `src/lib/components/helpers/NavLinks.svelte:18` (comment)

### Edge Cases

1. **`castToMilliseconds` not exported** — defined in `utils.ts` but not
   exported. Extract for independent testing.
2. **`ButtonGrid` color could be `undefined`** — `colorSet[cycleColorScale(i)]`
   may return `undefined` if `ColorDegrees` values don't match the color set
   keys. Guard against it.
3. **`parseBezierCoords` regex** — allows double-commas like
   `cubic-bezier(0.4,,0.2,1)`. Tighten to reject malformed input.
