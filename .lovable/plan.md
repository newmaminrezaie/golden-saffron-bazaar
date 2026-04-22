

## Set new OG share image

Replace the existing `public/og-image.png` with the uploaded Khajavi Saffron emblem image. No code changes needed — the root route already references `/og-image.png` for both `og:image` and `twitter:image`, so simply swapping the file out will update social media previews everywhere.

### Steps

1. Copy `user-uploads://khajavi-og-embelm.png` to `public/og-image.png` (overwrite).

That's it. The logo, header, and all UI remain untouched. Only the image served when the site is shared on social platforms (WhatsApp, Telegram, Twitter, Facebook, LinkedIn, etc.) changes.

### Note on caching

Social platforms aggressively cache OG images. After deploy, you may need to:
- Use Facebook's Sharing Debugger / Twitter Card Validator / LinkedIn Post Inspector to force a re-scrape.
- Or share with a `?v=2` query string once to bust the cache.

