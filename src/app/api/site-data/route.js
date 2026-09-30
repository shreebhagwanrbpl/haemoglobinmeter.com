import { NextResponse } from "next/server";
import { WEBSITE_ID, normalizeSiteDataParams } from "@/lib/catalog-utils";
import { fetchRemoteCatalogApi } from "@/lib/catalog-api-remote";
import { getWebsiteDocument, getDocument, queryDocuments } from "@/lib/sqliteDb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
const headers = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
};

export async function GET(request) {
  try {
    const incoming = new URL(request.url);
    const params = normalizeSiteDataParams(incoming.searchParams);
    const websiteId = params.get("websiteId") || WEBSITE_ID;
    const type = params.get("type");

    let payload = null;
    try {
      const upstream = await fetchRemoteCatalogApi(`/api/site-data?${params.toString()}`);
      if (upstream.ok) {
        payload = await upstream.json();
      }
    } catch (err) {
      // Upstream fetch failed, will try local SQLite
    }

    // If remote returned non-empty data, return it
    if (payload && payload.success !== false) {
      if (Array.isArray(payload.districts) && payload.districts.length > 0) {
        return NextResponse.json(payload.districts, { status: 200, headers });
      }
      if (payload.data && typeof payload.data === "object" && Object.keys(payload.data).length > 0) {
        return NextResponse.json(payload.data, { status: 200, headers });
      }
    }

    // Fallback to SQLite DB if local/vps catalog.db has the data
    try {
      if (type === "home" || type === "services" || type === "contact" || type === "about") {
        const row = getWebsiteDocument(websiteId, type);
        if (row?.data && Object.keys(row.data).length > 0) {
          return NextResponse.json(row.data, { status: 200, headers });
        }
      } else if (type === "district") {
        const district = params.get("district");
        if (district) {
          const rows = queryDocuments({ likePath: `websites/%/${websiteId}/districts/${district.toLowerCase()}` });
          if (rows[0]?.data) return NextResponse.json(rows[0].data, { status: 200, headers });
        }
      } else if (type === "districts") {
        const rows = queryDocuments({ likePath: `websites/%/${websiteId}/districts/%` });
        if (rows.length > 0) {
          return NextResponse.json(rows.map((r) => ({ id: r.doc_id, ...(r.data || {}) })), { status: 200, headers });
        }
      } else if (type === "doc") {
        const docPath = params.get("path");
        if (docPath) {
          const row = getDocument(docPath);
          if (row?.data) return NextResponse.json(row.data, { status: 200, headers });
        }
      }
    } catch (e) {
      // SQLite fallback not available or failed
    }

    if (payload && typeof payload === "object") {
      if (Array.isArray(payload.districts)) return NextResponse.json(payload.districts, { status: 200, headers });
      if (Object.prototype.hasOwnProperty.call(payload, "data")) return NextResponse.json(payload.data, { status: 200, headers });
      return NextResponse.json(payload, { status: 200, headers });
    }

    return NextResponse.json(null, { status: 200, headers });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to fetch SuperAdmin site data" },
      { status: 502, headers }
    );
  }
}

