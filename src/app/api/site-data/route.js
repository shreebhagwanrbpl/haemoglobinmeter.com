import { NextResponse } from "next/server";
import { getSiteData, getWebsiteId } from "@/lib/cms";

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
    const rawPath = incoming.searchParams.get("path");
    const rawCollection = incoming.searchParams.get("collection");
    const rawType = incoming.searchParams.get("type");
    const rawDistrict = incoming.searchParams.get("district");
    const websiteId = incoming.searchParams.get("websiteId") || getWebsiteId();

    const extra = {};
    if (rawPath) extra.path = rawPath;
    if (rawCollection) extra.collection = rawCollection;
    if (rawDistrict) extra.district = rawDistrict;

    const type = rawType || (rawPath ? "doc" : rawCollection ? "districts" : "home");

    const payload = await getSiteData(type, extra);

    if (payload && payload.success !== false) {
      if (Array.isArray(payload.districts)) {
        return NextResponse.json(payload.districts, { status: 200, headers });
      }
      if (payload.data !== undefined) {
        return NextResponse.json(payload.data, { status: 200, headers });
      }
      return NextResponse.json(payload, { status: 200, headers });
    }

    if (payload && typeof payload === "object") {
      return NextResponse.json(payload.data !== undefined ? payload.data : payload, { status: 200, headers });
    }

    return NextResponse.json(null, { status: 200, headers });
  } catch (error) {
    console.error("[api/site-data] Error fetching from Central CMS:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to fetch CMS site data" },
      { status: 502, headers }
    );
  }
}
