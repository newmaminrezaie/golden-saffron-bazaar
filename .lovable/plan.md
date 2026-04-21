

## Soften footer emblem edges to blend into brown footer

Make the cream emblem fade smoothly into the dark brown footer instead of sitting as a hard-edged rectangle, so it reads as a glowing medallion bridging the page and the footer.

### Approach

Apply a radial mask to the `<img>` so the artwork is fully opaque in the center and gradually fades to transparent toward the edges. Combined with a soft outer drop-shadow, this gives a "blend-in / halo" effect against the brown footer background.

### Change — `src/components/site-footer.tsx`

On the existing emblem `<img>`:

1. Add an inline `style` with a radial-gradient mask:
   - `WebkitMaskImage` and `maskImage`: `radial-gradient(ellipse at center, black 55%, transparent 85%)`
   - This keeps the logo crisp in the middle and fades the cream backdrop into the brown footer at the edges.
2. Add a soft glow via Tailwind drop-shadow utility: `drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]` so the medallion gently lifts off the footer.
3. Keep current size (`h-28 md:h-32`), centering, and `-translate-y-[18%]` positioning unchanged.

No other files touched. No CSS or asset changes.

### Out of scope
- No changes to footer columns, copyright row, header, or floating contact.
- No re-export/edit of the emblem PNG.

