

## Reduce hero banner height

Make the homepage hero section shorter so more of the page below shows on first load, without changing its content, images, or text styling.

### Change in `src/components/home/hero.tsx`

Update the `<section>` inline style heights:

- `height`: `72vh` → `56vh`
- `maxHeight`: `780px` → `600px`
- `minHeight`: `520px` → `380px`

Everything else (slideshow, tint overlay, text content, animations, padding) stays exactly as-is.

### Out of scope
- No changes to images, text, fonts, or colors.
- No changes to other sections or components.

