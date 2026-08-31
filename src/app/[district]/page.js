import Home from "@/app/page";

export default async function DistrictPage({ params }) {

  const { district = "jaipur" } = await params;

  const city = district
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return <div className="site2-static"><Home city={city} /></div>;
}