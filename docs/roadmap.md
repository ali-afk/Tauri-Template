# Roadmap

Phased development plan. Each phase is self-contained and shippable.

## Architectural Decision

**Unified storage via plugin-store.** Replace custom `serialize.rs` with
store-backed read/write. Use `kv_as_tuple` / `tuple_as_kv` helpers with a macro
to auto-generate `AppSettingsKey` / `AppSettingsKeyKind` enums and their
conversion functions from a single field list.

## Phase 1 — Quick Wins

- [ ] **Misc bugs:** `transtionParams` typo, `parseBezierCoords` regex,
      `initalised` typo, `+error.svelte` fallback, `ButtonGrid` color guard
- [x] **Logging:** Add `tauri-plugin-log` + `log` crate, register in `setup.rs`
      (release builds only via `#[cfg(not(debug_assertions))]`)
- [x] **Security hardening:** Set CSP in `tauri.conf.json`, scope capabilities,
      isolation pattern, custom permissions

## Phase 2 — Storage & Backend

- [x] **Unified storage:** Migrated `serialize.rs` to `tauri-plugin-store`.
      Added `AppSettingsKey` / `AppSettingsKeyKind` enums with `kv_as_tuple` /
      `tuple_as_kv` conversion helpers. Per-field read/write IPC commands
      (`read_settings_field`, `write_settings_field`, `read_settings`,
      `write_settings`).
- [ ] **Macro-generate settings enums:** Replace hand-written `AppSettingsKey` /
      `AppSettingsKeyKind` / `kv_as_tuple` / `tuple_as_kv` with a
      `settings_fields!` macro. New field = one line in the invocation + one
      `StoreValue` impl. Reduces touch points from 6 to 2 per field.
- [ ] **Rust tests:** Co-located `#[cfg(test)]` for types,
      `tauri::test::mock_context()` for store-backed commands

## Phase 3 — Frontend Foundation

- [ ] **Bits UI components:** Dialog, Toast, Toggle, Input, Tabs, Tooltip —
      co-located `__tests__/`
- [ ] **Storybook:** Stories in component `__tests__/`, remove boilerplate
      `src/stories/`
- [ ] **IPC error + loading states:** `invoke()` wrapper + `<Load>` component
      (loading/error/ready)
- [ ] **HeroImage alt fix** (carried from bugs, done in component phase)

## Phase 4 — App-Ready Features

- [ ] **Settings UI:** Bits primitives + unified storage
- [ ] **Resolution handling:** Read window size (A), react to resize (B),
      validate before apply (C)

## Phase 5 — Cross-Cutting

- [ ] **i18n:** `typesafe-i18n`, bilingual (English + Arabic), RTL, language
      switcher
- [ ] **Integration + E2E:** Component tests in `__tests__/`, expanded WDIO
      specs

## Future (not in active plan)

- Property-based testing — `proptest` or `quickcheck` for fuzz-style assertions
- CSS alias verification — `mask: url("$assets/externalLinkIcon.svg")` in
  `accessibility.css`
- Loading screen branding — replace shimmer with branded loading state
