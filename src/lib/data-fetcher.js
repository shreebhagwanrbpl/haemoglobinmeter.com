const json = async (res) => { if (!res.ok) throw new Error(`API ${res.status}`); return res.json(); };
const api = (path) => `/api/site-data?path=${encodeURIComponent(path)}`;

export async function fetchDocCached(path) {
  try { return await json(await fetch(api(path), { cache: "no-store" })); }
  catch (e) { console.error(`[data-fetcher] ${path}`, e); return null; }
}
export async function fetchFullCatalog() {
  try { return await json(await fetch("/api/catalog", { cache: "no-store" })); }
  catch (e) { console.error("[data-fetcher] catalog", e); return []; }
}
export async function fetchHomeData() { return fetchDocCached("__website__/pages/home"); }
export async function fetchContactData() { return fetchDocCached("__website__/pages/contact"); }
export async function fetchServicesData() { return fetchDocCached("__website__/pages/services"); }
export async function fetchDistrictData(district) { return fetchDocCached(`__website__/districts/${encodeURIComponent(district || "")}`); }
export async function fetchAllDistricts() {
  try { return await json(await fetch("/api/site-data?districts=1", { cache: "no-store" })); }
  catch (e) { console.error(e); return []; }
}
export const fetchActiveDistricts = fetchAllDistricts;
