import { fetchFullCatalog, fetchActiveDistricts } from "@/lib/data-fetcher-server";
import { WEBSITE_ID } from "@/lib/catalog-utils";
export const dynamic = "force-dynamic";
export default async function sitemap() {
  const base = "https://haemoglobinmeter.com";
  const products = await fetchFullCatalog();
  const districts = await fetchActiveDistricts();
  const now = new Date();
  return [
    { url: base, lastModified: now },
    { url: `${base}/about`, lastModified: now },
    { url: `${base}/services`, lastModified: now },
    { url: `${base}/items`, lastModified: now },
    { url: `${base}/contact`, lastModified: now },
    ...products.map((p) => ({ url: `${base}/items/${p.slug}`, lastModified: now })),
    ...districts.map((d) => ({ url: `${base}/${d.slug || d.id}/items`, lastModified: now })),
  ];
}
