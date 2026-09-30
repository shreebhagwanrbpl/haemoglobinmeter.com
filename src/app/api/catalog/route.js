import { NextResponse } from "next/server";
import { normalizeCatalogPayload, WEBSITE_ID } from "@/lib/catalog-utils";
import { fetchRemoteCatalogApi } from "@/lib/catalog-api-remote";
import { fetchFullCatalog } from "@/lib/data-fetcher-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
const headers = { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0", Pragma: "no-cache" };

export async function GET(request) {
  try {
    const incoming = new URL(request.url);
    const websiteId = incoming.searchParams.get("websiteId") || WEBSITE_ID;
    let products = [];

    try {
      const upstream = await fetchRemoteCatalogApi(`/api/catalog?websiteId=${encodeURIComponent(websiteId)}`);
      if (upstream.ok) {
        const payload = await upstream.json();
        if (payload && payload.success !== false) {
          products = normalizeCatalogPayload(payload);
        }
      }
    } catch (e) {
      // Remote upstream failed
    }

    if (products && products.length > 0) {
      return NextResponse.json(products, { status: 200, headers });
    }

    // Fallback to SQLite DB
    try {
      const localProducts = await fetchFullCatalog();
      if (localProducts && localProducts.length > 0) {
        return NextResponse.json(localProducts, { status: 200, headers });
      }
    } catch (e) {
      // SQLite fallback failed
    }

    return NextResponse.json([], { status: 200, headers });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unable to fetch catalog", products: [] }, { status: 502, headers });
  }
}

