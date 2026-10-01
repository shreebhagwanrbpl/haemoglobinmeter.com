import { cache } from "react";
import { normalizeCatalogPayload, normalizeSiteDataParams } from "./catalog-utils.js";
import { getCatalog, getSiteData, CMS_BASE, getWebsiteId } from "./cms.js";

function unwrapPayload(payload) {
  if (!payload || typeof payload !== "object") return payload;
  if (payload.data !== undefined) return payload.data;
  return payload;
}

export const fetchDocCached = cache(async (path) => {
  try {
    const websiteId = getWebsiteId();
    const params = normalizeSiteDataParams({ path, websiteId });
    const type = params.get("type") || "doc";
    const extra = {};
    for (const [key, value] of params.entries()) {
      if (key !== "websiteId" && key !== "type") {
        extra[key] = value;
      }
    }
    const payload = await getSiteData(type, extra);
    return unwrapPayload(payload);
  } catch (err) {
    console.error(`[fetchDocCached] Error fetching ${path}:`, err);
    return null;
  }
});

export async function fetchHomeData() {
  return fetchWebsitePage("home");
}

export async function fetchContactData() {
  return fetchWebsitePage("contact");
}

export async function fetchServicesData() {
  return fetchWebsitePage("services");
}

export async function fetchWebsitePage(pageType) {
  try {
    const payload = await getSiteData(pageType);
    const data = unwrapPayload(payload);
    if (data && typeof data === "object" && Object.keys(data).length > 0) {
      return data;
    }
    return null;
  } catch (err) {
    console.error(`[fetchWebsitePage] Error fetching page ${pageType}:`, err);
    return null;
  }
}

export async function fetchDistrictData(district) {
  if (!district) return null;
  try {
    const payload = await getSiteData("district", { district: encodeURIComponent(district) });
    const data = unwrapPayload(payload);
    if (data && typeof data === "object" && Object.keys(data).length > 0) {
      return data;
    }
    return null;
  } catch (err) {
    console.error(`[fetchDistrictData] Error fetching district ${district}:`, err);
    return null;
  }
}

export const fetchFullCatalog = cache(async () => {
  try {
    const payload = await getCatalog();
    const normalized = normalizeCatalogPayload(payload);
    if (normalized && normalized.length > 0) {
      return normalized;
    }
    return [];
  } catch (err) {
    console.error("[fetchFullCatalog] Error loading live catalog from CMS:", err);
    return [];
  }
});

export async function fetchActiveDistricts() {
  try {
    const payload = await getSiteData("districts");
    const list = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.districts)
      ? payload.districts
      : Array.isArray(payload?.data)
      ? payload.data
      : [];
    return list;
  } catch (err) {
    console.error("[fetchActiveDistricts] Error loading districts from CMS:", err);
    return [];
  }
}

export const fetchAllDistricts = fetchActiveDistricts;
