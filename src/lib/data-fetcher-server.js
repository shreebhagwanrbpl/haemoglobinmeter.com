import "server-only";
import { cache } from "react";
import { getDocument, getDocuments, queryDocuments } from "./sqliteDb";
import { WEBSITE_ID, normalizeWebsiteId, isVisibleForWebsite, makeSlug, normalizeCatalogPayload, normalizeSiteDataParams } from "./catalog-utils";
import { fetchRemoteCatalogApi, getRemoteCatalogBaseUrl } from "./catalog-api-remote";

async function remoteJson(path) {
  const response = await fetchRemoteCatalogApi(path);
  if (!response.ok) throw new Error(`Live catalog API returned HTTP ${response.status} for ${path}`);
  return response.json();
}

function unwrapPayload(payload) {
  if (!payload || typeof payload !== "object") return payload;
  if (payload.data !== undefined) return payload.data;
  return payload;
}

const memo = new Map();
function clone(v) { return v == null ? v : JSON.parse(JSON.stringify(v)); }

export const fetchDocCached = cache(async (path) => {
  if (getRemoteCatalogBaseUrl()) {
    try {
      const params = normalizeSiteDataParams({ path, websiteId: WEBSITE_ID });
      const payload = await remoteJson(`/api/site-data?${params.toString()}`);
      const data = unwrapPayload(payload);
      if (data && typeof data === "object" && Object.keys(data).length > 0) {
        return data;
      }
    } catch (err) {
      console.error(`[fetchDocCached] Error fetching ${path}:`, err);
    }
  }
  const key = `doc:${path}`;
  if (memo.has(key)) return clone(memo.get(key));
  try {
    const row = getDocument(path);
    const data = row?.data || null;
    memo.set(key, data);
    return clone(data);
  } catch (e) {
    return null;
  }
});

export async function fetchHomeData() { return fetchWebsitePage("home"); }
export async function fetchContactData() { return fetchWebsitePage("contact"); }
export async function fetchServicesData() { return fetchWebsitePage("services"); }

export async function fetchWebsitePage(pageType) {
  if (getRemoteCatalogBaseUrl()) {
    try {
      const payload = await remoteJson(`/api/site-data?type=${encodeURIComponent(pageType)}&websiteId=${encodeURIComponent(WEBSITE_ID)}`);
      const data = unwrapPayload(payload);
      if (data && typeof data === "object" && Object.keys(data).length > 0) {
        return data;
      }
    } catch (err) {
      console.error(`[fetchWebsitePage] Error fetching page ${pageType}:`, err);
    }
  }
  try {
    const row = getDocumentByWebsitePage(pageType);
    return clone(row?.data || null);
  } catch (e) {
    return null;
  }
}

function getDocumentByWebsitePage(pageType) {
  const normalized = normalizeWebsiteId(WEBSITE_ID);
  const rows = queryDocuments({ likePath: `websites/%/%/pages/${pageType}` });
  const hit = rows.find((r) => {
    const parts = String(r.path || "").split("/");
    return parts.length >= 5 && normalizeWebsiteId(parts[2]) === normalized;
  });
  if (hit) return hit;
  const directRows = queryDocuments({ likePath: `websites/%/pages/${pageType}` });
  return directRows.find((r) => {
    const parts = String(r.path || "").split("/");
    return parts.length >= 4 && normalizeWebsiteId(parts[1]) === normalized;
  }) || null;
}

export async function fetchDistrictData(district) {
  if (!district) return null;
  if (getRemoteCatalogBaseUrl()) {
    try {
      const payload = await remoteJson(`/api/site-data?type=district&district=${encodeURIComponent(district)}&websiteId=${encodeURIComponent(WEBSITE_ID)}`);
      const data = unwrapPayload(payload);
      if (data && typeof data === "object" && Object.keys(data).length > 0) {
        return data;
      }
    } catch (err) {
      console.error(`[fetchDistrictData] Error fetching district ${district}:`, err);
    }
  }
  try {
    const normalized = String(district).toLowerCase();
    const rows = queryDocuments({ likePath: `websites/%/%/districts/${normalized}` });
    if (rows[0]?.data) return clone(rows[0].data);
    const byId = queryDocuments({ likePath: "websites/%/%/districts/%" });
    const hit = byId.find((r) => normalizeWebsiteId(r.doc_id) === normalizeWebsiteId(district));
    return clone(hit?.data || null);
  } catch (e) {
    return null;
  }
}

function resolveCompanyId() {
  if (process.env.COMPANY_ID) return process.env.COMPANY_ID;
  const rows = queryDocuments({ likePath: `websites/%/%/pages/contact` });
  const normalized = normalizeWebsiteId(WEBSITE_ID);
  const hit = rows.find((r) => {
    const p = String(r.path || "").split("/");
    return p.length >= 5 && normalizeWebsiteId(p[2]) === normalized;
  });
  if (hit) return String(hit.path).split("/")[1];
  return "rajbiosis";
}

function firstValue(obj, keys, fallback = "") {
  for (const key of keys) if (obj?.[key] != null && obj[key] !== "") return obj[key];
  return fallback;
}

function productFrom(raw, category, subCategory, uid) {
  if (!raw || typeof raw !== "object") return null;
  const title = firstValue(raw, ["title", "name", "productName"]);
  if (!title) return null;
  return {
    ...raw,
    uid: raw.uid || uid,
    title,
    slug: raw.slug || makeSlug(title),
    category: raw.category || category || "Other Products",
    subCategory: raw.subCategory || raw.subcategory || subCategory || category || "Other Products",
  };
}

function collectEmbeddedProducts(raw, category, subCategory, uidPrefix) {
  const arrays = [raw?.products, raw?.items, raw?.categoryProducts].filter(Array.isArray);
  const out = [];
  arrays.forEach((arr) => arr.forEach((p, i) => out.push(productFrom(p, category, subCategory, `${uidPrefix}-${i}`))));
  return out.filter(Boolean);
}

export const fetchFullCatalog = cache(async () => {
  if (getRemoteCatalogBaseUrl()) {
    try {
      const payload = await remoteJson(`/api/catalog?websiteId=${encodeURIComponent(WEBSITE_ID)}`);
      const normalized = normalizeCatalogPayload(payload);
      if (normalized && normalized.length > 0) return normalized;
    } catch (err) {
      console.error("[fetchFullCatalog] Error loading remote catalog:", err);
    }
  }
  try {
    const companyId = resolveCompanyId();
    const websiteId = WEBSITE_ID;
    const products = [];
    const seen = new Set();

    const categories = getDocuments(`companies/${companyId}/categories`);
    for (const categoryRow of categories) {
      const categoryData = categoryRow.data || {};
      if (!isVisibleForWebsite(categoryData, websiteId)) continue;
      const categoryName = firstValue(categoryData, ["category", "name", "title"], categoryRow.doc_id);
      const categoryId = categoryRow.doc_id;

      const subRows = getDocuments(`companies/${companyId}/categories/${categoryId}/subcategories`);
      for (const subRow of subRows) {
        const subData = subRow.data || {};
        if (!isVisibleForWebsite(subData, websiteId)) continue;
        const subName = firstValue(subData, ["subCategory", "subcategory", "name", "title"], subRow.doc_id);
        for (const p of collectEmbeddedProducts(subData, categoryName, subName, `${categoryId}-${subRow.doc_id}`)) {
          if (!isVisibleForWebsite(p, websiteId)) continue;
          const key = `${p.slug}|${p.title}`.toLowerCase();
          if (!seen.has(key)) { seen.add(key); products.push(p); }
        }
        const separateProducts = getDocuments(`companies/${companyId}/categories/${categoryId}/subcategories/${subRow.doc_id}/products`);
        for (const row of separateProducts) {
          if (!isVisibleForWebsite(row.data || {}, websiteId)) continue;
          const p = productFrom(row.data, categoryName, subName, `${categoryId}-${subRow.doc_id}-${row.doc_id}`);
          if (!p) continue;
          const key = `${p.slug}|${p.title}`.toLowerCase();
          if (!seen.has(key)) { seen.add(key); products.push(p); }
        }
      }

      for (const p of collectEmbeddedProducts(categoryData, categoryName, categoryName, `${categoryId}-direct`)) {
        if (!isVisibleForWebsite(p, websiteId)) continue;
        const key = `${p.slug}|${p.title}`.toLowerCase();
        if (!seen.has(key)) { seen.add(key); products.push(p); }
      }
    }

    for (const row of getDocuments(`companies/${companyId}/products`)) {
      const p = productFrom(row.data, row.data?.category || "Other Products", row.data?.subCategory || row.data?.subcategory || "Other Products", `master-${row.doc_id}`);
      if (!p || !isVisibleForWebsite(p, websiteId)) continue;
      const key = `${p.slug}|${p.title}`.toLowerCase();
      if (!seen.has(key)) { seen.add(key); products.push(p); }
    }

    return products;
  } catch (err) {
    console.error("[fetchFullCatalog] SQLite fallback error:", err);
    return [];
  }
});

export async function fetchActiveDistricts() {
  if (getRemoteCatalogBaseUrl()) {
    try {
      const payload = await remoteJson(`/api/site-data?type=districts&websiteId=${encodeURIComponent(WEBSITE_ID)}`);
      const list = Array.isArray(payload) ? payload : Array.isArray(payload?.districts) ? payload.districts : Array.isArray(payload?.data) ? payload.data : [];
      if (list && list.length > 0) return list;
    } catch (err) {
      console.error("[fetchActiveDistricts] Error loading districts:", err);
    }
  }
  try {
    const rows = queryDocuments({ likePath: "websites/%/%/districts/%" });
    return rows.map((r) => ({ id: r.doc_id, ...(r.data || {}) }));
  } catch (e) {
    return [];
  }
}
export const fetchAllDistricts = fetchActiveDistricts;

