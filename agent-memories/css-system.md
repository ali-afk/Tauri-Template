# CSS System

Full reference: [`docs/css.md`](../docs/css.md) · [`docs/color-system.md`](../docs/color-system.md)

## Design Token Sources

| Source                                 | Contains                                                                        |
| -------------------------------------- | ------------------------------------------------------------------------------- |
| `src/lib/data/shared/design-tokens.ts` | Static values — source for `gen.ts`; type-safe, animatable                      |
| `src/lib/styles/gen.css`               | Auto-generated `@property` declarations + `:root` values — DO NOT EDIT MANUALLY |
| `src/lib/styles/variables.css`         | `clamp()`, `color-mix()`, breakpoint overrides — CSS functions can't live in TS |

## Token Quick Reference

```css
/* Spacing:     --space-0 … --space-8  (fluid, clamp-based) */
/* Font size:   --fs-0 … --fs-7        (fluid, clamp-based) */
/* Font weight: --fw-light/regular/semibold/bold */
/* Line height: --lh-1 … --lh-4 */
/* Colors:      --color-primary-{100,300,500,700,900} */
/*              --color-secondary-{100,300,500,700,900} */
/*              --color-status-{danger,warn,info,success} */
/* Semantic:    --text-main, --text-mute, --bg-main, --bg-card */
/*              --btn-primary, --accent, --link */
/* Borders:     --border-color, --border-radius */
/* Shadows:     --shadow-weak, --shadow-strong */
/* Transitions: --transition-duration-{long,medium,short}, --transition-easing */
```

> Never hardcode colors, spacing, font sizes, or durations — always use tokens.

## ⚠ OKLCH Auto-Contrast — Critical Rules

Set `--_background` on any `.card` or `.btn`. The system derives everything else. Full math: [`docs/color-system.md`](../docs/color-system.md)

- **Never** set `color`, `background-color`, or `border-color` on `.card`/`.btn` — only set `--_background`.
- Only acceptable override: `color: var(--text-mute)` for secondary text.
- Auto-contrast **only works on `.card` or `.btn`** — child elements without those classes don't recalculate.
- `--_contrast` is internal — never set it externally.

## CSS Layers

```css
@layer base, loading-state, layout, utility, accessibility;
```

## Transitions

Only set `transition-property` in component styles — duration/easing are applied
globally by `layout.css`. Override via `--transition-duration-{long,medium,short}`
only. See [`docs/css.md`](../docs/css.md#transitions).

## Responsive Shift-Down

| Breakpoint | Fonts     | Spaces    |
| ---------- | --------- | --------- |
| `≤ 1024px` | −1 level  | —         |
| `≤ 768px`  | −2 levels | −1 level  |
| `≤ 480px`  | −3 levels | −2 levels |

Components need no per-component media queries for font/space scaling. When a
component-level breakpoint is unavoidable, annotate: `/* DesignTokens.breakpoint[2] */`.
See [`docs/css.md`](../docs/css.md#responsive-design).

## Utility Classes

Full table: [`docs/css.md`](../docs/css.md#utility-classes)

⚠ `stack`, `row`, `center`, `card-grid`, `title` are matched via `[class*="..."]`
— avoid these substrings in unrelated class names.

## Base Resets

- `html { font-size: 62.5% }` — 1rem = 10px
- All elements: `box-sizing: border-box`, margin/padding reset
- Images: `display: block`, `max-width: 100%`, `height: auto`
- `ul`: `list-style: none`, `display: flex`

## Color Tinting

All grays are `color-mix()`-tinted with `--color-primary-500` — changing the primary
color updates all grays automatically. See [`docs/css.md`](../docs/css.md#color-mixing).
