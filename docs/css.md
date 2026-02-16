# CSS Patterns

CSS architecture and design tokens used in this codebase.

## Design Tokens

All values come from CSS custom properties. Never hardcode values.

**Note:** Some variables (`--fw-light`, `--fw-regular`, `--text-mute`) are
registered at runtime from `DesignTokens` via `register-design-tokens.ts`,
not defined in `variables.css`.

### Why Both `variables.css` AND `design-tokens.ts`?

#### design-tokens.ts

- Purpose: Static TS values or initial values; registered as animatable CSS props.
- Examples: `--fw-bold: 700`, `--border-darkness: 0.025`

#### variables.css

- Purpose: CSS functions (clamp, etc); media query overrides.
- Examples: `clamp()`, `color-mix()`, breakpoints.

**`variables.css` exists because:**

1. **CSS functions can't be expressed in TypeScript**

   ```css
   --fs-4: clamp(1.8rem, 1.7rem + 0.5vw, 2.2rem);
   --color-base-900: color-mix(in srgb, #000, var(--color-primary-500) 5%);
   ```

2. **Initial values are overridden via media queries**

   ```css
   --fs-7: clamp(3.5rem, 2.8rem + 3.5vw, 6.5rem);

   @media (max-width: 768px) {
     --fs-7: clamp(2.2rem, 2.05rem + 0.75vw, 2.8rem);
   }
   ```

3. **Some values don't need to be animatable**
   Breakpoints (`--bp-1`, `--bp-2`) are pure reference values — no need to
   register them with `CSS.registerProperty()`.

### Spacing (fluid)

```css
--space-0 through --space-8  /* 0.2rem → 12.8rem, scales with viewport */
```

### Font Sizes (fluid)

```css
--fs-1  /* 1.2rem - 1.4rem (smallest) */
--fs-3  /* 1.6rem - 1.8rem (body) */
--fs-6  /* 2.8rem - 4rem (heading) */
--fs-7  /* 3.5rem - 6.5rem (hero) */
```

### Colors

```css
--color-primary-500  /* Main purple */
--color-primary-700  /* Darker purple */
--color-base-900     /* Near black (tinted) */
--color-base-100     /* Near white (tinted) */
```

### Typography

```css
--font-head: Girassol, ui-serif;  /* Headings */
--font-body: Average, ui-serif;   /* Body text */
--lh-1  /* 1.1 (Tight) */
--lh-3  /* 1.6 (Body) */
```

## Fluid Typography

```css
--fs-4: clamp(1.8rem, 1.7rem + 0.5vw, 2.2rem);
```

Scales automatically between mobile and desktop — no media queries needed.

## Color Mixing

```css
--color-base-900: color-mix(in srgb, #000, var(--color-primary-500) 5%);
```

All grays are tinted with the primary color. Change the primary, everything
updates.

## Transitions

**From `Accordion.svelte`:**

```css
summary img {
  transition-property: transform;
}

details[open] summary img {
  transform: rotate(45deg);
}
```

Define `transition-property` on the base element, not the state.
Other properties such as `transition-duration` and `transition-timing-function`
are handled by layout.css. Don't define duration unless explicitly overridden
through `--transition-duration-{long,medium,short}`

## Shadows

```css
--shadow-weak: 0 2px 4px var(--shadow-color);
--shadow-strong: 0 10px 40px var(--shadow-color);
```

## Layout Patterns

### Grid (auto-fit)

```css
--min-col-size: min(300px, 100%);
display: grid;
grid-template-columns: repeat(auto-fit, minmax(var(--min-col-size), 1fr));
gap: var(--space-5);
```

`--min-col-size` ensures that if the screen width is smaller than e.g 300px,
the card takes up 100% of available width.

## Responsive Design

Fluid values handle most responsiveness. When needed:

```css
.grid {
  grid-template-columns: 1fr;
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
}
```

**Breakpoints:**
`--bp-1: 480px`, `--bp-2: 768px`, `--bp-3: 1024px`, `--bp-4: 1280px`

### Responsive "Shift Down" Pattern

At smaller breakpoints, size tokens are reassigned to smaller values:

```css
@media (max-width: 768px) {
  /* Font sizes: shift down 2 levels */
  --fs-5: clamp(1.6rem, ...); /* What --fs-3 would be on desktop */

  /* Spaces: shift down 1 level */
  --space-5: clamp(1.6rem, ...); /* What --space-4 would be on desktop */
}
```

The variable name stays the same, the value shifts down. Components use
semantic tokens (`--fs-5` for "medium heading") with no media queries —
responsiveness is handled once, globally.

**Shift levels by breakpoint:**

- `1024px` — fonts shift down 1 level
- `768px` — fonts shift down 2 levels, spaces shift down 1 level
- `480px` — fonts shift down 3 levels, spaces shift down 2 levels

## Utility Classes

### Attribute Selector Pattern

```css
[class*="stack"] {
  display: flex;
  flex-direction: column;
}

.stack {
  gap: var(--space-4);
}
.stack--tight {
  gap: var(--space-3);
}
.stack--loose {
  gap: var(--space-5);
}
```

`[class*="stack"]` matches any class containing "stack", so all variants
inherit the base flex styles. DRY, no preprocessor needed.

**Caution:** Could catch unintended class names (e.g. `.haystack`).
Reserved substrings: `row`, `stack`, `title`, `card-grid`, `center`.

### Lift Modifiers

```css
.lift:hover {
  transform: translateY(-2px);
}
.lift--strong:hover {
  transform: translateY(-4px);
}
```

- `.lift` — subtle, for nav links and minor elements
- `.lift--strong` — prominent, for quote cards and featured cards

Independent classes, not BEM modifiers. Use one or the other.

## GPU Optimization

`.card` and `.btn` include GPU layer promotion hints:

```css
.card,
.btn {
  backface-visibility: hidden;
  perspective: 1000px;
  transform: translateZ(0);
}
```

Results in smoother `transform` and `background-color` transitions. Trade-off:
slightly more memory for better animation performance. Disable if you notice
any issues (e.g blurry text).

## Auto-Contrast System (`--_background`)

The `--_background` variable powers automatic color contrast for `.card` and
`.btn` classes.

1. Set `--_background` to any color
2. System auto-calculates `--text-main`, `--text-mute`, `--border-color`,
   `--hover-color`
3. Uses OKLCH relative color syntax for perceptually uniform contrast

**Usage via inline style:**

```svelte
<article style="--_background: {color}" class="card">
  <!-- Text color auto-adjusts for contrast -->
</article>
```

**Usage via component styles:**

```css
article {
  --_background: var(--bg-card);
}
```

**Examples in codebase:**

- `Accordion.svelte` — sets `--_background: var(--bg-card)` in component
  styles
- `QuoteCard.svelte` — sets via inline style for dynamic colors
- `ItemCard.svelte` — nested elements with different backgrounds (card vs
  link button)

**From `interactive.css`:**

```css
.card,
.btn {
  --_contrast: sign(0.6 - l); /* -1 light bg, +1 dark bg */
  --text-main: oklch(from var(--_background) clamp(0, var(--_contrast), 1) 0 0);
  --text-mute: oklch(from var(--_background) 0.5 c h);
  background-color: var(--_background);
  color: var(--text-main);
}
```

### Critical Rule: Do NOT Manually Set Colors on Interactive Elements

> **When styling `.card` or `.btn` elements, NEVER manually set:**
>
> - `color`
> - `background-color`
> - `border-color`
>
> **These are calculated automatically from `--_background`.**

The only way to change an interactive element's appearance is by setting
`--_background`. The system then derives all other colors.

**Exception — `--text-mute`:** Use `color: var(--text-mute)` for secondary
text inside cards/buttons. That's the only acceptable color override.

```css
/* WRONG - breaks auto-contrast */
.my-card {
  background-color: purple;
  color: white;
  border-color: darkpurple;
}

/* CORRECT - let the system calculate */
.my-card {
  --_background: var(--color-primary-500);
}

/* CORRECT - using text-mute for secondary text */
.my-card p.subtitle {
  color: var(--text-mute);
}
```

### Nested `--_background` Overrides

Components can have multiple interactive elements with different backgrounds:

```css
/* ItemCard.svelte */
div {
  --_background: var(--bg-card); /* Light card background */
}

a {
  --_background: var(--color-status-info); /* Blue button inside */
}
```

Each element with `.card` or `.btn` recalculates its own contrast colors.
Works at any nesting level.

### The Underscore Prefix Convention

`--_` signals a "private" or "scoped" variable:

- `--_background` — input variable set by the component
- `--_contrast` — internal calculation, not for external use

Distinguishes "inputs" (set by component) from "outputs" (calculated by the
system) and global tokens (no underscore).

## Semantic Colors

```css
/* Text */
color: var(--text-main); /* Primary */
color: var(--text-mute); /* Muted */

/* Backgrounds */
background: var(--bg-main); /* Page */
background: var(--bg-card); /* Card */

/* Interactive */
background: var(--btn-primary); /* Button */
```
