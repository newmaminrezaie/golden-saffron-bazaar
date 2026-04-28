## Issue

The "محصولات کادویی و سازمانی" (gift/corporate) section misbehaves on some phones. Looking at `src/components/home/gift-corporate.tsx` and `src/components/product-card.tsx`, there are several mobile-specific problems that explain the weirdness:

1. **Touch hijacks the scroll**. `ProductCard` calls `startCycle` on `onTouchStart` and `stopCycle` on `onTouchEnd`. When the user swipes the rail horizontally, every card under the finger starts an image-cycling interval, and `stopCycle` resets `index` to 0 mid-swipe — so cards visibly flicker while scrolling.
2. **Tap-to-navigate is unreliable on RTL snap rails**. The whole card is a `<Link>`. Touch handlers + `snap-mandatory` + RTL scrollLeft sometimes register a swipe as a click, opening a product page when the user only meant to scroll.
3. **RTL `scrollBy` is inconsistent**. In RTL containers, `scrollLeft` semantics differ across engines (negative on WebKit/Firefox, positive on legacy). The arrow buttons (desktop) and the dot indicator math (`Math.abs(rail.scrollLeft)`) work most of the time but the active-dot index can desync on iOS Safari, making indicators jump.
4. **Snap + variable card width on small screens**. Cards are `w-[260px]` on mobile but the container has `px-4`, so the first card doesn't snap flush to the edge — users see partial cards and the snap "fights" their finger.
5. **No `overscroll-behavior`**. Horizontal swipes on the rail can trigger the page's vertical scroll or browser back-gesture on iOS.

## Fix

### `src/components/product-card.tsx`
- Remove the `onTouchStart` / `onTouchEnd` cycling on the image area. Keep hover cycling for desktop only. On touch devices the image just shows the first photo (taps navigate to the product page where all photos are visible).
- This single change eliminates the flicker-while-swiping and the accidental nav-on-swipe interference.

### `src/components/home/gift-corporate.tsx`
- Add `overscroll-behavior-x: contain` and `touch-action: pan-x` to the rail so horizontal swipes don't bleed into vertical page scroll or trigger iOS back-swipe.
- Add `scroll-padding-inline: 1rem` so snapped cards align nicely with the section's horizontal padding.
- Replace the active-dot calculation with one that is RTL-safe: read `rail.scrollLeft` once, normalize via `Math.abs`, but also clamp using `rail.scrollWidth - rail.clientWidth` so the last dot lights up reliably at the end of the rail.
- Make the dots clickable (tap a dot → scroll to that card) — small UX upgrade since the arrow buttons are desktop-only.
- Slightly reduce mobile card width (`w-[240px]` instead of `260px`) so two cards peek on common phone widths (360–390 px) without horizontal overflow of the section padding.

## Out of scope

- No change to the section's vertical padding, background, or copy.
- No change to which products appear in the rail.
- Desktop layout and arrow buttons remain unchanged.

## Verification

After the edits I'll resize the preview to a phone viewport (e.g. 390×844) and swipe through the rail to confirm: no flicker, no accidental product navigation on swipe, dots track the active card, and vertical page scroll is not blocked.
