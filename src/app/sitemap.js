import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { fetchFullCatalog } from "@/lib/data-fetcher-server";

const makeSlug = (text = "") =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

export default async function sitemap() {
    const baseUrl = "https://haemoglobinmeter.com";
    const urls = [];

    // 1. Static Pages
    urls.push(
        { url: baseUrl, lastModified: new Date() },
        { url: `${baseUrl}/about`, lastModified: new Date() },
        { url: `${baseUrl}/services`, lastModified: new Date() },
        { url: `${baseUrl}/contact`, lastModified: new Date() },
        { url: `${baseUrl}/items`, lastModified: new Date() }
    );

    try {
        // 2. Fetch Products Catalog (Server Cache)
        const products = await fetchFullCatalog();

        // 3. Category & Brand URL sets
        const categorySet = new Set();
        const brandSet = new Set();

        products.forEach((product) => {
            if (product.category) categorySet.add(product.category);
            if (product.brand) brandSet.add(product.brand);
        });

        // Add Category URLs
        categorySet.forEach((category) => {
            urls.push({
                url: `${baseUrl}/category/${makeSlug(category)}`,
                lastModified: new Date(),
            });
        });

        // Add Brand URLs
        brandSet.forEach((brand) => {
            urls.push({
                url: `${baseUrl}/brand/${makeSlug(brand)}`,
                lastModified: new Date(),
            });
        });

        // Add Main Product URLs (Primary Canonical URLs)
        products.forEach((product) => {
            if (!product.slug) return;
            urls.push({
                url: `${baseUrl}/items/${product.slug}`,
                lastModified: new Date(),
            });
        });

        // 4. Fetch Districts
        const districtSnap = await getDocs(
            collection(db, "websites", "haemoglobinmetercom", "districts")
        );

        const districts = districtSnap.docs.map((doc) => doc.data());
        const majorDistricts = ["jaipur", "jodhpur", "udaipur", "kota", "ajmer", "bikaner", "alwar", "sikar"];

        districts.forEach((district) => {
            const dSlug = district.slug;
            if (!dSlug) return;

            // District Landing URL
            urls.push({
                url: `${baseUrl}/${dSlug}`,
                lastModified: new Date(),
            });

            // District Items List URL
            urls.push({
                url: `${baseUrl}/${dSlug}/items`,
                lastModified: new Date(),
            });

            // Index location-specific product detail pages only for major target districts to avoid sitemap bloat
            if (majorDistricts.includes(dSlug)) {
                products.forEach((product) => {
                    if (!product.slug) return;
                    urls.push({
                        url: `${baseUrl}/${dSlug}/items/${product.slug}`,
                        lastModified: new Date(),
                    });
                });
            }
        });

    } catch (error) {
        console.error("Sitemap Generation Error:", error);
    }

    return urls;
}
