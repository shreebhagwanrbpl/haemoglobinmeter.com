export const WEBSITE_ID = "haemoglobinmetercom";

export function normalizeWebsiteId(value = "") {
  return String(value || "")
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/[.\-\s]/g, "");
}

export function isVisibleForWebsite(data = {}, websiteId = WEBSITE_ID) {
  if (!data || data.isPublished === false) return false;
  const status = String(data.status || "").toLowerCase();
  if (status === "inactive" || status === "draft") return false;
  if (!Array.isArray(data.websiteIds)) return true;
  if (data.websiteIds.length === 0) return false;
  const wanted = normalizeWebsiteId(websiteId);
  return data.websiteIds.some((id) => {
    const v = normalizeWebsiteId(id);
    return v === "all" || v === wanted;
  });
}

export function makeSlug(text = "") {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Normalize both legacy array responses and the SuperAdmin grouped catalog response.
 * The live VPS API returns { success, categories }, with products nested in each
 * category/subcategory. Site pages expect a flat product array.
 */
export function normalizeCatalogPayload(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  if (payload.success === false) {
    throw new Error(payload.error || "Catalog API reported success=false");
  }
  if (Array.isArray(payload.products)) return payload.products;

  const products = [];
  const seen = new Set();
  const addProducts = (items, categoryName, subCategoryName) => {
    if (!Array.isArray(items)) return;
    for (const item of items) {
      if (!item || typeof item !== "object") continue;
      const title = item.title || item.name || item.productName;
      if (!title) continue;
      const product = {
        ...item,
        title,
        category: item.category || categoryName || "Other Products",
        subCategory: item.subCategory || item.subcategory || subCategoryName || categoryName || "Other Products",
      };
      const key = `${String(product.slug || title).toLowerCase()}|${String(title).toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      products.push(product);
    }
  };

  for (const category of Array.isArray(payload.categories) ? payload.categories : []) {
    const categoryName = category?.category || category?.name || category?.title || "Other Products";
    addProducts(category?.products, categoryName, categoryName);
    for (const subcategory of Array.isArray(category?.subcategories) ? category.subcategories : []) {
      const subName = subcategory?.subCategory || subcategory?.subcategory || subcategory?.name || subcategory?.title || "";
      addProducts(subcategory?.products, categoryName, subName);
      addProducts(subcategory?.items, categoryName, subName);
      addProducts(subcategory?.categoryProducts, categoryName, subName);
    }
    addProducts(category?.items, categoryName, categoryName);
    addProducts(category?.categoryProducts, categoryName, categoryName);
  }
  return products;
}

/** Normalize incoming site-data query parameters so that Firestore/path style
 * queries correctly map to the SuperAdmin VPS API requirements (which expects `type`).
 */
export function normalizeSiteDataParams(inputParams) {
  const params = inputParams instanceof URLSearchParams ? new URLSearchParams(inputParams) : new URLSearchParams(inputParams || {});
  const websiteId = params.get("websiteId") || WEBSITE_ID;
  params.set("websiteId", websiteId);

  const rawPath = params.get("path");
  const rawCollection = params.get("collection");
  const rawType = params.get("type");

  if (rawType) {
    params.delete("path");
    params.delete("collection");
    return params;
  }

  if (rawPath) {
    params.delete("path");
    const normalizedPath = rawPath.replace(/\\/g, "/");

    const pageMatch = normalizedPath.match(/(?:^|\/)pages\/([^/]+)$/);
    if (pageMatch) {
      params.set("type", pageMatch[1]);
      return params;
    }

    const districtMatch = normalizedPath.match(/(?:^|\/)districts\/([^/]+)$/);
    if (districtMatch) {
      params.set("type", "district");
      params.set("district", districtMatch[1]);
      return params;
    }

    if (/(?:^|\/)districts\/?$/.test(normalizedPath)) {
      params.set("type", "districts");
      return params;
    }

    params.set("type", "doc");
    params.set("path", normalizedPath);
    return params;
  }

  if (rawCollection) {
    params.delete("collection");
    const normalizedCol = rawCollection.replace(/\\/g, "/");

    if (/(?:^|\/)districts\/?$/.test(normalizedCol)) {
      params.set("type", "districts");
      return params;
    }

    const colName = normalizedCol.split("/").filter(Boolean).pop() || "all";
    params.set("type", colName);
    return params;
  }

  params.set("type", "all");
  return params;
}
