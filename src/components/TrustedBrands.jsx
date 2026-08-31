export default function TrustedBrands() {
  const brands = [
    "Sysmex India",
    "Mindray Clinical",
    "Agappe Diagnostics",
    "Erba Mannheim",
    "Raj Biosis",
  ];

  return (
    <section className="py-16 bg-slate-50 border-y border-slate-100">
      <div className="container-custom">
        <p className="text-center text-slate-500 font-medium mb-10">
          Trusted by Leading Pathology Laboratories & Blood Banks
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 text-center font-semibold text-slate-700 card-shadow"
            >
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
