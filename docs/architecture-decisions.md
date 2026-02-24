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

### `aria-expanded` and `aria-controls` on `<summary>`

```svelte
<summary aria-expanded={isOpen} aria-controls={contentId}>
  ...
</summary>
...
{#if isOpen}
  <div id={contentId}>Content</div>
{/if}
```

Because the animated content lives *outside* `<details>` (see above), the
native disclosure widget's open/closed state is not communicated to assistive
technology for the visible content. `aria-expanded` on `<summary>` fills that
gap explicitly.

`aria-controls` pointing to a conditionally-rendered element is intentional —
the target exists in the DOM while open (valid reference) and is absent while
closed (stale reference, but harmless: assistive technology ignores missing
`aria-controls` targets rather than erroring). Don't move the `id` inside
`<details>` to "fix" this.

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
<div transition:standard={[slide]}>
```

Everything goes through `standard()` instead of using transitions directly.
It injects consistent easing/duration from design tokens and auto-disables
animations for `prefers-reduced-motion`.

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

## Build & Tooling

### `NO_STRIP=true` Required for Tauri Builds

```bash
NO_STRIP=true bun tauri build
```

The build fails without this. The stripping step (which removes debug
symbols to reduce binary size) errors out; known issue on github.
`NO_STRIP=true` skips it. The resulting binary is larger but otherwise
identical. Make sure to remove it when fixed.
