# Code Style & Conventions

## Formatting (Biome — auto-enforced on commit)

| Rule            | Value                  |
| --------------- | ---------------------- |
| Indentation     | Tabs (not spaces)      |
| Quotes          | Double quotes          |
| Trailing commas | Yes, in arrays/objects |
| Semicolons      | Yes                    |
| Line endings    | LF                     |

Biome relaxes some rules for `.svelte` files (`useConst`, `noUnusedVariables`,
`noUnusedImports` are disabled — Svelte's reactivity system triggers false positives).

## Naming Conventions

| Entity                     | Convention          | Example                                         |
| -------------------------- | ------------------- | ----------------------------------------------- |
| Component files            | `PascalCase.svelte` | `HeroImage.svelte`                              |
| Script / data / type files | `kebab-case.ts`     | `register-design-tokens.ts`                     |
| Variables & functions      | `camelCase`         | `isMenuOpen`, `handleClick`                     |
| CSS classes                | `kebab-case`        | `.hero-section`, `.card-grid--tight`            |
| Asset barrel re-exports    | `PascalCase`        | `export { default as Logo } from "./logo.webp"` |
| CSS "private/scoped" vars  | `--_` prefix        | `--_background`, `--_contrast`                  |

## TypeScript

- **Strict mode** + `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`,
  `noImplicitReturns`, `noImplicitOverride`
- Always type data arrays/objects: `export const items: Item[] = [...]`
- Use `interface` for structured data; extend for component props:

  ```ts
  interface Props extends QuoteData {
    color: ColorDegrees;
    direction: "left" | "right";
  }
  ```

- Place reusable types in `src/lib/types/`
- Use `import type` for type-only imports
- Use `as const satisfies T` on data objects:

  ```ts
  export const Logo = { url: "...", dimensions: { ... } } as const satisfies Image;
  ```

## Path Aliases

Always use — never use `../../` across lib boundaries. Full usage examples: [`docs/sveltekit.md`](../docs/sveltekit.md#path-aliases)

| Alias         | Resolves to          |
| ------------- | -------------------- |
| `$components` | `src/lib/components` |
| `$data`       | `src/lib/data`       |
| `$assets`     | `src/lib/assets`     |
| `$scripts`    | `src/lib/scripts`    |
| `$types`      | `src/lib/types`      |
| `$styles`     | `src/lib/styles`     |
| `$tauri`      | `src/lib/tauri`      |

> `$tauri` is not in `docs/sveltekit.md` — do not omit it.

## Barrel Exports

Every `lib/` subdirectory has an `index.ts` — always import from the directory, not the file. See [`docs/sveltekit.md`](../docs/sveltekit.md#barrel-exports).

## Svelte 5 Component Structure (order matters)

```svelte
<script lang="ts">
  // 1. Imports — framework first, then local (use aliases)
  import type { Snippet } from "svelte";
  import { DesignTokens } from "$data/shared";
  import type { ColorDegrees } from "$types/colors";

  // 2. Props
  interface Props { title: string; children: Snippet }
  let { title, children }: Props = $props();

  // 3. Local state
  let isOpen = $state(false);

  // 4. Derived values
  let fullTitle = $derived(`${title} | App`);

  // 5. Effects
  $effect(() => { /* ... */ });

  // 6. Functions
  function handleClick() { isOpen = !isOpen; }
</script>

<!-- 7. Template -->
<div class="card">{title}</div>

<!-- 8. Scoped styles (CSS nesting with &) -->
<style>
  div { padding: var(--space-3); }
</style>
```

For page components (PageProps / server data) and conditional class binding, see
[`docs/sveltekit.md`](../docs/sveltekit.md) and
[`docs/architecture-decisions.md`](../docs/architecture-decisions.md#conditional-class-binding).

## Accessibility Requirements

- `alt` on every `<img>` (`""` for decorative images)
- Explicit `width`/`height` on every image; use `loading="lazy"` / `fetchpriority`
- ARIA labels on interactive elements; `aria-expanded` + `aria-controls` on accordions
- Semantic HTML: `<button>` not `<div onclick>`, `<article>` for cards
- Root layout has a `<SkipLink>` component — do not remove
- `<Meta title="Page name" />` on every page
- External links: `target="_blank" rel="noopener noreferrer"` (accessibility.css auto-appends an icon via CSS mask)
- `prefers-reduced-motion` respected globally via `accessibility.css` and `standard()`

## Git Commit Format

```text
<type>[+type]...: <short summary ≤ 50 chars>

--- Changes ---
Description:
 - Specific change 1

Context:
 - Why this change was needed

--- Merged Branches (if any) ---
 - branch-name
```

Valid types: `fix` `config` `feat` `feat-rm` `update` `experimental` `docs` `chore`
`style` `content` `misc` `refactor`

**Never add `Co-Authored-By` lines.** Commits are attributed to the human developer only.
