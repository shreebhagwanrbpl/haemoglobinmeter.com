"use client";

import { useEffect, useState } from "react";
import { db, doc, onSnapshot } from "@/lib/firestore-shim";
import {
  Search,
  ListChecks,
  FileText,
  Truck,
  Settings2,
  MessageSquareText,
  CheckCircle2,
} from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import ServiceCard from "@/components/ServiceCard";
import CTASection from "@/components/CTASection";

export default function ServicesPage() {
  const fallbackServices = [
    {
      icon: <Search size={30} />,
      title: "Product Finding",
      description: "Help navigating the catalogue when you know the application or broad type of biomedical item but not the exact model.",
    },
    {
      icon: <ListChecks size={30} />,
      title: "Specification Shortlisting",
      description: "Review important parameters such as capacity, method, sample requirements, output and intended workflow.",
    },
    {
      icon: <FileText size={30} />,
      title: "Requirement Preparation",
      description: "Turn a long or mixed product list into a clearer enquiry with the relevant item and specification details.",
    },
    {
      icon: <Truck size={30} />,
      title: "Supply Enquiry Support",
      description: "Coordinate discussions around individual products or combined institutional requirements, subject to availability.",
    },
    {
      icon: <Settings2 size={30} />,
      title: "Equipment Guidance",
      description: "Where applicable, assist with questions about installation needs, operating considerations and related equipment items.",
    },
    {
      icon: <MessageSquareText size={30} />,
      title: "Pre-Purchase Discussion",
      description: "Clarify product information before a buyer moves from catalogue browsing to a commercial enquiry.",
    },
  ];

  const [services, setServices] = useState(fallbackServices);

  useEffect(() => {
    const ref = doc(db, "__website__", "pages", "services");
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (!snap || !snap.exists()) {
        setServices(fallbackServices);
        return;
      }
      const data = snap.data() || {};
      const rawServices = Array.isArray(data) ? data : Array.isArray(data.services) ? data.services : [];
      if (rawServices.length === 0) {
        setServices(fallbackServices);
        return;
      }
      const dynamicServices = rawServices
        .map((item, index) => {
          const Icon = [Search, ListChecks, FileText, Truck, Settings2, MessageSquareText][index % 6];
          return {
            icon: <Icon size={30} />,
            title: String(item?.title ?? item?.name ?? item?.serviceTitle ?? "").trim(),
            description: String(item?.desc ?? item?.description ?? item?.details ?? item?.serviceDescription ?? item?.serviceDesc ?? "").trim(),
          };
        })
        .filter((item) => item.title && item.description);

      setServices(dynamicServices.length > 0 ? dynamicServices : fallbackServices);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="site2-static">
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto text-center">
            <span className="inline-flex items-center rounded-full bg-sky-50 border border-sky-100 px-5 py-2 text-sm font-semibold text-sky-700">
              Biomedical Catalogue Support
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mt-5 leading-tight">
              Assistance for Product Discovery, Review and Enquiry
            </h2>
            <p className="mt-7 text-lg text-slate-600 leading-8">
              Our service approach is designed for different biomedical
              requirements. Whether you are looking for one item or preparing a
              multi-category list, the focus is on making the product-selection
              stage easier to navigate.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-sky-50">
        <div className="container-custom">
          <SectionTitle
            badge="Catalogue Assistance"
            title="Useful Support at Different Stages"
            description="Choose the kind of help that matches where you are in the buying process."
            center
          />
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mt-16">
            {services.map((service) => (
              <ServiceCard
                key={service.title}
                icon={service.icon}
                title={service.title}
                description={service.description}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex rounded-full bg-sky-50 border border-sky-100 px-5 py-2 text-sm font-semibold text-sky-700">
                A Simple Route
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-5">
                From Product Idea to a Better-Defined Requirement
              </h2>
              <p className="mt-6 text-slate-600 leading-8">
                Biomedical purchasing can involve technical terminology,
                different product formats and several items at once. A clear
                enquiry gives both sides a better starting point for discussing
                the exact product needed.
              </p>
            </div>
            <div className="bg-sky-50 rounded-[35px] p-8 lg:p-10 border border-sky-100">
              <h3 className="text-2xl font-bold text-slate-900">What to Include</h3>
              <div className="space-y-5 mt-8">
                {[
                  "Product category or intended application.",
                  "Preferred brand or model, if already known.",
                  "Important technical parameters or capacity.",
                  "Required quantity and whether the list contains multiple items.",
                  "Location and other procurement details relevant to the enquiry.",
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
            badge="Common Questions"
            title="Biomedical Product Enquiry FAQ"
            description="A few quick answers for visitors planning a product search or procurement request."
            center
          />
          <div className="max-w-4xl mx-auto mt-12 space-y-5">
            {[
              {
                q: "Can you help with products from more than one category?",
                a: "Yes. A requirement can include different biomedical product families. The enquiry can be shared as a combined list for discussion.",
              },
              {
                q: "I know the application but not the model. Can I still enquire?",
                a: "Yes. Share the intended use and the specifications you know. Those details can be used to narrow the relevant catalogue options.",
              },
              {
                q: "Can I ask about technical specifications before requesting a quotation?",
                a: "Yes. Product specifications and suitability questions can be discussed before moving to a commercial enquiry.",
              },
              {
                q: "Is support limited to laboratory instruments?",
                a: "No. The catalogue can include diagnostic products, kits, reagents, consumables, monitoring devices, accessories and other biomedical items.",
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
