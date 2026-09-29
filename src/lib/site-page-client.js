"use client";

import { WEBSITE_ID } from "@/lib/catalog-utils";

async function readPath(path) {
  try {
    const response = await fetch(`/api/site-data?path=${encodeURIComponent(path)}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    });
    if (!response.ok) return null;
    const result = await response.json();
    if (!result || typeof result !== "object" || Array.isArray(result) || result.error) return null;
    return Object.keys(result).length ? result : null;
  } catch (error) {
    console.warn(`[site-page-client] Could not read ${path}:`, error);
    return null;
  }
}

export async function fetchWebsitePage(pageName) {
  // Admin saves pages as websites/{websiteId}/pages/{pageName}.
  const exact = await readPath(`websites/${WEBSITE_ID}/pages/${pageName}`);
  if (exact) return exact;

  // Alias lookup also supports legacy/imported paths where the website ID differs in punctuation.
  return readPath(`__website__/pages/${pageName}`);
}
