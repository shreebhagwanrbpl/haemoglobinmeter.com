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
    <section className="py-4 sm:py-6 lg:py-8 bg-slate-50/70">
      <div className="container-custom">
        {/* Main Panoramic Hero Chassis */}
        <div
          className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-[0_20px_60px_rgba(15,23,42,0.18)] min-h-[420px] sm:min-h-[460px] lg:h-[480px] flex items-center bg-slate-950"
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
                    className="w-full h-full object-cover object-center"
                  />
                ) : currentMedia.isStatic ? (
                  <Image
                    src={currentMedia.url}
                    alt={currentMedia.name || "Biomedical Showcase"}
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="100vw"
                  />
                ) : (
                  <img
                    src={currentMedia.url}
                    alt={currentMedia.name || `Slide ${currentIndex + 1}`}
                    className="w-full h-full object-cover object-center"
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
          {/* Left-to-right deep contrast gradient to make text razor-sharp */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-transparent w-full lg:w-3/4 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 z-10 pointer-events-none" />

          {/* ================= FOREGROUND DYNAMIC CONTENT ================= */}
          <div className="relative z-20 w-full px-6 sm:px-10 lg:px-16 py-10 lg:py-14 max-w-3xl">
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
              >
                {/* Dynamic Category Pill Badge */}
                <div className="inline-flex items-center gap-2 bg-sky-500/20 backdrop-blur-md border border-sky-400/30 text-sky-200 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-4 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  <Boxes size={15} className="text-sky-300" />
                  <span>Biomedical & Diagnostic Catalogue</span>
                </div>

                {/* Dynamic Title */}
                {heroTitle && (
                  <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-white leading-[1.18] tracking-tight drop-shadow-md">
                    {heroTitle}
                    {city && (
                      <span className="block text-xl sm:text-2xl lg:text-3xl text-sky-300 font-bold mt-2">
                        Serving {city}
                      </span>
                    )}
                  </h1>
                )}

                {/* Dynamic Description */}
                {heroDesc && (
                  <p className="mt-4 text-slate-200 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl font-normal drop-shadow-sm">
                    {heroDesc}
                  </p>
                )}

                {/* Action Buttons (Dynamic Text, Static Links) */}
                {(btn1Label || btn2Label) && (
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-7 sm:mt-8">
                    {btn1Label && (
                      <Link href={makeLink("/items")}>
                        <button className="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-6 sm:px-7 py-3.5 rounded-full shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 transition hover:scale-105 active:scale-95 text-sm sm:text-base">
                          <span>{btn1Label}</span>
                          <ArrowRight size={17} />
                        </button>
                      </Link>
                    )}

                    {btn2Label && (
                      <Link href={makeLink("/contact")}>
                        <button className="bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/30 font-semibold px-6 sm:px-7 py-3.5 rounded-full transition hover:scale-105 active:scale-95 text-sm sm:text-base">
                          <span>{btn2Label}</span>
                        </button>
                      </Link>
                    )}
                  </div>
                )}
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
