"use client";
import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";

export default function Testimonials() {
  const reviews = [
    {
      name: "Dr. A. K. Sen",
      role: "Chief Pathologist",
      review: "The automated haemoglobin meters from Raj Biosis have dramatically enhanced our daily testing capacity.",
    },
    {
      name: "S. Mukherjee",
      role: "Clinic Director",
      review: "Excellent POC diagnostics supplier. Their technical support team was present on-site to handle setup and training.",
    },
    {
      name: "Dr. Priya Nair",
      role: "Hematology Head",
      review: "Highly accurate blood analyzers. The calibration services have kept our laboratory fully compliant.",
    },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionTitle
          badge="Testimonials"
          title="Lab Specialists Feedback"
          description="Hear from path labs, clinics, and hematology departments across India."
          center
        />
        <div className="grid lg:grid-cols-3 gap-8 mt-16">
          {reviews.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="bg-slate-50 rounded-[32px] p-8 border border-slate-100 card-shadow"
            >
              <div className="flex gap-1 text-yellow-400 text-xl mb-5">★★★★★</div>
              <p className="text-slate-600 leading-8 italic">"{item.review}"</p>
              <div className="mt-8">
                <h4 className="font-semibold text-lg">{item.name}</h4>
                <p className="text-slate-500">{item.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
