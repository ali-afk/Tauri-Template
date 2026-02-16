# AGENTS.md — Tauri/SvelteKit Template

> Reference for all agentic coding agents working in this repository.
> Derived from `agent-memories/`, `docs/`, and direct source analysis.

---

## Agent Memory Files

> **All agents:** Read the `agent-memories/` directory at the start of every session.
> It contains the authoritative project knowledge, split by topic.

| File                                                               | Contents                                                                           |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| [`agent-memories/dev-workflow.md`](agent-memories/dev-workflow.md) | Commands, git hooks, pre-commit checklist, common issues                           |
| [`agent-memories/code-style.md`](agent-memories/code-style.md)     | Formatting, naming conventions, TypeScript rules, Svelte 5 patterns, commit format |
| [`agent-memories/css-system.md`](agent-memories/css-system.md)     | Design tokens, OKLCH auto-contrast rules, utility classes, responsive patterns     |
| [`agent-memories/architecture.md`](agent-memories/architecture.md) | Critical rules — transitions, SSR, Tauri build, tauri-specta                       |

**Claude Code** auto-loads these via `CLAUDE.md` (`@`-imports). All other agents
should read the four files above before beginning work.

---

## Tech Stack

| Layer              | Tool                                                          |
| ------------------ | ------------------------------------------------------------- |
| Framework          | SvelteKit 2 + Svelte 5 (Runes)                                |
| Desktop            | Tauri 2 (Rust + `tauri-specta` for TS type exports)           |
| Language           | TypeScript 5 (strict)                                         |
| Styling            | CSS custom properties · CSS Layers · `oklch()` · LightningCSS |
| Build              | Vite 7 + `@sveltejs/adapter-static`                           |
| Linter / Formatter | Biome 2                                                       |
| Package Manager    | **bun** — never npm / yarn / pnpm                             |

---

## Commands

### Development

```bash
bun dev            # SvelteKit dev server → localhost:5173
bun tauri:dev      # Tauri desktop dev (wraps vite dev)
bun build          # Web production build (adapter-static)
bun tauri:build    # Tauri desktop build  ⚠ NO_STRIP=true is baked in
bun preview        # Preview web production build
```

### Code Quality

```bash
bun fix            # Format/lint staged files  (runs automatically on commit)
bun fix-all        # Format + lint entire src/ + svelte-kit sync + type-check
bun watch          # Continuous type checking (svelte-check --watch)
```

> **No dedicated test runner.** `bun fix-all` (type-check) is the quality gate.

---

## Git Hooks (Husky)

| Hook         | Runs                                        |
| ------------ | ------------------------------------------- |
| `pre-commit` | `bun fix` — formats/lints staged files      |
| `commit-msg` | Validates type prefix (rejects on mismatch) |
| `pre-push`   | `bun fix-all` — full format + type-check    |

> **Never use `--no-verify`.** Hook fails → run `bun fix-all`, fix errors, then recommit.

---

## Project Structure

```text
src/
├── routes/
│   ├── +layout.svelte      # Root: imports CSS, calls registerDesignTokens() on mount
│   ├── +layout.ts          # ssr=false, prerender=true — SPA mode for Tauri
│   ├── +error.svelte
│   └── (main)/
│       ├── +layout.svelte  # Wraps pages in <main>
│       └── +page.svelte    # Home page
└── lib/
    ├── components/shared/  # Reusable UI components (+ helpers/ sub-dir)
    ├── data/shared/        # DesignTokens, AppProperties, image objects
    ├── types/
    │   ├── colors.ts           # ColorDegrees, ColorScale = [100,300,500,700,900]
    │   ├── component-props.ts  # Item, Image, QuoteData, LoadPriority, etc.
    │   └── design-tokens.ts    # PropertyConfig, PropertyNode (recursive)  ⚠
    ├── scripts/
    │   ├── register-design-tokens.ts  # ⚠ Core — flattens tokens → CSS.registerProperty()
    │   ├── media.ts        # getMediaCurrent(), queryCssProperty()
    │   ├── transition.ts   # standard() curried transition wrapper
    │   └── utils.ts        # generateId(), isSSR(), parseCssTime(), cycleColorScale()
    ├── assets/shared/      # Images/SVGs — PascalCase barrel exports
    └── styles/
        ├── index.css             # Layer order + @imports
        ├── resets.css            # box-sizing reset; html font-size: 62.5%
        ├── variables.css         # clamp(), color-mix(), breakpoint overrides
        ├── document-loading.css  # Shimmer before tokens register
        ├── layout.css            # Body, header, links, sticky-header
        ├── interactive.css       # ⚠ OKLCH auto-contrast (.card, .btn); GPU hints
        ├── utility.css           # .wrapper .stack .row .card-grid .center .lift
        └── accessibility.css     # prefers-reduced-motion, :focus-visible, ext-link icon
src-tauri/                  # Rust source + Tauri config (lib.rs, main.rs, Cargo.toml)
agent-memories/             # Agent memory files (read at session start)
docs/                       # Extended docs: architecture, CSS, color system, SvelteKit
```

### ⚠ Files to Treat with Extra Care

| File                                        | Risk                                         |
| ------------------------------------------- | -------------------------------------------- |
| `src/lib/scripts/register-design-tokens.ts` | Breaks all CSS vars if changed incorrectly   |
| `src/lib/styles/interactive.css`            | Breaks `.card`/`.btn` auto-contrast coloring |
| `src/lib/types/design-tokens.ts`            | Structure changes break the token walker     |

---

## Architecture Decisions (summary)

Full rationale in [`docs/architecture-decisions.md`](docs/architecture-decisions.md)
and [`agent-memories/architecture.md`](agent-memories/architecture.md).

| Decision               | Rule                                                                |
| ---------------------- | ------------------------------------------------------------------- |
| Accordion content      | Keep in `{#if}`, not inside `<details>` — needed for animation      |
| Exclusive accordions   | Use `name` attribute on `<details>` — native radio-group            |
| Mobile detection state | Initialize as `null`, not `false` — avoids hydration flash          |
| Route-change effects   | Read `page.url.pathname` without using it — tracks navigation       |
| Transitions            | Always use `standard()` wrapper — never raw Svelte transitions      |
| Document shimmer       | `document-loaded` class added on mount — do not remove              |
| Tauri build            | `NO_STRIP=true` baked into `bun tauri:build` — toolchain workaround |
| SSR                    | Disabled (`ssr=false`) — Tauri apps are SPAs, no server at runtime  |
| Tauri commands         | Use `tauri_specta` to export Rust types to TypeScript               |

---

## Further Reading

| Doc                                                                | Contents                                                      |
| ------------------------------------------------------------------ | ------------------------------------------------------------- |
| [`docs/architecture-decisions.md`](docs/architecture-decisions.md) | Intentional "weird" patterns explained                        |
| [`docs/color-system.md`](docs/color-system.md)                     | Full OKLCH auto-contrast math and usage                       |
| [`docs/css.md`](docs/css.md)                                       | CSS utility patterns, transitions, shadows, responsive design |
| [`docs/sveltekit.md`](docs/sveltekit.md)                           | Routing, data loading, barrel exports, Meta component         |
