
export const WEBSITE_ID = "haemoglobinmetercom";

/**
 * Normalize website IDs without merging different spellings.
 *
 * haemoglobinmetercom !== hemoglobinmetercom
 */
export function normalizeWebsiteId(value = "") {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/[.\-\s]/g, "");
}

function getVisibilityObjects(item) {
  if (!item || typeof item !== "object") return [];
  return [
    item,
    item.data && typeof item.data === "object"
      ? item.data
      : null,
  ].filter(Boolean);
}

function getAssignmentList(object) {
  const fields = [
    "websiteIds",
    "websites",
    "assignedWebsites",
    "companyWebsites",
  ];

  for (const field of fields) {
    if (Object.prototype.hasOwnProperty.call(object, field)) {
      if (Array.isArray(object[field])) {
        return object[field];
      }

      // Do not treat a malformed assignment field as unrestricted.
      if (object[field] != null) {
        return [];
      }
    }
  }

  return null;
}

function websiteListIncludes(list, wanted) {
  if (!Array.isArray(list) || list.length === 0) {
    return false;
  }

  return list.some((item) => {
    const value =
      typeof item === "string"
        ? item
        : item?.websiteId || item?.id || item?.name || "";

    const normalized = normalizeWebsiteId(value);

    return normalized === "all" || normalized === wanted;
  });
}

/**
 * Determines whether a product/category is visible on a website.
 *
 * If both the outer document and nested data contain assignment lists,
 * both must allow the website. This prevents a stale duplicate list from
 * keeping a product visible after its assignment is removed.
 */
export function isVisibleForWebsite(
  item = {},
  websiteId = WEBSITE_ID
) {
  if (!item || typeof item !== "object") return false;

  const objects = getVisibilityObjects(item);
  const wanted = normalizeWebsiteId(websiteId);

  if (!wanted) return false;

  // Hide if either the outer document or nested data marks it unavailable.
  for (const object of objects) {
    if (object.isPublished === false) return false;
    if (object.visibility === false) return false;

    const status = String(object.status || "").toLowerCase();

    if (
      [
        "inactive",
        "draft",
        "deleted",
        "unassigned",
        "disabled",
      ].includes(status)
    ) {
      return false;
    }
  }

  // Check every explicitly configured assignment list.
  const lists = objects
    .map(getAssignmentList)
    .filter((list) => list !== null);

  if (lists.length > 0) {
    return lists.every((list) =>
      websiteListIncludes(list, wanted)
    );
  }

  // Also support records that use a single websiteId field.
  const singleIds = objects
    .filter(
      (object) =>
        typeof object.websiteId === "string" &&
        object.websiteId.trim() !== ""
    )
    .map((object) => normalizeWebsiteId(object.websiteId));

  if (singleIds.length > 0) {
    return singleIds.every(
      (id) => id === "all" || id === wanted
    );
  }

  // Preserve compatibility with legacy records without assignment fields.
  return true;
}

export function makeSlug(text = "") {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Normalize array and grouped catalog responses.
 * Filters categories, subcategories and products by website visibility.
 */
export function normalizeCatalogPayload(
  payload,
  websiteId = WEBSITE_ID
) {
  if (!payload || typeof payload !== "object") {
    return [];
  }

  if (payload.success === false) {
    throw new Error(
      payload.error || "Catalog API reported success=false"
    );
  }

  const products = [];
  const seen = new Set();

  const addProducts = (
    items,
    categoryName = "",
    subCategoryName = ""
  ) => {
    if (!Array.isArray(items)) return;

    for (const item of items) {
      if (!item || typeof item !== "object") continue;

      if (!isVisibleForWebsite(item, websiteId)) continue;

      const title =
        item.title ||
        item.name ||
        item.productName ||
        item.data?.title ||
        item.data?.name;

      if (!title) continue;

      const product = {
        ...item,
        title,
        category:
          item.category ||
          item.data?.category ||
          categoryName ||
          "Other Products",
        subCategory:
          item.subCategory ||
          item.subcategory ||
          item.data?.subCategory ||
          item.data?.subcategory ||
          subCategoryName ||
          categoryName ||
          "Other Products",
      };

      const key =
        `${String(product.slug || product.data?.slug || title).toLowerCase()}|` +
        `${String(title).toLowerCase()}`;

      if (seen.has(key)) continue;

      seen.add(key);
      products.push(product);
    }
  };

  if (Array.isArray(payload)) {
    addProducts(payload);
    return products;
  }

  if (Array.isArray(payload.products)) {
    addProducts(payload.products);
    return products;
  }

  for (const category of Array.isArray(payload.categories)
    ? payload.categories
    : []) {
    if (!isVisibleForWebsite(category, websiteId)) continue;

    const categoryName =
      category?.category ||
      category?.name ||
      category?.title ||
      "Other Products";

    addProducts(category?.products, categoryName, categoryName);

    for (const subcategory of Array.isArray(category?.subcategories)
      ? category.subcategories
      : []) {
      if (!isVisibleForWebsite(subcategory, websiteId)) continue;

      const subName =
        subcategory?.subCategory ||
        subcategory?.subcategory ||
        subcategory?.name ||
        subcategory?.title ||
        "";

      addProducts(subcategory?.products, categoryName, subName);
      addProducts(subcategory?.items, categoryName, subName);
      addProducts(
        subcategory?.categoryProducts,
        categoryName,
        subName
      );
    }

    addProducts(category?.items, categoryName, categoryName);
    addProducts(
      category?.categoryProducts,
      categoryName,
      categoryName
    );
  }

  return products;
}

/**
 * Normalize incoming site-data query parameters for the Admin API.
 */
export function normalizeSiteDataParams(inputParams) {
  const params =
    inputParams instanceof URLSearchParams
      ? new URLSearchParams(inputParams)
      : new URLSearchParams(inputParams || {});

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

    const pageMatch = normalizedPath.match(
      /(?:^|\/)pages\/([^/]+)$/
    );

    if (pageMatch) {
      params.set("type", pageMatch[1]);
      return params;
    }

    const districtMatch = normalizedPath.match(
      /(?:^|\/)districts\/([^/]+)$/
    );

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

    const colName =
      normalizedCol.split("/").filter(Boolean).pop() || "all";

    params.set("type", colName);
    return params;
  }

  params.set("type", "all");
  return params;
}
