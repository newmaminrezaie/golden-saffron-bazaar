## Goal

The home hero currently crossfades between 2 saffron images, which reads as "stuck." Switch it to a horizontal sliding carousel so motion is obvious.

## Changes

**`src/components/home/hero.tsx`**
- Replace the absolute-positioned stacked `<img>` crossfade with a flex track that holds both slides side-by-side at `width: 200%` (each slide `width: 50%`).
- Animate the track with `transform: translateX(...)` and a 900ms ease-in-out transition.
- Direction respects RTL: in RTL the track translates to positive X for the next slide; we'll read `document.dir` (or hardcode positive since the site is RTL-only) so the slide enters from the correct side.
- Keep the existing 8s auto-advance interval, the warm gradient overlay, and the Persian tagline content unchanged.
- Keep section sizing (`56vh`, min/max) and accessibility label unchanged.

## Out of scope

- No prev/next arrows or indicator dots (can be added later if wanted).
- No new images, no copy changes, no styling-token changes.

## Verification

- Visit `/`, watch hero: every 8s the image should visibly slide horizontally (not fade) and loop back smoothly.
- Confirm no layout shift, no horizontal page scrollbar, tagline still pinned to bottom-center.
