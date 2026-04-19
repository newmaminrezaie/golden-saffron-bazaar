# زعفران خواجوی — Khajavi Saffron

Static storefront for Khajavi Saffron, built with TanStack Start (static
prerender mode), Tailwind CSS v4, and shadcn/ui.

## Quick start

```bash
bun install
cp .env.example .env   # set VITE_PAYMENT_API_URL
bun run dev            # http://localhost:5173
bun run build          # static site -> ./dist
```

## Deployment

This site builds to a fully static `dist/` folder served by Nginx on a
Linux VPS. See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the Nginx server
block and rsync deploy steps.

The payment backend (Zarinpal / Express) is a **separate service** — this
repo only contains the frontend. The frontend reaches the backend via
`VITE_PAYMENT_API_URL`.

## Editing products

All catalog data lives in [`src/data/products.ts`](./src/data/products.ts).
Add a product object there and rebuild — its page at `/shop/<slug>` will
be prerendered automatically.
