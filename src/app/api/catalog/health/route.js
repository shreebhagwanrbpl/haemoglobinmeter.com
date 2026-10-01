import { NextResponse } from "next/server";
import { normalizeCatalogPayload } from "@/lib/catalog-utils";
import { getCatalog, CMS_BASE, getWebsiteId } from "@/lib/cms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
const headers = { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0", Pragma: "no-cache" };

export async function GET() {
  try {
    const websiteId = getWebsiteId();
    const payload = await getCatalog();
    if (!payload || payload.success === false) {
      return NextResponse.json(
        { ok: false, mode: "live-central-mongodb-cms", source: CMS_BASE, websiteId, error: payload?.error || "Central CMS returned failure" },
        { status: 502, headers }
      );
    }
    const products = normalizeCatalogPayload(payload);
    return NextResponse.json(
      { ok: true, mode: "live-central-mongodb-cms", source: CMS_BASE, websiteId, catalogCount: products.length },
      { headers }
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, mode: "live-central-mongodb-cms", source: CMS_BASE, error: error instanceof Error ? error.message : "Unknown catalog health error" },
      { status: 502, headers }
    );
  }
}
