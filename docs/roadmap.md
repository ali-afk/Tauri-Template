# Roadmap

Phased development plan. Each phase is self-contained and shippable.

## Architectural Decision

**Unified storage via plugin-store.** Remove custom `config/serialize.rs`. All
settings + app data backed by `@tauri-apps/plugin-store`. Same `AppSettings`
struct, same specta types, same validation — less code, auto-sync via `watch()`.

## Phase 1 — Quick Wins

- [ ] **Misc bugs:** `transtionParams` typo, `parseBezierCoords` regex,
      `initalised` typo, `+error.svelte` fallback, `ButtonGrid` color guard
- [ ] **Logging:** Add `tauri-plugin-log` + `log` crate, register in `setup.rs`
- [ ] **Security hardening:** Set CSP in `tauri.conf.json`, scope capabilities

## Phase 2 — Storage & Backend

- [ ] **Unified storage:** Remove `serialize.rs`, add store-backed
      `load_settings` / `save_settings`, auto-sync via `watch()`
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
