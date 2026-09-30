import path from "node:path";
import fs from "node:fs";

/** Resolve the shared SuperAdmin SQLite catalog for both local development and VPS deployment. */
export function resolveSqliteDbPath() {
  const configured = process.env.SQLITE_DB_PATH?.trim();
  if (configured) return path.resolve(process.cwd(), configured);

  const candidates = [
    "/root/SuperAdminRBPL/data/catalog.db",
    path.resolve(process.cwd(), "../SuperAdminRBPL/data/catalog.db"),
    path.resolve(process.cwd(), "data/catalog.db"),
  ];

  return candidates.find((candidate) => fs.existsSync(candidate)) || candidates[0];
}
