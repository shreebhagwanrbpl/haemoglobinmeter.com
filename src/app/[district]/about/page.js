import AboutPage from "@/app/about/page";
import { fetchDistrictData } from "@/lib/data-fetcher";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { district } = await params;
  const districtData = await fetchDistrictData(district);
  if (!districtData) return {};

  const districtName = districtData.district;
  const stateName = districtData.state || "India";

  return {
    title: `About Our Haemoglobin Diagnostics Practice in ${districtName} | Biomedical Equipment Partner`,
    description: `Learn about Raj Biosis in ${districtName}, ${stateName}. We deliver trusted diagnostic and medical laboratory technologies with precise support.`,
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