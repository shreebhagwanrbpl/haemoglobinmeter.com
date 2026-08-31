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

    // Find the clean category name from the database
    const matchingProduct = allProducts.find(
        (p) => makeSlug(p.category) === slug
    );

    if (!matchingProduct) {
        return {
            robots: {
                index: false,
                follow: false,
            }
        };
    }

    const categoryName = matchingProduct.category;
    const title = `${categoryName} Supplier in India | Raj Biosis`;
    const description = `Explore advanced ${categoryName} products supplied by Raj Biosis. Find specifications, models, and pricing for diagnostic laboratory systems.`;
    const url = `https://haemoglobinmeter.com/category/${slug}`;

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

export default async function CategoryPage({ params }) {
    const { slug } = await params;
    const allProducts = await fetchFullCatalog();

    const hasCategory = allProducts.some(
        (p) => makeSlug(p.category) === slug
    );

    if (!hasCategory) {
        notFound();
    }

    return (
        <ProductsClient
            initialProducts={allProducts}
            filterCategory={slug}
        />
    );
}
