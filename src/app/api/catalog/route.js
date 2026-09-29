import { NextResponse } from "next/server";
import { fetchFullCatalog } from "@/lib/data-fetcher-server";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export async function GET() {
  try { return NextResponse.json(await fetchFullCatalog(), { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } }); }
  catch (e) { return NextResponse.json({ error: e.message }, { status: 500, headers: { "Cache-Control": "no-store" } }); }
}
