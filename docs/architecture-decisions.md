# Architecture Decisions

This document explains non-obvious implementation choices in the codebase.
These patterns may seem confusing at first glance but exist for specific reasons.

## Svelte Component Patterns

### Exclusive FAQ Accordion via `name` Attribute

```svelte
<details bind:open={isOpen} name="faq">
```

**What:** The `name` attribute on `<details>` creates mutually
exclusive accordions - opening one FAQ automatically
closes all others with the same name.

**Why:** Native HTML solution requires no JavaScript, works even if JS fails
to load, and provides better performance than a custom implementation.

**How:** All `<details>` elements sharing the same `name` value behave
like radio buttons.

### Three-State Boolean for Mobile Detection

```typescript
let isMobile = $state<boolean | null>(null);

// Later:
{#if isMobile !== null && (isMenuOpen || !isMobile)}
```

**What:** `isMobile` is initialized as `null` instead of `false`.

**Why:** During SSR and before hydration, we don't know the viewport size.
Using `null` as a third state prevents:

- Desktop links briefly flashing on mobile before JS hydrates
- Mobile hamburger briefly appearing on desktop

**How:** `null` = "unknown", `false` = "definitely desktop",
`true` = "definitely mobile". The null-check ensures nothing renders
until we know the actual state.

### Route Change Closes Mobile Menu

```typescript
$effect(() => {
    page.url.pathname;
    isMenuOpen = false;
});
```

**What:** Reading `page.url.pathname` without using it triggers menu close on navigation.

**Why:** Svelte 5's `$effect` automatically tracks reactive dependencies
that are read inside it. By reading `pathname`, the effect re-runs on every navigation.

**How:** Don't remove the seemingly useless
`page.url.pathname;` line - it triggers $effect() on change.

### Curried Transition Function

```svelte
<div transition:standard={slide}>
```

**What:** Transitions are wrapped through `standard()` instead of
using `transition:slide` directly.

**Why:** Centralizes all transition behavior:

- Consistent easing from design tokens
- Consistent duration from design tokens
- Automatic `prefers-reduced-motion` support (sets duration to 0)

**How:** `standard` is a higher-order function that receives the
transition function as an argument, applies default parameters,
and returns the configured transition.

### Conditional Class Binding

```svelte
<article
    class:reverse={direction === 'right'}
    class="wrapper card row lift--strong"
>
```

**What:** `class:reverse` appears before the main `class` attribute.

**Why:** Svelte's `class:name` directive is the idiomatic way for
boolean class toggles. More readable than ternary expressions,
separates static from dynamic classes.

**How:** Order doesn't matter - Svelte merges all class directives
with the class attribute.

### FAQ Content Uses `{@html}` for Rich Text

```svelte
{#each faqs as faq}
    <Faq question={faq.question}>{@html faq.answer}</Faq>
{/each}
```

**What:** FAQ answers are rendered as raw HTML, allowing links and formatting.

**Why:** FAQ content is developer-controlled (in TypeScript file), not user-generated,
so XSS risk is acceptable. Allows rich formatting without a markdown parser.

**How:** Keep FAQ content in `faqs.ts`. If content ever comes from
a CMS or user input, this must be sanitized or converted to a different approach.

### Color Cycling with Modulo

```svelte
{#each testimonialData as content, i}
    <Testimonial
        color={ColorScale[i % 5] ?? 500}
        direction={i % 2 === 0 ? 'right' : 'left'}
    />
{/each}
```

**What:** Testimonials cycle through 5 color intensities (100→300→500→700→900→100...).

**Why:** Creates visual rhythm without manual color assignment. Add a new testimonial
and it automatically gets the "next" color in the sequence.

**How:** `ColorScale` is `[100, 300, 500, 700, 900]`. Modulo 5 cycles through indices.
The `?? 500` fallback handles edge cases.

## JavaScript Patterns

### `generateId()` Uses Counter + Random

```typescript
let idCounter = 0;

export function generateId(prefix: string = "id"): string {
    idCounter++;
    return `${prefix}-${idCounter}-${Math.random().toString(36).substring(2, 5)}`;
}
```

**What:** IDs combine an incrementing counter with a random suffix.

**Why:** Belt-and-suspenders approach:

- Counter alone: guaranteed unique within session, but predictable
- Random alone: could theoretically collide
- Both together: virtually impossible to collide

**How:** Produces IDs like `content-1-x7f`, `content-2-k9p`.

### `{ passive: true }` on Event Listeners

```typescript
document.addEventListener("mouseover", handler, { passive: true });
```

**What:** Marks event handlers as passive.

**Why:** Signals "this handler will never call `preventDefault()`", allowing
browser optimizations. Good practice for handlers that only read, don't prevent.

**How:** Always add `{ passive: true }` for handlers that don't need to
prevent default behavior.

### `$app/state` vs `$app/stores`

```typescript
import { page } from "$app/state";  // Svelte 5 way
// NOT: import { page } from "$app/stores";  // Svelte 4 way
```

**What:** Using the runes-based `$app/state` module.

**Why:** Svelte 5 introduced runes-based state management. `$app/state` is the modern,
runes-compatible approach - no store subscription boilerplate needed.

**How:** Access directly as `page.url` instead of `$page.url`.

## CSS/Styling Patterns

### Document Loading Shimmer

```typescript
onMount(() => {
    registerProperties();
    document.documentElement.classList.add("document-loaded");
});
```

```css
html:not(.document-loaded) body::before {
    /* shimmer animation */
}
```

**What:** Shows a shimmer animation until JavaScript executes.

**Why:** CSS properties are registered via JS. Before that runs, token-based colors
might not work correctly. The shimmer masks the "flash" of unregistered properties.
Hardcoded color is necessary because design tokens aren't available yet.

**How:** The class toggle hides the shimmer once JS is ready.

**Potential improvement:** Use CSS `@property` at-rule declarations
generated at build time to eliminate the JS dependency entirely.

### Image Loading Priority System

```typescript
// src/lib/types/component-props.ts
export type LoadPriority = "high" | "low";

export type Image = {
    url: FilePath | HttpPath;
    dimensions: { width: number; height: number };
};

export type Council = {
    name: string;
    image: Image;
    backgroundGuide: string;
};
```

```svelte
<!-- CouncilCard.svelte -->
<img
    src={council.image.url}
    alt={council.name}
    width={council.image.dimensions.width}
    height={council.image.dimensions.height}
    fetchpriority={loadPriority}
    loading={loadPriority === "high" ? "eager" : "lazy"}
    decoding="async"
>
```

```svelte
<!-- CouncilCategory.svelte -->
<script>
const councilsAboveScreenFold = 5;
</script>

{#each category.councils as council, index}
    <CouncilCard
        {council}
        loadPriority={index < councilsAboveScreenFold ? "high" : "low"}
    />
{/each}
```

**What:** Images use explicit dimensions and priority-based loading. Dimensions
are centralized in `src/lib/data/councils/images.ts`.

**Why:**

- `width`/`height` attributes prevent layout shifts (CLS) by reserving space
- `fetchpriority="high"` tells browser to prioritize above-fold images
- `loading="eager"` loads immediately; `loading="lazy"` defers until near viewport
- `decoding="async"` decodes images off main thread (reduces TBT)
- Named constant documents intent and is easy to adjust
- Centralized dimensions in `images.ts` keeps category data clean

**How:** Parent component determines priority based on index, child component
applies the appropriate attributes. The `Image` type bundles URL with dimensions,
stored in `images.ts` alongside the asset imports.
