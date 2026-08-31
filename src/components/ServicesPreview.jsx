"use client";
import { motion } from "framer-motion";
import { Microscope, FlaskConical, ShieldCheck, Stethoscope } from "lucide-react";
import SectionTitle from "./SectionTitle";
import ServiceCard from "./ServiceCard";

export default function ServicesPreview() {
  const services = [
    {
      icon: <Microscope size={30} />,
      title: "Biomedical Supplies",
      description: "Clinical-grade haemoglobinometers and automated cell counters.",
    },
    {
      icon: <FlaskConical size={30} />,
      title: "Lab Instrumentation",
      description: "Complete biochemistry and clinical chemistry analysis setups.",
    },
    {
      icon: <ShieldCheck size={30} />,
      title: "Calibration Service",
      description: "Certified calibration and maintenance for hematology equipment.",
    },
    {
      icon: <Stethoscope size={30} />,
      title: "Expert Consultation",
      description: "Tailored guidance on diagnostic equipment compliance and lab setup.",
    },
  ];

  return (
    <section className="section-padding bg-slate-50">
      <div className="container-custom">
        <SectionTitle
          badge="Haemoglobin & Diagnostic Services"
          title="Advanced Laboratory Instrumentation Services"
          description="Providing clinical equipment distribution, calibration support, and technical services for modern pathology laboratories."
          center
        />
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mt-16">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <ServiceCard
                icon={service.icon}
                title={service.title}
                description={service.description}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
