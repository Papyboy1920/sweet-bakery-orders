# Sweet Bakery Cafeteria — Online Ordering

Cuban bakery & cafeteria ordering demo (store #18).
1467 N Krome Ave, Homestead, FL 33030 · 305-242-0717

- Customer app: `/` (English, warm Cuban-bakery theme)
- Back office: `/store` (black theme, protected by `STORE_KEY`)
- Owner kill-switch: `/admin` (protected by Portal's private `ADMIN_KEY`
  — set in Render Environment, never in this repo)
- Payments at launch: Cash / Zelle only (no card processing).
  Zelle handle starts EMPTY — the owner sets it in /store → Catalog.
- DB: Postgres when `DATABASE_URL` is set, else local SQLite.

## Prices
⚠️ All seed prices are **DRAFT — not owner-confirmed** (see `seed.js` header).
The owner confirms/corrects every price; everything is editable in /store.

## Photos
Current images are AI-generated placeholders in `public/images/`.
Portal will swap in LIVE photos later (real beats AI).
Filenames per item are in the catalog (`image` field) — drop the new
photo in `public/images/` with the same name and it appears everywhere.
