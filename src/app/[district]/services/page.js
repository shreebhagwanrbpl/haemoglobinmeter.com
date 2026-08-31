import ServicesPage from "@/app/services/page";
import { fetchDistrictData } from "@/lib/data-fetcher";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { district } = await params;
  const districtData = await fetchDistrictData(district);
  if (!districtData) return {};

  const districtName = districtData.district;
  const stateName = districtData.state || "India";

  return {
    title: `Biomedical & Laboratory Services in ${districtName} | Raj Biosis`,
    description: `Professional medical laboratory and hospital equipment services in ${districtName}, ${stateName}. We provide product consultation, installation and AMC support.`,
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