import { NextResponse } from "next/server";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request) {
  try {
    const body = await request.json();
    const dbPath = process.env.SQLITE_DB_PATH || path.resolve(process.cwd(), "../SuperAdminRBPL/data/catalog.db");
    if (!fs.existsSync(dbPath)) throw new Error(`SQLite database not found: ${dbPath}`);
    const db = new DatabaseSync(dbPath);
    const websiteId = process.env.WEBSITE_ID || "haemoglobinmetercom";
    const companyId = process.env.COMPANY_ID || "rajbiosis";
    const collectionPath = `websitesQueries/${companyId}/$haemoglobinmetercom`;
    const docId = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    const now = new Date().toISOString();
    const data = JSON.stringify({ ...body, websiteId, createdAt: body.createdAt || now });
    db.prepare(`INSERT INTO documents (path, collection_path, doc_id, data, updated_at) VALUES (?, ?, ?, ?, ?)`).run(`${collectionPath}/${docId}`, collectionPath, docId, data, now);
    db.close();
    return NextResponse.json({ ok: true, id: docId }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) { return NextResponse.json({ ok: false, error: e.message }, { status: 500 }); }
}
