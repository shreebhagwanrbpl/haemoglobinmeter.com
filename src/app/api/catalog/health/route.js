import { NextResponse } from "next/server";
import { WEBSITE_ID, normalizeCatalogPayload } from "@/lib/catalog-utils";
import { fetchRemoteCatalogApi, getRemoteCatalogBaseUrl } from "@/lib/catalog-api-remote";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
const headers = { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0", Pragma: "no-cache" };

export async function GET() {
  try {
    const base = getRemoteCatalogBaseUrl();
    const upstream = await fetchRemoteCatalogApi(`/api/catalog?websiteId=${encodeURIComponent(WEBSITE_ID)}&companyId=rajbiosis`);
    const payload = await upstream.json();
    if (!upstream.ok || payload?.success === false) {
      return NextResponse.json({ ok: false, mode: "shared-superadmin-api", source: base, error: payload?.error || `SuperAdmin API returned HTTP ${upstream.status}` }, { status: 502, headers });
    }
    return NextResponse.json({ ok: true, mode: "shared-superadmin-api", source: base, websiteId: WEBSITE_ID, companyId: payload?.companyId || "rajbiosis", catalogCount: normalizeCatalogPayload(payload).length }, { headers });
  } catch (error) {
    return NextResponse.json({ ok: false, mode: "shared-superadmin-api", source: getRemoteCatalogBaseUrl(), error: error instanceof Error ? error.message : "Unknown catalog health error" }, { status: 502, headers });
  }
}
