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
