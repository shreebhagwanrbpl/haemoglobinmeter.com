"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ClipboardList } from "lucide-react";

export default function CTASection({ city }) {
  const pathname = usePathname();
  const staticRoutes = ["about", "services", "products", "contact", "items", "enquiry"];
  const pathParts = pathname.split("/").filter(Boolean);
  const urlDistrict =
    pathParts.length > 0 && !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";
  const districtSlug =
    city ? city.toLowerCase().replace(/\s+/g, "-") : urlDistrict;

  const makeLink = (path) =>
    districtSlug ? `/${districtSlug}${path}` : path;

  return (
    <section className="section-padding bg-slate-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[42px] bg-gradient-to-r from-sky-700 to-cyan-600 p-10 lg:p-20 text-white"
        >
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-[100px]" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block bg-white/20 px-5 py-2 rounded-full text-sm font-semibold mb-5">
                Have a Product List?
              </span>
              <h2 className="text-4xl lg:text-6xl font-bold leading-tight">
                Turn Your Biomedical Requirement Into a Clear Enquiry
              </h2>
              <p className="mt-6 text-white/80 text-lg leading-8 max-w-xl">
                Send the items, specifications or product categories you need.
                We can help organise the requirement so the right catalogue
                options are easier to evaluate.
              </p>
            </div>
            <div className="flex lg:justify-end">
              <div className="bg-white text-slate-900 rounded-[32px] p-8 max-w-md w-full shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mb-6">
                  <ClipboardList size={30} />
                </div>
                <h3 className="text-2xl font-bold">Start a Requirement</h3>
                <p className="mt-3 text-slate-600 leading-7">
                  Contact the team for product details, specifications and
                  quotation-related discussion.
                </p>
                <Link href={makeLink("/contact")} className="block mt-8">
                  <button className="w-full bg-sky-700 text-white px-6 py-4 rounded-2xl font-semibold hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                    Send Requirement
                    <ArrowRight size={18} />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
