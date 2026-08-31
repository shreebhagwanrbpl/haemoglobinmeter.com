"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Microscope, HeartPulse, BadgeCheck } from "lucide-react";
import SectionTitle from "./SectionTitle";

export default function WhyChooseUs() {
  const features = [
    {
      icon: <Microscope size={30} />,
      title: "Innovative Diagnostics",
      description: "Advanced optical and electrochemical detection systems for precise hemoglobin profiling.",
    },
    {
      icon: <ShieldCheck size={30} />,
      title: "Clinical Standards",
      description: "Certified diagnostics systems designed to satisfy stringent healthcare quality protocols.",
    },
    {
      icon: <HeartPulse size={30} />,
      title: "Patient-First Focus",
      description: "Supporting clinics with rapid POC analysis systems to facilitate quick treatment decisions.",
    },
    {
      icon: <BadgeCheck size={30} />,
      title: "Reliable Support",
      description: "On-site calibration, technician training, and prompt troubleshooting support.",
    },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionTitle
          badge="Why Labs Select Our Hb Solutions"
          title="Premier Diagnostic Innovation"
          description="We deliver advanced hemoglobinometers and hematology systems, ensuring precision calibration and reliable support."
          center
        />
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mt-16">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
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
