import ProductDetails from "./ProductDetails";
import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
    const { slug } = await params;

    const allProducts = await fetchFullCatalog();
    const product = allProducts.find((p) => p.slug === slug);

    if (!product) {
        return {
            robots: {
                index: false,
                follow: false,
            }
        };
    }

    const productName = product.title;
    const title = `${productName} Supplier in India | Price, Dealer & Distributor | Raj Biosis`;
    const description = `Buy ${productName} at best price in India. Trusted supplier, dealer and distributor of ${productName} for hospitals, laboratories, diagnostic centers. Contact Raj Biosis for latest quotation.`;
    const url = `https://haemoglobinmeter.com/items/${slug}`;

    return {
        title,
        description,

        keywords: [
            productName,
            `${productName} Supplier`,
            `${productName} Dealer`,
            `${productName} Distributor`,
            `${productName} Price`,
            `${productName} Supplier in India`,
            "Biomedical Equipment",
            "Laboratory Equipment",
            "Diagnostic Equipment",
            "Hospital Equipment",
            "Raj Biosis",
        ],

        alternates: {
            canonical: url,
        },

        openGraph: {
            title,
            description,
            url,
            siteName: "Raj Biosis",
            type: "website",
            locale: "en_IN",
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
    const { slug } = await params;

    const allProducts = await fetchFullCatalog();
    const product = allProducts.find((p) => p.slug === slug);

    if (!product) {
        notFound();
    }

    return <ProductDetails slug={slug} initialProduct={product} />;
}