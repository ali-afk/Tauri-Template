# PWA & Web Standards

This guide explains the Progressive Web App (PWA) features and web standards endpoints implemented in the BritMUN website.

## Table of Contents
- [Service Worker (Offline Support)](#service-worker-offline-support)
- [Web App Manifest](#web-app-manifest)
- [Web Standards Endpoints](#web-standards-endpoints)
- [Icon Assets](#icon-assets)

---

## Service Worker (Offline Support)

The service worker enables the site to work offline and load faster by caching resources.

### How It Works

**Location:** `src/service-worker.ts` + `src/lib/scripts/service-worker.ts`

The service worker uses a **cache-first strategy** for all resources (HTML pages and static assets):

1. **Install phase:** Precaches all build assets (JS, CSS, images)
2. **Fetch phase:**
   - Checks cache first
   - If not cached, fetches from network and caches the response
   - If network fails, returns 503 error with `Retry-After: 300` header

**Why cache-first?** Conference websites change infrequently, so prioritizing cached content provides fast load times. Users will still get updates when the site is deployed (cache version changes).

### Cache Behavior

- **Cache name:** `cache-${version}` (automatically versioned on deployment)
- **What's cached:**
  - All build assets (JS, CSS, fonts)
  - All static files (images, icons)
  - HTML pages (after first visit)
- **Cache updates:** Automatic when you deploy a new version

### Testing Offline Mode

1. Open the site in Chrome/Edge
2. Open DevTools → Network tab
3. Select "Offline" from throttling dropdown
4. Refresh the page → should still load from cache
5. Try navigating → should work for visited pages

### Debugging

**Chrome DevTools → Application → Service Workers:**
- See registration status
- Unregister for testing
- Update on reload
- View cache storage

**Common issues:**
- Service worker only runs in production (not `bun dev`)
- HTTPS required (or localhost for testing)
- Clear cache if updates aren't showing: DevTools → Application → Clear Storage

---

## Web App Manifest

The Web App Manifest makes the site installable as a Progressive Web App.

**Location:** `src/routes/site.webmanifest/+server.ts`

### What It Provides

```json
{
  "name": "BritMUN XI - Model United Nations Bahrain",
  "short_name": "BritMUN XI",
  "description": "British School of Bahrain Model United Nations Conference 2026",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#934599"
}
```

**Key features:**
- **Standalone display:** Opens in app mode (no browser UI)
- **Theme color:** Purple (#934599) for browser chrome
- **Icons:** Multiple sizes for different devices (see below)

### Installation

**On mobile (Chrome/Safari):**
1. Visit the site
2. Browser shows "Add to Home Screen" prompt
3. Tap to install → app appears on home screen

**On desktop (Chrome/Edge):**
1. Visit the site
2. Look for install icon in address bar
3. Click to install → app in taskbar/dock

### Configuration

The manifest is **dynamically generated** from:
- `SiteProperties` (name, description, URL)
- `DesignTokens` (colors)

No manual editing needed - update `SiteProperties` and it updates automatically.

---

## Web Standards Endpoints

These endpoints provide information to search engines, bots, and tools.

### robots.txt

**URL:** `/robots.txt`
**Purpose:** Tells search engines which pages to crawl

```
User-agent: *
Allow: /

Sitemap: https://britmun.netlify.app/sitemap.xml
```

**Current config:**
- Allows all crawlers
- Allows all pages
- Points to sitemap

**When to update:** Rarely. Only if you want to block specific pages from search engines.

---

### sitemap.xml

**URL:** `/sitemap.xml`
**Purpose:** Helps search engines discover and index your pages

```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://britmun.netlify.app/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://britmun.netlify.app/councils</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

**Currently indexed:**
- `/` (Home) - priority 1.0
- `/councils` - priority 0.8

**To add a new page:**
1. Edit `src/routes/sitemap.xml/+server.ts`
2. Add page to `pages` array: `"/new-page"`
3. Deploy → sitemap automatically updates

**Note:** Only include pages on YOUR domain. Don't add external links (Google Drive, etc.).

---

### llms.txt

**URL:** `/llms.txt`
**Purpose:** Provides information for AI assistants and LLM crawlers

Contains:
- Conference overview (dates, location, fees)
- Complete list of councils by category
- Contact information and resources
- Context for AI assistants answering questions about the site

**When to update:**
- New conference year (automatically via `SiteProperties`)
- Council changes (update manually in the file)
- Major site structure changes

---

### humans.txt

**URL:** `/humans.txt`
**Purpose:** Credits the team behind the website

```
# TEAM

British School of Bahrain MUN Team

Credits: Ali Hussain Ali, Amr AlSaleh

Year: 2026

# TECH

Standards: HTML5, CSS3, TypeScript
Components: SvelteKit, Vite, LightningCSS
Linting: Biome
Fonts: Average, Girassol
```

**When to update:**
- Beginning of each conference year
- Add new team members who significantly contributed
- Update year

---

### security.txt

**URL:** `/.well-known/security.txt`
**Purpose:** RFC 9116 - Security contact information for researchers

```
Contact: mailto:britmun@thebsbh.com
Expires: 2027-12-31T23:59:59Z
Preferred-Languages: en
Canonical: https://britmun.netlify.app/.well-known/security.txt
```

**When to update:** Rarely. Expiration is set far in the future (2027).

---

## Icon Assets

**Location:** `static/` directory

### Icon Set

| File | Size | Purpose |
|------|------|---------|
| `icon-192.png` | 192×192 | Android home screen |
| `icon-512.png` | 512×512 | Android splash screen |
| `apple-touch-icon.png` | 180×180 | iOS home screen |
| `favicon-16x16.png` | 16×16 | Browser tab |
| `favicon-32x32.png` | 32×32 | Browser tab (high-DPI) |
| `favicon.ico` | Multi-size | Fallback favicon |

### Icon Requirements

**Design guidelines:**
- Use the BritMUN logo or branding
- Solid background (no transparency for iOS)
- Simple design that scales well
- High contrast for visibility

**File format:** PNG (except `.ico`)
**Color space:** sRGB

### Generating Icons for New Conference

1. **Design the logo** (512×512 or larger)
2. **Use a tool** like [RealFaviconGenerator](https://realfavicongenerator.net/):
   - Upload your 512×512 logo
   - Configure iOS, Android, browser settings
   - Download generated icon pack
3. **Replace files** in `static/` directory
4. **Test:**
   - Check browser tab icon
   - Try "Add to Home Screen" on mobile
   - Verify PWA install on desktop

---

## Testing Checklist

Before deploying PWA features:

- [ ] Service worker registers successfully (DevTools → Application)
- [ ] Offline mode works (DevTools → Network → Offline)
- [ ] Manifest is valid ([Web Manifest Validator](https://manifest-validator.appspot.com/))
- [ ] Icons load correctly in browser tab
- [ ] "Add to Home Screen" prompt appears on mobile
- [ ] PWA installs on desktop
- [ ] All web standards endpoints return correct responses:
  - [ ] `/robots.txt`
  - [ ] `/sitemap.xml`
  - [ ] `/llms.txt`
  - [ ] `/humans.txt`
  - [ ] `/.well-known/security.txt`

---

## Browser Support

| Feature | Chrome | Safari | Firefox | Edge |
|---------|--------|--------|---------|------|
| Service Worker | 40+ | 11.1+ | 44+ | 17+ |
| Web Manifest | 39+ | 11.3+ | ✗ | 79+ |
| PWA Install | Yes | Yes (iOS 11.3+) | No | Yes |

**Note:** Firefox supports service workers but not full PWA installation.

---

## Common Questions

**Q: Why doesn't the service worker work in development?**
A: Service workers only run in production for security. Test with `bun run build && bun run preview`.

**Q: How do I force a service worker update?**
A: Deploy a new version. The cache version automatically changes, and users get the update on next visit.

**Q: Can users disable the service worker?**
A: Yes, users can clear cache/site data in browser settings. The service worker will re-register on next visit.

**Q: What happens if the service worker fails to register?**
A: The site works normally without offline support. Service worker is a progressive enhancement.

**Q: Should I add every external link to sitemap.xml?**
A: No. Sitemaps are only for pages on YOUR domain. External links (Google Drive, etc.) shouldn't be included.
