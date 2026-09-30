import { NextResponse } from "next/server";
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import { resolveSqliteDbPath } from "@/lib/sqlite-path";
import { WEBSITE_ID } from "@/lib/catalog-utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request) {
  try {
    const body = await request.json();
    const dbPath = resolveSqliteDbPath();
    if (!fs.existsSync(dbPath)) {
      throw new Error(`SQLite database not found: ${dbPath}`);
    }

    const db = new DatabaseSync(dbPath);
    const websiteId = body.websiteId || WEBSITE_ID;
    const collectionPath = `websitesQueries/${websiteId}/contactQueries`;
    const docId = `contact_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date();
    const nowIso = now.toISOString();
    const timestamp = Date.now();
    const seconds = Math.floor(timestamp / 1000);

    const record = {
      id: docId,
      name: String(body.name || "").trim(),
      email: String(body.email || "").trim(),
      phone: String(body.phone || "").trim(),
      subject: String(body.subject || "General Inquiry").trim(),
      message: String(body.message || "").trim(),
      city: String(body.city || "").trim(),
      district: String(body.district || "").trim(),
      websiteId,
      createdAt: {
        __sqliteType: "timestamp",
        value: nowIso,
        seconds: seconds,
        nanoseconds: 0,
      },
      timestamp: timestamp,
      date: now.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }),
      dateStr: now.toLocaleString("en-IN"),
    };

    const data = JSON.stringify(record);
    const docPath = `${collectionPath}/${docId}`;

    db.prepare(
      `INSERT INTO documents (path, collection_path, doc_id, data, updated_at) VALUES (?, ?, ?, ?, ?)`
    ).run(docPath, collectionPath, docId, data, timestamp);

    db.close();

    return NextResponse.json(
      { ok: true, success: true, id: docId, docId },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    console.error("[contact-query] Error saving query:", e);
    return NextResponse.json(
      { ok: false, success: false, error: e.message },
      { status: 500 }
    );
  }
}


