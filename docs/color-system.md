# Auto-Contrast Color System

Automatic text and border color calculation based on background lightness.

## Why This Exists

Without this system, every new background color would require:

1. Manually testing if text is readable
2. Adding CSS edge cases for light vs. dark backgrounds
3. Duplicating hover/border color logic per component
4. Risking accessibility failures when colors change

The auto-contrast system eliminates this by
**deriving all related colors from a single input**.

## How It Works

### The Core Calculation

```css
.card, .btn {
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

| Variable | Purpose | Calculation |
| ---------- | --------- | ------------- |
| `--text-main` | Primary text | Black or white based on contrast |
| `--text-mute` | Secondary text | 50% lightness, keeps hue |
| `--border-color` | Default border | Darkened/lightened from background |
| `--hover-color` | Hover background | Slightly shifted from background |
| `--hover-border-color` | Hover border | Calculated on hover |

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

**Via scoped overrides:**

```css
.special-card {
  --_background: var(--color-primary-700);
}
```

## Critical Limitation: Only Works on `.card` and `.btn`

> **The auto variables (`--text-main`, `--border-color`, etc.) are ONLY
> calculated inside _interactive_ elements (`.card` or `.btn`).**

This is because the calculations are defined in the `.card, .btn` selector
block in `interactive.css`.

### What Works

```svelte
<!-- Card class triggers auto-contrast -->
<article class="card" style="--_background: {color}">
  <p>Text color auto-adjusts</p>
</article>

<!-- Button class triggers auto-contrast -->
<button class="btn" style="--_background: {color}">
  Click me
</button>
```

### What Does NOT Work

```svelte
<!-- NO .card or .btn class = NO auto-contrast -->
<div style="--_background: {color}">
  <p>Text color will NOT adjust - uses global --text-main instead</p>
</div>

<!-- Child inherits --_background but NOT the calculations -->
<article class="card" style="--_background: {color}">
  <div class="nested-element">
    <!-- If you set a different --_background here, it won't recalculate -->
  </div>
</article>
```

### If You Need Auto-Contrast on a Non-Interactive Element

Either:

1. Add `.card` class (even without hover effects, it enables the system)
2. Manually set the colors using the same calculation pattern

## The Math Explained

### Why 0.6 Threshold?

```css
--_contrast: sign(0.6 - l);
```

Human perception doesn't treat 50% lightness as the midpoint. Light colors
appear lighter than they "should" due to how our eyes work. The 0.6 threshold
accounts for this — it switches to dark text slightly earlier than pure
middle gray.

### Why OKLCH?

OKLCH (Oklab Lightness, Chroma, Hue) is a **perceptually uniform** color
space:

- Equal steps in `l` appear as equal brightness changes
- Colors with same `l` value appear equally bright
- Unlike HSL where "50% lightness" varies wildly by hue

This makes the lightness-based contrast calculation reliable across all hues.

### Border Darkness Calculation

```css
--border-brightness: calc(
   l + var(--_contrast) * var(--border-darkness)
 );

--border-color: oklch(
   from var(--_background) clamp(
   0, var(--border-brightness), 1
 ) c h);
```

- Light backgrounds → darken border (`--_contrast` = -1)
- Dark backgrounds → lighten border (`--_contrast` = +1)
- `--border-darkness` controls intensity (defined in `design-tokens.ts`)

## Usage Examples

### QuoteCard (Dynamic Colors)

```svelte
<!-- Color passed from parent, changes per card -->
<article
  style="--_background: {colorSet[color]}"
  class="card"
>
```

### Accordion (Static Color)

```svelte
<article class="card">
  <!-- --_background set in component <style> -->
</article>

<style>
article {
  --_background: var(--bg-card);
}
</style>
```

## Debugging

**Colors look wrong?**

1. Check that `--_background` is defined on the element
2. Check that element has `.card` or `.btn` class
3. Inspect computed value of `--_contrast` (should be -1 or 1)

**Text not readable?**

1. Background might be near the 0.6 threshold — test with slightly
   lighter/darker
2. Check that `--text-main` is being applied (not overridden)

## Critical Rule: Only Set `--_background`

> **When styling `.card` or `.btn`, NEVER manually set `color`,
> `background-color`, or `border-color`. These are auto-calculated from
> `--_background`.**

The only acceptable color override is `color: var(--text-mute)` for
secondary text, since interactive elements default to `--text-main`.

See [CSS Patterns](./css.md#critical-rule-do-not-manually-set-colors-on-interactive-elements)
for detailed examples.

## Related Files

- `src/lib/styles/interactive.css` — core calculations
- `src/lib/data/design-tokens.ts` — tuning values (`--border-darkness`,
  `--hover-degree`, etc.)
- `src/lib/scripts/register-design-tokens.ts` — registers CSS properties for
  animations
- [CSS Patterns](./css.md) — usage patterns and utility classes
- [Architecture Decisions](./architecture-decisions.md) — why things are
  implemented this way
