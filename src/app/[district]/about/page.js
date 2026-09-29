import AboutPage from "@/app/about/page";
import { fetchDistrictData } from "@/lib/data-fetcher-server";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { district } = await params;
  const districtData = await fetchDistrictData(district);
  if (!districtData) return {};

  const districtName = districtData.district;
  const stateName = districtData.state || "India";

  return {
    title: `About Our Biomedical Product Catalogue in ${districtName} | Raj Biosis`,
    description: `Explore Raj Biosis products and catalogue support in ${districtName}, ${stateName}, covering laboratory, diagnostic and other biomedical requirements.`,
    alternates: {
      canonical: `https://haemoglobinmeter.com/${district}/about`,
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

  return <div className="site2-static"><AboutPage city={city} /></div>;
}
