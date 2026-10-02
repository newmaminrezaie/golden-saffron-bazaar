# Language switcher as a dropdown in the mobile header (with flags)

## Current state (confirmed from code)

- `src/components/i18n/locale-shell.tsx` — `LanguageSwitcher` renders plain language pills. In the English/Turkish/Arabic header it is hidden on mobile (`hidden md:block`) and duplicated inside the hamburger menu.
- `src/components/site-header.tsx` — Persian header shows the switcher only on large screens (`hidden lg:block`) and also inside the hamburger menu.
- No flag assets exist in the project. Everything must stay offline (project rule): no emoji flags (Windows renders them as letters) and no external CDN images — flags will be tiny inline SVGs.

## What to build

A compact, self-contained `LanguageDropdown` component (new file `src/components/language-dropdown.tsx`) and its use in both headers.

### 1. Inline SVG flag icons
- Small rounded flags (~18×13) drawn as inline SVG: Iran (green/white/red stripes), United Kingdom (simplified union jack), Turkey (red with crescent + star), Saudi Arabia (green with a simplified white mark).
- Fully offline: pure markup, no images to load.

### 2. `LanguageDropdown` behavior
- Closed state: a single bordered pill showing the current flag + current language label (from `LANG_LABELS`), with a small chevron. Sized to fit neatly in the 56px-tall mobile header row (`h-9`).
- Open state (tap): a small anchored panel listing all four languages with flag + label, current one highlighted.
- Closes on outside tap, on selection, and on Escape. Keyboard accessible (buttons, aria-expanded, aria-haspopup).
- Navigation reuses the existing `pathInLocale()` helper so the same page opens in the chosen language (or that language's home), keeping the current full-reload behavior for direction switching.

### 3. Wire into headers
- **Persian header (`site-header.tsx`)**: replace the desktop-only pill switcher with `LanguageDropdown` visible at every screen size; remove the switcher from the hamburger menu.
- **English/Turkish/Arabic header (`locale-shell.tsx`)**: use `LanguageDropdown` in the header row on mobile (it stays simple enough to also serve desktop — one component, one look); remove the switcher from the hamburger menu.
- Header row keeps `shrink-0` on the switcher so it never squeezes the logo or nav on narrow screens.

## Verification

- Playwright at mobile viewport on `/`, `/en`, `/tr`, `/ar`: dropdown opens, flags render, picking a language lands on the correct page, hamburger menu no longer contains a switcher.
- Confirm no hamburger-menu switcher remains and the dropdown never overlaps the cart/menu buttons.
