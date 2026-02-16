# Architecture Decisions

Non-obvious choices — do not "fix" these. Full rationale: [`docs/architecture-decisions.md`](../docs/architecture-decisions.md)

## Patterns fully documented in docs/architecture-decisions.md

Read that file for: accordion content outside `<details>`, exclusive accordions via
`name`, three-state boolean for mobile detection, route-change side-effect read,
document loading shimmer, `generateId()` counter+random, color cycling with
`cycleColorScale()`, conditional class binding.

## Critical rules (quick reference)

- **Transitions:** Never use Svelte transitions directly — always wrap with `standard()` from `$scripts/transition`.
- **`NO_STRIP=true`** is already baked into `bun tauri:build` — do not remove it.
- **SSR:** Never re-enable SSR.

  ```ts
  // src/routes/+layout.ts
  export const ssr = false;
  export const prerender = true;
  ```

- **Tauri commands:** Any new `#[command]` must use `tauri_specta` to export types to TypeScript.
