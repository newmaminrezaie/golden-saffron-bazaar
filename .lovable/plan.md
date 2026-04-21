

## Fix "پودر زعفران" label centering on mobile

The label for the saffron powder tile (`d`) is positioned with `left: 50%` but uses `transform: translateX(50%)`, which shifts it further right by half its width instead of pulling it back to center. That's why it appears off to the side.

### Change in `src/components/home/category-grid.tsx` (line 46)

Update the `labelStyle` for the "پودر زعفران" entry:

- From: `{ bottom: "1rem", left: "50%", transform: "translateX(50%)", textAlign: "center" }`
- To:   `{ bottom: "1rem", left: "50%", transform: "translateX(-50%)", textAlign: "center" }`

This properly horizontally centers the label over the tile on both mobile and desktop. No other tiles, images, or styles change.

