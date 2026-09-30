import "server-only";

const DEFAULT_ADMIN_API_BASE_URL = "https://admin.rajbiosis.app";

/** The SuperAdmin VPS API is the single catalog/site-data source in every environment. */
export function getRemoteCatalogBaseUrl() {
  const configured = (process.env.CATALOG_API_BASE_URL || DEFAULT_ADMIN_API_BASE_URL).trim();
  try {
    const url = new URL(configured);
    if (!/^https?:$/.test(url.protocol)) return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function isLocalDevelopment() {
  return process.env.NODE_ENV !== "production";
}

export async function fetchRemoteCatalogApi(path, init = {}) {
  const base = getRemoteCatalogBaseUrl();
  if (!base) throw new Error("CATALOG_API_BASE_URL must be a valid http(s) URL pointing to the SuperAdmin VPS API.");
  const url = new URL(path, `${base}/`);
  return fetch(url, {
    ...init,
    cache: "no-store",
    headers: { Accept: "application/json", ...(init.headers || {}) },
  });
}

/** Preserve the deployed website's old write endpoints for contact/product enquiries. */
export async function fetchRemoteSiteWriteApi(path, init = {}) {
  const configured = (process.env.SITE_WRITE_API_BASE_URL || "https://haemoglobinmeter.com").trim();
  let base;
  try { base = new URL(configured).origin; }
  catch { throw new Error("SITE_WRITE_API_BASE_URL must be a valid http(s) URL."); }
  const url = new URL(path, `${base}/`);
  return fetch(url, { ...init, cache: "no-store", headers: { Accept: "application/json", ...(init.headers || {}) } });
}
