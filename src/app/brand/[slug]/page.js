import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import ProductsClient from "@/app/items/ProductsClient";
import { notFound } from "next/navigation";

const makeSlug = (text = "") =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const allProducts = await fetchFullCatalog();

    // Find the clean brand name from the database
    const matchingProduct = allProducts.find(
        (p) => makeSlug(p.brand) === slug
    );

    if (!matchingProduct) {
        return {
            robots: {
                index: false,
                follow: false,
            }
        };
    }

    const brandName = matchingProduct.brand;
    const title = `${brandName} Laboratory & Diagnostic Equipment | Raj Biosis`;
    const description = `Explore diagnostic devices, analyzers and reagents from ${brandName} supplied by Raj Biosis. Get specifications, brochures, and quotes.`;
    const url = `https://haemoglobinmeter.com/brand/${slug}`;

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
    };
}

export default async function BrandPage({ params }) {
    const { slug } = await params;
    const allProducts = await fetchFullCatalog();

    const hasBrand = allProducts.some(
        (p) => makeSlug(p.brand) === slug
    );

    if (!hasBrand) {
        notFound();
    }

    return (
        <ProductsClient
            initialProducts={allProducts}
            filterBrand={slug}
        />
    );
}
