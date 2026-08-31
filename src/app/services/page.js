"use client";
import { Microscope, FlaskConical, ShieldCheck, Stethoscope, Wrench, Activity, CheckCircle2, ArrowRight } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import ServiceCard from "@/components/ServiceCard";
import CTASection from "@/components/CTASection";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const icons = [
    <Microscope size={30} />,
    <FlaskConical size={30} />,
    <ShieldCheck size={30} />,
    <Stethoscope size={30} />,
    <Wrench size={30} />,
    <Activity size={30} />,
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const snap = await getDoc(doc(db, "websites", "haemoglobinmetercom", "pages", "services"));
        if (snap.exists()) {
          setServices(snap.data().services || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="site2-static">
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto text-center">
            <span className="inline-flex items-center rounded-full bg-sky-50 border border-sky-100 px-5 py-2 text-sm font-semibold text-sky-700">
              Haemoglobin & Diagnostic Services
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mt-5 leading-tight">
              Pathology Laboratory & Clinical Testing Setup Support
            </h2>
            <p className="mt-7 text-lg text-slate-600 leading-8">
              We assist clinical setups, testing centers, and medical units in executing high-precision hemoglobinometer calibrations and automated hematology installs. Our experts focus on ensuring compliance with diagnostic protocols.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-sky-50">
        <div className="container-custom">
          <SectionTitle
            badge="What We Offer"
            title="Biomedical Operations Support"
            description="From blood analyzer setup to medical calibration, we provide comprehensive laboratory technical services."
            center
          />
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mt-16">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-[30px] p-10 border border-sky-100 shadow-sm animate-pulse">
                    <div className="w-20 h-20 rounded-3xl bg-sky-100 mb-8" />
                    <div className="h-8 bg-slate-200 rounded mb-6" />
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-200 rounded" />
                      <div className="h-4 bg-slate-200 rounded w-11/12" />
                    </div>
                  </div>
                ))
              : services.length > 0
                ? services.map((service, index) => (
                    <ServiceCard
                      key={index}
                      icon={icons[index % icons.length]}
                      title={service.title}
                      description={service.desc}
                    />
                  ))
                : (
                  <div className="lg:col-span-3 text-center py-16">
                    <p className="text-slate-500">No services currently configured.</p>
                  </div>
                )}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex rounded-full bg-sky-50 border border-sky-100 px-5 py-2 text-sm font-semibold text-sky-700">
                Setup Protocol
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-5">
                Diagnostics Calibration Built for Confidence
              </h2>
              <p className="mt-6 text-slate-600 leading-8">
                Accurate hemoglobin testing demands micro-precision calibration and regular validation runs using control blood samples. We work alongside laboratory managers to define custom calibration schedules tailored to high testing volumes.
              </p>
            </div>
            <div className="bg-sky-50 rounded-[35px] p-8 lg:p-10 border border-sky-100">
              <h3 className="text-2xl font-bold text-slate-900">Technical Deliverables</h3>
              <div className="space-y-5 mt-8">
                {[
                  "On-site calibration checks against reference standards.",
                  "System diagnostic updates for cell counter firmware.",
                  "Detailed documentation for laboratory standard inspections.",
                  "Operator training for sample preparation and handling.",
                  "Technical support line for testing inquiries.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={22} className="text-sky-700 flex-shrink-0 mt-1" />
                    <p className="text-slate-600 leading-7">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-custom">
          <SectionTitle
            badge="Laboratory FAQs"
            title="Service Procedures & Setup FAQ"
            description="Have questions about diagnostic setups? Here are answers from our biomedical engineering team."
            center
          />
          <div className="max-w-4xl mx-auto mt-12 space-y-5">
            {[
              {
                q: "What does your calibration service involve?",
                a: "We calibrate optical sensors, fluidics, and mechanical components of hemoglobin meters and cell counters using standard control blood packs to ensure precise results.",
              },
              {
                q: "How often should clinical cell counters be serviced?",
                a: "We recommend professional calibration twice a year or after major test cycles to maintain compliance and avoid data drift.",
              },
              {
                q: "Do you supply spare parts for Mindray and Sysmex counters?",
                a: "Yes, we maintain an inventory of key replacement components, tubing, and optical arrays for leading diagnostics brands.",
              },
              {
                q: "Can you help set up a new pathology lab?",
                a: "Yes, we assist from layout planning to complete device selection, procurement, installation, and standard validation.",
              },
            ].map((item) => (
              <details key={item.q} className="group bg-white rounded-2xl border border-slate-200 p-6">
                <summary className="cursor-pointer list-none font-semibold text-lg text-slate-900 flex items-center justify-between gap-5">
                  <span>{item.q}</span>
                  <span className="text-sky-700 text-2xl group-open:rotate-45 transition-transform flex-shrink-0">+</span>
                </summary>
                <p className="text-slate-600 leading-7 mt-4 pr-8">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
