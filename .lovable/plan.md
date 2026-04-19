
Replace the 3 Unsplash hero slides with the user's uploaded saffron images. The nuts and cinnamon/rose images aren't saffron-themed, so I'll use the 3 saffron-focused photos for the hero slider.

### Steps
1. Copy the 3 saffron images into `src/assets/`:
   - `wp5684242-saffron-wallpapers.jpg` → `src/assets/hero-saffron-1.jpg` (close-up red threads)
   - `close-up-scoop-full-saffron.jpg` → `src/assets/hero-saffron-2.jpg` (wooden scoop on ceramic plate)
   - `flat-lay-spa-arrangement-with-cutting-board.jpg` → `src/assets/hero-saffron-3.jpg` (flat-lay spices)
2. Update `src/components/home/hero.tsx`:
   - Import the 3 local assets as ES6 modules
   - Replace the `SLIDES` array `src` values with the imported asset URLs
   - Adjust `pos` (object-position) per image for best framing and update Persian `alt` text
   - Keep the existing 8s interval, 1.5s crossfade, gradient dissolve, and typography intact

### Notes
- Nuts and cinnamon/rose images will be saved aside (not used in hero) — can be reused later for category cards or an "about" section if desired.
