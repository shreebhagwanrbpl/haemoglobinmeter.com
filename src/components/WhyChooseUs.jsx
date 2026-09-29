"use client";
import { motion } from "framer-motion";
import { Boxes, SearchCheck, Layers3, Headset } from "lucide-react";
import SectionTitle from "./SectionTitle";

export default function WhyChooseUs() {
  const features = [
    {
      icon: <Boxes size={30} />,
      title: "A Wider Product Mix",
      description:
        "Find instruments, kits, reagents, consumables, monitoring devices and laboratory accessories across one catalogue.",
    },
    {
      icon: <SearchCheck size={30} />,
      title: "Specification-Led Selection",
      description:
        "Review products according to parameters, intended use, format, capacity and other practical requirements.",
    },
    {
      icon: <Layers3 size={30} />,
      title: "Useful for Different Setups",
      description:
        "The range is suited to hospitals, diagnostic centres, laboratories, clinics, research units and institutional buyers.",
    },
    {
      icon: <Headset size={30} />,
      title: "Enquiry Assistance",
      description:
        "Share a single item or a multi-product requirement and get help identifying the appropriate catalogue options.",
    },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionTitle
          badge="Why Use This Catalogue"
          title="One Place to Explore Biomedical Requirements"
          description="The catalogue is organised around the many products used in healthcare and laboratory environments, not around a single test or device."
          center
        />
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mt-16">
          {features.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-50 p-8 rounded-[28px] border border-slate-100 hover:-translate-y-2 transition-all duration-300 card-shadow"
            >
              <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-slate-900">{item.title}</h3>
              <p className="text-slate-600 leading-7">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
