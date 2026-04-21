

## Enlarge floating button & flip popover to right edge

### Changes to `src/components/floating-contact.tsx`

**Bigger trigger button**
- Closed pill: `h-12 px-4` → `h-14 px-5`, label `text-sm` → `text-base`, icon `h-5 w-5` → `h-6 w-6`.
- Open close-button: `h-11 w-11` → `h-12 w-12`, X icon `h-5 w-5` → `h-6 w-6`.
- Popover card width: `w-64` → `w-72` to stay visually balanced with the larger trigger.

**Flip popover to open from the right**
Currently the container uses `items-end` which anchors the popover to the right edge in the normal flow, but inside the popover the rows use `flex items-center gap-3` in an RTL container — meaning the colored icon circle sits on the **right** and text on the left. The user wants the panel to visually "open from the right," i.e. icon on the **left**, text on the right (mirrored layout).

- Change each row's inner layout from default RTL flex to `flex-row-reverse` so the icon circle appears on the left side of the row and the Persian text aligns to the right edge of the card.
- Update the text column from `text-right` → `text-left` (so the label and number sit flush against the icon, with the card's right edge free) — OR keep `text-right` and rely on `flex-row-reverse` + `ml-auto` on the text block. Will use the cleaner `flex-row-reverse` + text alignment approach.
- Keep `dir="rtl"` on the container so Persian text shaping stays correct.

### Out of scope
- No changes to colors, animation, position (still bottom-right), 3-second reveal, or phone numbers.
- No CSS file changes.

