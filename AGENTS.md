- Languages: Persian at root; en/tr/ar under the `$lang` route section with texts in `src/i18n/` (product/article translations keyed by slug, untranslated items fall back to Persian). Why: one place per language and SEO-correct hreflang via `src/lib/seo.ts` LOCALES.

- Order fees (packaging, shipping, free-shipping threshold, gift box) live in the SQLite `settings` table via `server/src/settingsDb.js`; the server computes totals and the frontend only displays them via `src/lib/fees-client.ts`. Why: one source of truth editable by admin and AI agent, with no client-side tampering.
