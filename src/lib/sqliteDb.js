import "server-only";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";

const DB_PATH = process.env.SQLITE_DB_PATH || path.resolve(process.cwd(), "../SuperAdminRBPL/data/catalog.db");
let db;

function getDb() {
  if (!db) {
    if (!fs.existsSync(DB_PATH)) throw new Error(`SQLite database not found: ${DB_PATH}`);
    db = new DatabaseSync(DB_PATH, { readOnly: true });
    db.exec("PRAGMA query_only = ON; PRAGMA read_uncommitted = ON;");
  }
  return db;
}

export function queryDocuments({ path: exactPath, collectionPath, likePath } = {}) {
  const database = getDb();
  let sql = "SELECT path, collection_path, doc_id, data, updated_at FROM documents";
  const where = [];
  const args = [];
  if (exactPath) { where.push("path = ?"); args.push(exactPath); }
  if (collectionPath) { where.push("collection_path = ?"); args.push(collectionPath); }
  if (likePath) { where.push("path LIKE ?"); args.push(likePath); }
  if (where.length) sql += ` WHERE ${where.join(" AND ")}`;
  sql += " ORDER BY path ASC";
  const rows = database.prepare(sql).all(...args);
  return rows.map((row) => ({ ...row, data: parseData(row.data) }));
}

export function parseData(value) {
  if (value == null) return {};
  if (typeof value === "object") return value;
  try { return JSON.parse(value); } catch { return {}; }
}

export function getDocument(exactPath) {
  return queryDocuments({ exactPath })[0] || null;
}

export function getDocuments(collectionPath) {
  return queryDocuments({ collectionPath });
}

export function getWebsiteDocument(websiteId, pageType) {
  const escaped = String(websiteId || "").replace(/%/g, "");
  const rows = queryDocuments({ likePath: `websites/%/${escaped}/pages/${pageType}` });
  return rows[0] || null;
}

export { DB_PATH };
