

## Option B — Slim announcement bar above the header

Add a thin, site-wide announcement strip above `SiteHeader` that reads:
"🚚 ارسال رایگان برای سفارش‌های بالای ۱,۰۰۰,۰۰۰ تومان"

Visible on every page, ~36px tall, saffron/brown themed, single line.

### New file: `src/components/announcement-bar.tsx`

- Full-width `<div>` with saffron/brown gradient background (uses existing `--saffron` / `--brown-deep` tokens) and parchment-colored text.
- Centered content, RTL, small font (`text-xs md:text-sm`), height ~36px (`h-9`).
- `Truck` icon from `lucide-react` on the right (RTL start) followed by the Persian message.
- Uses Persian digits (۱,۰۰۰,۰۰۰) to match the rest of the site.
- No dismiss button (keeps it always visible and simple). Can be added later if desired.

### Edit: `src/routes/__root.tsx`

In `RootComponent`, render `<AnnouncementBar />` immediately before `<SiteHeader />` so it sits at the very top of every page and the sticky header sits just below it.

```tsx
<AnnouncementBar />
<SiteHeader />
```

Add the import at the top of the file.

### Notes

- `SiteHeader` keeps `sticky top-0` — the announcement bar scrolls away naturally and the header then sticks to the viewport top. This matches the common pattern (Nutella, most e-commerce sites).
- No changes to images, products, hero, or any other section.
- Works on mobile (single line, smaller text) and desktop.

