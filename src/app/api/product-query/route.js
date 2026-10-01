import { NextResponse } from "next/server";
import { submitInquiry, getWebsiteId } from "@/lib/cms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request) {
  try {
    const body = await request.json();
    const websiteId = body.websiteId || getWebsiteId();
    const docId = `prod_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date();

    const record = {
      id: docId,
      name: String(body.name || "").trim(),
      email: String(body.email || "").trim(),
      phone: String(body.phone || "").trim(),
      productName: String(body.productName || body.productTitle || body.title || "").trim(),
      productTitle: String(body.productName || body.productTitle || body.title || "").trim(),
      productSlug: String(body.productSlug || body.slug || "").trim(),
      brand: String(body.brand || "").trim(),
      model: String(body.model || "").trim(),
      message: String(body.message || "").trim(),
      city: String(body.city || "").trim(),
      district: String(body.district || "").trim(),
      websiteId,
      date: now.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }),
      dateStr: now.toLocaleString("en-IN"),
      ...body,
    };

    const result = await submitInquiry(record);

    if (result && result.ok !== false) {
      return NextResponse.json(
        { ok: true, success: true, id: docId, docId, ...result },
        { status: 200, headers: { "Cache-Control": "no-store" } }
      );
    }

    return NextResponse.json(
      { ok: false, success: false, error: result?.error || "Failed to submit inquiry to Central CMS" },
      { status: 500 }
    );
  } catch (e) {
    console.error("[product-query] Error saving query to CMS:", e);
    return NextResponse.json(
      { ok: false, success: false, error: e.message },
      { status: 500 }
    );
  }
}
