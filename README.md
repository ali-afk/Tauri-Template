# SvelteKit Personal Template

My personal starter template for SvelteKit projects, featuring a sophisticated component library, design token system, and modern architecture.

## ✨ Features

- 🎨 **Design Token System** - Type-safe CSS custom properties with `CSS.registerProperty()` for smooth animations
- 🌈 **Auto-Contrast Colors** - OKLCH-based automatic text/border contrast calculation
- 🧩 **Component Primitives** - Reusable building blocks (Accordion, CardSection, QuoteCard, ItemCard, etc.)
- 📱 **PWA Ready** - Service worker for offline support, web app manifest
- 🔍 **SEO Optimized** - Meta tags, JSON-LD structured data, sitemap, robots.txt
- ♿ **Accessibility First** - ARIA labels, keyboard navigation, skip links, semantic HTML
- ⚡ **Modern Stack** - SvelteKit 2, Svelte 5 (runes), TypeScript, Vite, LightningCSS, Biome
- 📦 **Zero Runtime Dependencies** - Just build tools, no bloated runtime libraries
- 🎯 **Minimal by Design** - Infrastructure without opinions, build exactly what you need

## 🚀 Quick Start

```bash
bun install    # Install dependencies
bun dev        # Start dev server (http://localhost:5173)
bun run build  # Build for production
```

## 📚 Documentation

### Getting Started

| Guide | Description |
|-------|-------------|
| **[Customizing Template](docs/customizing-template.md)** | **Start here!** Step-by-step guide to adapt this template |
| [Development Guide](docs/development.md) | Daily workflow, common tasks, troubleshooting |

### Architecture & Features

| Guide | Description |
|-------|-------------|
| [CSS Guide](docs/css.md) | Design tokens, styling patterns, CSS layers |
| [Color System](docs/color-system.md) | OKLCH auto-contrast system explained |
| [PWA & Web Standards](docs/pwa-web-standards.md) | Service worker, manifest, SEO endpoints |
| [SEO Strategy](docs/seo-strategy.md) | Meta tags, structured data, social sharing |

### Development Patterns

| Guide | Description |
|-------|-------------|
| [SvelteKit Patterns](docs/sveltekit.md) | Svelte 5 runes, component patterns, data loading |
| [TypeScript Guide](docs/typescript.md) | Type safety patterns used in this template |
| [Architecture Decisions](docs/architecture-decisions.md) | Rationale behind non-obvious choices |
| [Contributing](CONTRIBUTING.md) | Code style, commit format |

## 🗂️ Project Structure

```
src/
├── routes/                 # Pages (SvelteKit file-based routing)
│   ├── +layout.svelte      # Root layout (fonts, meta tags, design tokens)
│   ├── +error.svelte       # Error page
│   └── (main)/             # Main site group
│       ├── +layout.svelte  # Main layout (header, skip link)
│       └── +page.svelte    # Homepage (minimal - build from here!)
├── lib/
│   ├── components/         # Reusable UI components
│   │   └── shared/         # Component primitives
│   │       ├── Accordion.svelte
│   │       ├── HeroImage.svelte
│   │       ├── Header.svelte
│   │       ├── Meta.svelte
│   │       ├── QuoteCard.svelte
│   │       ├── ItemCard.svelte
│   │       ├── ItemCategory.svelte
│   │       ├── helpers/    # Component helpers
│   │       └── layout/     # Layout components
│   │           ├── ButtonGrid.svelte
│   │           └── CardSection.svelte
│   ├── data/               # Configuration (no example content)
│   │   └── shared/         # Site-wide config
│   │       ├── site-properties.ts   # Site metadata
│   │       ├── design-tokens.ts     # Design system tokens
│   │       └── meta.ts              # JSON-LD structured data
│   ├── types/              # TypeScript types
│   │   ├── component-props.ts  # Component prop types
│   │   ├── colors.ts           # Color system types
│   │   └── design-tokens.ts    # Design token types
│   ├── scripts/            # Utility functions
│   │   ├── register-design-tokens.ts
│   │   ├── register-service-worker.ts
│   │   ├── media.ts
│   │   ├── transition.ts
│   │   └── utils.ts
│   ├── assets/             # Images with barrel exports
│   │   └── shared/         # Logo, icons (replace with yours)
│   └── styles/             # Global CSS
│       ├── index.css       # Main entry
│       ├── variables.css   # CSS custom properties
│       ├── interactive.css # Auto-contrast system
│       └── ...
└── app.html                # HTML template

static/                     # Static assets (favicons, robots.txt)
docs/                       # Documentation
```

## 🎨 Key Features Explained

### Design Token System

All design tokens (colors, spacing, typography, etc.) are defined in `src/lib/data/shared/design-tokens.ts` and automatically:

- Converted to CSS custom properties (`--color-primary-500`)
- Registered with `CSS.registerProperty()` for type safety
- Validated by the browser (prevents invalid values)
- Smoothly animated/transitioned

### Auto-Contrast Color System

Set `--_background` on any `.card` or `.btn` element, and text/border colors automatically calculate for optimal contrast using OKLCH color space. No manual color picking needed!

```css
.my-card {
  --_background: var(--color-primary-500);
  /* Text color and border automatically calculated! */
}
```

### Component Library

**Primitives** (building blocks):

- **Accordion** - Collapsible sections with exclusive opening
- **QuoteCard** - Quote/testimonial with avatar support
- **ItemCard** - Generic card with image, name, optional link
- **ItemCategory** - Groups items into categorized sections
- **HeroImage** - Full-width hero sections with lazy loading
- **Meta** - SEO meta tags per page
- **Header** - Site navigation (customize NavLinks)

**Layout Components**:

- **CardSection** - Grid layout with heading
- **ButtonGrid** - Color-cycling button links

**Helpers**:

- **SkipLink** - Accessibility skip-to-content
- **NavLinks** - Navigation helper
- **QuoteCardHeader** - Quote card header with avatar

### PWA Support

- **Service Worker** - Offline support with cache-first strategy
- **Manifest** - Installable as app on mobile/desktop
- **Icons** - Multiple sizes for different platforms (replace in `static/`)

## 🛠️ Tech Stack

- **Framework:** SvelteKit 2.50
- **UI Library:** Svelte 5 (runes syntax: `$state`, `$derived`, `$effect`, `$props`)
- **Language:** TypeScript 5.9
- **Styling:** CSS with custom properties, CSS Layers, OKLCH colors
- **Build:** Vite 7.3 + LightningCSS
- **Linting:** Biome 2.3 (auto-runs on commit via Husky)
- **Package Manager:** Bun
- **Fonts:** Average (serif), Girassol (display) via `@fontsource`

## 🎯 Quick Customization

1. **Site Info:** Edit `src/lib/data/shared/site-properties.ts`
2. **Colors:** Edit `src/lib/data/shared/design-tokens.ts` (use [oklch.com](https://oklch.com/))
3. **Homepage:** Build from `src/routes/(main)/+page.svelte` (currently minimal)
4. **Assets:** Replace logo in `src/lib/assets/shared/`, favicons in `static/`

See **[Customizing Template Guide](docs/customizing-template.md)** for detailed instructions.

## 📝 Generic Types

Flexible types for common patterns:

```typescript
Item          - name, image, optional link/description
ItemCategory  - name, items array (for categorized content)
QuoteData     - title, comment, avatar (for testimonials/quotes)
FaqData       - question, answer (use with Accordion component)
```

## 🚀 Deployment

This template is configured for Netlify but works with any static hosting:

**Netlify:**

1. Push to GitHub
2. Connect repository in Netlify
3. Build settings (auto-detected):
   - Build command: `bun run build`
   - Publish directory: `build`

**Other hosts (Vercel, Cloudflare Pages, etc.):**

- Install Bun
- Build command: `bun run build`
- Output: `build/`

## 💡 Usage Patterns

### Using QuoteCard

```svelte
<script lang="ts">
import { QuoteCard } from "$components/shared";
import type { QuoteData } from "$types/component-props";

const quotes: QuoteData[] = [
  { title: "Person Name", comment: "Quote text...", avatar: { url: "/avatar.jpg", dimensions: { width: 400, height: 400 } } }
];
</script>

{#each quotes as quote, i}
  <QuoteCard
    {...quote}
    color={[500, 700, 300][i % 3]}
    direction={i % 2 === 0 ? "left" : "right"}
    loadPriority={i < 2 ? "high" : "low"}
  />
{/each}
```

### Using ItemCard with ItemCategory

```svelte
<script lang="ts">
import { ItemCategory } from "$components/shared";
import type { ItemCategory as Category } from "$types/component-props";

const categories: Category[] = [
  {
    name: "Projects",
    items: [
      { name: "Project Alpha", image: { url: "/project.jpg", dimensions: { width: 800, height: 600 } }, link: "https://example.com" }
    ]
  }
];
</script>

{#each categories as category}
  <ItemCategory {category} />
{/each}
```

### Using Accordion

```svelte
<script lang="ts">
import { Accordion } from "$components/shared";
import type { FaqData } from "$types/component-props";

const faqs: FaqData[] = [
  { question: "How does this work?", answer: "It's simple..." }
];
</script>

<Accordion items={faqs} name="faq" />
```

## 🔮 Future Enhancements

Planned improvements (tracked in memory files):

- Form components (TextField, TextArea, Select, Button)
- More layout components as needed
- Tauri integration for desktop apps
- Additional primitives based on project needs

## 📖 Learning Resources

This template demonstrates modern SvelteKit patterns:

- Svelte 5 runes (`$state`, `$derived`, `$effect`, `$props`)
- Snippet composition for flexible components
- Type-safe design tokens
- File-based routing with route groups
- Server-side data loading patterns
- CSS Layers for style organization
- Progressive Web App (PWA) setup

## 🙏 Origin

Extracted from a successful conference website I built and shipped. This template preserves all the good architecture and patterns while removing project-specific content. **Minimal by design** - you get the infrastructure without the opinions.

## 📄 License

Personal template - use however you want!

---

**Built with ❤️ and lots of attention to detail**
