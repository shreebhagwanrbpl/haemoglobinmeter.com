import ProductsPage from "@/app/items/page";
import { fetchDistrictData } from "@/lib/data-fetcher";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { district } = await params;
  const districtData = await fetchDistrictData(district);
  if (!districtData) return {};

  const districtName = districtData.district;
  const stateName = districtData.state || "India";

  return {
    title: `Biomedical Equipment & Products in ${districtName} | Raj Biosis`,
    description: `Explore advanced biomedical & laboratory equipment products in ${districtName}, ${stateName}. Find CBC machines, hematology and biochemistry analyzers at best price.`,
    alternates: {
      canonical: `https://haemoglobinmeter.com/${district}/items`,
    },
  };
}

export default async function Page({ params }) {
  const { district } = await params;
  const districtData = await fetchDistrictData(district);
  if (!districtData) {
    notFound();
  }

  const city = districtData.district;

  return <ProductsPage district={district} city={city} />;
}