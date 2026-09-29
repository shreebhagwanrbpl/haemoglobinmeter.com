"use client";

import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Headphones, MapPin } from "lucide-react";

export default function PageBanner({
  title,
  subtitle,
  badge = "Direct Assistance & Support",
}) {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-sky-200/40 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-200/30 rounded-full blur-[90px] pointer-events-none" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Top Pill Badge */}
          {badge && (
            <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-5 shadow-xs">
              <Sparkles size={14} className="text-sky-600" />
              <span>{badge}</span>
            </div>
          )}

          {/* Main Title - Dark text for perfect readability on light background */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.18] tracking-tight">
            {title}
          </h1>

          {/* Subtitle - Dark grey text */}
          {subtitle && (
            <p className="mt-5 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
              {subtitle}
            </p>
          )}

          {/* Trust Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-8 pt-8 border-t border-sky-200/60 text-xs sm:text-sm text-slate-700 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-sky-700" />
              <span>Certified Diagnostic Support</span>
            </div>
            <span className="hidden sm:inline text-slate-300">•</span>
            <div className="flex items-center gap-2">
              <Headphones size={16} className="text-sky-700" />
              <span>Direct Quotation Assistance</span>
            </div>
            <span className="hidden sm:inline text-slate-300">•</span>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-sky-700" />
              <span>Pan-India Supply</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
