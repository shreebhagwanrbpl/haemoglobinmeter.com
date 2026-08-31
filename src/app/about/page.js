import Image from "next/image";
import PageBanner from "@/components/PageBanner";
import SectionTitle from "@/components/SectionTitle";
import DDS from "@/components/img/Dds.png";

export default function AboutPage() {
  return (
    <div className="site2-static">
      <PageBanner
        title="About Our Haemoglobin Diagnostics Practice"
        subtitle="Pioneering clinical diagnostic excellence with high-accuracy hemoglobinometers and hematology systems."
      />

      <section className="section-padding bg-white">
        <div className="container-custom grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="rounded-[40px] overflow-hidden bg-sky-50 border border-sky-100 h-[600px] flex items-center justify-center p-10 shadow-xl shadow-sky-100/40">
              <Image
                src={DDS}
                alt="Raj Biosis Clinical Diagnostic Systems"
                width={1200}
                height={900}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="absolute bottom-8 left-8 bg-white p-6 rounded-[26px] shadow-2xl border border-sky-100 hidden lg:block">
              <h3 className="text-3xl font-bold text-sky-700">10+</h3>
              <p className="text-slate-500">Years of Innovation</p>
            </div>
          </div>

          <div>
            <SectionTitle
              badge="Who We Are"
              title="Your Medical Diagnostics Partner"
              description="Raj Biosis specializes in the supply of clinical laboratory equipment, with a specific focus on haemoglobinometers, hematology cell counters, and point-of-care diagnostics."
            />
            <p className="mt-8 text-slate-600 leading-8">
              We deliver premium-quality diagnostic and blood testing solutions designed to support laboratory professionals and pathology clinics in making accurate diagnostic determinations.
            </p>
            <p className="mt-5 text-slate-600 leading-8">
              We recognize that medical testing centers demand consistent reliability, calibration accuracy, and thorough technical assistance. Our inventory is curated from global manufacturers of hematology instrumentation and biochemistry devices to fulfill these exact clinical standards.
            </p>
            <p className="mt-5 text-slate-600 leading-8">
              Our long-term commitment involves ongoing customer service, prompt equipment calibration, and ensuring diagnostic accessibility for pathology facilities of any scale across India.
            </p>
            <div className="grid sm:grid-cols-2 gap-5 mt-10">
              <div className="bg-sky-50 p-6 rounded-2xl border border-sky-100">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-sky-700 font-bold text-xl mb-4 shadow-sm">✓</div>
                <h4 className="font-semibold text-lg text-slate-900">Certified Equipment</h4>
                <p className="text-slate-500 mt-2 leading-6">Precision calibration systems compliant with diagnostic standards.</p>
              </div>
              <div className="bg-sky-50 p-6 rounded-2xl border border-sky-100">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-sky-700 font-bold text-xl mb-4 shadow-sm">✓</div>
                <h4 className="font-semibold text-lg text-slate-900">Calibration Services</h4>
                <p className="text-slate-500 mt-2 leading-6">Full on-site assistance, technician training, and device maintenance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-sky-50">
        <div className="container-custom">
          <SectionTitle
            badge="Our Approach"
            title="Engineered for Precision"
            description="Our service model revolves around the operational workflows of hematology laboratories and point-of-care testing rooms."
            center
          />
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white rounded-[30px] p-8 border border-sky-100 shadow-lg shadow-sky-100/40">
              <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-2xl font-bold mb-6">01</div>
              <h3 className="text-xl font-bold text-slate-900">Strict Quality Checks</h3>
              <p className="mt-4 text-slate-600 leading-7">We supply instrumentation that yields reproducible blood parameters and satisfies health regulatory systems.</p>
            </div>
            <div className="bg-white rounded-[30px] p-8 border border-sky-100 shadow-lg shadow-sky-100/40">
              <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-2xl font-bold mb-6">02</div>
              <h3 className="text-xl font-bold text-slate-900">Technological Integration</h3>
              <p className="mt-4 text-slate-600 leading-7">We integrate smart optical detection technologies and computerized semen and protein analyzers into local clinics.</p>
            </div>
            <div className="bg-white rounded-[30px] p-8 border border-sky-100 shadow-lg shadow-sky-100/40">
              <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-2xl font-bold mb-6">03</div>
              <h3 className="text-xl font-bold text-slate-900">Continuous Support</h3>
              <p className="mt-4 text-slate-600 leading-7">Our support extends beyond sales, covering validation runs, user troubleshooting, and replacement parts.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionTitle
            badge="Our Purpose"
            title="Mission & Vision"
            description="Empowering laboratories with reliable equipment for confident diagnosis."
            center
          />
          <div className="grid lg:grid-cols-2 gap-8 mt-16">
            <div className="relative overflow-hidden rounded-[32px] bg-sky-700 p-10 lg:p-12 text-white">
              <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-white/10" />
              <div className="relative">
                <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">Our Mission</span>
                <h3 className="text-3xl font-bold mt-6">Supporting Pathology Excellence</h3>
                <p className="mt-6 text-sky-50 leading-8">
                  To supply clinical medical teams with durable, highly-accurate hemoglobinometers and test components that streamline diagnostic procedures and minimize operational error.
                </p>
              </div>
            </div>
            <div className="rounded-[32px] bg-slate-50 border border-slate-200 p-10 lg:p-12">
              <span className="inline-flex rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">Our Vision</span>
              <h3 className="text-3xl font-bold text-slate-900 mt-6">Smarter Blood Diagnostics</h3>
              <p className="mt-6 text-slate-600 leading-8">
                To build an accessible healthcare diagnostics framework across India where medical centers are equipped with rapid point-of-care hemoglobin testing machines.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-custom">
          <SectionTitle
            badge="Why Raj Biosis"
            title="Our Calibration Advantage"
            description="We go beyond standard sales, delivering certified calibration support, post-setup training, and emergency parts supply."
            center
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {[
              { number: "01", title: "Lab Alignment", description: "All devices are aligned to target diagnostic standards prior to customer delivery." },
              { number: "02", title: "Scientific Advisory", description: "Our technical advisors help you pick the exact system configuration for your workload." },
              { number: "03", title: "Fast Implementation", description: "On-site installation is completed quickly to avoid lab workflow disruption." },
              { number: "04", title: "Ongoing Maintenance", description: "Robust AMC contracts to prevent machinery downtime and maintain testing accuracy." },
            ].map((item) => (
              <div key={item.number} className="bg-white rounded-[28px] p-7 border border-slate-200 shadow-sm hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-100/50 transition-all duration-300">
                <span className="text-sm font-bold text-sky-700">{item.number}</span>
                <h3 className="text-xl font-bold text-slate-900 mt-4">{item.title}</h3>
                <p className="mt-4 text-slate-600 leading-7">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
