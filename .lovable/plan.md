

## Floating contact widget (call + WhatsApp)

### What you'll see
A circular saffron-colored button fixed to the bottom-left corner of every page (bottom-right would conflict with RTL layout's natural reading flow — bottom-left feels less intrusive in RTL). After **3 seconds** of the user being on the site, it gently fades + scales in with a subtle pulse ring to draw attention without being aggressive.

Tapping it expands a small elegant card upward with two options:
1. **تماس تلفنی** — opens phone dialer (`tel:+989150494939`)
2. **واتساپ** — opens WhatsApp chat (`https://wa.me/989150494939` — the cleanest WhatsApp deep link, works on mobile app and web)

Tapping the FAB again (now showing an X icon) collapses the card. Tapping outside also closes it.

### Visual design
- **FAB**: 56px circle, saffron background (`bg-accent`), deep brown phone icon, soft shadow (`shadow-lg`), gentle pulse ring using a `::before` pseudo-element with `animate-ping` at low opacity (stops pulsing once user has opened it once — no nagging).
- **Expanded card**: rounded parchment card (`bg-card`, `rounded-2xl`, `shadow-xl`, `border border-border/60`), ~240px wide, anchored above the FAB with 12px gap. Two stacked rows:
  - Call row: `Phone` icon in a brown circle + "تماس تلفنی" label + faded phone number underneath
  - WhatsApp row: brand-green circle (`bg-[#25D366]`) with `MessageCircle` icon + "واتساپ" label + same number underneath
- Both rows are full-width buttons with hover bg shift (`hover:bg-secondary`) and `transition-colors`.
- Entrance animation: `animate-in fade-in slide-in-from-bottom-2` (already available via `tw-animate-css`).
- Number displayed in Persian digits (۰۹۱۵۰۴۹۴۹۳۹) for visual consistency, but `tel:` and `wa.me` URLs use Latin digits.

### Behavior
- Hidden for first 3 seconds after mount (uses `setTimeout` in a `useEffect`).
- Once visible, stays visible for the rest of the session.
- Click-outside detection via a `ref` + `mousedown` listener closes the expanded card.
- `Escape` key also closes it.
- `aria-label` on the FAB ("راه‌های ارتباطی"); expanded card uses `role="dialog"` semantics with `aria-expanded` on the trigger.
- `z-50` so it sits above page content but below toasts (`Toaster` is also `z-[100]`-ish from sonner defaults — fine).

### Files

**New: `src/components/floating-contact.tsx`**
Self-contained client component. No props. Uses `useState` for open/visible state, `useEffect` for the 3s reveal timer + click-outside listener, lucide icons (`Phone`, `MessageCircle`, `X`), and the existing color tokens.

**Edit: `src/routes/__root.tsx`**
Import and render `<FloatingContact />` once inside `RootComponent`, after `<Toaster />` so it lives at every route automatically.

### Out of scope
- No analytics tracking on click (can be added later if you want to measure engagement).
- No "missed call" badge / scheduling-aware hiding.
- No additional channels (Telegram, Rubika, etc.) in the floating widget — keeping it to the two highest-intent actions. Footer/contact page already lists the full set.

