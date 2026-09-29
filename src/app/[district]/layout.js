import { fetchDistrictData } from "@/lib/data-fetcher-server";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { district } = await params;
  if (!district) return {};

  const districtData = await fetchDistrictData(district);
  if (!districtData) {
    notFound();
  }

  const districtName = districtData.district || district
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const url = `https://haemoglobinmeter.com/${district}`;

  return {
    title: `Biomedical Products & Laboratory Supplies in ${districtName} | Raj Biosis`,

    description: `Explore biomedical products, laboratory supplies, diagnostic equipment, reagents and consumables for healthcare requirements in ${districtName}, ${districtData.state || "India"}.`,

    keywords: [
      `Biomedical Products ${districtName}`,
      `Laboratory Supplies ${districtName}`,
      `Diagnostic Products ${districtName}`,
      `Medical Consumables ${districtName}`,
      `Biomedical Catalogue ${districtName}`,
    ],

    robots: {
      index: true,
      follow: true,
    },

    alternates: {
      canonical: url,
    },

    openGraph: {
      title: `Biomedical Equipment in ${districtName}`,
      description: `Browse biomedical products and laboratory supplies for varied healthcare requirements in ${districtName}.`,
      url,
      type: "website",
    },
  };
}

export default async function DistrictLayout({ children, params }) {
  const { district } = await params;
  const districtData = await fetchDistrictData(district);
  if (!districtData) {
    notFound();
  }

  return children;
}
