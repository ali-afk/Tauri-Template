# CSS Patterns

CSS architecture and design tokens used in this codebase.

## Design Tokens

All values come from CSS custom properties. Never hardcode values.

CSS custom properties are registered at build time by `gen.ts`, which reads
`design-tokens.ts` and generates `gen.css`. `variables.css` then aliases fluid
font sizes and spacing to Open Props values and adds responsive overrides.

### Why Both `variables.css` AND `design-tokens.ts`?

`design-tokens.ts` holds static values that need to be registered as animatable
`@property` declarations — things like colors, font weights, and transition
durations.

`variables.css` exists for two reasons:

1. **CSS functions can't live in TypeScript** — `clamp()`, `color-mix()`, and
   `light-dark()` must be written in CSS:

   ```css
   --fs-1: var(--font-size-fluid-0);
   --bg-card: color-mix(in srgb, var(--bg-main), var(--accent) 5%);
   ```

2. **Media query overrides** — the responsive shift-down pattern reassigns token
   values at breakpoints, which requires CSS:

   ```css
   @media (max-width: 768px) {
     --fs-4: var(--fs-3); /* shift down 1 level */
   }
   ```

### Token Quick Reference

```css
/* Font sizes:   --fs-1 … --fs-4  (fluid, via Open Props) */
/* Font weights: --fw-light / --fw-regular / --fw-semibold / --fw-bold */
/* Line heights: --lh-1 … --lh-4 */
/* Spacing:      --space-1 … --space-7  (fluid, via Open Props) */
/*               --space-gutter / --space-min / --space-max */
/* Breakpoints:  --breakpoint-sm / --breakpoint-md / --breakpoint-lg / --breakpoint-xl */
/* Colors:       --color-primary-{100,300,500,700,900} */
/*               --color-secondary-{100,300,500,700,900} */
/*               --color-status-{danger,warn,info,success} */
/* Semantic:     --text-main, --text-mute, --bg-main, --bg-card */
/*               --btn-primary, --accent, --link */
/* Borders:      --border-color, --border-radius */
/* Shadows:      --shadow-weak, --shadow-strong */
/* Transitions:  --transition-duration-{short,medium,long}, --transition-easing */
```

Font sizes and spacing are fluid via `clamp()` — no per-component media queries needed.

## Transitions

Only set `transition-property` in component styles. Duration and easing are
applied globally by `layout.css` via the `*` selector. Override only via
`--transition-duration-{short,medium,long}`.

```css
/* Component style — only declare the property */
summary img {
  transition-property: transform;
}
```

In JS/Svelte, always use `standard()` from `$scripts/transition` instead of
transitions directly — it injects design-token easing/duration and respects
`prefers-reduced-motion`. See `architecture-decisions.md`.

## Path Aliases in CSS `url()`

Vite resolves path aliases (e.g. `$assets`) in CSS `url()` — don't replace with relative paths.

## Layout Patterns

### Grid (auto-fit)

```css
display: grid;
grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
gap: var(--space-5);
```

`min(300px, 100%)` ensures the column never exceeds the viewport on very small
screens.

## Responsive Design

Fluid values handle most responsiveness automatically. Use explicit media queries
only for structural layout changes (column count, direction, etc.).

**Breakpoints** (from Open Props via `design-tokens.ts`):
`--breakpoint-sm`, `--breakpoint-md`, `--breakpoint-lg`, `--breakpoint-xl`

Note: media queries can't use CSS custom properties — use the raw pixel values
from `DesignTokens.breakpoint.*` in component comments for traceability.

### Responsive "Shift Down" Pattern

At smaller breakpoints, token values are reassigned so the same variable name
maps to a smaller value. Components use tokens normally with no media queries.

**Shift levels (defined once in `variables.css`):**

| Breakpoint | Fonts      | Spaces     |
| ---------- | ---------- | ---------- |
| `≤ 768px`  | −1 level   | −1 level   |
| `≤ 480px`  | −2 levels  | −2 levels  |

## Utility Classes

Full list in `utility.css`. Base styles shared via attribute selectors:

```css
[class*="stack"] { display: flex; flex-direction: column; }
.stack           { gap: var(--space-4); }
.stack--tight    { gap: var(--space-3); }
```

**Reserved substrings** — avoid these in unrelated class names:
`row`, `stack`, `title`, `card-grid`, `center`, `lift`

## GPU Optimization

`.card` and `.btn` include `backface-visibility: hidden` and `transform: translateZ(0)`
for smoother transitions. Disable if you notice blurry text.

## Auto-Contrast System (`--_background`)

Set `--_background` on any `.card` or `.btn`. The system derives `--text-main`,
`--text-mute`, `--border-color`, and hover colors automatically using OKLCH
relative color syntax.

**Never** set `color`, `background-color`, or `border-color` directly on `.card`
or `.btn` — only set `--_background`.

See [`docs/color-system.md`](./color-system.md) for the full explanation,
math, and debugging guide.
