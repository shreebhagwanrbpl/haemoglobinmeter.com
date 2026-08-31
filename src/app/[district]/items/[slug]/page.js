import ProductDetails from "../../../items/[slug]/ProductDetails";
import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import { fetchDistrictData } from "@/lib/data-fetcher";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
    const { slug, district } = await params;

    const allProducts = await fetchFullCatalog();
    const product = allProducts.find((p) => p.slug === slug);
    const districtData = await fetchDistrictData(district);

    if (!product || !districtData) {
        return {
            robots: {
                index: false,
                follow: false,
            }
        };
    }

    const productName = product.title;
    const districtName = districtData.district;
    const stateName = districtData.state || "India";

    const title = `${productName} Supplier in ${districtName} | Price, Specification & Quote`;
    const description = `Get best price quote and specs for ${productName} in ${districtName}, ${stateName}. Raj Biosis is a trusted medical equipment dealer & supplier in ${districtName}.`;

    const url = `https://haemoglobinmeter.com/${district}/items/${slug}`;

    return {
        title,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        metadataBase: new URL("https://haemoglobinmeter.com"),
    };
}

export default async function Page({ params }) {
    const { slug, district } = await params;

    const allProducts = await fetchFullCatalog();
    const product = allProducts.find((p) => p.slug === slug);
    const districtData = await fetchDistrictData(district);

    if (!product || !districtData) {
        notFound();
    }

    return (
        <ProductDetails
            slug={slug}
            district={district}
            initialProduct={product}
        />
    );
}