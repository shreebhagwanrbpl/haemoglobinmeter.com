"use client";
import { motion } from "framer-motion";
import { ListTree, SlidersHorizontal, FileSearch, Building2 } from "lucide-react";

export default function StatsSection() {
  const stats = [
    { icon: <ListTree size={34} />, number: "Many", label: "Product Families" },
    { icon: <SlidersHorizontal size={34} />, number: "Flexible", label: "Selection Criteria" },
    { icon: <FileSearch size={34} />, number: "Clear", label: "Specification Review" },
    { icon: <Building2 size={34} />, number: "Wide", label: "Healthcare Use Cases" },
  ];

  return (
    <section className="section-padding bg-slate-50">
      <div className="container-custom">
        <div className="bg-white rounded-[40px] p-10 lg:p-16 card-shadow border border-slate-100">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-10">
            {stats.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto rounded-[24px] bg-sky-100 text-sky-700 flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold text-slate-900">{item.number}</h3>
                <p className="mt-3 text-slate-500 text-lg">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
