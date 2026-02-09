# Development Guide

## Quick Start

```bash
git pull                    # Get latest
bun dev                     # Dev server at localhost:5173
bun fix-all                 # Format and fix code
git push                    # Auto-deploys to Netlify
```

## Project Structure

```bash
src/
├── lib/
│   ├── components/         # UI components
│   │   ├── shared/         # Header, NavLinks, Meta (used across pages)
│   │   ├── home/           # Homepage components (FaqList, Testimonial, etc.)
│   │   └── councils/       # Council page components (CouncilCard, etc.)
│   ├── data/               # Content files
│   │   ├── design-tokens.ts    # Design tokens (colors, spacing, etc.)
│   │   ├── home/               # Homepage data (faqs, testimonials)
│   │   └── councils/           # Council data (categories, images, documents)
│   ├── types/              # Reusable TypeScript types
│   │   ├── colors.ts           # ColorDegrees, ColorRecord
│   │   ├── component-props.ts  # Council, Image, FaqData, LoadPriority, etc.
│   │   └── design-tokens.ts    # PropertyConfig, PropertyNode
│   ├── scripts/            # Utilities
│   │   ├── register-design-tokens.ts  # CSS property registration
│   │   ├── transition.ts              # Svelte transition wrapper
│   │   ├── media.ts                   # Media query helpers
│   │   └── utils.ts                   # General utilities
│   ├── assets/             # Images (bundled, with barrel exports)
│   │   ├── shared/         # Logo, external link icon
│   │   ├── home/           # Hero image, toggle icon
│   │   └── councils/       # Council images (WebP)
│   └── styles/             # Global CSS
└── routes/                 # Pages (SvelteKit file-based routing)
    ├── +layout.svelte      # Root layout (CSS imports, design token registration)
    ├── +error.svelte       # Error page
    └── (main)/             # Main site route group
        ├── +layout.svelte  # Main layout (Header, skip-link, <main>)
        ├── +page.svelte    # Homepage (/)
        ├── +page.server.ts # Homepage data loader
        └── councils/
            ├── +page.svelte    # Councils page
            └── +page.server.ts # Councils data loader

static/                     # Files served as-is (/favicon.png)
```

## Common Tasks

### Add FAQ

Edit `src/lib/data/home/faqs.ts`:

```typescript
export const faqs: FaqData[] = [
 {
  question: "What should I bring?",
  answer: "Laptop, notepad, delegate pass..."
 },
];
```

### Add Testimonial

Edit `src/lib/data/home/testimonials.ts`:

```typescript
export const testimonials: TestimonialData[] = [
  { title: "SC Chair", year: "2024", comment: "Amazing experience..." },
];
```

### Add Council

1. Add optimized image to `src/lib/assets/councils/` (WebP, max 800px width)
2. Export from barrel: `src/lib/assets/councils/index.ts`
3. Get image dimensions: `identify your-image.webp` (returns WxH)
4. Add to `src/lib/data/councils/images.ts`:

```typescript
import { NewCouncil } from "$assets/councils";

export const CouncilImages = {
  // ... existing images
  NewCouncil: {
    url: NewCouncil as FilePath,
    dimensions: { width: 800, height: 600 },
  },
} as const satisfies Record<string, Image>;
```

5. Add to `src/lib/data/councils/categories.ts`:

```typescript
import { CouncilImages } from "./images";

export const councilCategories: CouncilCategory[] = [
  {
    name: "General Assembly",
    councils: [
      {
        name: "UN Security Council",
        image: CouncilImages.Unsc,
        backgroundGuide: "https://drive.google.com/...",
      },
    ],
  },
];
```

**Note:** Image dimensions are stored in `images.ts`, not in categories.

### Change Colors

Edit `src/lib/data/design-tokens.ts`:

```typescript
color: {
  primary: {
    500: "#934599",  // Main brand
    700: "#7a3a7f",  // Dark variant
  },
}
```

All themed elements update automatically.

### Add Page

1. Create `src/routes/(main)/about/+page.svelte`
2. Add to navigation in `src/lib/components/shared/NavLinks.svelte`

```svelte
<script lang="ts">
import { Meta } from "$components/shared";
</script>

<Meta
  title="About"
  description="Learn about BRITMUN XI"
  pageURI="/about"
/>

<section class="container">
  <h1>About</h1>
</section>

<style>
.container {
 max-width: var(--container-max);
 margin-inline: auto;
 padding: var(--space-6);
}
</style>
```

### Add Component

1. Create `src/lib/components/[page]/NewComponent.svelte`
2. Export from `src/lib/components/[page]/index.ts`
3. Import with `import { NewComponent } from "$components/[page]"`

For shared components, use `src/lib/components/shared/`.

### Barrel Export Pattern

Directories use `index.ts` files to centralize exports:

```typescript
// src/lib/components/home/index.ts
export { default as FaqList } from "./FaqList.svelte";
export { default as Testimonial } from "./Testimonial.svelte";

// src/lib/assets/councils/index.ts
export { default as Unsc } from "./unsc.webp";
export { default as Iaea } from "./iaea.webp";
```

**Benefits:**

- Cleaner imports: `"$components/home"` instead of `"$components/home/FaqList.svelte"`
- Internal file structure can change without breaking imports
- Encapsulates implementation details

**Conventions:**

- Component exports: Match filename (`FaqList.svelte` → `FaqList`)
- Asset exports: PascalCase regardless of filename (`unsc.webp` → `Unsc`)

**Important:** New components/assets must be manually added to `index.ts`.
This is easy to forget - if an import fails, check the barrel export first.

## Image Optimization

```bash
bunx sharp-cli input.jpg --resize 800 --webp --quality 85 --output output.webp
```

| Type | Max Width | Format |
| ------ | ----------- | -------- |
| Hero | 1920px | WebP |
| Council | 800px | WebP |
| Logo | 400px | WebP/PNG |

**Placement:** Static assets → `static/`, component assets → `src/lib/assets/`

## Git Workflow

```bash
git checkout -b feature/my-feature
# make changes
git commit -m "feat: add feature"
git push -u origin feature/my-feature
# Create PR, merge to dev, then main
```

See [CONTRIBUTING](../CONTRIBUTING.md) for commit message format.

## Troubleshooting

```bash
# Dev server issues
killall node && rm -rf .svelte-kit && bun install && bun dev

# Build issues
bun watch                   # Check type errors
bun fix-all                 # Fix formatting
rm -rf .svelte-kit node_modules && bun install && bun build

# IDE type errors
bun exec svelte-kit sync    # Regenerate types
```

## Testing Checklist

- [ ] Homepage loads
- [ ] Navigation works
- [ ] FAQs expand/collapse
- [ ] Images load (no 404s in console)
- [ ] Mobile responsive
- [ ] `bun build && bun preview` works

## Deployment

```bash
git push                    # Auto-deploys to Netlify
# Or manual: bun netlify deploy --prod
```

## Environment

**Required:** Node.js 18+, Bun 1+, Git

**VS Code Extensions:** Svelte for VS Code, Biome

**Config Files:** `svelte.config.js`, `vite.config.ts`, `tsconfig.json`, `biome.json`

## Commands

```bash
bun dev          # Dev server
bun build        # Production build
bun preview      # Preview build
bun watch        # Type checking
bun fix-all      # Format + lint
```
