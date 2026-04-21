

## Use uploaded nuts image for the "خشکبار" category

Replace the Unsplash URL currently used for the "خشکبار" (dried fruits) tile in the homepage category grid with the uploaded nuts photo, imported as a local asset.

### Steps

1. **Add the image to the project**
   - Copy `user-uploads://nuts-2.png` → `src/assets/dried-fruits.png`.

2. **Update `src/components/home/category-grid.tsx`**
   - Add import at the top with the other asset imports:
     ```ts
     import driedFruits from "@/assets/dried-fruits.png";
     ```
   - In the `CATS` array, change the `g` (خشکبار) entry's `img` from the Unsplash URL to `driedFruits`.
   - Keep `pos: "center 50%"`, scrim, label position, and count unchanged.

### Out of scope
- No changes to other category tiles, layout, or any other section.

