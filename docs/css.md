# CSS Patterns

CSS architecture and design tokens used in the BRITMUN codebase.

## Design Tokens

All values come from CSS custom properties. Never hardcode values.

**Note:** Some variables (`--fw-light`, `--fw-regular`, `--text-mute`) are
registered at runtime from `DesignTokens` via `register-design-tokens.ts`,
not defined in `variables.css`.

### Why Both `variables.css` AND `design-tokens.ts`?

#### design-tokens.ts

- Purpose: Static TS values; registered as animatable CSS props.
- Examples: `--fw-bold: 700`, `--border-darkness: 0.025`

#### variables.css

- Purpose: CSS functions (clamp, etc); media query overrides.
- Examples: `clamp()`, `color-mix()`, breakpoints.

**`variables.css` exists because:**

1. **CSS functions can't be expressed in TypeScript**

   ```css
   --fs-4: clamp(1.8rem, 1.7rem + 0.5vw, 2.2rem);  /* Dynamic calculation */
   --color-base-900: color-mix(in srgb, #000, var(--color-primary-500) 5%);
   ```

2. **Initial values are overridden via media queries**

   ```css
   --fs-7: clamp(3.5rem, 2.8rem + 3.5vw, 6.5rem);

   @media (max-width: 768px) {
     --fs-7: clamp(2.2rem, 2.05rem + 0.75vw, 2.8rem);  /* Shifted down */
   }
   ```

3. **Some values don't need to be animatable**
   Breakpoints (`--bp-1`, `--bp-2`) are pure reference values—no need to register
   them as CSS properties with `CSS.registerProperty()`.

**From `variables.css`:**

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

**From `variables.css`:**

```css
--fs-4: clamp(1.8rem, 1.7rem + 0.5vw, 2.2rem);
```

Scales automatically between mobile and desktop—no media queries needed.

## Color Mixing

**From `variables.css`:**

```css
--color-base-900: color-mix(in srgb, #000, var(--color-primary-500) 5%);
```

All grays are tinted with the primary color. Change the primary, everything updates.

## Scoped Styles

**From `Faq.svelte`:**

```svelte
<style>
article {
  --_background: var(--bg-card);
  padding-inline: var(--space-4);

  summary {
    padding-block: var(--space-4);
    font: var(--fw-light) var(--fs-4) / var(--lh-2) var(--font-body);
  }
}
</style>
```

Styles only apply to this component. Use native CSS nesting.

## Font Shorthand

```css
font: [weight] [size] / [line-height] [family];
font: var(--fw-light) var(--fs-4) / var(--lh-2) var(--font-body);
```

## Transitions

**From `Faq.svelte`:**

```css
summary img {
  transition-property: transform;
}

details[open] summary img {
  transform: rotate(45deg);
}
```

Define `transition-property` on the base element, not the state.

## Shadows

**From `variables.css`:**

```css
--shadow-weak: 0 2px 4px var(--shadow-color);
--shadow-strong: 0 10px 40px var(--shadow-color);
```

## Layout Patterns

### Flexbox

```css
display: flex;
justify-content: space-between;
align-items: center;
gap: var(--space-3);
```

### Grid (auto-fit)

```css
display: grid;
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
gap: var(--space-5);
```

## Responsive Design

Fluid values handle most responsiveness. When needed:

```css
.grid {
  grid-template-columns: 1fr;
  @media (min-width: 768px) { grid-template-columns: 1fr 1fr; }
}
```

**Breakpoints:** `--bp-1: 480px`, `--bp-2: 768px`, `--bp-3: 1024px`, `--bp-4: 1280px`

### Responsive "Shift Down" Pattern

At smaller breakpoints, size tokens are reassigned to smaller values:

```css
@media (max-width: 768px) {
  /* Font sizes: shift down 2 levels */
  --fs-5: clamp(1.6rem, ...);  /* Contains what --fs-3 would be on desktop */
  
  /* Spaces: shift down 1 level */
  --space-5: clamp(1.6rem, ...);  /* Contains what --space-4 would be on desktop */
}
```

**What this does:** `--fs-5` on mobile actually contains what `--fs-3` would be on desktop.
The variable name stays the same but the value shifts down.

**Why:** Components use semantic tokens (`--fs-5` for "medium heading") without media queries.
Responsiveness is handled once, globally, rather than in every component.

**Shift levels by breakpoint:**

- `1024px` — fonts shift down 1 level
- `768px` — fonts shift down 2 levels, spaces shift down 1 level
- `480px` — fonts shift down 3 levels, spaces shift down 2 levels

## Utility Classes

### Attribute Selector Pattern

Utility classes use attribute selectors to share base styles:

```css
[class*="stack"] {
  display: flex;
  flex-direction: column;
}

.stack { gap: var(--space-4); }
.stack--tight { gap: var(--space-3); }
.stack--loose { gap: var(--space-5); }
```

**What this does:** `[class*="stack"]` matches any class containing "stack".
So `.stack`, `.stack--tight`, and `.stack--loose` all inherit the base flex styles.

**Why:** DRY approach - base styles defined once, modifiers only override what changes.
No preprocessor needed, works in vanilla CSS.

**Caution:** Could cause unintended matches (e.g., a class named `.haystack` would match).
Reserved substrings: `row`, `stack`, `title`, `card-grid`, `center`.

### Lift Modifiers

```css
.lift:hover { transform: translateY(-2px); }
.lift--strong:hover { transform: translateY(-4px); }
```

**What:** Subtle "lift" effect on hover - element moves up slightly.

**Usage:**

- `.lift` — Subtle, for nav links and minor elements
- `.lift--strong` — Prominent, for testimonials and featured cards

**Note:** These are independent classes, not BEM modifiers. Use one or the other, not both.
They're kept separate from `.card`/`.btn` because lift is optional.

## GPU Optimization

`.card` and `.btn` include GPU layer promotion hints:

```css
.card, .btn {
  backface-visibility: hidden;
  perspective: 1000px;
  transform: translateZ(0);
}
```

**What these do:**

- `translateZ(0)` — Classic "GPU layer promotion hack"
- `perspective` and `backface-visibility` — Reinforce layer creation

**Why:** Results in smoother `transform` and `background-color` transitions.
Trade-off: slightly more memory usage for better animation performance.

**Caution:** Can cause blurry text on some browsers/zoom levels. If you notice
rendering issues, these may need adjustment.

## Auto-Contrast System (`--_background`)

The `--_background` variable powers automatic color
contrast for `.card` and `.btn` classes.

**How it works:**

1. Set `--_background` to any color
2. System auto-calculates `--text-main`, `--text-mute`, `--border-color`, `--hover-color`
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

- `Faq.svelte` — sets `--_background: var(--bg-card)` in component styles
- `Testimonial.svelte` — sets via inline style for dynamic colors
- `CouncilCard.svelte` — different backgrounds for card vs link

**From `interactive.css`:**

```css
.card, .btn {
  --_contrast: sign(0.6 - l);  /* -1 light bg, +1 dark bg */
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

The only way to change an interactive element's appearance is by setting `--_background`.
The system then derives all other colors to ensure proper contrast and consistency.

**Exception - `--text-mute`:** Interactive elements default to `--text-main` for text color.
If you need muted/secondary text inside a card or button, use `color: var(--text-mute)`.
This is the only color override that's acceptable.

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

**If adding new interactive variants in the future:** Always define them by setting
`--_background` only. Never bypass the auto-contrast system with manual color overrides.

### Nested `--_background` Overrides

Components can contain multiple interactive elements with different backgrounds:

```css
/* CouncilCard.svelte */
div {
  --_background: var(--bg-card);  /* Light card background */
}

a {
  --_background: var(--color-status-info);  /* Blue button inside */
}
```

Each element with `.card` or `.btn` recalculates its own contrast colors based on its
`--_background` value. The system works correctly at any nesting level.

### The Underscore Prefix Convention

The `--_` prefix signals a "private" or "scoped" variable:

- `--_background` — Input variable that must be set by the component
- `--_contrast` — Internal calculation, not meant for external use

This convention distinguishes "input" variables (set by component) from
"output" variables (calculated by the system) and global tokens (no underscore).

## Semantic Colors

```css
/* Text */
color: var(--color-base-900);      /* Primary */
color: var(--text-mute);           /* Muted */

/* Backgrounds */
background: var(--bg-main);        /* Page */
background: var(--bg-card);        /* Card */

/* Interactive */
background: var(--btn-primary);    /* Button */
```

## Accessibility

```css
button:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  transition: none;
}
```
