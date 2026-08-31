import { fetchDistrictData } from "@/lib/data-fetcher";
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
    title: `Biomedical & Diagnostic Equipment Supplier in ${districtName} | Raj Biosis`,

    description: `Raj Biosis supplies diagnostic machines, laboratory equipment, reagents and biomedical products in ${districtName}, ${districtData.state || "India"}.`,

    keywords: [
      `Biomedical Equipment ${districtName}`,
      `Diagnostic Machines ${districtName}`,
      `Laboratory Equipment ${districtName}`,
      `Pathology Equipment ${districtName}`,
      `Biomedical Supplier ${districtName}`,
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
      description: `Diagnostic laboratory equipment supplier in ${districtName}.`,
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
