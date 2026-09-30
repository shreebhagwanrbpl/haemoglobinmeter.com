# Shared SuperAdmin catalog source — haemoglobinmeter.com

## Single source of truth
Catalog and site-page reads use the SuperAdmin VPS API at `https://admin.rajbiosis.app` in both local development and production. The SuperAdmin API reads the canonical SQLite database configured for the SuperAdmin process; the website no longer tries to use a separate local SQLite copy for catalog reads.

## Local Windows setup
The included `.env.local` sets:
```env
CATALOG_API_BASE_URL=https://admin.rajbiosis.app
SITE_WRITE_API_BASE_URL=https://haemoglobinmeter.com
```
Restart `npm run dev` after changing environment variables. Verify:
- `http://localhost:3001/api/catalog/health` is the Admin API (if Admin is running on port 3001).
- `http://localhost:3000/api/catalog/health` or the website's actual local port reports `mode: shared-superadmin-api`, `source: https://admin.rajbiosis.app`, and a nonzero `catalogCount` when the VPS catalog has published products for `haemoglobinmetercom`.

## VPS deployment
Set the same `CATALOG_API_BASE_URL=https://admin.rajbiosis.app` in the website production environment, then rebuild/restart the website. The website and local dev will read the same SuperAdmin API, so they cannot silently choose different local SQLite files for catalog reads.

The public website's contact/product enquiry write endpoints remain configured separately through `SITE_WRITE_API_BASE_URL`. If those are later moved into SuperAdmin, update the write routes and base URL together.

## Important
The SuperAdmin API must itself be running on the VPS and configured to use `/root/SuperAdminRBPL/data/catalog.db`. A local admin process on `localhost:3001` may use a different Windows SQLite file and is not proof that the VPS database contains the same records. If the health endpoint reports zero products, verify the data exists in the VPS SuperAdmin API, not just in the local admin app.
