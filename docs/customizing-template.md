# Customizing the Template

This guide walks you through adapting this minimal template for your new project.

## Philosophy

This template provides **infrastructure without opinions**:
- ✅ Design token system, auto-contrast colors, PWA setup
- ✅ Component primitives (building blocks)
- ✅ SEO optimization, accessibility features
- ❌ No pre-built pages or example content
- ❌ No opinionated structure - build exactly what you need

## Quick Start Checklist

- [ ] Update `package.json` (name, description)
- [ ] Update `src/lib/data/shared/site-properties.ts`
- [ ] Customize colors in `src/lib/data/shared/design-tokens.ts`
- [ ] Build your homepage in `src/routes/(main)/+page.svelte`
- [ ] Replace logo and favicon assets
- [ ] Update README.md with your project info
- [ ] Deploy and configure your hosting

---

## 1. Site Properties

**File:** `src/lib/data/shared/site-properties.ts`

Update these values for your project:

```typescript
export const SiteProperties = {
  siteUrl: "https://yourdomain.com",  // Your production URL
  siteName: "Your Project Name",
  siteDescription: "Brief description for SEO",
  author: "Your Name",
  contact: {
    email: "your-email@example.com",
    // Add social media links as needed
  },
}
```

This file is referenced throughout the codebase for SEO meta tags, structured data, and display content.

---

## 2. Colors & Design Tokens

**File:** `src/lib/data/shared/design-tokens.ts`

The current purple/pink color scheme is just an example. Replace with your brand colors:

```typescript
export const DesignTokens = {
  color: {
    primary: {
      900: "#your-darkest",
      700: "#your-dark",
      500: "#your-main",  // Main brand color
      300: "#your-light",
      100: "#your-lightest",
    },
    secondary: {
      // Same structure for secondary color
    },
  },
  // ... rest unchanged
}
```

### Choosing Colors

**Tool:** Use [oklch.com](https://oklch.com/) for picking colors

**Why OKLCH?** The template uses OKLCH color space for perceptually uniform colors and automatic contrast calculation.

**Tips:**
- Start with your main brand color (primary.500)
- Adjust lightness (L value) to create shades
- Keep chroma (C) consistent for cohesive palette
- The auto-contrast system handles text colors automatically!

---

## 3. Build Your First Page

The homepage (`src/routes/(main)/+page.svelte`) is intentionally minimal - just a Meta tag. Build from here!

### Example: Simple Homepage

```svelte
<script lang="ts">
import { Meta, HeroImage } from "$components/shared";

let metaDescription = "Welcome to my site";
</script>

<Meta title="Home" description={metaDescription} pageURI="/" />

<section>
  <h1>Welcome</h1>
  <p>Your content here...</p>
</section>
```

### Example: Using QuoteCard for Testimonials

```svelte
<script lang="ts">
import { Meta, QuoteCard } from "$components/shared";
import type { QuoteData } from "$types/component-props";

const testimonials: QuoteData[] = [
  {
    title: "Client Name",
    comment: "This service was amazing!",
    avatar: { url: "/avatar.jpg", dimensions: { width: 400, height: 400 } }
  }
];
</script>

<Meta title="Testimonials" description="What our clients say" pageURI="/testimonials" />

<section>
  <h1>Testimonials</h1>
  {#each testimonials as testimonial, i}
    <QuoteCard
      {...testimonial}
      color={[500, 700, 300][i % 3]}
      direction={i % 2 === 0 ? "left" : "right"}
      loadPriority={i < 2 ? "high" : "low"}
    />
  {/each}
</section>
```

### Example: Categorized Items (Portfolio, Products, etc.)

```svelte
<script lang="ts">
import { Meta, ItemCategory } from "$components/shared";
import type { ItemCategory as Category } from "$types/component-props";

const projects: Category[] = [
  {
    name: "Web Projects",
    items: [
      {
        name: "Project Alpha",
        image: { url: "/project1.jpg", dimensions: { width: 800, height: 600 } },
        link: "https://example.com",
        description: "Optional description"
      }
    ]
  }
];
</script>

<Meta title="Portfolio" description="My work" pageURI="/portfolio" />

<section>
  <h1>My Work</h1>
  {#each projects as category}
    <ItemCategory {category} />
  {/each}
</section>
```

### Example: FAQ Section with Accordion

```svelte
<script lang="ts">
import { Meta, Accordion } from "$components/shared";
import type { FaqData } from "$types/component-props";

const faqs: FaqData[] = [
  { question: "How does this work?", answer: "It's simple..." },
  { question: "What about pricing?", answer: "Free for personal use!" }
];
</script>

<Meta title="FAQ" description="Frequently asked questions" pageURI="/faq" />

<section>
  <h1>FAQ</h1>
  <Accordion items={faqs} name="faq" />
</section>
```

---

## 4. Assets to Replace

### Logo

**File:** `src/lib/assets/shared/logo.webp`

- Replace with your logo (WebP format recommended)
- Update `src/lib/assets/shared/index.ts` barrel export
- Update dimensions if needed

### Favicons & PWA Icons

Replace these in `static/`:
- `favicon.ico`
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` (180x180)
- `icon-192.png` (for PWA)
- `icon-512.png` (for PWA)

**Tool:** [favicon.io](https://favicon.io) generates all sizes from one image

---

## 5. Adding New Pages

### Create a New Route

1. **Create route file:** `src/routes/(main)/your-page/+page.svelte`

```svelte
<script lang="ts">
import { Meta } from "$components/shared";
</script>

<Meta
  title="Page Title"
  description="Page description for SEO"
  pageURI="/your-page"
/>

<section>
  <h1>Your Page</h1>
  <!-- Your content -->
</section>
```

2. **Add navigation link:** Update `src/lib/components/shared/helpers/NavLinks.svelte`

### Using Server-Side Data Loading (Optional)

For dynamic data, create a `+page.server.ts` file:

```typescript
// src/routes/(main)/your-page/+page.server.ts
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  // Fetch or compute data here
  return {
    items: [...],
  };
};
```

Then use in your page:

```svelte
<script lang="ts">
import type { PageProps } from "./$types";
let { data }: PageProps = $props();
</script>

{#each data.items as item}
  <div>{item.name}</div>
{/each}
```

---

## 6. Available Components

**Primitives:**
- `Accordion` - Collapsible sections (FAQs, etc.)
- `HeroImage` - Full-width hero images
- `ItemCard` - Generic card with image, name, link
- `ItemCategory` - Groups items into sections
- `QuoteCard` - Quotes/testimonials with avatars
- `Meta` - SEO meta tags per page
- `Header` - Site navigation

**Layout:**
- `CardSection` - Grid layout with heading
- `ButtonGrid` - Color-cycling button links

**Helpers:**
- `SkipLink` - Accessibility skip-to-content
- `NavLinks` - Navigation links helper
- `QuoteCardHeader` - Quote card header with avatar

See README.md for usage examples of each component.

---

## 7. SEO & Metadata

### Structured Data

**File:** `src/lib/data/shared/meta.ts`

Update the JSON-LD structured data for your organization:

```typescript
export const OrganizationData = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization", // Or "Person" for personal sites
  name: SiteProperties.siteName,
  description: SiteProperties.siteDescription,
  url: SiteProperties.siteUrl,
  sameAs: [
    "https://github.com/yourusername",
    "https://twitter.com/yourusername",
  ],
});
```

### Sitemap

**File:** `src/routes/sitemap.xml/+server.ts`

Update the routes array with your actual pages and their priorities.

---

## 8. Package & Deployment

### package.json

```json
{
  "name": "your-project-name",
  "description": "Your project description",
  "version": "1.0.0"
}
```

### Deployment (Netlify)

1. Push to GitHub
2. Connect repository in Netlify
3. Build settings (auto-detected):
   - Build command: `bun run build`
   - Publish directory: `build`
4. Add environment variables if needed

---

## 9. Optional Customizations

### Typography

**Files to update:**
- `package.json` - Replace `@fontsource` packages
- `src/styles/variables.css` - Update font-family variables
- `src/routes/+layout.svelte` - Import new font packages

Current fonts: **Average** (serif), **Girassol** (display)

### Animation Preferences

The template respects `prefers-reduced-motion`. Animations are in:
- `src/lib/scripts/transition.ts` - Svelte transition presets
- `src/styles/interactive.css` - Hover effects
- `src/lib/data/shared/design-tokens.ts` - Duration/easing tokens

---

## 10. Testing Your Changes

After customization:

```bash
# Development
bun dev

# Production build
bun run build
bun preview

# Type checking
bun run watch
```

**Check:**
- [ ] Site loads without errors
- [ ] Navigation works
- [ ] Colors match your brand
- [ ] Meta tags show correct info (inspect page source)
- [ ] PWA manifest accessible at `/site.webmanifest`
- [ ] Offline mode works (DevTools → Network → Offline)

---

## 11. Project Structure Tips

**Organize content by feature:**
```
src/lib/data/
├── shared/        # Site-wide config
├── blog/          # Blog-specific data
├── products/      # Product data
└── team/          # Team member data
```

**Component organization:**
```
src/lib/components/
├── shared/        # Reusable primitives
├── blog/          # Blog-specific components
└── products/      # Product-specific components
```

**Keep it simple:**
- Don't create folders until you need them
- Start with shared components
- Extract page-specific components only when you reuse them
- Prefer composition over complex components

---

## 12. Further Enhancements

Consider adding:
- Form components (TextField, TextArea, Button)
- Blog with MDsveX for markdown posts
- CMS integration (e.g., Sanity, Contentful)
- Analytics (Plausible, Fathom, GA4)
- Tauri for desktop app version
- Authentication (if needed)

See `docs/architecture-decisions.md` for rationale behind current patterns.

---

## Need Help?

- **Architecture:** Read `docs/architecture-decisions.md`
- **Styling:** Read `docs/css.md` and `docs/color-system.md`
- **SvelteKit:** Read `docs/sveltekit.md`
- **SEO:** Read `docs/seo-strategy.md`
- **PWA:** Read `docs/pwa-web-standards.md`
