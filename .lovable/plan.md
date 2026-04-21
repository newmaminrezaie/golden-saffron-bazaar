

## Polish footer: spacing, layout, categories, trust seals

Reorganize the footer columns so content breathes under the emblem, add the missing product category, and reserve clean placeholder slots for trust badges (Enamad, Emalls, Samandehi) styled like the Mostafavi reference.

### Changes to `src/components/site-footer.tsx`

**1. Breathing room under the emblem**
- Increase top padding of the columns grid from `pt-20` → `pt-28 md:pt-32` so the three columns start well below the medallion's lower edge.
- Increase column gap from `gap-10` → `gap-10 md:gap-12`.

**2. Restructure into a 4-column layout**
Switch grid from `md:grid-cols-3` → `md:grid-cols-4` so the layout becomes (RTL reading order):

```text
[ Trust seals ] [ Contact ] [ Categories ] [ Quick links + intro ]
```

- **Quick links column**: keep current "دسترسی سریع" links; add the short intro paragraph (currently floating alone) above the heading so the column has a natural top.
- **Categories column**: keep existing list and **add `خشکبار`** as a new `<li>` after "بسته‌های هدیه".
- **Contact column**: unchanged content, just normalized spacing (`space-y-3`, consistent icon sizing).
- **Trust seals column** (new): heading "نمادهای اعتماد" + a vertical stack of three placeholder cards.

**3. Trust seal placeholder cards (matches Mostafavi reference)**
Each placeholder is a white rounded card with subtle border, fixed aspect, centered icon + label, ready to be swapped for real badges later:

- Card style: `bg-white/95 rounded-xl border border-white/10 p-3 w-32 h-32 flex flex-col items-center justify-center text-center shadow-sm`
- Three cards stacked with `space-y-3`:
  1. **Enamad** — `ShieldCheck` icon + small text "eNAMAD.ir" + "جهت اطمینان کلیک نمایید"
  2. **Emalls** — `Award` icon + small text "Emalls"
  3. **Samandehi** — `BadgeCheck` icon + small text "samandehi.ir"
- Wrap each card in a placeholder `<a href="#" aria-label="...">` so they're click-ready when real URLs arrive.
- Icons imported from `lucide-react` (already used in this file) — add `ShieldCheck, Award, BadgeCheck` to the existing import.

**4. Typography & spacing normalization**
- All column headings: unify to `text-base font-bold mb-4 text-white`.
- All list text: `text-sm leading-7 text-white/80`, lists use `space-y-2`.
- Remove the orphan intro `<div>` (its paragraph moves into the Quick links column).

**5. Bottom copyright row**
- Unchanged content; ensure top border still reads cleanly with the new column heights (no structural change needed).

### Out of scope
- No real Enamad/Emalls/Samandehi assets wired up (placeholders only — user can drop real images later).
- No header, hero, or other page changes.
- No emblem repositioning or sizing changes.
- No CSS/token changes.

