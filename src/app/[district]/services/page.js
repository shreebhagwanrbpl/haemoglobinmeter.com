import ServicesPage from "@/app/services/page";
import { fetchDistrictData } from "@/lib/data-fetcher-server";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { district } = await params;
  const districtData = await fetchDistrictData(district);
  if (!districtData) return {};

  const districtName = districtData.district;
  const stateName = districtData.state || "India";

  return {
    title: `Biomedical Product Support in ${districtName} | Raj Biosis`,
    description: `Product discovery and biomedical procurement assistance in ${districtName}, ${stateName}, for equipment, kits, reagents, consumables and related items.`,
    alternates: {
      canonical: `https://haemoglobinmeter.com/${district}/services`,
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

  return <div className="site2-static"><ServicesPage city={city} /></div>;
}
