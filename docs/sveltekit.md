# SvelteKit Patterns

Svelte 5 and SvelteKit patterns used in the BRITMUN codebase.

## File-Based Routing

```bash
src/routes/
├── +page.svelte        → /
├── +layout.svelte      → Wraps all pages
└── councils/
    └── +page.svelte    → /councils
```

**Layout wraps all pages:**

```svelte
<Header />
<a href="#main-content" class="skip-link">Skip to main content</a>
<main>{@render children()}</main>
```

Note: Footer was removed. Skip-link improves keyboard accessibility.

## Svelte 5 Runes

### $state - Reactive Variables

**From `Faq.svelte`:**

```svelte
<script lang="ts">
  let isOpen = $state(false);
</script>

<details bind:open={isOpen}>
  <summary>Toggle</summary>
</details>
{#if isOpen}<div>Content</div>{/if}
```

### $props - Component Properties

**From `Faq.svelte`:**

```svelte
<script lang="ts">
  let { question, children } = $props();
</script>

<summary>{question}</summary>
<div>{@render children()}</div>
```

**With inline types:**

```svelte
let { question, children }: { question: string; children: Snippet } = $props();
```

**With interface extension (for complex props):**

```svelte
<script lang="ts">
import { type TestimonialData } from "$data/home";
import type { ColorDegrees } from "$types/colors";

interface TestimonialProps extends TestimonialData {
  color: ColorDegrees;
  direction: "left" | "right";
}

let { color, title, year, comment, direction }: TestimonialProps = $props();
</script>
```

### $derived - Computed Values

```svelte
let count = $state(0);
let doubled = $derived(count * 2);
```

## Path Aliases

```svelte
import { Header } from "$components/shared";
import { faqs } from "$data/home";
import { Logo } from "$assets/shared";
import { parseCssTime } from "$scripts/utils";
import type { Council } from "$types/component-props";
```

**Aliases:**

- `$components` → `src/lib/components`
- `$data` → `src/lib/data`
- `$assets` → `src/lib/assets`
- `$scripts` → `src/lib/scripts`
- `$types` → `src/lib/types`

(defined in `svelte.config.js`)

**Note:** Shared components/assets are in `shared/` subdirectories.

## onMount

**From `+layout.svelte`:**

```svelte
import { onMount } from "svelte";

onMount(() => {
  optimiseInteractive();
  registerProperties();
  document.documentElement.classList.add("document-loaded");
});
```

Use for browser-only APIs. Don't use for data fetching (use load functions).

## Server-Side Data Loading

Pages load data via `+page.server.ts`, then pass it to components:

**`+page.server.ts`:**

```typescript
import { testimonials } from "$data/home";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => {
  return { testimonials };
};
```

**`+page.svelte`:**

```svelte
<script lang="ts">
import { type PageProps } from "./$types";
let { data }: PageProps = $props();
</script>

<TestimonialList testimonialData={data.testimonials} />
```

## Loops with #each

**From `TestimonialList.svelte`:**

```svelte
{#each testimonialData as content, i}
  <Testimonial
    {...content}
    color={ColorScale[i % 5] ?? 500}
    direction={i % 2 === 0 ? 'right' : 'left'}
  />
{/each}
```

- `{...content}` spreads all properties as props
- `ColorScale[i % 5]` cycles through color degrees (100, 300, 500, 700, 900)
- Components handle color lookup internally

## Conditionals with #if

**From `Faq.svelte`:**

```svelte
{#if isOpen}
  <div transition:standard={slide}>Content</div>
{/if}
```

> **Why is FAQ content outside `<details>`?**
>
> The accordion content is wrapped in an `<article>` with `{#if}` instead of
> being inside `<details>` because browsers don't yet support **discrete
> keyword interpolation** (e.g., animating `display: none` → `display: block`).
>
> **Future cleanup:** Once browsers support `transition-behavior: allow-discrete`,
> move the content inside `<details>`, remove the `{#if}` block, and use CSS
> `display` interpolation with `@starting-style` for the open/close animation.

## Transitions

**From `Faq.svelte`:**

```svelte
import { slide } from "svelte/transition";
import { standard } from "$scripts/transition";

<div transition:standard={slide}>Slides in/out</div>
```

Custom transitions via `standard` wrapper respect `prefers-reduced-motion`.

## Snippet Rendering

```svelte
let { children } = $props();

<div class="card">{@render children()}</div>
```

**Usage:**

```svelte
<Card><h2>Title</h2><p>Content</p></Card>
```

Replaces slots from Svelte 4.

## Event Handling

**From `NavLinks.svelte`:**

```svelte
<button onclick={() => (isMenuOpen = !isMenuOpen)} type="button">Toggle</button>
```

- Use `onclick` (not `on:click`)
- Always set `type="button"` (prevents form submission)

## Accessibility

**From `Faq.svelte`:**

```svelte
<summary aria-expanded={isOpen} aria-controls="{contentId}">
  {question}
  <img src={toggleIcon} alt="" aria-hidden="true">
</summary>
```

- `aria-expanded` for toggles (native `<details>` handles this automatically)
- `aria-hidden="true"` + empty `alt=""` for decorative images

## svelte:head

**From `+layout.svelte`:**

```svelte
<svelte:head>
  <title>BRITMUN XI | BSB</title>
  <meta name="description" content="..." />
</svelte:head>
```

## Barrel Exports

**From `src/lib/components/home/index.ts`:**

```typescript
export { default as Faq } from "./Faq.svelte";
export { default as FaqList } from "./FaqList.svelte";
```

**Import:**

```svelte
import { Faq, FaqList } from "$components/home";
```

## Quick Reference

| Pattern | Syntax |
| --------- | -------- |
| State | `let x = $state(0)` |
| Props | `let { title } = $props()` |
| Computed | `let x = $derived(y * 2)` |
| Loop | `{#each items as item, i}` |
| Condition | `{#if show}...{/if}` |
| Event | `onclick={() => {}}` |
| Lifecycle | `onMount(() => {})` |
| Slot content | `{@render children()}` |
