import Image from "next/image";
import PageBanner from "@/components/PageBanner";
import SectionTitle from "@/components/SectionTitle";
import DDS from "@/components/img/Dds.png";

export default function AboutPage({ city = "" }) {
  const place = city ? ` in ${city}` : "";

  return (
    <div className="site2-static">
      <PageBanner
        title={`About the Biomedical Catalogue${place}`}
        subtitle="A multi-category destination for laboratory, diagnostic and healthcare product requirements."
      />

      <section className="section-padding bg-white">
        <div className="container-custom grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="rounded-[40px] overflow-hidden bg-sky-50 border border-sky-100 h-[600px] flex items-center justify-center p-10 shadow-xl shadow-sky-100/40">
              <Image
                src={DDS}
                alt="Biomedical products and laboratory equipment"
                width={1200}
                height={900}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="absolute bottom-8 left-8 bg-white p-6 rounded-[26px] shadow-2xl border border-sky-100 hidden lg:block">
              <h3 className="text-3xl font-bold text-sky-700">Multi</h3>
              <p className="text-slate-500">Category Catalogue</p>
            </div>
          </div>

          <div>
            <SectionTitle
              badge="About the Catalogue"
              title="Built for Varied Biomedical Buying Lists"
              description="Raj Biosis brings different kinds of biomedical products into one searchable catalogue so buyers do not have to start with a single instrument or test."
            />
            <p className="mt-8 text-slate-600 leading-8">
              The range can include laboratory instruments, diagnostic systems,
              reagents, test kits, patient-monitoring devices, consumables and
              supporting accessories. The emphasis is on helping visitors find
              the item that fits a particular application or specification.
            </p>
            <p className="mt-5 text-slate-600 leading-8">
              Healthcare procurement is rarely identical from one organisation
              to another. A clinic may need a compact device, while a hospital
              or laboratory may be preparing a much longer list across several
              departments. The catalogue is structured to accommodate both.
            </p>
            <p className="mt-5 text-slate-600 leading-8">
              Visitors can use product names, categories, brands, models and
              technical details as starting points for discovery, then contact
              the team when they need clarification or a quotation discussion.
            </p>

            <div className="grid sm:grid-cols-2 gap-5 mt-10">
              <div className="bg-sky-50 p-6 rounded-2xl border border-sky-100">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-sky-700 font-bold text-xl mb-4">01</div>
                <h4 className="font-semibold text-lg text-slate-900">Broad Product Coverage</h4>
                <p className="text-slate-500 mt-2 leading-6">Different biomedical categories can be explored from the same catalogue.</p>
              </div>
              <div className="bg-sky-50 p-6 rounded-2xl border border-sky-100">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-sky-700 font-bold text-xl mb-4">02</div>
                <h4 className="font-semibold text-lg text-slate-900">Procurement-Friendly</h4>
                <p className="text-slate-500 mt-2 leading-6">Useful for individual product enquiries and larger mixed-item requirements.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-sky-50">
        <div className="container-custom">
          <SectionTitle
            badge="How It Is Organised"
            title="A Catalogue That Starts With Your Requirement"
            description="Instead of assuming what a buyer needs, the product journey can begin with the use case, category, brand, model or technical parameter."
            center
          />
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              {
                number: "01",
                title: "Discover",
                description: "Browse product families and narrow the catalogue to the type of biomedical item being considered.",
              },
              {
                number: "02",
                title: "Shortlist",
                description: "Use application and specification details to identify options that deserve closer review.",
              },
              {
                number: "03",
                title: "Enquire",
                description: "Send a product or multi-item requirement for availability, commercial and specification discussion.",
              },
            ].map((item) => (
              <div key={item.number} className="bg-white rounded-[30px] p-8 border border-sky-100 shadow-lg shadow-sky-100/40">
                <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-2xl font-bold mb-6">{item.number}</div>
                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="mt-4 text-slate-600 leading-7">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionTitle
            badge="What Matters to Buyers"
            title="Practical Information Before a Purchase"
            description="Good product selection depends on more than a product name. The catalogue approach keeps the surrounding details visible."
            center
          />
          <div className="grid lg:grid-cols-2 gap-8 mt-16">
            <div className="rounded-[32px] bg-slate-900 p-10 lg:p-12 text-white">
              <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">For Product Teams</span>
              <h3 className="text-3xl font-bold mt-6">Compare the details that affect fit</h3>
              <p className="mt-6 text-slate-300 leading-8">
                Capacity, sample type, testing method, output, dimensions,
                automation level and intended application can all influence
                which product makes sense for a particular workflow.
              </p>
            </div>
            <div className="rounded-[32px] bg-slate-50 border border-slate-200 p-10 lg:p-12">
              <span className="inline-flex rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">For Procurement Teams</span>
              <h3 className="text-3xl font-bold text-slate-900 mt-6">Build a requirement around the whole setup</h3>
              <p className="mt-6 text-slate-600 leading-8">
                A procurement request can contain instruments, consumables,
                reagents, kits and accessories together. The goal is to make
                the initial product discovery less fragmented.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
