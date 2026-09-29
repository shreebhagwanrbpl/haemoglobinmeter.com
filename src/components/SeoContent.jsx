export default function SeoContent({ city = "" }) {
  const location = city || "India";

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <h2 className="text-4xl font-bold text-slate-900 mb-8">
          Biomedical Products, Laboratory Equipment and Diagnostic Supplies in {location}
        </h2>
        <div className="space-y-6 text-slate-600 leading-8 text-lg">
          <p>
            Raj Biosis presents a broad biomedical catalogue for organisations
            looking for laboratory instruments, diagnostic equipment, test
            systems, reagents, consumables, patient-monitoring products and
            related accessories in {location}.
          </p>
          <p>
            Product discovery can begin with the application, category, brand,
            model or specification. This makes the website useful for mixed
            procurement lists instead of limiting visitors to a single device
            or diagnostic parameter.
          </p>
          <p>
            Hospitals, diagnostic centres, pathology laboratories, clinics,
            research facilities and institutional purchasers can use the
            catalogue to identify products and prepare a focused enquiry.
            Availability, specifications and commercial terms can be discussed
            for the particular requirement.
          </p>
          <p>
            For larger projects, buyers can combine several product families
            into one requirement and request assistance with shortlisting,
            specifications and supply coordination.
          </p>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">
            Biomedical Catalogue FAQs
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-xl">Is the catalogue limited to one type of medical product?</h3>
              <p className="text-slate-600 mt-2">
                No. The catalogue covers multiple biomedical families, including laboratory equipment, diagnostic products, reagents, consumables, monitoring devices and accessories.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-xl">Can I search for a product by specification?</h3>
              <p className="text-slate-600 mt-2">
                Yes. Specifications, application, category, brand and model details can all be useful starting points when shortlisting an item.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-xl">Can one enquiry contain several different items?</h3>
              <p className="text-slate-600 mt-2">
                Yes. Institutional and laboratory requirements can include products from different categories, subject to the specific enquiry.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-xl">Who can use the catalogue?</h3>
              <p className="text-slate-600 mt-2">
                Hospitals, clinics, diagnostic centres, laboratories, research organisations and other healthcare procurement teams can use it for product discovery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
