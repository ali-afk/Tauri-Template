# Roadmap

tauri-template — Tauri v2 + SvelteKit v2 + Svelte 5 desktop app template.

Current version: `1.3.1`

---

### Phase 1 — Quick Wins (Done)

- [x] Misc bugs cleanup
- [x] Logging — `tauri-plugin-log` + `log` crate (release builds only)
- [x] Security hardening — CSP, isolation pattern, scope capabilities, custom
      permissions

### Phase 2 — Storage & Backend

- [x] Unified storage — `serialize.rs` migrated to `tauri-plugin-store` with
      per-field IPC
- [ ] **Macro-generate settings enums** — `settings_fields!` macro +
      `StoreValue` trait replacing hand-written boilerplate
- [ ] Rust tests — `#[cfg(test)]` for types, `tauri::test::mock_context()` for
      commands
- [ ] Rust CI test gate — `cargo test` in `tauri.yml`

### Phase 3 — Template Foundation

- [ ] **Clean architecture scaffold** —
      `src/lib/{domain,application,infrastructure}/` dirs with example files per
      layer
- [ ] **IPC wrapper** — reactive Svelte 5 runes store per domain wrapping specta
      commands
- [ ] **Theme switcher** — `mode-watcher` + `<ThemeToggle>` component;
      `light-dark()` tokens adapt automatically
- [ ] **Native menu bar** — macOS standard layout via `tauri::menu` builder

### Phase 4 — Frontend Foundation

- [ ] **Bits UI components** — Dialog, Toast, Toggle, Input, Tabs, Tooltip
      (co-located `__tests__/`)
- [ ] **Command palette** — Bits UI `Dialog` + `Command`, Cmd+K, fuzzy search
- [ ] **Layout shell** — `<AppShell>` with sidebar + header + main slot
      (optional scaffold)
- [ ] **Storybook** — stories co-located in `__tests__/`, remove `src/stories/`
- [ ] **Fix HeroImage alt**

### Phase 5 — App Features

- [ ] **Settings UI** — Bits primitives + unified storage
- [ ] **Resolution handling** — read, watch, validate

### Phase 6 — Cross-Cutting

- [ ] **i18n** — `typesafe-i18n`, bilingual (English + Arabic), RTL, language
      switcher
- [ ] **Release-please + CHANGELOG** — auto-bumps `package.json` / `Cargo.toml`
      / `tauri.conf.json`
- [ ] **Integration + E2E** — component tests, expanded WDIO specs

### Future (not in active plan)

- Property-based testing — `proptest` or `quickcheck` for fuzz-style assertions
- CSS alias verification — `mask: url("$assets/externalLinkIcon.svg")` in
  `accessibility.css`
- Loading screen branding — replace shimmer with branded loading state
