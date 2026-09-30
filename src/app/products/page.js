import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import ProductsClient from "@/app/items/ProductsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function ProductsPage() {
  const allProducts = await fetchFullCatalog();
  return <ProductsClient initialProducts={allProducts} />;
}
