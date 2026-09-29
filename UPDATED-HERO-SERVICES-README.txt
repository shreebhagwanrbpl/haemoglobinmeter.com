HERO + SERVICES DYNAMIC DATA FIX

This update changes only these files:
- src/app/api/site-data/route.js
- src/components/HeroSection.jsx
- src/components/ServicesPreview.jsx
- src/app/services/page.js
- src/lib/data-fetcher-server.js

Root cause fixed:
SuperAdmin SQLite normalizes website documents to grouped paths:
websites/{companyId}/{websiteId}/pages/{pageType}
while the website client requests the legacy path:
websites/{websiteId}/pages/{pageType}
The site-data API now resolves that legacy request to the grouped database path.

Hero reads the existing home document. Homepage Services Preview and the Services page read the saved services array and update when the local SQLite API polling detects changes. Existing visual design and other page components were not intentionally changed.

Database requirement:
The website project must point SQLITE_DB_PATH to the same catalog.db file used by SuperAdmin. The default path remains ../SuperAdminRBPL/data/catalog.db.
