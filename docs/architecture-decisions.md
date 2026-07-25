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

### Settings: `tauri-plugin-store` + `app_settings!` Macro

Settings stored in `settings.json` via `tauri-plugin-store`. No managed
`Mutex<AppSettings>` — every command opens the same `Arc<Store>`.

`app_settings!` macro (in `domain/macros.rs`) generates three types from a
single invocation:

- `AppSettings` — struct with typed fields + `Default`
- `AppSettingsKeyKind` — enum for field identification, derives `Display`,
  `AsRefStr`, `EnumString` (via `strum`) for store-key string conversion
- `AppSettingsKey` — tagged union for single-field IPC, with `kind()`,
  `to_json_value()`, `from_json_value()` methods

`if_empty_write_default()` seeds defaults on first launch. Adding a new setting
is one line in the macro invocation.

### Clean Architecture Layout

The Rust backend follows a three-layer structure in `src-tauri/src/`:

- `app/` — application layer: commands (IPC handlers), config re-exports
- `domain/` — domain layer: types, error enum, macros (no Tauri imports)
- `infrastructure/` — infrastructure layer: store serialization, plugin setup

`lib.rs` re-exports the three modules and registers commands via
`collect_commands![]`. `main.rs` calls `tauri_template_lib::run()`.

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

### Typed Error Handling: `app_error!` Macro

`app_error!` (in `domain/macros.rs`) generates `AppError` (typed IPC error
enum), `AppErrorKind` (discriminant enum), and `AppError::kind()` from a single
invocation:

```rust
app_error! {
    Config,
    Validation
}

// Generates:
// pub enum AppError {
//     Config(String),
//     Validation(String),
// }
// pub enum AppErrorKind { Config, Validation }
// impl AppError { pub fn kind(&self) -> AppErrorKind { ... } }
```

`#[serde(tag = "type", content = "data")]` serializes errors as
`{"type":"Config"|"Validation", "data": string}` — clean discriminated union on
the frontend.

`to_app_error!` generates `From<T>` impls mapping external error types to
`AppError::Config(...)`. All 5 IPC commands return `Result<T, AppError>` instead
of `Result<T, String>`. No more `.map_err(|e| e.to_string())` boilerplate.

### Test Structure: Inline Units + Minimal Integration

Unit tests live in `#[cfg(test)]` modules inside the source file — fast,
co-located, can access private items:

| Location          | Tests | What they test           |
| ----------------- | ----- | ------------------------ |
| `domain/error.rs` | 5     | AppError Display + From  |
| `domain/types.rs` | 19    | Email, Resolution, Theme |
| `app/config.rs`   | 5     | AppSettings macro output |

The only file in `tests/` is `serialize.rs` — a true integration test needing
`tauri::test::mock_builder()` with separate test binary. Each `test_app()` call
creates an isolated temp dir — no `#[serial]` needed.
