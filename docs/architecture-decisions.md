# Architecture Decisions

Non-obvious implementation choices — stuff that might look weird but are intentional.

## Svelte Component Patterns

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
  document.documentElement.classList.add("loading-item");
});
```

```css
.loading-item {
  /* shimmer animation */
}
```

The shimmer masks the brief flash before fonts and images load.

## Known Refactor Targets

### `transition.ts` — Type Safety

`transition.ts` works but has loose types that should be tightened before the
transition system is extended:

- `TransitionFn` uses `params?: any` — no type safety on transition parameters
- Non-null assertions (`!`) scattered through `parseBezierCoords`
- `standard()` types `params` as `SlideParams`, which is too narrow — passing
  `fly` or `fade` params doesn't type-check correctly
- `standard()` should either accept a generic params type or provide
  per-transition overloads

Don't add new transition variants until this is addressed.

## Build & Tooling

### `NO_STRIP=true` Required for Tauri Builds

```bash
NO_STRIP=true bun tauri build
```

The build fails without this. The stripping step (which removes debug
symbols to reduce binary size) errors out; known issue on github.
`NO_STRIP=true` skips it. The resulting binary is larger but otherwise
identical. Make sure to remove it when fixed.
