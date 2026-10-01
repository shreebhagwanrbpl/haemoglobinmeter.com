export const CMS_BASE = "https://admin.rajbiosis.app";
export const DEFAULT_WEBSITE_ID = "haemoglobinmetercom";
export const DEFAULT_COMPANY_ID = "rajbiosis";

// Auto-detect clean websiteId from package.json, environment, or hostname
export function getWebsiteId() {
  let name = "";
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_WEBSITE_ID) {
    name = process.env.NEXT_PUBLIC_WEBSITE_ID;
  } else if (typeof process !== "undefined" && process.env?.WEBSITE_ID) {
    name = process.env.WEBSITE_ID;
  } else if (
    typeof window !== "undefined" &&
    window.location?.hostname &&
    !["localhost", "127.0.0.1", "0.0.0.0"].includes(window.location.hostname) &&
    !window.location.hostname.endsWith(".local")
  ) {
    name = window.location.hostname;
  } else {
    name = DEFAULT_WEBSITE_ID;
  }

  const clean = name
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/[^a-z0-9]/g, "");

  return (clean && clean !== "localhost" && clean !== "127001" && clean !== "0000")
    ? clean
    : DEFAULT_WEBSITE_ID;
}

// 1. Fetch Products & Categories (Instant Live)
export async function getCatalog() {
  try {
    const siteId = getWebsiteId();
    const res = await fetch(`${CMS_BASE}/api/catalog?websiteId=${siteId}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Catalog failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("getCatalog error:", err);
    return { success: false, categories: [], products: [], totalCount: 0 };
  }
}

async function fetchCmsPath(docPath) {
  try {
    const res = await fetch(`${CMS_BASE}/api/site-data?path=${encodeURIComponent(docPath)}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json?.data && typeof json.data === "object" && Object.keys(json.data).length > 0) {
      return json.data;
    }
    return null;
  } catch {
    return null;
  }
}

// 2. Fetch Site Data / Pages (Live MongoDB sync for Add, Update & Delete)
export async function getSiteData(type = "home", extraParams = {}) {
  try {
    const siteId = getWebsiteId();
    const companyId = DEFAULT_COMPANY_ID;

    // 1. Direct query by websiteId and type (matches live MongoDB collection _id: `${siteId}_${type}`)
    const query = new URLSearchParams({ websiteId: siteId, type, ...extraParams });
    const res = await fetch(`${CMS_BASE}/api/site-data?${query.toString()}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const payload = await res.json();
      if (payload && payload.success !== false) {
        if (payload.data !== undefined && payload.data !== null) {
          return { success: true, exists: true, type, data: payload.data };
        }
        if (Array.isArray(payload.districts)) {
          return { success: true, exists: true, type, districts: payload.districts };
        }
      }
    }

    // 2. Fallback to path queries if direct type didn't have data
    const rawPath = extraParams.path || (type === "doc" ? extraParams.path : null);
    if (rawPath) {
      const cleanPath = rawPath.replace(/\\/g, "/").replace(/^__website__/, `websites/${siteId}`);
      let docData = await fetchCmsPath(cleanPath);
      if (docData) return { success: true, exists: true, data: docData };

      if (cleanPath.startsWith("websites/") && !cleanPath.includes(`/${companyId}/`)) {
        const companyPath = cleanPath.replace(/^websites\//, `websites/${companyId}/`);
        docData = await fetchCmsPath(companyPath);
        if (docData) return { success: true, exists: true, data: docData };
      }
    }

    // 3. Fallback to candidate page paths
    if (type && type !== "districts" && type !== "district" && type !== "doc" && type !== "all") {
      const candidatePaths = [
        `websites/${companyId}/${siteId}/pages/${type}`,
        `websites/${siteId}/pages/${type}`,
        `companies/${companyId}/websites/${siteId}/pages/${type}`,
      ];
      for (const p of candidatePaths) {
        const docData = await fetchCmsPath(p);
        if (docData) {
          return { success: true, exists: true, type, data: docData };
        }
      }
    }

    // 4. District candidate paths
    if (type === "district" && extraParams.district) {
      const dist = decodeURIComponent(extraParams.district).toLowerCase();
      const candidatePaths = [
        `websites/${companyId}/${siteId}/districts/${dist}`,
        `websites/${siteId}/districts/${dist}`,
      ];
      for (const p of candidatePaths) {
        const docData = await fetchCmsPath(p);
        if (docData) {
          return { success: true, exists: true, type, district: dist, data: docData };
        }
      }
    }

    return { success: true, data: null, exists: false };
  } catch (err) {
    console.error("getSiteData error:", err);
    return { success: false, data: null, exists: false };
  }
}

// 3. Submit Customer Lead / Inquiry
export async function submitInquiry(data) {
  try {
    const siteId = getWebsiteId();
    const qId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : "q_" + Date.now();
    const isProduct = Boolean(data.productTitle || data.productName || data.productSlug || data.model || data.brand);
    const type = isProduct ? "productQueries" : "contactQueries";
    
    const res = await fetch(`${CMS_BASE}/api/db`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        op: "set",
        path: `websitesQueries/${siteId}/${type}/${qId}`,
        data: { ...data, websiteId: siteId, createdAt: Date.now() },
      }),
    });
    return await res.json();
  } catch (err) {
    console.error("submitInquiry error:", err);
    return { ok: false, error: err.message };
  }
}
