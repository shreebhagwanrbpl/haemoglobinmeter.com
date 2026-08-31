"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const makeSlug = (text = "") =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

const ProductCard = React.memo(function ProductCard({
    product,
    district,
}) {
    const pathname = usePathname();

    // Use the passed district first.
    // If it is missing, get the district from the current URL.
    const pathParts =
        pathname?.split("/").filter(Boolean) || [];

    const staticRoutes = [
        "about",
        "services",
        "items",
        "contact",
    ];

    const currentDistrict =
        district ||
        (pathParts.length > 0 &&
            !staticRoutes.includes(pathParts[0])
            ? pathParts[0]
            : "");

    const productSlug =
        product.slug ||
        product.productSlug ||
        makeSlug(product.title);

    return (
        <div
            id={product.slug || productSlug}
            className="
                bg-white
                rounded-[30px]
                border border-slate-200
                shadow-lg
                hover:shadow-2xl
                transition-all
                duration-300
                p-8
            "
        >
            <div
                className="
                    grid
                    grid-cols-1
                    lg:grid-cols-[240px_1fr_180px]
                    gap-5
                    lg:gap-8
                    items-center
                "
            >

                {/* =====================================================
                    IMAGE
                ===================================================== */}

                <div
                    className="
                        relative
                        h-[180px]
                        sm:h-[220px]
                        rounded-2xl
                        lg:rounded-3xl
                        overflow-hidden
                        bg-slate-100
                    "
                >
                    <img
                        src={
                            product.images?.[0] ||
                            product.image ||
                            "/placeholder.svg"
                        }
                        alt={product.title}
                        loading="lazy"
                        decoding="async"
                        className="
                            w-full
                            h-full
                            object-contain
                            p-5
                        "
                        onError={(e) => {
                            e.currentTarget.src =
                                "/placeholder.svg";
                        }}
                    />
                </div>

                {/* =====================================================
                    CONTENT
                ===================================================== */}

                <div>

                    <h3 className="text-2xl font-bold text-slate-900">
                        {product.title}
                    </h3>

                    <p className="mt-4 text-slate-600 leading-8">
                        {product.description ||
                            product.desc ||
                            "Premium biomedical equipment designed for laboratories, hospitals and diagnostic centres."}
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 mt-6">

                        {/* Brand */}

                        <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-xs uppercase text-slate-400">
                                Brand
                            </p>

                            <p className="font-semibold mt-1 text-slate-900">
                                {product.brand || "N/A"}
                            </p>
                        </div>

                        {/* Model */}

                        <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-xs uppercase text-slate-400">
                                Model
                            </p>

                            <p className="font-semibold mt-1 text-slate-900">
                                {product.model || "N/A"}
                            </p>
                        </div>

                        {/* Instrument */}

                        <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-xs uppercase text-slate-400">
                                Instrument
                            </p>

                            <p className="font-semibold mt-1 text-slate-900">
                                {product.instrument || "N/A"}
                            </p>
                        </div>

                        {/* Category */}

                        <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-xs uppercase text-slate-400">
                                Category
                            </p>

                            <p className="font-semibold mt-1 text-slate-900">
                                {product.category || "N/A"}
                            </p>
                        </div>

                    </div>
                </div>

                {/* =====================================================
                    GET QUOTE BUTTON
                ===================================================== */}

                <div className="flex justify-center lg:justify-end">

                    <Link
                        href={
                            currentDistrict
                                ? `/${currentDistrict}/items/${productSlug}`
                                : `/items/${productSlug}`
                        }
                        className="
                            rounded-xl
                            bg-sky-700
                            px-7
                            py-3
                            font-semibold
                            !text-white
                            shadow-md
                            transition-all
                            duration-300
                            hover:bg-sky-800
                            hover:shadow-lg
                            hover:shadow-sky-200
                        "
                    >
                        Get Quote
                    </Link>

                </div>

            </div>
        </div>
    );
});

export default ProductCard;