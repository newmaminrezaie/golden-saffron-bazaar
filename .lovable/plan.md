## Update contact information across the site

### New contact details

- **Phone (call)**: +98 938 043 4939
- **Phone (WhatsApp / Telegram / Rubika / Eitaa / Bale)**: +98 915 049 4939
- **Instagram**: Khajavi.saffron111
- **Email**: [info@khajavisaffron.ir](mailto:info@khajavisaffron.ir) (kept — not in the new list, but retained unless you say otherwise)
- **Rubika channel**: [https://rubika.ir/saffron_khajavi](https://rubika.ir/saffron_khajavi)

### Files to update

**1. `src/components/site-footer.tsx**`
Replace the "تماس با ما" block with:

- 📍  خراسان جنوبی، قائنات، بیهود
- 📞 تماس: +۹۸ ۹۳۸ ۰۴۳ ۴۹۳۹
- 💬 واتساپ / تلگرام / روبیکا / ایتا / بله: +۹۸ ۹۱۵ ۰۴۹ ۴۹۳۹
- ✉ [info@khajavisaffron.ir](mailto:info@khajavisaffron.ir)
- 📷 اینستاگرام: Khajavi.saffron111
- Add a Rubika channel link row (using `MessageCircle` icon from lucide) → [https://rubika.ir/saffron_khajavi](https://rubika.ir/saffron_khajavi)

Make Instagram and Rubika rows actual `<a>` links (instagram.com/khajavi.saffron111 and the rubika URL), opening in a new tab.

**2. `src/routes/contact.tsx**`
Replace the info cards array with:

- آدرس: خراسان جنوبی، قائنات، بیهود، پلاک ۱۲ (kept)
- تماس مستقیم: +۹۸ ۹۳۸ ۰۴۳ ۴۹۳۹
- پیام‌رسان‌ها (واتساپ، تلگرام، روبیکا، ایتا، بله): +۹۸ ۹۱۵ ۰۴۹ ۴۹۳۹
- ایمیل: [info@khajavisaffron.ir](mailto:info@khajavisaffron.ir)
- اینستاگرام: Khajavi.saffron111 (clickable link)
- کانال روبیکا: [https://rubika.ir/saffron_khajavi](https://rubika.ir/saffron_khajavi) (clickable link)
- ساعات کاری: شنبه تا پنج‌شنبه، ۹ تا 20 (kept)

Use appropriate lucide icons (`Phone`, `MessageCircle`, `Send`, `Instagram`, `Mail`, `MapPin`, `Clock`).

**3. Quick search for stray references**
Grep for the old placeholder `۹۱۵ ۰۰۰ ۰۰۰۰` and `khajavi.saffron@` across the codebase and replace any remaining occurrences (likely none beyond the two files above, but will verify during implementation).

### Out of scope

- No new routes or components.
- Email kept as-is (not listed in new info but currently present); will remove if you confirm it should go.
- Address detail ("خیابان زعفران، پلاک ۱۲") kept as-is since not contradicted by the new info.