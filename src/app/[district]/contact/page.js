import ContactPage from "@/app/contact/page";
import { fetchDistrictData } from "@/lib/data-fetcher";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { district } = await params;
  const districtData = await fetchDistrictData(district);
  if (!districtData) return {};

  const districtName = districtData.district;
  const stateName = districtData.state || "India";

  return {
    title: `Contact Raj Biosis in ${districtName} | Phone, Address & Enquiry`,
    description: `Talk to our haemoglobin diagnostics team in ${districtName}, ${stateName}. Find our local office address, phone numbers, and submit inquiries for biomedical laboratory products.`,
    alternates: {
      canonical: `https://haemoglobinmeter.com/${district}/contact`,
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

  return <div className="site2-static"><ContactPage city={city} /></div>;
}