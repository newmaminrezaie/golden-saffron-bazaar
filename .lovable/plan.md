
## زعفران خواجوی — Persian Saffron Storefront

A warm, premium, mobile-first Persian (RTL) showcase site for **KhajaviSaffron.ir**, modeled after mostafavisaffron.com. Static showcase (no live cart/checkout yet).

### Pages (core structure)
- **/** — Home: hero slideshow + category grid + featured products + brand story teaser
- **/shop** — فروشگاه: full product grid with category filters
- **/about** — درباره ما: brand story, saffron heritage, quality promise
- **/contact** — تماس با ما: address, phone, email, contact form (visual), map placeholder

Shared RTL header (logo "مُصطفَوی"-style wordmark for "خواجوی", nav links, search icon, cart icon, login) and footer (links, contact, social, copyright).

### Hero Section (home)
- 72vh full-bleed banner (max 780px), 3 stock saffron images crossfading every 8s (1.5s fade)
- Bottom-to-top parchment gradient dissolve into page
- "Great Vibes" English tagline ("a delightful journey") + large Estedad Persian headline ("زعفران خواجوی")
- Fade-in + slide-up entrance animation

### Category Grid (home)
Art-directed 6-card CSS Grid (named areas, tall + wide + standard slots; responsive 2-col on mobile, 3-col on desktop). Per-card image positioning, directional gradient scrims, varied label placement, hover zoom.

**6 saffron-focused categories:**
1. زعفران سرگل
2. زعفران نگین
3. زعفران پوشال
4. پودر زعفران
5. بسته‌های هدیه
6. عمده‌فروشی

### Design tokens
- Background parchment `#f5ede0` / `hsl(37, 54%, 95%)`
- Primary text dark brown `#2a1a0a`
- Accent medium brown `#5a3e2e`
- Card radius `1rem`
- Fonts: **Estedad** (Persian, via CDN) + **Great Vibes** (English script, Google Fonts)
- Full RTL layout (`dir="rtl"`, `lang="fa"`)

### Additional home sections
- Featured products row (4–6 saffron product cards, price in تومان, "افزودن به سبد" button — visual only)
- Brand promise strip (3 icons: کیفیت ممتاز، ارسال سریع، ضمانت اصالت)
- Short "درباره ما" teaser with CTA to /about

### Shop page
- Sidebar/topbar category filter chips
- Responsive product grid with the same warm card styling
- Static product data (12–18 items across categories)

### Tech notes
- TanStack Start file-based routes: `index.tsx`, `shop.tsx`, `about.tsx`, `contact.tsx`
- Per-route `head()` metadata in Persian for SEO
- Stock images from Unsplash (saffron fields, threads, Persian spice styling)
- Inline styles for hero/category sections per spec; Tailwind for the rest
- Mobile-first; tested at 415px viewport
