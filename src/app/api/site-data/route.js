import { NextResponse } from "next/server";
import { getDocument, getDocuments, getWebsiteDocument, queryDocuments } from "@/lib/sqliteDb";
import { WEBSITE_ID, normalizeWebsiteId, isVisibleForWebsite } from "@/lib/catalog-utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const headers = { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" };
function response(data, status = 200) { return NextResponse.json(data, { status, headers }); }

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    if (searchParams.get("districts") === "1") {
      const rows = queryDocuments({ likePath: "websites/%/%/districts/%" });
      return response(rows.map((r) => ({ id: r.doc_id, ...(r.data || {}) })));
    }
    const collection = searchParams.get("collection");
    if (collection) {
      const rows = getDocuments(collection);
      return response(rows.filter((r) => isVisibleForWebsite(r.data || {}, WEBSITE_ID)).map((r) => ({ id: r.doc_id, data: r.data })));
    }
    let p = searchParams.get("path") || "";
    if (p.startsWith("__website__/")) {
      const pagePath = p.replace("__website__/", "");
      const rows = queryDocuments({ likePath: `websites/%/%/${pagePath}` });
      const normalized = normalizeWebsiteId(WEBSITE_ID);
      const hit = rows.find((r) => String(r.path).split("/").length >= 4 && normalizeWebsiteId(String(r.path).split("/")[2]) === normalized);
      return response(hit?.data || null);
    }
    // Admin stores known website pages under the grouped SQLite path:
    // websites/{companyId}/{websiteId}/pages/{pageType}.
    // Keep legacy exact-path support, then resolve grouped paths by website ID.
    let row = getDocument(p);
    if (!row) {
      const parts = p.split("/").filter(Boolean);
      if (parts[0] === "websites" && parts.length === 4 && parts[2] === "pages") {
        row = getWebsiteDocument(parts[1], parts[3]);
      }
    }
    return response(row?.data || null);
  } catch (e) { return response({ error: e.message }, 500); }
}
