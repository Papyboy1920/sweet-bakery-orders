# Order Online on YOUR Domain — Setup Guide

**Goal:** customers order at **`order.sweetbakerycafeteria.shop`** —
her brand in the link, our ordering engine underneath. Her existing
website stays exactly as it is; we just point a subdomain at the app.

Do this only after the owner says yes and you have access to wherever
her domain lives (GoDaddy, Namecheap, Google Domains, whoever she paid
for `sweetbakerycafeteria.shop`).

---

## Part 1 — Add the domain in Render (2 minutes)

1. Open the Render dashboard and go to the **`sweet-bakery-orders`** service.
2. Click **Settings** in the left menu.
3. Scroll to **Custom Domains** and click **Add Custom Domain**.
4. Type exactly: `order.sweetbakerycafeteria.shop`
5. Click **Save**. Render will show it as "pending" and give you a
   target to point the DNS at — it will be:
   **`sweet-bakery-orders.onrender.com`**
6. Leave this tab open — you'll come back to verify.

## Part 2 — Create the subdomain where her domain lives (5 minutes)

1. Log in to wherever `sweetbakerycafeteria.shop` is registered
   (GoDaddy / Namecheap / Google Domains / etc.).
2. Find **DNS settings** (sometimes called "DNS Management" or "Zone Editor").
3. Add a new record with these exact values:
   - **Type:** `CNAME`
   - **Host / Name:** `order`
   - **Points to / Value:** `sweet-bakery-orders.onrender.com`
   - **TTL:** leave default / Automatic
4. Save. That's it — one record.

⏳ DNS takes 5 minutes to a few hours to spread. Go back to the Render
tab from Part 1 and refresh — when it says **Verified** (with a lock 🔒),
the subdomain is live with free HTTPS handled by Render automatically.

## Part 3 — Put the "Order Online" button on her current site

On `sweetbakerycafeteria.shop`, add one big button (header or homepage):

> **🛵 Order Online** → `https://order.sweetbakerycafeteria.shop`

Until the subdomain verifies, the button can point to the direct link:
`https://sweet-bakery-orders.onrender.com`

## Quick reference

| What | Value |
|---|---|
| Subdomain to create | `order.sweetbakerycafeteria.shop` |
| CNAME target (exact) | `sweet-bakery-orders.onrender.com` |
| Render service | `sweet-bakery-orders` |
| Fallback direct link | `https://sweet-bakery-orders.onrender.com` |

## If something goes wrong

- **"DNS not verified" after hours:** double-check the CNAME host is just
  `order` (not `order.sweetbakerycafeteria.shop`) and the value has no
  typos. Some registrars add the domain automatically — that's normal.
- **Button goes to the wrong place:** make sure the link starts with
  `https://`.
- Her main site is untouched by all of this — worst case, the subdomain
  just doesn't resolve yet and the direct Render link still works.
