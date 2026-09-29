"use client";
import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";

export default function Testimonials() {
  const perspectives = [
    {
      title: "For Diagnostic Centres",
      text: "A practical catalogue for building mixed requirements across instruments, kits, reagents and routine consumables.",
    },
    {
      title: "For Hospital Teams",
      text: "Useful when several departments need different biomedical items and the purchase cannot be reduced to one equipment category.",
    },
    {
      title: "For Laboratories",
      text: "Specification-focused browsing makes it easier to shortlist products before sending a detailed requirement for quotation.",
    },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionTitle
          badge="Built Around Real Buying Tasks"
          title="Different Buyers, Different Requirements"
          description="The catalogue is designed to accommodate the varied product lists that healthcare and laboratory teams work with."
          center
        />
        <div className="grid lg:grid-cols-3 gap-8 mt-16">
          {perspectives.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-50 rounded-[32px] p-8 border border-slate-100 card-shadow"
            >
              <div className="text-sky-700 text-3xl mb-5">◆</div>
              <h3 className="text-2xl font-bold text-slate-900">{item.title}</h3>
              <p className="text-slate-600 leading-8 mt-4">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
