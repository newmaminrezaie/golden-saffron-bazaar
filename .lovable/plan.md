

## Restyle floating contact to a pill chat bubble (bottom-right)

Match the reference: a soft white rounded pill with a small chat icon + "بپرس" text, anchored to the bottom-right corner.

### Changes to `src/components/floating-contact.tsx`

**Position**
- Move container from `bottom-6 left-6` → `bottom-6 right-6`.
- Change popover anchor alignment so it opens above and aligns to the right edge (`items-end` on the container).

**Trigger button (closed state)**
- Shape: horizontal pill (`h-12 rounded-full px-4`), auto width.
- Background: white (`bg-white`), subtle border (`border border-border/60`), soft shadow (`shadow-lg`).
- Content (in order, RTL): small chat bubble icon (`MessageCircleMore` from lucide, `h-5 w-5`, saffron `text-accent`) + "بپرس" label (`text-sm font-semibold text-foreground`), gap-2.
- Keep gentle bounce animation, hover scale, focus ring.

**Trigger button (open state)**
- Collapse to a compact circle (`h-11 w-11 rounded-full p-0`) showing just the `X` icon, same white background — feels like a clean close affordance.
- Bounce paused while open (already handled).

**Popover**
- Same content (تماس تلفنی + واتساپ rows), unchanged.
- Container alignment switches to `items-end` so the popover hugs the right edge under/above the pill in RTL layout.

### Files
- `src/components/floating-contact.tsx` — position, trigger shape, icon swap, alignment.

### Out of scope
- No CSS changes (`animate-gentle-bounce` stays).
- No change to popover content, phone numbers, or 3-second reveal delay.

