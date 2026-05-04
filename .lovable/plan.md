## Use uploaded owner photos on About page and home About teaser

Add the two uploaded photos of the owner with the saffron bags to the site.

### Files to add
- Copy `user-uploads://IMG_9361.jpeg` → `src/assets/owner-portrait.jpg` (frontal portrait — used as the main about/owner image)
- Copy `user-uploads://IMG_9362.jpeg` → `src/assets/owner-working.jpg` (action shot packing saffron — used as a secondary image)

### `src/components/home/about-teaser.tsx`
- Replace the `saffronFarm` import and `<img>` src with `owner-portrait.jpg`.
- Update `alt` to "مجید خواجوی، بنیان‌گذار زعفران خواجوی".
- Adjust `objectPosition` to `center 25%` so the face is well-framed in the 4/5 crop.

### `src/routes/about.tsx`
- Replace the Unsplash hero image with `owner-working.jpg` (more contextual — shows production).
- Add a new "بنیان‌گذار" / owner section between the Story block (line ~57) and the Values grid:
  - Two-column layout (`md:grid-cols-2`, image right on RTL) with `owner-portrait.jpg` on one side and a short bio on the other.
  - Heading: "مجید خواجوی — بنیان‌گذار"
  - 2 short paragraphs about the founder's hands-on role, three generations of family expertise, and direct sourcing from Qaen farms (reuse tone of existing copy).
- Use existing brand tokens (`--brown-deep`, `--brown-medium`, `--parchment`) and the same rounded card / shadow styling already used on the page.

### Notes
- Both images imported as ES modules from `@/assets/...` (per project convention).
- No changes to routing, data, or other components.
