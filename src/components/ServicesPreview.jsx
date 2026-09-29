"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, FileText, Truck, Wrench, ListChecks, Settings2, MessageSquareText } from "lucide-react";
import { db, doc, onSnapshot } from "@/lib/firestore-shim";
import SectionTitle from "./SectionTitle";
import ServiceCard from "./ServiceCard";

const FALLBACK_SERVICES = [
  { title: "Catalogue Navigation", description: "Help locating suitable biomedical products by category, application or specification." },
  { title: "Requirement Review", description: "Organise item lists and compare the practical details that matter before an enquiry." },
  { title: "Supply Coordination", description: "Support for product enquiries involving individual items as well as larger institutional requirements." },
  { title: "Equipment Assistance", description: "Guidance around installation, operating requirements and service-related product needs where applicable." },
];

const ICONS = [Search, FileText, Truck, Wrench, ListChecks, Settings2, MessageSquareText];

function normalizeServices(data) {
  const raw = Array.isArray(data) ? data : Array.isArray(data?.services) ? data.services : [];
  return raw.map((item) => ({
    title: String(item?.title ?? item?.name ?? item?.serviceTitle ?? "").trim(),
    description: String(item?.desc ?? item?.description ?? item?.details ?? item?.serviceDescription ?? item?.serviceDesc ?? "").trim(),
  })).filter((item) => item.title && item.description);
}

export default function ServicesPreview() {
  const [services, setServices] = useState(FALLBACK_SERVICES);

  useEffect(() => {
    const ref = doc(db, "__website__", "pages", "services");
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (!snap?.exists?.()) return;
      const dynamicServices = normalizeServices(snap.data());
      if (dynamicServices.length) setServices(dynamicServices);
    });
    return unsubscribe;
  }, []);

  return (
    <section className="section-padding bg-slate-50">
      <div className="container-custom">
        <SectionTitle
          badge="How We Help"
          title="Support Around the Product, Not Just the Purchase"
          description="From finding an item to clarifying its specifications, the service model is designed for varied biomedical procurement needs."
          center
        />
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mt-16">
          {services.map((service, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <motion.div
                key={`${service.title}-${index}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ServiceCard icon={<Icon size={30} />} title={service.title} description={service.description} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
