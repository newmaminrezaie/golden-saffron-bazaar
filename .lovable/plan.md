

## Footer: stick contact column to the right edge

### Issue
The grid wrapper has `px-6 md:px-12`, which pads both sides. The trust seals column (leftmost in RTL) was pulled flush to the left with negative margin, but the Quick Links column (rightmost in RTL) still respects the right padding — so there's visible space on the right edge.

### Change in `src/components/site-footer.tsx`

Mirror the trust-seals trick on the first column (Quick Links + intro), which is the rightmost column in RTL.

- Wrap the first column's root `<div>` with `-mr-6 md:-mr-12` so it bleeds into the right padding and sits flush to the viewport edge.
- Keep its heading and body text where they are (no inner padding added) so content aligns with the column's natural left start, matching how the trust seals column was handled.

### No other changes
- Middle two columns (Categories, Contact), emblem, copyright row, colors, sizes — all unchanged.
- Outer footer padding (`px-6 md:px-12`) stays so middle columns keep breathing room; only the two edge columns bleed out.

