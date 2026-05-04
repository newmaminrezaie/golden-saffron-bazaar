## Add Founder section to home page (mirrored layout)

Add a new "Founder" section on the home page directly after the existing "our story" (`AboutTeaser`) section. The layout mirrors AboutTeaser: in AboutTeaser the image sits on the visual left and text on the right; in the new section the image goes on the visual right and text on the left.

### New file: `src/components/home/founder-teaser.tsx`
- Same structure as `about-teaser.tsx` (max-w-6xl, `md:grid-cols-2`, `md:items-center`, same image card classes — `aspect-[4/5] md:aspect-[5/6]`, rounded-3xl, shadow-xl).
- Flip column order on desktop using `md:[&>div:first-child]:order-2` (or simply place the text div first and the image div second — since the page is RTL, this naturally puts the image on the opposite side from AboutTeaser).
- Image: `owner-working.jpg` (the action/packing shot — different from AboutTeaser's portrait so the two sections feel complementary rather than repetitive). `objectPosition: center 35%`.
- Alt: "مجید خواجوی در حال بسته‌بندی زعفران اصل قائنات".
- Eyebrow: `the founder` (font-display, brown-medium) — matches AboutTeaser's `our story` style.
- Heading: "مجید خواجوی\nبنیان‌گذار مجموعه" (extrabold, same sizing).
- Body: 2 short paragraphs reusing the founder copy from `about.tsx` (lines 96–106), kept concise.
- CTA: link to `/about` → "آشنایی با بنیان‌گذار ←", same pill button styling as AboutTeaser but using `--saffron` background with `--brown-deep` text to visually distinguish it from AboutTeaser's brown CTA.
- Add subtle visual separation: section uses `pb-16 md:pb-24` only (no top padding) so it flows directly out of AboutTeaser as a continuation.

### Edit: `src/routes/index.tsx`
- Import `FounderTeaser` from `@/components/home/founder-teaser`.
- Render `<FounderTeaser />` immediately after `<AboutTeaser />` and before `<EnamadPopup />`.

### Visual result
```
[ image  ] [  text   ]   ← AboutTeaser (existing)
[  text  ] [ image   ]   ← FounderTeaser (new, mirrored)
```

No other files change. No data, routing, or asset additions needed (both owner images already exist in `src/assets/`).
