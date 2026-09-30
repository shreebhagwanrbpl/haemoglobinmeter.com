import { normalizeCatalogPayload, WEBSITE_ID } from "./catalog-utils";

const json = async (res) => {
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
};

function unwrapPayload(payload) {
  if (!payload || typeof payload !== "object") return payload;
  if (payload.data !== undefined) return payload.data;
  return payload;
}

export async function fetchDocCached(path) {
  try {
    const cleanPath = path.startsWith("__website__")
      ? path.replace(/^__website__/, `websites/${WEBSITE_ID}`)
      : path;
    const res = await json(await fetch(`/api/site-data?path=${encodeURIComponent(cleanPath)}&websiteId=${encodeURIComponent(WEBSITE_ID)}`, { cache: "no-store" }));
    return unwrapPayload(res);
  } catch (e) {
    console.error(`[data-fetcher] ${path}`, e);
    return null;
  }
}

export async function fetchFullCatalog() {
  try {
    const res = await json(await fetch(`/api/catalog?websiteId=${encodeURIComponent(WEBSITE_ID)}`, { cache: "no-store" }));
    return normalizeCatalogPayload(res);
  } catch (e) {
    console.error("[data-fetcher] catalog", e);
    return [];
  }
}

export async function fetchWebsitePage(pageType) {
  try {
    const res = await json(await fetch(`/api/site-data?type=${encodeURIComponent(pageType)}&websiteId=${encodeURIComponent(WEBSITE_ID)}`, { cache: "no-store" }));
    return unwrapPayload(res);
  } catch (e) {
    console.error(`[data-fetcher] page ${pageType}`, e);
    return null;
  }
}

export async function fetchHomeData() {
  return fetchWebsitePage("home");
}

export async function fetchContactData() {
  return fetchWebsitePage("contact");
}

export async function fetchServicesData() {
  return fetchWebsitePage("services");
}

export async function fetchDistrictData(district) {
  if (!district) return null;
  try {
    const res = await json(await fetch(`/api/site-data?type=district&district=${encodeURIComponent(district)}&websiteId=${encodeURIComponent(WEBSITE_ID)}`, { cache: "no-store" }));
    return unwrapPayload(res);
  } catch (e) {
    console.error(`[data-fetcher] district ${district}`, e);
    return null;
  }
}

export async function fetchAllDistricts() {
  try {
    const payload = await json(await fetch(`/api/site-data?type=districts&websiteId=${encodeURIComponent(WEBSITE_ID)}`, { cache: "no-store" }));
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.districts)) return payload.districts;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
  } catch (e) {
    console.error("[data-fetcher] districts", e);
    return [];
  }
}

export const fetchActiveDistricts = fetchAllDistricts;

