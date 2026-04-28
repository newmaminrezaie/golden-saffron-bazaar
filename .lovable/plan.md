## Add Enamad trust seal + 10s homepage popup

### 1. Wire real Enamad seal into the footer

In `src/components/site-footer.tsx`, replace the first placeholder card in the "نمادهای اعتماد" grid (the `ShieldCheck` / `eNAMAD.ir` `<a href="#">`) with the official Enamad anchor + image:

```html
<a referrerpolicy="origin" target="_blank"
   href="https://trustseal.enamad.ir/?id=720710&Code=wRYn3reyeBtj2jZJ2oZYzZfyeKkh6don">
  <img referrerpolicy="origin"
       src="https://trustseal.enamad.ir/logo.aspx?id=720710&Code=wRYn3reyeBtj2jZJ2oZYzZfyeKkh6don"
       alt="نماد اعتماد الکترونیکی"
       data-code="wRYn3reyeBtj2jZJ2oZYzZfyeKkh6don" />
</a>
```

Keep the same square card shell (white bg, rounded, aspect-square, centered) so it visually matches the Emalls and Samandehi tiles. Enamad requires the `code` attribute on the `<img>` for verification — React doesn't allow unknown attributes directly, so use `data-code` (Enamad's verifier reads either; `data-code` is the safe React-friendly form). The other two tiles stay as-is.

### 2. Homepage-only popup after 10 seconds

New component `src/components/enamad-popup.tsx`:

- Fixed-position card at bottom-right (RTL-friendly: `bottom-6 right-6`), `z-50`
- Small square: ~140×140px, white bg, rounded-xl, soft shadow, thin border
- Contains the same Enamad anchor + logo image (clickable, opens trust page in new tab)
- Tiny `×` close button top-left of the card
- `useEffect`: `setTimeout` shows it after 10000ms
- Dismissal: clicking `×` hides it AND sets `sessionStorage.setItem("enamad-popup-dismissed", "1")` so it doesn't reappear on every homepage navigation within the same browsing session (still re-shows on next visit, which is the gentle nudge behavior for trust seals)
- On mount, if `sessionStorage` flag is set, skip the timer entirely

Render `<EnamadPopup />` only inside `src/routes/index.tsx` (the home component), so it never appears on `/shop`, `/about`, etc.

### Visual

```text
                                          ┌─────────────┐
                                          │ ×           │
                                          │   [enamad]  │
                                          │   logo      │
                                          │             │
                                          └─────────────┘
                                              ↑ bottom-right, 140px square
```

### Files

- **edit** `src/components/site-footer.tsx` — replace first trust tile with real Enamad markup
- **create** `src/components/enamad-popup.tsx` — timed popup component
- **edit** `src/routes/index.tsx` — render `<EnamadPopup />`

### Out of scope

- No changes to the Emalls / Samandehi tiles (still placeholders until you provide their codes)
- No localStorage persistence (sessionStorage only — popup re-shows on next visit, which is intentional for ongoing trust reinforcement). Can switch to localStorage if you'd prefer "dismiss forever".
