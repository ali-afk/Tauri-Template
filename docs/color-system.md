# Auto-Contrast Color System

Automatic text and border color calculation based on background lightness.

## Why This Exists

Every new background color would otherwise require manual testing, edge cases,
and duplicated logic. This system derives all related colors from a single
`--_background` input.

## How It Works

### The Core Calculation

```css
.card,
.btn {
  /* 1. Determine contrast direction from background lightness */
  --_contrast: sign(0.6 - l);

  /* 2. Auto-calculate text color */
  --text-main: oklch(from var(--_background) clamp(0, var(--_contrast), 1) 0 0);
}
```

**Step by step:**

1. `l` = lightness of `--_background` (0 = black, 1 = white)
2. `sign(0.6 - l)` returns:
   - `-1` if lightness > 0.6 (light background → need dark text)
   - `+1` if lightness < 0.6 (dark background → need light text)
3. `clamp(0, var(--_contrast), 1)` converts this to:
   - `0` (black text) for light backgrounds
   - `1` (white text) for dark backgrounds

### Auto-Generated Variables

When you set `--_background`, these are calculated automatically:

| Variable             | Purpose          | Calculation                        |
| -------------------- | ---------------- | ---------------------------------- |
| `--text-main`        | Primary text     | Black or white based on contrast   |
| `--text-mute`        | Secondary text   | 50% lightness, keeps hue           |
| `--border-color`     | Default border   | Darkened/lightened from background |
| `--hover-background` | Hover background | Slightly shifted from background   |

## Critical Requirement: `--_background`

> **The system ONLY works if `--_background` is defined.**

Without it, all calculations fail silently and you get broken colors.

### Setting `--_background`

**Via inline style (dynamic colors):**

```svelte
<article style="--_background: {colorValue}" class="card">
```

**Via component styles (static colors):**

```css
article {
  --_background: var(--bg-card);
}
```

## Critical Limitation: Only Works on `.card` and `.btn`

The auto variables (`--text-main`, `--border-color`, etc.) are **only**
recalculated inside elements with `.card` or `.btn` — the calculations are
defined in that selector block in `interactive.css`.

Child elements without those classes don't recalculate; they inherit the
parent's already-computed values.

If you need auto-contrast on a non-interactive element, add `.card` — hover
effects can be suppressed separately if unwanted.

## The Math Explained

### Why 0.6 Threshold?

```css
--_contrast: sign(0.6 - l);
```

Human perception doesn't treat 50% lightness as the midpoint — light colors
appear lighter than they "should". The 0.6 threshold switches to dark text
slightly earlier than pure middle gray to compensate.

### Why OKLCH?

OKLCH is perceptually uniform: equal steps in `l` appear as equal brightness
changes, and colors with the same `l` value appear equally bright regardless of
hue. HSL doesn't have this property. This makes the lightness-based contrast
calculation reliable across all hues.

### Border Calculation

```css
--_border-darkness: 2.5%;
--_border-brightness: calc(l + var(--_contrast) * var(--_border-darkness));

--border-color: oklch(
  from var(--_background) clamp(0, var(--_border-brightness), 1) c h
);
```

`--_contrast` is `-1` for light backgrounds and `+1` for dark ones, so borders
always shift toward the opposite end of the lightness scale.
`--_border-darkness` increases to `10%` on hover for a more pronounced outline.

## Usage Example

```svelte
<article style="--_background: {colorValue}" class="card">
```

## Debugging

**Colors look wrong?**

1. Check that `--_background` is defined on the element
2. Check that element has `.card` or `.btn` class
3. Inspect computed value of `--_contrast` (should be -1 or 1)

**Text not readable?**

1. Background might be near the 0.6 threshold — test with slightly
   lighter/darker values
2. Check that `--text-main` is not being overridden

## Related Files

- `src/lib/styles/interactive.css` — core calculations
- `src/lib/data/design-tokens.ts` — transition/color token values
- [CSS Patterns](./css.md) — usage patterns and utility classes
- [Architecture Decisions](./architecture-decisions.md) — why things are
  implemented this way
