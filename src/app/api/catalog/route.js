import { NextResponse } from "next/server";
import { normalizeCatalogPayload } from "@/lib/catalog-utils";
import { getCatalog } from "@/lib/cms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
const headers = { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0", Pragma: "no-cache" };

export async function GET() {
  try {
    const payload = await getCatalog();
    if (payload && payload.success !== false) {
      const products = normalizeCatalogPayload(payload);
      return NextResponse.json(products, { status: 200, headers });
    }
    return NextResponse.json([], { status: 200, headers });
  } catch (error) {
    console.error("[api/catalog] Error fetching live catalog from CMS:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unable to fetch catalog", products: [] },
      { status: 502, headers }
    );
  }
}
