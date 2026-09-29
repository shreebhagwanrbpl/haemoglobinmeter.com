"use client";

const pathOf = (parts) => parts.filter(Boolean).join("/");
export const db = { __catalogApi: true };
export function serverTimestamp() { return new Date().toISOString(); }
export function doc(_db, ...parts) { return { kind: "doc", path: pathOf(parts) }; }
export function collection(_db, ...parts) { return { kind: "collection", path: pathOf(parts) }; }

async function request(url, options) {
  const res = await fetch(url, { ...options, cache: "no-store", headers: { "Cache-Control": "no-cache", ...(options?.headers || {}) } });
  if (!res.ok) throw new Error(`Catalog API ${res.status}`);
  return res.json();
}

function snap(data, id = "") {
  const exists = data != null;
  return { exists: () => exists, id, data: () => data || {} };
}

export async function getDoc(ref) {
  const data = await request(`/api/site-data?path=${encodeURIComponent(ref.path)}`);
  return snap(data, ref.path.split("/").pop());
}

export async function getDocs(ref) {
  const data = await request(`/api/site-data?collection=${encodeURIComponent(ref.path)}`);
  const rows = Array.isArray(data) ? data : [];
  const docs = rows.map((r) => snap(r.data || r, r.id || r.doc_id || ""));
  return { docs, forEach(cb) { docs.forEach(cb); }, size: docs.length, empty: docs.length === 0 };
}

export async function addDoc(ref, data) {
  const parts = ref.path.split("/");
  const type = parts[0] === "websitesQueries" ? parts[2] : "";
  const endpoint = type === "productQueries" ? "/api/product-query" : "/api/contact-query";
  const result = await request(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  return { id: result.id || result.docId || `local-${Date.now()}` };
}

export function onSnapshot(ref, callback) {
  let stopped = false;
  const run = async () => { if (stopped) return; try { callback(await getDoc(ref)); } catch (e) { console.error(e); } };
  run();
  const timer = setInterval(run, 3000);
  return () => { stopped = true; clearInterval(timer); };
}
