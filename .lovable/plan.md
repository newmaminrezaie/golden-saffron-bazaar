

## Footer: full-width, no horizontal margin

### Change in `src/components/site-footer.tsx`

The `<footer>` itself already spans full width — the constraint comes from the inner wrappers using `max-w-7xl mx-auto`. Remove those caps so content stretches edge-to-edge.

**1. Columns grid wrapper**
- Replace `mx-auto max-w-7xl px-4 md:px-8 pt-40 md:pt-48 pb-12 grid …` with `w-full px-4 md:px-8 pt-40 md:pt-48 pb-12 grid …`.
- Drop `mx-auto` and `max-w-7xl`; keep horizontal padding so text doesn't touch the screen edge (set `px-6 md:px-12` for a bit more breathing room on very wide screens).

**2. Copyright row wrapper**
- Replace `mx-auto max-w-7xl px-4 md:px-8 py-5 …` with `w-full px-6 md:px-12 py-5 …`.
- Keep the surrounding `border-t border-white/10` band unchanged.

**3. No other changes**
- Emblem positioning, column order, trust seals stack, RTL alignment, colors, typography — all unchanged.
- If you'd prefer zero horizontal padding (content literally flush to viewport edges), say so and I'll drop `px-*` entirely; default keeps small padding so text isn't clipped.

