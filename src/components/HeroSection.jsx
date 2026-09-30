"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

import {
  db,
  doc,
  collection,
  getDoc,
  getDocs,
  addDoc,
  onSnapshot,
} from "@/lib/firestore-shim";

import CBG from "@/components/img/CBG.png";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Boxes,
  Video,
  Sparkles,
  Pause,
  Play,
} from "lucide-react";

export default function HeroSection({ city }) {
  const districtSlug = city ? city.toLowerCase().replace(/\s+/g, "-") : "";

  const makeLink = (path) =>
    districtSlug ? `/${districtSlug}${path}` : path;

  // Purely dynamic state loaded from Firestore
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mediaList, setMediaList] = useState([]);

  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState(1);

  // Parse media formats saved by SuperAdmin.
  const parseMediaFromData = (d) => {
    const list = [];
    const addMedia = (item, idx, defaultType = "image", prefix = "media") => {
      const url =
        typeof item === "string"
          ? item
          : item?.url || item?.src || item?.imageUrl || item?.videoUrl;
      if (typeof url !== "string" || !url.trim()) return;

      const detectedType =
        item?.type ||
        (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url.trim()) ? "video" : defaultType);

      list.push({
        id: item?.id || `${prefix}-${idx}`,
        type: detectedType === "video" ? "video" : "image",
        url: url.trim(),
        name: item?.name || item?.title || `Slide ${idx + 1}`,
      });
    };

    // SuperAdmin's primary format is media: [{ type, url, name }].
    if (Array.isArray(d?.media) && d.media.length > 0) {
      d.media.forEach((item, idx) => addMedia(item, idx, "image", "media"));
      if (list.length > 0) return list;
    }

    if (Array.isArray(d?.images)) {
      d.images.forEach((item, idx) => addMedia(item, idx, "image", "image"));
    }

    if (list.length === 0) {
      const singleImage = d?.imageUrl || d?.image;
      if (typeof singleImage === "string" && singleImage.trim()) {
        addMedia(singleImage, 0, "image", "image");
      }
    }

    if (Array.isArray(d?.videos)) {
      d.videos.forEach((item, idx) => addMedia(item, idx, "video", "video"));
    } else if (d?.videoUrl) {
      addMedia(d.videoUrl, 0, "video", "video");
    }

    return list;
  };

  // Load dynamic SuperAdmin home-page data and refresh it every 3 seconds.
  useEffect(() => {
    let active = true;
    let inFlight = false;

    const loadHomeData = async () => {
      if (!active || inFlight) return;
      inFlight = true;

      try {
        const ref = doc(db, "__website__", "pages", "home");
        const snap = await getDoc(ref);
        if (!active) return;

        if (!snap || !snap.exists()) {
          console.warn("[HeroSection] No home-page document found at:", ref.path);
          setData(null);
          setMediaList([
            {
              id: "default-slide",
              type: "image",
              url: CBG,
              isStatic: true,
              name: "Biomedical Showcase",
            },
          ]);
          return;
        }

        const raw = snap.data() || {};
        // Support both SuperAdmin's root-level fields and nested hero/home formats.
        const docData =
          raw.heroSection && typeof raw.heroSection === "object"
            ? { ...raw, ...raw.heroSection }
            : raw.hero && typeof raw.hero === "object"
              ? { ...raw, ...raw.hero }
              : raw;

        console.info("[HeroSection] Home data loaded:", {
          path: ref.path,
          fields: Object.keys(docData),
        });

        setData(docData);

        const parsedMedia = parseMediaFromData(docData);
        setMediaList(
          parsedMedia.length > 0
            ? parsedMedia
            : [
              {
                id: "default-slide",
                type: "image",
                url: CBG,
                isStatic: true,
                name: "Biomedical Showcase",
              },
            ]
        );
      } catch (err) {
        console.error("[HeroSection] Failed to load home data:", err);
        if (active) {
          setData(null);
          setMediaList([
            {
              id: "default-slide",
              type: "image",
              url: CBG,
              isStatic: true,
              name: "Biomedical Showcase",
            },
          ]);
        }
      } finally {
        inFlight = false;
        if (active) setLoading(false);
      }
    };

    loadHomeData();
    const timer = setInterval(loadHomeData, 3000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  // Carousel Autoplay Timer
  useEffect(() => {
    if (mediaList.length <= 1 || isHovered || !isPlaying) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % mediaList.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [mediaList.length, isHovered, isPlaying]);

  // Adjust active index if media count shrinks
  useEffect(() => {
    if (currentIndex >= mediaList.length && mediaList.length > 0) {
      setCurrentIndex(mediaList.length - 1);
    }
  }, [mediaList.length, currentIndex]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % mediaList.length);
  };

  // Dynamic values directly from Firestore
  const asText = (value) =>
    typeof value === "string" || typeof value === "number"
      ? String(value).trim()
      : "";

  const heroTitle = asText(data?.title ?? data?.heroTitle ?? data?.heading ?? data?.headline);
  const heroDesc = asText(data?.description ?? data?.heroDescription ?? data?.subtitle ?? data?.subheading);
  const btn1Label = asText(data?.button1Text ?? data?.btn1Text ?? data?.buttonText ?? data?.primaryButtonText);
  const btn2Label = asText(data?.button2Text ?? data?.btn2Text ?? data?.secondaryButtonText);

  const isMultiple = mediaList.length > 1;
  const currentMedia = mediaList[currentIndex] || mediaList[0];

  // Slide Animation Variants
  const slideVariants = {
    enter: (dir) => ({
      opacity: 0,
      scale: 1.05,
    }),
    center: {
      opacity: 1,
      scale: 1,
      transition: {
        opacity: { duration: 0.7, ease: "easeInOut" },
        scale: { duration: 0.7, ease: "easeInOut" },
      },
    },
    exit: (dir) => ({
      opacity: 0,
      scale: 0.98,
      transition: {
        opacity: { duration: 0.5, ease: "easeInOut" },
      },
    }),
  };

  return (
    <section className="py-4 sm:py-6 lg:py-8 bg-slate-50/80">
      <div className="container-custom">
        {/* Main Panoramic Hero Chassis */}
        <div
          className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-[0_25px_70px_rgba(15,23,42,0.22)] min-h-[540px] sm:min-h-[580px] lg:min-h-[560px] xl:min-h-[580px] flex items-center bg-slate-950 border border-slate-800/60"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* ================= BACKGROUND CAROUSEL MEDIA ================= */}
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            {currentMedia && (
              <motion.div
                key={currentMedia.id || currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 w-full h-full"
              >
                {currentMedia.type === "video" ? (
                  <video
                    src={currentMedia.url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover object-right lg:object-center"
                  />
                ) : currentMedia.isStatic ? (
                  <Image
                    src={currentMedia.url}
                    alt={currentMedia.name || "Biomedical Showcase"}
                    fill
                    priority
                    className="object-cover object-right lg:object-center"
                    sizes="100vw"
                  />
                ) : (
                  <img
                    src={currentMedia.url}
                    alt={currentMedia.name || `Slide ${currentIndex + 1}`}
                    className="w-full h-full object-cover object-right lg:object-center"
                    loading="eager"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://placehold.co/1900x700?text=Diagnostic+Equipment";
                    }}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ================= RICH DYNAMIC GRADIENT OVERLAYS ================= */}
          {/* Left-to-right solid protective backdrop mask to guarantee razor-sharp readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/92 sm:via-slate-950/85 to-transparent w-full lg:w-[68%] xl:w-[62%] z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40 z-10 pointer-events-none" />
          {/* Subtle cyan glow in the dark section */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none z-10" />

          {/* ================= FOREGROUND DYNAMIC CONTENT ================= */}
          <div className="relative z-20 w-full px-6 sm:px-10 lg:px-14 xl:px-16 py-12 sm:py-14 lg:py-16 max-w-3xl">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-8 bg-white/20 rounded-full w-48" />
                <div className="h-12 bg-white/20 rounded-2xl w-full" />
                <div className="h-20 bg-white/15 rounded-2xl w-3/4 mt-4" />
                <div className="flex gap-4 mt-6">
                  <div className="h-12 w-36 bg-white/20 rounded-full" />
                  <div className="h-12 w-36 bg-white/20 rounded-full" />
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col justify-center"
              >
                {/* Dynamic Category Pill Badge */}
                <div className="inline-flex items-center gap-2 bg-sky-500/15 backdrop-blur-md border border-sky-400/30 text-sky-300 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-5 shadow-sm w-fit">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                  <Boxes size={15} className="text-sky-300" />
                  <span>Biomedical & Diagnostic Catalogue</span>
                </div>

                {/* Dynamic Title */}
                {heroTitle && (
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[44px] font-extrabold text-white leading-[1.18] tracking-tight drop-shadow-md">
                    {heroTitle}
                    {city && (
                      <span className="block text-lg sm:text-2xl lg:text-3xl text-sky-300 font-bold mt-2.5">
                        Serving {city} & Nationwide
                      </span>
                    )}
                  </h1>
                )}

                {/* Dynamic Description */}
                {heroDesc && (
                  <p className="mt-4 sm:mt-5 text-slate-200/90 text-sm sm:text-base lg:text-[17px] leading-relaxed max-w-2xl font-normal drop-shadow-sm">
                    {heroDesc}
                  </p>
                )}

                {/* Action Buttons (Dynamic Text, Static Links) */}
                {(btn1Label || btn2Label) && (
                  <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 mt-8 sm:mt-9">
                    {btn1Label && (
                      <Link href={makeLink("/items")}>
                        <button className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-7 sm:px-8 py-3.5 rounded-full shadow-[0_10px_30px_rgba(14,165,233,0.35)] flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base">
                          <span>{btn1Label}</span>
                          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </button>
                      </Link>
                    )}

                    {btn2Label && (
                      <Link href={makeLink("/contact")}>
                        <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/25 hover:border-white/40 font-semibold px-6 sm:px-7 py-3.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base shadow-sm">
                          <span>{btn2Label}</span>
                        </button>
                      </Link>
                    )}
                  </div>
                )}

                {/* Quick Quality & Trust Highlights Strip */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-8 pt-6 border-t border-white/10 text-xs sm:text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>ISO & CE Certified Quality</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <span>Pan-India Supply & Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Direct OEM Warranty</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* ================= TOP RIGHT HUD BADGE (When multiple media) ================= */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-2 pointer-events-none">
            {currentMedia?.type === "video" ? (
              <span className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-red-300 px-3 py-1.5 rounded-full text-xs font-semibold border border-white/15 shadow-sm">
                <Video size={13} className="text-red-400" />
                <span>VIDEO</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-sky-200 px-3 py-1.5 rounded-full text-xs font-semibold border border-white/15 shadow-sm">
                <Sparkles size={13} className="text-sky-300" />
                <span>FEATURED</span>
              </span>
            )}

            {isMultiple && (
              <span className="bg-black/60 backdrop-blur-md text-white/90 px-3 py-1.5 rounded-full text-xs font-mono font-semibold border border-white/15 shadow-sm">
                {String(currentIndex + 1).padStart(2, "0")} / {String(mediaList.length).padStart(2, "0")}
              </span>
            )}
          </div>

          {/* ================= NAVIGATION ARROWS (When multiple media) ================= */}
          {isMultiple && (
            <>
              <button
                type="button"
                aria-label="Previous Slide"
                onClick={handlePrev}
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition hover:scale-105 active:scale-95 z-20 shadow-md"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                aria-label="Next Slide"
                onClick={handleNext}
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition hover:scale-105 active:scale-95 z-20 shadow-md"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          {/* ================= BOTTOM PAGINATION DOTS (When multiple media) ================= */}
          {isMultiple && (
            <div className="absolute bottom-4 sm:bottom-6 inset-x-0 flex items-center justify-center gap-2 z-20">
              {mediaList.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${currentIndex === idx
                    ? "w-8 bg-sky-400 shadow-md"
                    : "w-2 bg-white/40 hover:bg-white/70"
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
