

## Restyle the floating contact trigger

Turn the round phone FAB into an elegant rounded-square "بپرس" button that gently bounces to attract attention, while keeping the existing two-option popover (call + WhatsApp) intact.

### Visual changes (`src/components/floating-contact.tsx`)

**Trigger button** — replace the 56px circle with:
- Shape: rounded-square, ~64×64px (`h-16 w-16 rounded-2xl`).
- Background: saffron (`bg-accent`), deep brown text (`text-primary`).
- Content: Persian word **«بپرس»** centered, semibold, ~lg size. No icon when closed.
- When the popover is open: swap "بپرس" for the `X` icon (so users have a clear close affordance).
- Soft shadow (`shadow-lg`), subtle border (`border border-primary/10`) for definition on light backgrounds.
- Keep focus ring + hover scale.

**Bounce animation** — slow, gentle, infinite vertical bounce:
- Add a custom keyframe `gentle-bounce` in `src/styles.css` (translateY 0 → -8px → 0) running ~2.4s ease-in-out infinite.
- Apply via a utility class `animate-gentle-bounce` on the button.
- Pause the bounce when the popover is open (`open ? "" : "animate-gentle-bounce"`) so it sits still while the user reads options.
- Remove the old `animate-ping` pulse ring (the bounce replaces it as the attention cue).

**Popover** — unchanged: same card with تماس تلفنی + واتساپ rows, same delay (3s) before first appearance, same click-outside / Escape behavior.

### Files
- `src/components/floating-contact.tsx` — swap icon for "بپرس" text, change shape to rounded-square, apply bounce class, drop ping ring.
- `src/styles.css` — add `@keyframes gentle-bounce` and `.animate-gentle-bounce` utility (3-line addition).

### Out of scope
- No change to the popover content, phone numbers, or position (stays bottom-left).
- No change to the 3-second reveal delay.

