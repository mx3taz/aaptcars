# The Ultimate AI Playbook: Converting ANY Website to a WordPress Theme

> **Version**: 2.0 — April 2026
> **Purpose**: A complete, definitive, zero-ambiguity guide for any AI model to convert ANY static HTML/CSS/JS website into a high-performance WordPress custom theme — with **zero mistakes**, **zero missing assets**, and **perfect Lighthouse scores**.
> **Tested with**: WordPress 6.7, PHP 8.2

---

## TABLE OF CONTENTS

| Phase | Title | Focus |
|-------|-------|-------|
| 0 | [Output Management Strategy](#phase-0-output-management-strategy) | Avoiding output limits |
| 1 | [Deep Audit & Inventory](#phase-1-deep-audit--inventory) | Understanding the source |
| 2 | [Architecture Decision](#phase-2-architecture-decision) | When to use this approach |
| 3 | [CSS Extraction & Separation](#phase-3-css-extraction--separation) | Splitting styles |
| 4 | [JavaScript Extraction & Separation](#phase-4-javascript-extraction--separation) | Splitting scripts |
| 5 | [Theme Skeleton Creation](#phase-5-theme-skeleton-creation) | WordPress file structure |
| 6 | [Template Conversion — HTML → PHP](#phase-6-template-conversion--html--php) | Converting pages |
| 7 | [JavaScript WordPress Adaptation](#phase-7-javascript-wordpress-adaptation) | Path resolution, IIFE wrapping |
| 8 | [Asset Pipeline & functions.php](#phase-8-asset-pipeline--functionsphp) | Conditional loading |
| 9 | [WordPress Admin Setup](#phase-9-wordpress-admin-setup) | Activation & configuration |
| 10 | [Verification & Lighthouse](#phase-10-verification--lighthouse) | Testing everything |

---

## PHASE 0: OUTPUT MANAGEMENT STRATEGY

> [!CAUTION]
> AI models have output token limits. A full website conversion can require 50,000+ characters of output. You MUST manage this or you WILL lose context and produce incomplete work.

### The Golden Rules of Output Management

1. **NEVER output the entire converted website in one response.** Break work into discrete, self-contained steps.
2. **One file per response.** Create/modify ONE file at a time, then confirm completion before moving on.
3. **Use a Task Checklist.** Create a persistent task list (like `task.md`) and mark items complete as you go. This prevents losing track.
4. **Work in this exact order:**
   ```
   Step 1:  Create style.css (theme declaration only — tiny file)
   Step 2:  Create functions.php (bloat removal + asset pipeline)
   Step 3:  Extract and create assets/css/global.css
   Step 4:  Extract and create page-specific CSS files (one at a time)
   Step 5:  Copy and adapt products.js / shared data files
   Step 6:  Extract and create assets/js/global.js
   Step 7:  Extract and create page-specific JS files (one at a time)
   Step 8:  Create header.php
   Step 9:  Create footer.php
   Step 10: Create front-page.php (home)
   Step 11: Create page-shop.php
   Step 12: Create page-checkout.php
   Step 13: Create any remaining page templates (one at a time)
   Step 14: Create index.php (fallback)
   Step 15: Copy images to assets/img/
   Step 16: Verification pass
   ```
5. **If a single file is too large (>3000 lines):** Output it in sections, clearly marking `// === SECTION 1 of 3 ===` boundaries. The user must concatenate.
6. **Always state what you completed and what's next** at the end of each response:
   ```
   ✅ Completed: header.php
   ⏭️ Next: footer.php
   📊 Progress: 8/16 steps complete
   ```

### Context Preservation Between Responses

When splitting work across responses, always begin the next response by restating:
- The theme name and text-domain
- The asset path convention (`assets/css/`, `assets/js/`, `assets/img/`)
- Any critical variable names (e.g., `THEME_DATA`, `PRODUCTS`, `CART` localStorage key)
- Which step number you are on

---

## PHASE 1: DEEP AUDIT & INVENTORY

### Step 1.1 — File Inventory

Create a complete inventory of EVERY file in the project. Use this exact table format:

| File | Type | Size | Maps To (WP) |
|------|------|------|---------------|
| `index.html` | HTML | 122KB | `front-page.php` |
| `shop.html` | HTML | 111KB | `page-shop.php` |
| `checkout.html` | HTML | 43KB | `page-checkout.php` |
| `product-details.html` | HTML | 76KB | `single-{cpt}.php` or `page-product.php` |
| `products.js` | JS (shared data) | 26KB | `assets/js/products.js` |
| `script_temp.js` | JS (shop logic) | 38KB | `assets/js/shop.js` |
| `css_temp.css` | CSS (shop styles) | 54KB | `assets/css/shop.css` |
| `logo.png` | Image | 79KB | `assets/img/logo.png` |
| `img/Products/...` | Images | varies | `assets/img/Products/...` |

### Step 1.2 — Identify Code Architecture Pattern

Classify the website into ONE of these patterns (each requires different handling):

| Pattern | Characteristics | Strategy |
|---------|----------------|----------|
| **Monolithic Inline** | All CSS in `<style>`, all JS in `<script>`, all in one HTML file | Extract everything to external files |
| **Multi-Page Inline** | Multiple HTML files, each with its own `<style>` and `<script>` blocks | Extract shared code to global files, page-specific to named files |
| **Multi-Page External** | HTML files link to external `.css` and `.js` files | Minimal extraction needed, mainly path fixes |
| **SPA (Single Page App)** | One HTML file with JS routing showing/hiding views | Convert to multi-page WordPress; split JS per logical "page" |
| **Hybrid** | Mix of inline and external, some shared, some page-specific | Requires the most careful analysis |

> [!IMPORTANT]
> Most real-world sites are **Hybrid** or **Multi-Page Inline**. The IL & ELLE site is a **Multi-Page Inline with Shared External Data** — CSS and JS are embedded in each HTML file as `<style>` and `<script>` blocks, while product data lives in an external `products.js`.

### Step 1.3 — Map All Embedded Code Blocks

For EACH HTML file, create this inventory:

```
=== index.html ===
<style> block 1: Lines 15-2431    → Purpose: ALL styles (reset + components + page-specific)
<style> block 2: Lines 2437-2528  → Purpose: Loader + card swatches (in <body>)
<script> block 1: Line 2536       → External: products.js
<script> block 2: Lines 2537-2551 → Purpose: Loader logic
<script> block 3: Lines 3007-3721 → Purpose: Carousels, search, cart, drawer, animations
```

### Step 1.4 — Map Shared vs. Page-Specific Code

Create a definitive classification:

#### Shared HTML (→ `header.php` + `footer.php`)
- Announcement bar
- Sticky header wrapper
- Site header with logo, search icon, cart icon
- Main navigation with dropdown menus
- Mobile menu
- Footer with brand info, category links, navigation links
- App drawer (Quick Buy + Cart)
- Search overlay
- Drawer overlay

#### Shared CSS (→ `global.css`)
- CSS reset (`*`, `*::before`, `*::after`)
- CSS custom properties (`:root`)
- Base element styles (`html`, `body`, `a`, `img`, `button`, `ul`)
- Announcement bar styles
- Header styles (`.sticky-header-wrapper`, `.site-header`, `.header-main`, etc.)
- Navigation styles (`.main-nav`, `.nav-list`, `.nav-item-dropdown`, `.dropdown-menu`)
- Mobile menu styles (`.mobile-menu`, `.mobile-menu-content`)
- Footer styles (`.site-footer`, `.footer-grid`, `.footer-col`, etc.)
- Drawer styles (`.drawer-overlay`, `.app-drawer`, `.drawer-header`, etc.)
- Quick View styles (`.qv-image`, `.qv-image-container`, `.color-swatch`, `.size-btn`, etc.)
- Cart styles (`.cart-item`, `.cart-item-details`, `.qty-selector`, etc.)
- Search overlay styles (`.search-overlay`, `.search-grid`, etc.)
- Product card styles (`.product-card`, `.img-wrap`, `.badge`, `.quick-buy`, `.view-details-btn`, etc.)
- Card color swatch styles (`.card-colors`, `.card-color-swatch`)
- Loader styles (`#premium-loader`)
- Animation classes (`.reveal`, `.stagger-item`, `@keyframes`)
- Responsive breakpoints that apply to shared components

#### Shared JS (→ `global.js`)
- Cart state management (`window.CART`, `localStorage`, `saveCartState`)
- Cart count update (`updateCartCount`)
- Drawer open/close (`openDrawer()`, `closeDrawer()`)
- Quick Buy rendering (`renderQuickShop()`)
- Cart drawer rendering (`renderCartDrawer()`)
- Cart item operations (`updateItemQty`, `removeCartItem`)
- Search overlay logic (`renderSearchResults`, `closeSearch`)
- Mobile menu toggle logic
- Sticky header scroll shadow
- Quick buy click delegation (`document.body.addEventListener('click', ...)`)
- Escape key handler

#### Shared Data (→ `products.js` — loaded before everything else)
- `PRODUCTS` array
- `COLOR_NAMES` map
- `formatPrice()` function
- `getGroupedProducts()` function
- `renderCard()` function
- `handleCardClick()` function
- `switchCardVariant()` function

#### Page-Specific CSS (→ `home.css`, `shop.css`, etc.)
- **Home**: Hero, section headers, carousel, category grid, banners, promo text, newsletter, essentials, pay-later
- **Shop**: Shop layout, sidebar, filter groups, product grid, sort, mobile filter, active filter tags, inline search, empty state
- **Checkout**: Checkout container, form styles, cart summary, order success
- **Product Details**: Details grid, gallery, thumbnails, product info, breadcrumbs, selection groups, action buttons, related products section

#### Page-Specific JS (→ `home.js`, `shop.js`, etc.)
- **Home**: `populateCarousel()`, carousel navigation, drag-to-scroll, IntersectionObserver reveals, magnetic buttons, parallax, category grid init
- **Shop**: Filter state management (`shopState`), `filterProducts()`, `initFilters()`, URL param parsing, sort, inline search, mobile filter toggle, sidebar open/close
- **Checkout**: Cart summary rendering, form validation, Google Sheets submission, order success state
- **Product Details**: Product data loading from URL params, gallery rendering, color/size selection, add-to-cart, related products carousel

### Step 1.5 — Map ALL Internal Links

Search for EVERY `href=`, `src=`, `window.location`, `location.href` in ALL files:

| Static URL | WordPress Equivalent | Where Found |
|------------|---------------------|-------------|
| `href="index.html"` | `<?php echo esc_url(home_url('/')); ?>` | header nav, footer, mobile menu |
| `href="shop.html"` | `<?php echo esc_url(home_url('/shop/')); ?>` | header nav, hero CTA, banners, footer |
| `href="shop.html?categoryName=Robes%20Soirée"` | `<?php echo esc_url(home_url('/shop/?categoryName=Robes%20Soirée')); ?>` | dropdown menu, footer |
| `href="checkout.html"` | `<?php echo esc_url(home_url('/checkout/')); ?>` | cart drawer button |
| `href="product-details.html?id=X"` | dynamically resolved in JS | renderCard(), handleCardClick() |
| `href="index.html#promotionsSection"` | `<?php echo esc_url(home_url('/#promotionsSection')); ?>` | nav links |
| `src="logo.png"` | `<?php echo esc_url(get_template_directory_uri() . '/assets/img/logo.png'); ?>` | header, footer |
| `src="img/Products/..."` | resolved via `imgPath()` JS helper | products.js data, dynamically rendered |
| External URLs (pexels.com, fonts.googleapis.com) | **Keep as-is** | hero images, banners, Google Fonts |

> [!WARNING]
> **Edge Case: Hash links with page prefix.** Links like `index.html#promotionsSection` must become `home_url('/#promotionsSection')`. The hash fragment must be preserved but the `.html` must be removed.

> [!WARNING]
> **Edge Case: Query parameters on page links.** Links like `shop.html?categoryName=X&isNew=true` must become `home_url('/shop/?categoryName=X&isNew=true')`. Use PHP's `add_query_arg()` for dynamic construction, but for hardcoded HTML links, use the full URL string.

### Step 1.6 — Audit ALL Image References

Cross-reference EVERY image path against actual files on disk:

```
FOR EACH image reference in products.js / HTML / CSS:
  1. Does the file exist at the exact path?
  2. Does the case match EXACTLY? (Linux servers are case-sensitive)
  3. Does the extension match? (.jpeg vs .jpg vs .webp vs .png)
  4. Are there spaces in the filename? (Must be URL-encoded or renamed)
  5. Are there special characters? (accents: é, ï, etc.)
```

> [!CAUTION]
> **The #1 cause of broken WordPress themes is image 404s.** Products with paths like `img/Products/Robe longue/Product 2/drapé beige.jpeg` contain BOTH spaces AND accented characters. These MUST be preserved exactly as they are in the filesystem, but they need proper URL encoding in `<img src>` attributes.

### Step 1.7 — Identify External Dependencies

List ALL external resources:

| Resource | Type | Used On | Action |
|----------|------|---------|--------|
| Google Fonts (Playfair Display + Montserrat) | CSS | All pages | Preconnect + enqueue via `wp_enqueue_style` |
| Pexels images | Images | Home page hero/banners | Keep external URLs unchanged |
| Google Apps Script endpoint | API | Checkout | Keep fetch URL unchanged in JS |
| Facebook/Instagram/TikTok links | URLs | Announcement bar, footer | Keep unchanged |

---

## PHASE 2: ARCHITECTURE DECISION

### When to Use Zero-Dependency Custom Theme (THIS GUIDE)

Use this approach when the site has **ANY** of:
- ✅ Client-side rendering (JS builds DOM dynamically from data arrays)
- ✅ Custom cart/checkout logic using `localStorage`
- ✅ Complex filter/search systems with multi-dimensional state
- ✅ Custom animations (IntersectionObserver, parallax, magnetic buttons, drag-to-scroll)
- ✅ Google Sheets / external API integrations
- ✅ Hardcoded product data in JS arrays
- ✅ Custom overlay systems (search, quick buy, drawers)
- ✅ Custom image transition effects (zoom-fade variant switching)

### When NOT to Use This Approach

- ❌ Simple brochure sites with 2-3 static pages and no JS → Use a block theme or Starter Theme
- ❌ Sites that need WooCommerce product management → WooCommerce theme
- ❌ Sites with dynamic server-rendered content (blog, CMS-heavy) → Standard WordPress theme development

### The Zero-Dependency Rule

> [!IMPORTANT]
> **NO third-party plugins** for the core functionality: No WooCommerce, Elementor, Yoast (for core), Slider Revolution, etc.
> **NO CSS frameworks**: No Bootstrap, Tailwind (unless already used), Foundation.
> **NO jQuery**: WordPress includes jQuery but we don't need it. Deregister `jquery-migrate`.
> **NO block editor styles**: Dequeue `wp-block-library`, `wp-block-library-theme`, `classic-theme-styles`, `global-styles`.

**WHY:** Every plugin and framework adds 50-400KB of CSS/JS. A zero-dependency theme achieves Lighthouse Performance scores of 95-100 because it loads only what's needed.

---

## PHASE 3: CSS EXTRACTION & SEPARATION

### Step 3.1 — Extract Shared Global CSS

From the FIRST (most complete) HTML file, extract all styles that are shared across pages into `global.css`.

**Identification method:**
1. Open each HTML file
2. Compare their `<style>` blocks line by line
3. Any rule that appears in 2+ files → **SHARED** → `global.css`
4. Any rule that appears in only 1 file → **PAGE-SPECIFIC** → `{page}.css`

**The shared CSS includes (but verify for YOUR site):**
- CSS reset and custom properties
- Typography base styles
- Announcement bar
- Header and navigation
- Mobile menu
- Footer
- Drawer / Quick View / Cart UI
- Search overlay
- Product card styles (if used on multiple pages)
- Animation keyframes and reveal classes
- All responsive media queries for shared components

### Step 3.2 — Extract Page-Specific CSS

For each page template, extract ONLY the styles unique to that page:

```
home.css   → Hero, carousels, category grid, banners, promo text, newsletter, essentials, pay-later, loader
shop.css   → Shop layout, sidebar, filters, product grid, sort controls, active tags, empty state, mobile filter
checkout.css → Checkout form, cart summary table, order success
product.css  → Product details grid, gallery, thumbnails, breadcrumbs, size/color selectors, actions, related products
```

### Step 3.3 — Handle CSS Edge Cases

> [!WARNING]
> **Edge Case: Duplicate rules across pages.** Some rules may appear identically in multiple pages (e.g., `.product-card` in both home and shop). Include them in `global.css` ONCE. Do NOT duplicate.

> [!WARNING]
> **Edge Case: Slightly different rules across pages.** Example: `.product-card` might have `flex: 0 0 calc(25% - 15px)` on home (carousel) but `grid` layout on shop. Solution: The base `.product-card` styles go in `global.css`. Page-specific overrides go in `home.css` and `shop.css`.

> [!WARNING]
> **Edge Case: CSS specificity conflicts.** When splitting, ensure that page-specific CSS loads AFTER `global.css` in the dependency chain. Check `wp_enqueue_style` dependencies.

> [!WARNING]
> **Edge Case: Background images in CSS.** If CSS references `url('img/...')`, these paths must become relative to the CSS file's location in the theme. Use `url('../img/...')` since CSS files are in `assets/css/` and images are in `assets/img/`.

> [!WARNING]
> **Edge Case: Background images as inline styles.** If HTML elements have `style="background-image: url('...')"`, convert to PHP: `style="background-image: url('<?php echo esc_url(get_template_directory_uri() . '/assets/img/...'); ?>')"`. For external URLs (Pexels, etc.), keep as-is.

### Step 3.4 — CSS Variable Consistency

Ensure the `:root` custom property block appears EXACTLY ONCE in `global.css`. If different pages define slightly different variables, merge them:

```css
:root {
    --font-heading: 'Playfair Display', Georgia, serif;
    --font-body: 'Montserrat', Arial, sans-serif;
    --color-bg: #ffffff;
    --color-beige: #f7f1e3;
    --color-text: #000000;
    --color-grey: #777;
    --color-gold: #b8860b;
    --color-light-grey: #f5f5f5;
    --color-accent: #b8860b;       /* alias used on product-details page */
    --header-height: 60px;
    --nav-height: 48px;
    --announce-height: 40px;
    --container-padding: 24px;     /* used on product-details page */
}

@media (max-width: 768px) {
    :root {
        --container-padding: 16px;
    }
}
```

---

## PHASE 4: JAVASCRIPT EXTRACTION & SEPARATION

### Step 4.1 — Extract Shared Product Data (`products.js`)

If the site already has an external `products.js`, keep it as-is. If data is inline, extract it.

This file MUST contain:
- The product data array (`const PRODUCTS = [...]`)
- Color name mappings (`const COLOR_NAMES = {...}`)
- Price formatting utility (`function formatPrice()`)
- Card rendering function (`function renderCard()`)
- Variant grouping function (`function getGroupedProducts()`)
- Card interaction handlers (`handleCardClick()`, `switchCardVariant()`)

**This file loads FIRST on every page.**

### Step 4.2 — Extract Shared Global JS (`global.js`)

Contains logic needed on EVERY page:

```javascript
(function() {
    'use strict';

    // === IMAGE PATH HELPER ===
    // THE MOST CRITICAL FUNCTION IN THE ENTIRE MIGRATION
    window.imgPath = function(src) {
        if (!src) return '';
        if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//')) return src;
        var base = (typeof THEME_DATA !== 'undefined' && THEME_DATA.url) ? THEME_DATA.url + '/assets/img/' : '';
        // Handle paths that start with "img/" — strip the prefix since it's now in assets/img/
        if (src.startsWith('img/')) {
            src = src.substring(4); // Remove "img/" prefix
        }
        return base + src;
    };

    // === LINK HELPERS ===
    window.shopUrl = function(params) {
        var base = (typeof THEME_DATA !== 'undefined' && THEME_DATA.shop) ? THEME_DATA.shop : '/shop/';
        if (params) base += (base.indexOf('?') === -1 ? '?' : '&') + params;
        return base;
    };

    window.homeUrl = function(hash) {
        var base = (typeof THEME_DATA !== 'undefined' && THEME_DATA.home) ? THEME_DATA.home : '/';
        if (hash) base += hash;
        return base;
    };

    window.checkoutUrl = function() {
        return (typeof THEME_DATA !== 'undefined' && THEME_DATA.checkout) ? THEME_DATA.checkout : '/checkout/';
    };

    window.productUrl = function(productId) {
        return (typeof THEME_DATA !== 'undefined' && THEME_DATA.product)
            ? THEME_DATA.product + '?id=' + productId
            : '/product/?id=' + productId;
    };

    // === CART STATE MANAGEMENT ===
    window.CART = [];
    try {
        var saved = localStorage.getItem('taz_cart_state');
        if (saved) window.CART = JSON.parse(saved);
    } catch (e) {}

    window.saveCartState = function() {
        localStorage.setItem('taz_cart_state', JSON.stringify(window.CART));
        updateCartCount();
    };

    // Cross-tab sync
    window.addEventListener('storage', function(e) {
        if (e.key === 'taz_cart_state') {
            try {
                window.CART = JSON.parse(e.newValue || '[]');
                updateCartCount();
                var appDrawer = document.getElementById('appDrawer');
                var drawerTitle = document.getElementById('drawerTitle');
                if (appDrawer && appDrawer.classList.contains('open') && drawerTitle && drawerTitle.innerText === 'VOTRE PANIER') {
                    renderCartDrawer();
                }
            } catch (err) {}
        }
    });

    // === DRAWER LOGIC ===
    // ... (openDrawer, closeDrawer, renderQuickShop, renderCartDrawer, etc.)
    // ... (updateItemQty, removeCartItem, updateCartCount)

    // === SEARCH OVERLAY ===
    // ... (renderSearchResults, closeSearch, searchToggle handler)

    // === MOBILE MENU ===
    // ... (menuToggle, menuClose handlers)

    // === STICKY HEADER ===
    window.addEventListener('scroll', function() {
        var sh = document.getElementById('stickyHeader');
        if (sh) sh.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    // === QUICK BUY DELEGATION ===
    document.body.addEventListener('click', function(e) {
        var qbBtn = e.target.closest('.quick-buy');
        if (qbBtn) {
            e.preventDefault();
            var id = qbBtn.getAttribute('data-id');
            if (id) renderQuickShop(id);
            if (typeof closeSearch === 'function') closeSearch();
        }
    });

    // === ESCAPE KEY ===
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            var searchOverlay = document.getElementById('searchOverlay');
            var appDrawer = document.getElementById('appDrawer');
            if (searchOverlay && searchOverlay.classList.contains('open')) closeSearch();
            if (appDrawer && appDrawer.classList.contains('open')) closeDrawer();
        }
    });

    // Initialize cart count on every page
    updateCartCount();
})();
```

### Step 4.3 — Extract Page-Specific JS

Each page gets its own JS file that contains ONLY the logic unique to that page:

**`home.js`** — Carousel population, carousel navigation, drag-to-scroll, IntersectionObserver, magnetic buttons, parallax banners, category grid initialization, loader logic.

**`shop.js`** — Filter state object, `filterProducts()`, `initFilters()`, URL param parsing, sort handler, inline search, mobile filter/sidebar toggles, animation engine for shop.

**`checkout.js`** — Cart summary render, form validation, Google Sheets submit, success state render.

**`product.js`** — URL param product lookup, gallery render, color/size selection, add-to-cart, related products carousel.

### Step 4.4 — JS Wrap in IIFE

> [!IMPORTANT]
> Wrap EACH page-specific JS file in an IIFE to prevent global scope pollution:

```javascript
(function() {
    'use strict';
    // All page-specific logic here...
})();
```

### Step 4.5 — Handle JS Edge Cases

> [!CAUTION]
> **Edge Case: Functions called from inline `onclick` attributes.** If HTML has `onclick="switchCardVariant(event, this, ${id}, '${hex}')"`, the function MUST be on `window`. Either:
> 1. Keep the function global: `window.switchCardVariant = function(...) { ... }`
> 2. Or use event delegation instead of inline handlers (preferred but requires HTML changes)

> [!CAUTION]
> **Edge Case: DOM element references.** Code like `const grid = document.getElementById('productGrid')` will throw if the element doesn't exist on the current page. ALWAYS guard with null checks:
```javascript
const grid = document.getElementById('productGrid');
if (!grid) return; // Not on this page
```

> [!CAUTION]
> **Edge Case: Script execution order.** WordPress enqueues scripts with dependencies. The order MUST be:
> 1. `products.js` (no dependencies)
> 2. `global.js` (depends on `products.js`)
> 3. `{page}.js` (depends on `global.js`)

> [!CAUTION]
> **Edge Case: `renderCard()` generates links to `product-details.html?id=X`.** These must be updated to use the WordPress URL. Replace `href="product-details.html?id=${p.id}"` with `href="${window.productUrl ? window.productUrl(p.id) : '#'}"` in `products.js`.

> [!CAUTION]
> **Edge Case: `window.location.href = 'checkout.html'`** in cart drawer. Must become `window.location.href = window.checkoutUrl ? window.checkoutUrl() : '/checkout/'`.

> [!CAUTION]
> **Edge Case: `window.location.href = 'product-details.html?id=${productId}'`** in `handleCardClick()`. Must use the `productUrl()` helper.

---

## PHASE 5: THEME SKELETON CREATION

### Step 5.1 — Create the Theme Directory Structure

```
{theme-name}/
├── style.css                          ← WP theme declaration (REQUIRED)
├── functions.php                      ← Bloat removal + asset pipeline (REQUIRED)
├── index.php                          ← Fallback template (REQUIRED)
├── header.php                         ← Shared header
├── footer.php                         ← Shared footer
├── front-page.php                     ← Home page (auto-detected by WP)
├── page-shop.php                      ← Shop page template
├── page-checkout.php                  ← Checkout page template
├── page-product.php                   ← Product details page template
│                                         (OR single-{cpt}.php if using CPT)
├── screenshot.png                     ← 1200×900 theme preview (REQUIRED)
├── assets/
│   ├── css/
│   │   ├── global.css                 ← All shared styles
│   │   ├── home.css                   ← Home-only styles
│   │   ├── shop.css                   ← Shop-only styles
│   │   ├── checkout.css               ← Checkout-only styles
│   │   └── product.css                ← Product details-only styles
│   ├── js/
│   │   ├── products.js                ← Shared product data (loads FIRST)
│   │   ├── global.js                  ← Shared logic (loads SECOND)
│   │   ├── home.js                    ← Home-only logic
│   │   ├── shop.js                    ← Shop-only logic
│   │   ├── checkout.js                ← Checkout-only logic
│   │   └── product.js                 ← Product details-only logic
│   └── img/
│       ├── Logo.png                   ← Site logos (EXACT case from original!)
│       ├── Logo.webp
│       └── Products/                  ← ALL product images, preserving directory structure
│           ├── Robe courte/
│           ├── Robe longue/
│           ├── Robe mi-longues/
│           └── ...etc
```

> [!CAUTION]
> **CRITICAL: File Name Case Sensitivity.** Most WordPress hosting runs on Linux, which has a **case-sensitive filesystem**. If the original file is `Logo.png` (uppercase L), then `logo.png` (lowercase l) will return a **404 error** on the server, even though it works on Windows/Mac during development. **ALWAYS match the EXACT case of the original filenames** in your `<img src>`, `wp_enqueue_style()`, and `wp_localize_script()` paths. Audit EVERY image reference against the actual filename on disk.
>
> Common mistakes:
> - `logo.png` vs `Logo.png`
> - `img/products/` vs `img/Products/`
> - Files with accented characters (e.g., `épaule dénudée noir.jpeg`) — these MUST be URL-encoded in PHP (`esc_url()`) and handled by `imgPath()` in JS.

```text
(continued from directory structure above)
```

### Step 5.2 — `style.css` (Theme Declaration)

```css
/*
Theme Name: IL & ELLE
Theme URI: https://ilelle.com
Author: IL & ELLE
Author URI: https://ilelle.com
Description: Zero-dependency, high-performance custom theme for IL & ELLE fashion brand. Features advanced product filtering, localStorage cart, quick-buy drawer, and parallax animations.
Version: 1.0.0
Requires at least: 6.0
Tested up to: 6.7
Requires PHP: 7.4
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: il-elle
*/

/* No styles here — all styles are in assets/css/ for performance. */
```

> [!IMPORTANT]
> `style.css` should contain ONLY the theme header comment. No actual styles. This is intentional for performance — WordPress loads `style.css` automatically, and if it's empty, it costs zero bytes.

---

## PHASE 6: TEMPLATE CONVERSION — HTML → PHP

### Step 6.1 — `header.php`

Extract everything from `<!DOCTYPE html>` through the end of the mobile menu. Include search overlay and drawers here if they appear on every page. DO include the `wp_head()` and `wp_body_open()` hooks.

```php
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<!-- PREMIUM LOADER (only on front page) -->
<?php if (is_front_page()) : ?>
<div id="premium-loader">
    <div class="loader-content">
        <div class="loader-brand">IL &amp; ELLE</div>
        <div class="loader-line"></div>
    </div>
</div>
<?php endif; ?>

<!-- ANNOUNCEMENT BAR -->
<div class="announce-bar">
    <div class="announce-social">
        <a href="https://www.facebook.com/people/Il-Elle/100086970232088/">
            <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
        </a>
        <!-- ... other social links ... -->
    </div>
</div>

<!-- STICKY HEADER -->
<div class="sticky-header-wrapper" id="stickyHeader">
    <header class="site-header">
        <div class="header-main">
            <div class="header-left">
                <span class="mobile-toggle" id="menuToggle">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <line x1="3" y1="12" x2="21" y2="12"/>
                        <line x1="3" y1="18" x2="21" y2="18"/>
                    </svg>
                </span>
                <span class="header-icon" id="searchToggle">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                </span>
            </div>
            <div class="logo" id="logo">
                <a href="<?php echo esc_url(home_url('/')); ?>">
                    <img width="100%" src="<?php echo esc_url(get_template_directory_uri() . '/assets/img/logo.png'); ?>" alt="<?php bloginfo('name'); ?>">
                </a>
            </div>
            <div class="header-right">
                <span class="header-icon" id="cartToggle" style="cursor:pointer;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 01-8 0"/>
                    </svg>
                    <span class="cart-count">0</span>
                </span>
            </div>
        </div>
    </header>

    <!-- NAVIGATION -->
    <nav class="main-nav">
        <ul class="nav-list">
            <li><a href="<?php echo esc_url(home_url('/')); ?>" <?php if (is_front_page()) echo 'class="active"'; ?>>Accueil</a></li>
            <li class="nav-item-dropdown">
                <a href="<?php echo esc_url(home_url('/shop/')); ?>" <?php if (is_page_template('page-shop.php')) echo 'class="active"'; ?>>Toutes les Robes</a>
                <div class="dropdown-menu">
                    <div class="dropdown-col">
                        <h4>Type de Robe</h4>
                        <a href="<?php echo esc_url(home_url('/shop/?categoryName=Robes%20Soirée')); ?>">Robes Soirée</a>
                        <a href="<?php echo esc_url(home_url('/shop/?categoryName=Robes%20Occasion%20%2FAïd')); ?>">Robes Occasion /Aïd</a>
                        <a href="<?php echo esc_url(home_url('/shop/?categoryName=Robes%20courtes')); ?>">Robes courtes</a>
                        <a href="<?php echo esc_url(home_url('/shop/?categoryName=Robes%20mi-longues')); ?>">Robes mi-longues</a>
                        <a href="<?php echo esc_url(home_url('/shop/?categoryName=Robes%20longues')); ?>">Robes longues</a>
                        <a href="<?php echo esc_url(home_url('/shop/?categoryName=Robes%20chaque%20jour')); ?>">Robes chaque jour</a>
                    </div>
                </div>
            </li>
            <li><a href="<?php echo esc_url(home_url('/#promotionsSection')); ?>">Promotions</a></li>
        </ul>
    </nav>
</div>

<!-- MOBILE MENU -->
<div class="mobile-menu" id="mobileMenu">
    <div class="mobile-menu-content">
        <div class="close-btn" id="menuClose">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        </div>
        <nav>
            <a href="<?php echo esc_url(home_url('/')); ?>">Accueil</a>
            <a href="<?php echo esc_url(home_url('/shop/')); ?>">Toutes les Robes</a>
            <div class="mobile-dropdown-container">
                <div class="mobile-dropdown-col">
                    <h4>Type de Robe</h4>
                    <a href="<?php echo esc_url(home_url('/shop/?categoryName=Robes%20Soirée')); ?>">Robes Soirée</a>
                    <!-- ... remaining links ... -->
                </div>
            </div>
            <a href="<?php echo esc_url(home_url('/#promotionsSection')); ?>">Promotions</a>
        </nav>
    </div>
</div>
```

### Step 6.2 — `footer.php`

Extract footer + all global overlays (drawer, search):

```php
<!-- FOOTER -->
<footer class="site-footer">
    <div class="footer-grid">
        <div class="footer-brand">
            <div class="footer-logo">
                <img width="100" src="<?php echo esc_url(get_template_directory_uri() . '/assets/img/logo.png'); ?>" alt="IL & ELLE">
            </div>
            <p>Un espace en ligne où sont présentés des vêtements décontractés et tendance pour femmes, avec des collections uniques.</p>
            <p class="contact-line"><strong>Service client :</strong> info@ilelle.com</p>
            <p class="contact-line"><strong>Téléphone :</strong> +216 26 574 461</p>
            <!-- ... more contact lines ... -->
        </div>
        <div class="footer-col">
            <h4>Catégories</h4>
            <ul>
                <li><a href="<?php echo esc_url(home_url('/shop/?categoryName=Robes%20Soirée')); ?>">Robes Soirée</a></li>
                <!-- ... -->
            </ul>
        </div>
        <div class="footer-col">
            <h4>Navigation</h4>
            <ul>
                <li><a href="<?php echo esc_url(home_url('/')); ?>">Accueil</a></li>
                <li><a href="<?php echo esc_url(home_url('/shop/')); ?>">Toutes les Robes</a></li>
                <li><a href="<?php echo esc_url(home_url('/#promotionsSection')); ?>">Promotions</a></li>
            </ul>
        </div>
    </div>
    <div class="footer-bottom-bar">
        <div>
            <p class="copyright" style="margin-top:16px">&copy; <?php echo date('Y'); ?> IL &amp; ELLE. Tous droits réservés.</p>
        </div>
    </div>
</footer>

<!-- APP DRAWER (Quick Buy / Cart) -->
<div class="drawer-overlay" id="drawerOverlay"></div>
<div class="app-drawer" id="appDrawer">
    <div class="drawer-header">
        <div class="drawer-title" id="drawerTitle">VOTRE PANIER</div>
        <div class="drawer-close" id="drawerClose">
            <svg viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="1.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </div>
    </div>
    <div class="drawer-body" id="drawerBody"></div>
    <div class="drawer-footer" id="drawerFooter" style="display:none;"></div>
</div>

<!-- SEARCH OVERLAY -->
<div class="search-overlay" id="searchOverlay">
    <div class="search-close" id="searchClose">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    </div>
    <div class="search-container">
        <div class="search-input-box">
            <input type="text" id="searchInput" placeholder="Rechercher dans notre boutique" autocomplete="off">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
        </div>
        <div class="search-suggestions-text" id="searchSuggestions">Suggestions : <strong>Articles Tendances</strong></div>
    </div>
    <div class="search-results-area">
        <div class="search-grid" id="searchGrid"></div>
        <div class="search-pages-links" id="searchPagesLinks" style="display:none;">
            <h4>Pages</h4>
            <a href="#">À propos</a>
            <a href="#">Conditions Générales d'Utilisation</a>
        </div>
        <button class="search-view-all" id="searchViewAll" style="display:none;">
            <a href="<?php echo esc_url(home_url('/shop/')); ?>">VOIR TOUS LES RÉSULTATS</a>
        </button>
    </div>
</div>

<?php wp_footer(); ?>
</body>
</html>
```

> [!IMPORTANT]
> `<?php wp_head(); ?>` goes in `<head>`. `<?php wp_footer(); ?>` goes before `</body>`. These are MANDATORY — they load all enqueued CSS and JS. WITHOUT THEM, nothing loads.

### Step 6.3 — Page Templates

> [!CAUTION]
> **🚨 CRITICAL BUG — 503/500 Fatal Error: `front-page.php` must NEVER have a `Template Name:` header.**
>
> WordPress has a **built-in template hierarchy** that auto-detects `front-page.php` by its filename when Settings → Reading is set to "A static page". If you add a `/* Template Name: Front Page */` comment to this file, WordPress tries to register it as BOTH a custom page template AND the auto-detected front page template simultaneously. This creates a **fatal PHP conflict** that crashes the entire site with a **503 Backend fetch failed** or **500 Internal Server Error** — often with no useful error message in the logs.
>
> **Rules:**
> - `front-page.php` — **NO** `Template Name:` header (auto-detected by filename)
> - `page-shop.php` — **YES** `Template Name: Shop Page` (custom page template)
> - `page-checkout.php` — **YES** `Template Name: Checkout Page` (custom page template)
> - `page-product.php` — **YES** `Template Name: Product Detail Page` (custom page template)
>
> This is the **#1 cause of white-screen-of-death after theme activation** when using a static front page.

**`front-page.php`** (auto-detected by WordPress for the front page):
```php
<?php
/**
 * Home Page Template (front-page.php)
 * Auto-detected by WordPress when Settings → Reading → Static front page is set.
 * DO NOT add "Template Name:" here — it causes a fatal 503/500 error!
 */
get_header(); ?>

<div id="homeView">
    <!-- HERO -->
    <section class="hero reveal">
        <img src="https://images.pexels.com/photos/34744048/pexels-photo-34744048.jpeg" alt="IL & ELLE Collection" loading="eager">
        <div class="hero-overlay">
            <span class="hero-sub">IL & ELLE</span>
            <h1 class="hero-title">UNIQUE COMME VOUS L'ÊTES</h1>
            <a href="<?php echo esc_url(home_url('/shop/')); ?>" class="hero-btn">ACHETER MAINTENANT</a>
        </div>
    </section>

    <!-- ... remaining home page sections, with all links converted ... -->
</div>

<?php get_footer(); ?>
```

**`page-shop.php`** (requires Template Name — this IS a custom page template):
```php
<?php
/**
 * Template Name: Shop Page
 */
get_header(); ?>

<!-- ... shop page HTML content ... -->

<?php get_footer(); ?>
```

**`page-checkout.php`** (requires Template Name):
```php
<?php
/**
 * Template Name: Checkout Page
 */
get_header(); ?>

<!-- ... checkout page HTML content ... -->

<?php get_footer(); ?>
```

> [!WARNING]
> **Edge Case: `front-page.php` auto-detection.** WordPress will ONLY auto-use `front-page.php` if **Settings → Reading** is set to "A static page" with a Front Page selected. If using "Your latest posts", it falls back to `home.php` → `index.php`.

> [!WARNING]
> **Edge Case: Template assignment.** Pages using `page-shop.php` MUST have `/* Template Name: Shop Page */` at the top, and a WordPress page titled "Shop" MUST exist with this template assigned in the Page Attributes panel.

---

## PHASE 7: JAVASCRIPT WORDPRESS ADAPTATION

### Step 7.1 — The Image Path Helper (CRITICAL)

This is **THE SINGLE MOST IMPORTANT** change in the entire migration.

In the static site, products reference images like:
```javascript
imgSrc: "img/Products/Robe longue/Product 1/dorés raffinés bordeaux.jpeg"
```

In WordPress, this image lives at:
```
/wp-content/themes/il-elle-theme/assets/img/Products/Robe longue/Product 1/dorés raffinés bordeaux.jpeg
```

**Solution: Global `imgPath()` helper** (in `global.js`):
```javascript
window.imgPath = function(src) {
    if (!src) return '';
    // External URLs: keep as-is
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//')) return src;
    // Data URIs: keep as-is
    if (src.startsWith('data:')) return src;

    var base = (typeof THEME_DATA !== 'undefined' && THEME_DATA.url) ? THEME_DATA.url + '/assets/' : '';

    // Paths starting with "img/" → maps to "assets/img/" (strip nothing, base already points to assets/)
    // Paths NOT starting with "img/" → assume they're relative to assets/img/
    if (!src.startsWith('img/')) {
        base += 'img/';
    }

    return base + src;
};
```

Then update EVERY place in `products.js` where `renderCard()` generates `<img>`:
```javascript
// BEFORE:
`<img src="${p.imgSrc}" alt="${p.name}" loading="lazy">`

// AFTER:
`<img src="${imgPath(p.imgSrc)}" alt="${p.name}" loading="lazy">`
```

And in `renderQuickShop()`, `renderCartDrawer()`, category grid, search results — everywhere an image is rendered from JS.

### Step 7.2 — Link Replacement in JS

Replace ALL hardcoded links in JavaScript:

```javascript
// BEFORE:
window.location.href = 'checkout.html';
// AFTER:
window.location.href = window.checkoutUrl();

// BEFORE:
href="product-details.html?id=${p.id}"
// AFTER:
href="${window.productUrl(p.id)}"

// BEFORE:
href="shop.html?categoryName=Robes%20Soirée"
// AFTER:
href="${window.shopUrl('categoryName=Robes%20Soirée')}"

// BEFORE:
window.location.href = `product-details.html?id=${productId}`;
// AFTER:
window.location.href = window.productUrl(productId);
```

### Step 7.3 — Image Path Updates for All Dynamic Rendering

Search for ALL of these patterns and replace with `imgPath()` wrapper:

```javascript
// In renderCard():
src="${p.imgSrc}"           → src="${imgPath(p.imgSrc)}"

// In renderQuickShop():
src="${p.imgSrc}"           → src="${imgPath(p.imgSrc)}"

// In renderCartDrawer():
src="${item.imgSrc}"        → src="${imgPath(item.imgSrc)}"

// In switchCardVariant():
newImg.src = sibling.imgSrc → newImg.src = imgPath(sibling.imgSrc)

// In Quick View color swatch handler:
newImg.src = variantProduct.imgSrc → newImg.src = imgPath(variantProduct.imgSrc)

// In category grid:
src="${p.imgSrc}"           → src="${imgPath(p.imgSrc)}"

// In checkout cart summary:
src="${item.imgSrc}"        → src="${imgPath(item.imgSrc)}"
```

> [!CAUTION]
> **Edge Case: Already-stored cart items.** If a user added items to cart on the static site (pre-migration), their `localStorage` will contain paths like `"img/Products/..."` without the WordPress prefix. The `imgPath()` function handles this automatically because it prepends the base path. But verify that `imgPath()` works correctly for stored paths.

---

## PHASE 8: ASSET PIPELINE & `functions.php`

### Complete `functions.php` Template

```php
<?php
/**
 * IL & ELLE Theme Functions
 *
 * Zero-dependency, high-performance asset pipeline.
 */

// ============================================================
// 1. REMOVE ALL WORDPRESS BLOAT
// ============================================================
function ilelle_remove_bloat() {
    // Emoji scripts and styles
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('admin_print_styles', 'print_emoji_styles');

    // Meta generators and discovery links
    remove_action('wp_head', 'wp_generator');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wp_shortlink_wp_head');

    // REST API discovery (keep REST API itself, just hide the link)
    remove_action('wp_head', 'rest_output_link_wp_head', 10);
    remove_action('wp_head', 'wp_oembed_add_discovery_links', 10);
    remove_action('template_redirect', 'rest_output_link_header', 11, 0);

    // Feed links
    remove_action('wp_head', 'feed_links', 2);
    remove_action('wp_head', 'feed_links_extra', 3);

    // Disable wp-embed
    wp_deregister_script('wp-embed');
}
add_action('init', 'ilelle_remove_bloat');

// Remove block editor CSS on frontend
function ilelle_remove_block_css() {
    wp_dequeue_style('wp-block-library');
    wp_dequeue_style('wp-block-library-theme');
    wp_dequeue_style('classic-theme-styles');
    wp_dequeue_style('global-styles');
}
add_action('wp_enqueue_scripts', 'ilelle_remove_block_css', 100);

// Remove jQuery Migrate (keep jQuery core for plugins that need it)
function ilelle_remove_jquery_migrate($scripts) {
    if (!is_admin() && isset($scripts->registered['jquery'])) {
        $script = $scripts->registered['jquery'];
        if ($script->deps) {
            $script->deps = array_diff($script->deps, array('jquery-migrate'));
        }
    }
}
add_action('wp_default_scripts', 'ilelle_remove_jquery_migrate');

// ============================================================
// 2. DNS PREFETCH & PRECONNECT
// ============================================================
function ilelle_preconnect() {
    echo '<link rel="dns-prefetch" href="//fonts.googleapis.com">' . "\n";
    echo '<link rel="preconnect" href="https://fonts.googleapis.com">' . "\n";
    echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' . "\n";
    // Add preconnect for external image CDNs if used
    echo '<link rel="dns-prefetch" href="//images.pexels.com">' . "\n";
}
add_action('wp_head', 'ilelle_preconnect', 1);

// ============================================================
// 3. CONDITIONAL ASSET LOADING (THE HEART)
// ============================================================
function ilelle_enqueue_assets() {
    $ver = '1.0.0';
    $css_dir = get_template_directory_uri() . '/assets/css/';
    $js_dir  = get_template_directory_uri() . '/assets/js/';

    // --- GOOGLE FONTS ---
    wp_enqueue_style(
        'ilelle-fonts',
        'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Montserrat:wght@300;400;500;600;700&display=swap',
        array(),
        null  // null version = no ?ver= appended (Google already handles caching)
    );

    // --- GLOBAL CSS (ALL PAGES) ---
    wp_enqueue_style('ilelle-global', $css_dir . 'global.css', array('ilelle-fonts'), $ver);

    // --- PAGE-SPECIFIC CSS ---
    if (is_front_page()) {
        wp_enqueue_style('ilelle-home', $css_dir . 'home.css', array('ilelle-global'), $ver);
    }

    if (is_page_template('page-shop.php')) {
        wp_enqueue_style('ilelle-shop', $css_dir . 'shop.css', array('ilelle-global'), $ver);
    }

    if (is_page_template('page-checkout.php')) {
        wp_enqueue_style('ilelle-checkout', $css_dir . 'checkout.css', array('ilelle-global'), $ver);
    }

    if (is_page_template('page-product.php') || is_singular('ilelle_product')) {
        wp_enqueue_style('ilelle-product', $css_dir . 'product.css', array('ilelle-global'), $ver);
    }

    // --- GLOBAL JS (ALL PAGES) — loaded in footer ---
    wp_enqueue_script('ilelle-products', $js_dir . 'products.js', array(), $ver, true);
    wp_enqueue_script('ilelle-global', $js_dir . 'global.js', array('ilelle-products'), $ver, true);

    // --- PASS WORDPRESS DATA TO JS ---
    // Null-safe page lookups — get_page_by_path() returns null if the page
    // hasn't been created yet. Passing null to get_permalink() causes a PHP
    // warning and outputs the current page URL, breaking JS navigation.
    $shop_page     = get_page_by_path('shop');
    $checkout_page = get_page_by_path('checkout');
    $product_page  = get_page_by_path('product');

    wp_localize_script('ilelle-global', 'THEME_DATA', array(
        'url'      => get_template_directory_uri(),
        'home'     => home_url('/'),
        'shop'     => $shop_page ? get_permalink($shop_page) : home_url('/shop/'),
        'checkout' => $checkout_page ? get_permalink($checkout_page) : home_url('/checkout/'),
        'product'  => $product_page ? get_permalink($product_page) : home_url('/product/'),
        'ajax'     => admin_url('admin-ajax.php'),
    ));

    // --- PAGE-SPECIFIC JS ---
    if (is_front_page()) {
        wp_enqueue_script('ilelle-home', $js_dir . 'home.js', array('ilelle-global'), $ver, true);
    }

    if (is_page_template('page-shop.php')) {
        wp_enqueue_script('ilelle-shop', $js_dir . 'shop.js', array('ilelle-global'), $ver, true);
    }

    if (is_page_template('page-checkout.php')) {
        wp_enqueue_script('ilelle-checkout', $js_dir . 'checkout.js', array('ilelle-global'), $ver, true);
    }

    if (is_page_template('page-product.php') || is_singular('ilelle_product')) {
        wp_enqueue_script('ilelle-product', $js_dir . 'product.js', array('ilelle-global'), $ver, true);
    }
}
add_action('wp_enqueue_scripts', 'ilelle_enqueue_assets');

// ============================================================
// 4. THEME SUPPORT
// ============================================================
function ilelle_theme_setup() {
    // Let WordPress manage <title> tag
    add_theme_support('title-tag');

    // HTML5 markup for search, comments, galleries
    add_theme_support('html5', array(
        'search-form', 'comment-form', 'comment-list',
        'gallery', 'caption', 'style', 'script'
    ));

    // Custom logo support
    add_theme_support('custom-logo', array(
        'width'       => 120,
        'height'      => 120,
        'flex-width'  => true,
        'flex-height' => true,
    ));

    // Post thumbnails (featured images)
    add_theme_support('post-thumbnails');
}
add_action('after_setup_theme', 'ilelle_theme_setup');

// ============================================================
// 5. OPTIONAL: CUSTOM POST TYPE FOR PRODUCTS (if needed)
// ============================================================
/*
function ilelle_register_product_cpt() {
    register_post_type('ilelle_product', array(
        'labels' => array(
            'name'          => 'Produits',
            'singular_name' => 'Produit',
            'add_new_item'  => 'Ajouter un produit',
            'edit_item'     => 'Modifier le produit',
        ),
        'public'       => true,
        'has_archive'  => true,
        'rewrite'      => array('slug' => 'produit'),
        'supports'     => array('title', 'editor', 'thumbnail'),
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-tag',
    ));
}
add_action('init', 'ilelle_register_product_cpt');
*/
```

> [!TIP]
> **`wp_enqueue_script` 5th parameter = `true`** means "load in footer". ALWAYS set this to `true` for non-blocking page loads. This is critical for Lighthouse performance.

> [!CAUTION]
> **Edge Case: `get_page_by_path('shop')` returns `null`** if the page doesn't exist yet. The `wp_localize_script` will output an empty URL. Solution: Use the `?:` null coalescing operator as fallback: `get_permalink(get_page_by_path('shop')) ?: home_url('/shop/')`.

> [!CAUTION]
> **Edge Case: `is_page_template()` detection.** `is_page_template('page-shop.php')` detects templates assigned via the admin. For `front-page.php`, use `is_front_page()`. For slug-based templates (`page-shop.php` auto-resolved by slug), you can also use `is_page('shop')`.

---

## PHASE 9: WORDPRESS ADMIN SETUP

After uploading the theme to `wp-content/themes/{theme-name}/`:

### Step 9.1 — Activate Theme
**Appearance → Themes → Activate**

### Step 9.2 — Create Required Pages

| Page Title | Slug | Template Assignment |
|-----------|------|-------------------|
| Accueil | accueil | (none — `front-page.php` auto-detects) |
| Shop | shop | Shop |
| Checkout | checkout | Checkout |
| Product | product | Product Details |

### Step 9.3 — Configure Settings

1. **Settings → Reading:**
   - ✅ "A static page"
   - Front page: **Accueil**
   - Posts page: (leave empty or create "Blog" if needed)

2. **Settings → Permalinks:**
   - Select **"Post name"** (`/%postname%/`)
   - Click **Save Changes** (this flushes rewrite rules)

3. **Settings → Discussion:** Disable comments if not needed

4. **Settings → General:** Set Site Title and Tagline

### Step 9.4 — Verify Theme Activation

1. Visit the homepage — should load `front-page.php`
2. Visit `/shop/` — should load `page-shop.php`
3. Visit `/checkout/` — should load `page-checkout.php`
4. Open browser DevTools → Network tab → verify:
   - `global.css` loads on all pages
   - `home.css` loads ONLY on homepage
   - `shop.css` loads ONLY on shop page
   - `products.js` loads on all pages
   - `global.js` loads on all pages
   - `home.js` loads ONLY on homepage
   - No `wp-block-library.css` or `classic-theme-styles.css` loaded
   - No `wp-emoji-release.min.js` loaded

---

## PHASE 10: VERIFICATION & LIGHTHOUSE

### Step 10.1 — Functional Test Checklist

```
=== HOME PAGE ===
- [ ] Loader animation plays on first visit, skips on subsequent
- [ ] All carousels populate with product cards
- [ ] Carousel arrows navigate correctly (prev/next)
- [ ] Drag-to-scroll works on carousels (mouse + touch)
- [ ] Category grid renders dynamically with unique images
- [ ] Parallax banners scroll with depth effect
- [ ] Hero CTA button links to shop
- [ ] Banner CTA buttons link correctly
- [ ] Scroll reveal animations trigger on scroll
- [ ] Magnetic button hover effects work

=== NAVIGATION ===
- [ ] Desktop dropdown menu opens on hover
- [ ] Dropdown links navigate to correct filtered shop views
- [ ] Mobile hamburger menu opens/closes
- [ ] Mobile dropdown renders with categories
- [ ] Active page indicated with underline
- [ ] Logo links to homepage

=== SEARCH ===
- [ ] Search icon opens fullscreen overlay
- [ ] Typing filters products in real-time
- [ ] Product cards in search results are clickable
- [ ] "View All Results" button links to shop
- [ ] Escape key closes search
- [ ] Close button closes search

=== QUICK BUY ===
- [ ] Clicking "ACHAT RAPIDE" on product card opens drawer
- [ ] Correct product displayed with image, name, price
- [ ] Color swatches render for multi-color products
- [ ] Clicking color swatch changes image with animation
- [ ] Size buttons render, only available sizes shown
- [ ] Selecting size updates label
- [ ] Quantity +/- controls work
- [ ] "AJOUTER AU PANIER" validates color + size selection
- [ ] Error shake animation plays on validation failure
- [ ] Successful add shows cart drawer

=== CART ===
- [ ] Cart icon in header shows item count badge
- [ ] Badge changes color when items present (gold)
- [ ] Clicking cart icon opens cart drawer
- [ ] Cart items render with image, name, size, color swatch, price
- [ ] Quantity +/- controls update total
- [ ] "Supprimer" removes item
- [ ] Subtotal, shipping (8000 TND), and total calculate correctly
- [ ] "PASSER LA COMMANDE" navigates to checkout
- [ ] Cart persists across page navigations (localStorage)
- [ ] Cart syncs across tabs (storage event)

=== SHOP PAGE ===
- [ ] Products render in grid layout
- [ ] Category name checkboxes filter correctly
- [ ] Status filters (Sale, New, Best) work
- [ ] Size swatch filters work
- [ ] Color swatch filters work (single-select)
- [ ] Price range slider filters correctly
- [ ] Sort dropdown works (price asc/desc, name, newest)
- [ ] Inline search filters products
- [ ] Active filter tags appear above grid
- [ ] Clicking tag × removes that filter
- [ ] "Tout effacer" resets all filters
- [ ] URL parameters pre-apply filters (?categoryName=..., ?isNew=true, etc.)
- [ ] Empty state shows when no products match
- [ ] Product count updates dynamically
- [ ] Page title updates based on active filters
- [ ] Mobile filter button opens sidebar overlay
- [ ] Staggered reveal animation on products
- [ ] Product card color swatches switch variants inline

=== CHECKOUT PAGE ===
- [ ] Cart items render from localStorage
- [ ] Empty cart shows "return to shop" CTA
- [ ] Form fields render with labels
- [ ] Required fields validate on submit
- [ ] Invalid fields get red border + shake animation
- [ ] Successful order clears cart
- [ ] Success state shows with order reference
- [ ] Google Sheets/API integration submits order data

=== PRODUCT DETAILS PAGE ===
- [ ] Product loads based on URL parameter (?id=X)
- [ ] Main image displays correctly
- [ ] Thumbnail gallery renders with all variant images
- [ ] Clicking thumbnail changes main image with transition
- [ ] Color swatches switch product variant (image + sizes + price)
- [ ] Size buttons are interactive
- [ ] Add to Cart validates selections
- [ ] Breadcrumb navigation renders correctly
- [ ] Related products carousel populated
- [ ] Related product carousels scroll and are interactive

=== RESPONSIVE ===
- [ ] 1440px — Full desktop layout
- [ ] 1024px — Tablet landscape
- [ ] 768px — Tablet portrait (mobile menu activates, desktop nav hides)
- [ ] 480px — Mobile
- [ ] 375px — Small mobile (iPhone SE)
```

### Step 10.2 — Image Verification

```bash
# Verify NO image returns 404
# Open DevTools → Console → Check for any "Failed to load resource: 404" errors
# Open DevTools → Network → Filter by "Img" → Check all status codes are 200
```

### Step 10.3 — Performance Targets

| Metric | Target | How to Achieve |
|--------|--------|----------------|
| Performance | ≥ 95 | Conditional loading, deferred JS, lazy images |
| Accessibility | ≥ 90 | Alt text, ARIA labels, color contrast, semantic HTML |
| Best Practices | ≥ 95 | HTTPS, no mixed content, no deprecated APIs |
| SEO | ≥ 95 | Title tags, meta descriptions, H1 hierarchy, robots.txt |

### Step 10.4 — Lighthouse Optimization Checklist

```
- [ ] All JS loads with `defer` (wp_enqueue_script 5th param = true)
- [ ] All below-fold images have `loading="lazy"`
- [ ] Hero/critical images have `loading="eager"` and `fetchpriority="high"`
- [ ] No render-blocking CSS (Google Fonts has &display=swap)
- [ ] No unused CSS loaded (page-specific splitting)
- [ ] No wp-emoji scripts loaded
- [ ] No wp-block-library CSS loaded
- [ ] No wp-embed scripts loaded
- [ ] All images in next-gen format (.webp preferred, .jpeg acceptable)
- [ ] Images are appropriately sized (no serving 4000px images in 300px containers)
- [ ] DNS prefetch for all external domains
- [ ] Preconnect for Google Fonts
- [ ] Cache-Control headers set (via .htaccess or server config)
- [ ] GZIP/Brotli compression enabled on server
```

---

## COMMON PITFALLS & SOLUTIONS

| # | Pitfall | Root Cause | Solution |
|---|---------|------------|----------|
| 1 | **All images 404** | Theme directory not included in JS image paths | Implement `imgPath()` helper + `wp_localize_script('THEME_DATA')` |
| 2 | **JS functions undefined** | Script dependency chain wrong | Check `wp_enqueue_script()` dependencies: products → global → page |
| 3 | **CSS not loading** | Handle names collide or dependencies wrong | Ensure unique handle names: `'ilelle-global'`, not `'style'` |
| 4 | **Cart empty after navigation** | Wrong localStorage key | Verify EXACT key match: `'taz_cart_state'` everywhere |
| 5 | **Links go to `.html` URLs** | Missed a `href` or `location.href` | Global search for `.html` in ALL PHP and JS files |
| 6 | **Drawer/search doesn't open** | DOM elements null on certain pages | Add null checks: `if (!element) return;` |
| 7 | **Filters don't work on shop** | `PRODUCTS` array not loaded before shop.js | Verify script dependency order |
| 8 | **Mobile menu invisible** | `display:none` default not toggled | Verify `menuToggle` click handler sets `display:block` |
| 9 | **Template not selectable** | Missing `Template Name:` comment | Must be FIRST thing after `<?php` in the file |
| 10 | **`front-page.php` not used** | Reading settings wrong | Settings → Reading → "A static page" → Front page selected |
| 11 | **Dropdown menu clips behind content** | `overflow: hidden` on nav | `overflow: visible !important` on `.main-nav` at `min-width: 768px` |
| 12 | **Parallax stutters on mobile** | `background-attachment: fixed` on mobile | CSS: `background-attachment: scroll` under `@media (max-width: 768px)` |
| 13 | **Quick buy opens wrong product** | Event delegation not working | Use `document.body.addEventListener('click', ...)` delegation |
| 14 | **Search shows no results** | `PRODUCTS` reference wrong | Ensure products.js functions are on `window` scope |
| 15 | **Font FOUT/FOIT** | Google Fonts blocks render | Use `&display=swap` in font URL |
| 16 | **Cart count shows `NaN`** | Cart data corrupted in localStorage | Wrap in try-catch: `try { ... } catch(e) { window.CART = []; }` |
| 17 | **Page-specific CSS bleeds** | CSS loaded on wrong pages | Double-check `is_front_page()` / `is_page_template()` conditions |
| 18 | **Accented characters in paths** | URL encoding issue | Preserve exact filesystem names; browser handles encoding |
| 19 | **`wp_localize_script` returns null URLs** | Pages not created yet | Use fallback: `get_permalink(...) ?: home_url('/fallback/')` |
| 20 | **Double scrollbar** | `body overflow` conflict with overlays | Ensure drawer/search close handlers restore `body.style.overflow = ''` |

---

## ADVANCED: CUSTOM POST TYPE INTEGRATION

If the client wants to manage products through WordPress admin (instead of the hardcoded `products.js`), implement a Custom Post Type:

### Step A — Register CPT in `functions.php`

```php
function ilelle_register_product_cpt() {
    register_post_type('ilelle_product', array(
        'labels' => array(
            'name'          => 'Produits IL & ELLE',
            'singular_name' => 'Produit',
        ),
        'public'       => true,
        'has_archive'  => true,
        'rewrite'      => array('slug' => 'produit'),
        'supports'     => array('title', 'editor', 'thumbnail', 'custom-fields'),
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-tag',
    ));
}
add_action('init', 'ilelle_register_product_cpt');
```

### Step B — Inject Products as JS Data

```php
function ilelle_inject_products() {
    $posts = get_posts(array(
        'post_type'      => 'ilelle_product',
        'posts_per_page' => -1,
        'post_status'    => 'publish',
    ));

    $products = array();
    foreach ($posts as $post) {
        $products[] = array(
            'id'             => $post->ID,
            'name'           => $post->post_title,
            'permalink'      => get_permalink($post),
            'imgSrc'         => get_the_post_thumbnail_url($post, 'full'),
            'price'          => get_post_meta($post->ID, '_price', true),
            // ... map all fields
        );
    }

    wp_localize_script('ilelle-products', 'ILELLE_PRODUCTS', $products);
}
add_action('wp_enqueue_scripts', 'ilelle_inject_products');
```

### Step C — Use `single-ilelle_product.php` for individual product pages

With CPT, WordPress auto-routes `/produit/product-slug/` to `single-ilelle_product.php`.

---

## PERFORMANCE OPTIMIZATION EXTRAS

For absolute Lighthouse 100:

1. **Critical CSS Inlining:**
   Extract above-the-fold CSS and inline it directly in `<head>` via `wp_head` action. Load remaining CSS async.

2. **Image Optimization:**
   - Convert all `.jpeg`/`.png` to `.webp` using tools like `cwebp` or WordPress media settings
   - Add `width` and `height` attributes to all `<img>` tags to prevent layout shift (CLS)
   - Use `fetchpriority="high"` on LCP (hero) images

3. **Server-Side:**
   Add to `.htaccess`:
   ```apache
   # Enable GZIP
   <IfModule mod_deflate.c>
       AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml
   </IfModule>

   # Cache static assets
   <IfModule mod_expires.c>
       ExpiresActive On
       ExpiresByType text/css "access plus 1 year"
       ExpiresByType application/javascript "access plus 1 year"
       ExpiresByType image/jpeg "access plus 1 year"
       ExpiresByType image/png "access plus 1 year"
       ExpiresByType image/webp "access plus 1 year"
       ExpiresByType image/svg+xml "access plus 1 year"
   </IfModule>
   ```

4. **Minification (Production):**
   Use WP Rocket or Autoptimize for production CSS/JS minification. During development, keep files readable.

5. **Preload Critical Assets:**
   ```php
   function ilelle_preload_critical() {
       if (is_front_page()) {
           // Preload hero image
           echo '<link rel="preload" as="image" href="https://images.pexels.com/photos/34744048/pexels-photo-34744048.jpeg">' . "\n";
       }
       // Preload logo — MUST match exact filename case! (Linux is case-sensitive)
       echo '<link rel="preload" as="image" href="' . esc_url(get_template_directory_uri() . '/assets/img/Logo.png') . '">' . "\n";
   }
   add_action('wp_head', 'ilelle_preload_critical', 2);
   ```

---

## FINAL SUMMARY CHECKLIST

Before declaring the migration complete, verify:

```
=== FILES CREATED ===
- [ ] style.css (theme declaration)
- [ ] functions.php (bloat removal + conditional enqueue)
- [ ] header.php (announcement → header → nav → mobile menu)
- [ ] footer.php (footer → drawer → search overlay → wp_footer)
- [ ] front-page.php (home page — **NO Template Name!**)
- [ ] page-shop.php (shop with `Template Name: Shop Page`)
- [ ] page-checkout.php (checkout with `Template Name: Checkout Page`)
- [ ] page-product.php (product details with `Template Name: Product Detail Page`)
- [ ] index.php (fallback)
- [ ] screenshot.png (1200×900)
- [ ] assets/css/global.css
- [ ] assets/css/home.css
- [ ] assets/css/shop.css
- [ ] assets/css/checkout.css
- [ ] assets/css/product.css
- [ ] assets/js/products.js (adapted with imgPath calls)
- [ ] assets/js/global.js (imgPath + link helpers + cart + drawer + search)
- [ ] assets/js/home.js (carousels + animations)
- [ ] assets/js/shop.js (filters + grid)
- [ ] assets/js/checkout.js (form + submit)
- [ ] assets/js/product.js (details + gallery)
- [ ] assets/img/ (ALL images copied, directory structure preserved)

=== LINKS CONVERTED ===
- [ ] ALL .html references → WordPress PHP functions
- [ ] ALL logo/image src → get_template_directory_uri()
- [ ] ALL JS hardcoded URLs → helper functions
- [ ] ALL internal navigation → esc_url(home_url('/...'))

=== WORDPRESS ADMIN ===
- [ ] Theme activated
- [ ] Pages created (Home, Shop, Checkout, Product)
- [ ] Templates assigned to pages
- [ ] Reading settings → Static front page
- [ ] Permalinks → Post name

=== PERFORMANCE ===
- [ ] No unnecessary CSS/JS loaded
- [ ] All JS deferred (footer loading)
- [ ] WordPress bloat removed
- [ ] Google Fonts preconnected
- [ ] Images lazy loaded
- [ ] Lighthouse ≥ 95 on all categories
```

---

*This guide was created through deep analysis of a real-world production e-commerce website (IL & ELLE — a Tunisian fashion brand) and its successful migration to WordPress. Every edge case documented here was encountered and solved in practice.*

*Last updated: April 2026 — WordPress 6.7, PHP 8.2*

---

## APPENDIX: COMMON PRODUCTION PITFALLS

These are real bugs that caused site outages in production. Each one was discovered after deployment.

### Pitfall #1: `Template Name` in `front-page.php` → 503 Fatal
**Symptom:** 503 Backend fetch failed / 500 Internal Server Error immediately after activating theme or setting static front page.
**Cause:** `front-page.php` contained `/* Template Name: Front Page */`. WordPress crashes trying to register it as both a page template and the auto-detected front page.
**Fix:** NEVER add `Template Name:` to `front-page.php`. It's auto-detected by filename.

### Pitfall #2: Case-Sensitive Filenames → 404 Images on Linux
**Symptom:** All images work locally on Windows/Mac but return 404 on hosting server.
**Cause:** The file is `Logo.png` but PHP/JS references `logo.png`. Linux servers are case-sensitive.
**Fix:** Audit every `<img src>`, `url()` in CSS, and `imgPath()` call against the actual filenames on disk.

### Pitfall #3: `get_page_by_path()` Returns `null` → Broken Navigation
**Symptom:** Product/shop/checkout links go to the home page or the current page instead of their target.
**Cause:** `get_permalink(get_page_by_path('shop'))` — if the "Shop" page hasn't been created yet, `get_page_by_path()` returns `null`, and `get_permalink(null)` returns the current page URL.
**Fix:** Always use null-safe fallbacks:
```php
$shop_page = get_page_by_path('shop');
'shop' => $shop_page ? get_permalink($shop_page) : home_url('/shop/'),
```

### Pitfall #4: Footer/Nav Categories Don't Match Product Data
**Symptom:** Footer category links filter to an empty product grid.
**Cause:** Footer lists "Robes Chic" and "Robes Casual" but the `PRODUCTS` array uses "Robes Soirée", "Robes longues", etc. The `?categoryName=` filter finds zero matches.
**Fix:** Extract the exact `categoryName` values from `products.js` and use only those in navigation links, footer, and filter checkboxes.

### Pitfall #5: JS Variable Name Mismatch After `wp_localize_script`
**Symptom:** Cart drawer, search, and product pages fail silently — no errors in console, but links/images don't work.
**Cause:** `functions.php` uses `wp_localize_script('ilelle-global', 'ilElleData', ...)` but `global.js` reads `THEME_DATA`. The variable simply doesn't exist.
**Fix:** The variable name in `wp_localize_script()` (2nd argument) MUST exactly match what the JS reads. Pick ONE name and use it everywhere.

### Pitfall #6: Inline Loader Script Runs Before Enqueued JS
**Symptom:** `document.getElementById('premium-loader')` returns `null` intermittently.
**Cause:** The loader dismiss script is enqueued via `wp_enqueue_script()` with `defer`, but the loader `<div>` is in `header.php` and needs immediate inline JS to check `sessionStorage`.
**Fix:** The loader show/hide logic MUST be an inline `<script>` tag directly after the loader `<div>` in `header.php` — NOT an enqueued file. This ensures it runs synchronously before the page renders.
