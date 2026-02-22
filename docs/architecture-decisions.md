# Architecture Decisions

Non-obvious implementation choices — stuff that might look weird but is intentional.

## Svelte Component Patterns

### Exclusive Accordion via `name` Attribute

```svelte
<details bind:open={isOpen} {name}>
```

`<details>` elements sharing the same `name` behave like radio buttons —
opening one closes the rest. Native HTML, no JS required.

### Accordion Content Lives Outside `<details>`

```svelte
<!-- The animated content is in {#if}, not inside <details> -->
{#if isOpen}
 <div transition:standard={slide}>Content</div>
{/if}
```

Browsers don't yet support discrete keyword interpolation — you can't animate
`display: none` → `display: block`. Putting content inside `<details>` would
make it un-animatable. The `{#if}` block lets Svelte mount/unmount the element
so `transition:standard` can run.

**Future cleanup:** Once `transition-behavior: allow-discrete` has broad
support, move content back inside `<details>` and use `@starting-style` for
the animation instead.

### Three-State Boolean for Mobile Detection

```typescript
let isMobile = $state<boolean | null>(null);

// In template:
{#if isMobile !== null && (isMenuOpen || !isMobile)}
```

`isMobile` starts as `null`, not `false`. During SSR and before hydration
we don't know the viewport size — using `false` as the default would cause
desktop links to flash on mobile before JS runs.
`null` = unknown, `false` = desktop, `true` = mobile.

### Route Change Closes Mobile Menu

```typescript
$effect(() => {
  page.url.pathname;
  isMenuOpen = false;
});
```

Reading `page.url.pathname` without using it isn't accidental — `$effect`
tracks reactive reads, so this line makes the effect re-run on every
navigation. Don't remove it.

### Curried Transition Function

```svelte
<div transition:standard={slide}>
```

Everything goes through `standard()` instead of using transitions directly.
It injects consistent easing/duration from design tokens and auto-disables
animations for `prefers-reduced-motion`. Higher-order function: takes a
transition fn, returns a configured version.

### Conditional Class Binding

```svelte
<!-- QuoteCard.svelte -->
<article
 class:reverse={direction === 'right'}
 class="wrapper card row lift--strong"
>
```

`class:name` is the idiomatic Svelte way to toggle a class — cleaner than
a ternary in `class`. Static and dynamic classes can be mixed freely; Svelte
merges them.

### Color Cycling with `cycleColorScale()`

```typescript
// utils.ts
export function cycleColorScale(index: number): ColorDegrees {
  return ColorScale[index % 5] ?? 500;
}
```

```svelte
<!-- ButtonGrid.svelte -->
style="--_background: {colorSet[cycleColorScale(i)]}"
```

Cycles through `[100, 300, 500, 700, 900]` by index. Add a new item and it
automatically picks the next color in the sequence — no manual assignment.

## JavaScript Patterns

### `generateId()` Uses Counter + Random

```typescript
let idCounter = 0;

export function generateId(prefix: string = "id"): string {
  idCounter++;
  return `${prefix}-${idCounter}-${Math.random().toString(36).substring(2, 5)}`;
}
```

Counter alone is predictable, random alone could theoretically collide —
both together is essentially impossible. Produces IDs like `content-1-x7f`.

## CSS/Styling Patterns

### Document Loading Shimmer

```typescript
onMount(() => {
  document.documentElement.classList.add("document-loaded");
});
```

```css
html:not(.document-loaded) body::before {
  /* shimmer animation */
}
```

`@property` declarations are generated at build time by `gen.ts` and shipped
in `gen.css`, so tokens are available immediately. The shimmer now exists only
to mask the brief flash before fonts and images load. The hardcoded color in
the shimmer is intentional — it can't reference tokens since it runs before
the cascade is applied.

## Build & Tooling

### `NO_STRIP=true` Required for Tauri Builds

```bash
NO_STRIP=true bun tauri build
```

The build fails without this. The stripping step (which removes debug
symbols to reduce binary size) errors out — likely a toolchain mismatch.
`NO_STRIP=true` skips it. The resulting binary is larger but otherwise
identical.
