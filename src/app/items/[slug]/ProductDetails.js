"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

import { usePathname } from "next/navigation";

import {
    FaPlay,
    FaShareAlt,
    FaWhatsapp,
    FaFacebook,
    FaInstagram,
    FaLink,
} from "react-icons/fa";

import {
    doc,
    getDoc,
    getDocs,
    addDoc,
    collection,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { fetchFullCatalog } from "@/lib/data-fetcher";
import { Download } from "lucide-react";
const makeSlug = (text = "") =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
export default function ProductDetails({ slug, district, initialProduct }) {
    const [product, setProduct] = useState(initialProduct || null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [selectedImage, setSelectedImage] = useState(
        initialProduct
            ? (initialProduct.images?.length > 0 ? initialProduct.images[0] : initialProduct.image || "")
            : ""
    );
    const [selectedMedia, setSelectedMedia] = useState("image");
    const [showShare, setShowShare] = useState(false);

    const shareRef = useRef();
    const brochureRef = useRef();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const [submitting, setSubmitting] =
        useState(false);
    const [downloading, setDownloading] = useState(false);
    const [brochureImage, setBrochureImage] = useState("");
    const [contactData, setContactData] = useState({
        phone: "+91 9983123469\n+91 9983333489",
        email: "rajbiosis@yahoo.in",
        address: "F-4, 1st Floor, Plot No. 16, D-Block Tagor Nagar, on Ajmer-Delhi, 200 Feet Bypass Rd, Jaipur, Rajasthan 302021"
    });

    const pathname = usePathname();

    const pathParts = pathname
        .split("/")
        .filter(Boolean);

    const city =
        pathParts.length > 1 && !["about", "services", "items", "contact"].includes(pathParts[0])
            ? pathParts[0]
            : "India";

    const cityName =
        city.charAt(0).toUpperCase() +
        city.slice(1);

    useEffect(() => {
        const loadProduct = async () => {
            if (product) return; // Skip client-side load if already server-rendered
            try {
                const allProducts = await fetchFullCatalog();
                const found = allProducts.find(
                    (p) => p.slug === slug
                );
                setProduct(found || null);

                if (found) {
                    if (found.images?.length > 0) {
                        setSelectedImage(found.images[0]);
                    } else {
                        setSelectedImage(found.image || "");
                    }
                    setSelectedMedia("image");
                }
            } catch (error) {
                console.error("Error loading product catalog:", error);
            }
        };

        const loadContact = async () => {
            try {
                const snap = await getDoc(
                    doc(db, "websites", "haemoglobinmetercom", "pages", "contact")
                );
                if (snap.exists()) {
                    const info = snap.data().contactInfo || [];
                    const phoneVal = info.find(x => x.label === "Phone Number")?.value || "";
                    const emailVal = info.find(x => x.label === "Email Address")?.value || "";
                    const addressVal = info.find(x => x.label === "Office Address")?.value || "";
                    setContactData({
                        phone: phoneVal || "+91 9983123469\n+91 9983333489",
                        email: emailVal || "rajbiosis@yahoo.in",
                        address: addressVal || "F-4, 1st Floor, Plot No. 16, D-Block Tagor Nagar, on Ajmer-Delhi, 200 Feet Bypass Rd, Jaipur, Rajasthan 302021"
                    });
                }
            } catch (err) {
                console.error("Error loading contact details:", err);
            }
        };

        loadProduct();
        loadContact();
    }, [slug, product]);


    const handleDownloadBrochure = async () => {
        if (downloading || !product) return;
        setDownloading(true);
        const toastId = toast.loading("Generating brochure PDF...");

        try {
            const html2canvas = (await import("html2canvas")).default;
            const { jsPDF } = await import("jspdf");

            // Convert image to same-origin Base64 to bypass CORS and load instant
            let base64Img = "";
            const imageUrl = selectedImage || product.image;
            if (imageUrl) {
                try {
                    // Use Next.js image optimizer endpoint to proxy and bypass CORS
                    const proxyUrl = `/_next/image?url=${encodeURIComponent(imageUrl)}&w=640&q=75`;
                    const res = await fetch(proxyUrl);
                    if (res.ok) {
                        const blob = await res.blob();
                        base64Img = await new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result);
                            reader.readAsDataURL(blob);
                        });
                    }
                } catch (imgErr) {
                    console.error("Error proxying image for brochure:", imgErr);
                }
            }

            // Fallback to original URL if proxying failed
            setBrochureImage(base64Img || imageUrl || "/placeholder.svg");

            const input = brochureRef.current;
            if (!input) throw new Error("Brochure template not found");

            // Make it temporarily visible offscreen
            input.style.display = "block";
            input.style.position = "absolute";
            input.style.left = "-9999px";
            input.style.top = "0px";

            // Wait a tiny bit for the base64 image render inside the template (no network load needed!)
            await new Promise(resolve => setTimeout(resolve, 200));

            const canvas = await html2canvas(input, {
                useCORS: true,
                allowTaint: true,
                scale: 2,
                logging: false,
                backgroundColor: "#ffffff"
            });

            // Hide the template again
            input.style.display = "none";

            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4"
            });

            const imgWidth = 210;
            const pageHeight = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const height = Math.min(imgHeight, pageHeight);

            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, height, undefined, 'FAST');
            pdf.save(`Raj_Biosis_${product.title.replace(/\s+/g, "_")}_Brochure.pdf`);

            toast.success("Brochure downloaded successfully!", { id: toastId });
        } catch (error) {
            console.error("Error generating PDF brochure:", error);
            toast.error("Failed to generate PDF. Please try again.", { id: toastId });
        } finally {
            setDownloading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const phoneRegex = /^[6-9]\d{9}$/;
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!form.name.trim()) {
            return toast.error(
                "Name is required"
            );
        }

        if (!emailRegex.test(form.email)) {
            return toast.error(
                "Enter valid email"
            );
        }

        if (!phoneRegex.test(form.phone)) {
            return toast.error(
                "Enter valid mobile number"
            );
        }

        try {
            setSubmitting(true);

            await addDoc(
                collection(
                    db,
                    "websitesQueries",
                    "haemoglobinmetercom",
                    "productQueries"
                ),
                {
                    ...form,
                    productName: product.title,
                    productSlug: product.slug,
                    brand: product.brand || "",
                    model: product.model || "",
                    createdAt: new Date(),
                }
            );

            toast.success(
                "Your enquiry has been submitted successfully."
            );

            setForm({
                name: "",
                email: "",
                phone: "",
            });
        } catch (error) {
            console.error(error);
            toast.error(
                "Something went wrong"
            );
        } finally {
            setSubmitting(false);
        }
    };
    const productSchema = product
        ? {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            image: product.image ? [product.image] : [],
            description:
                product.desc ||
                product.description ||
                product.title,
            brand: {
                "@type": "Brand",
                name: product.brand || "Raj Biosis",
            },
        }
        : null;

    const faqSchema = product
        ? {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
                {
                    "@type": "Question",
                    name: `What is ${product.title} used for?`,
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: `${product.title} is used in hospitals, pathology labs and diagnostic centres.`,
                    },
                },
                {
                    "@type": "Question",
                    name: "Do you provide installation support?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "Yes, installation and technical support are available.",
                    },
                },
            ],
        }
        : null;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link Copied");
        setShowShare(false);
    };

    const handleWhatsapp = () => {
        const shareText = `🔬 ${product?.title}

${product?.desc}

🌐 ${window.location.href}`;

        window.open(
            `https://wa.me/?text=${encodeURIComponent(shareText)}`,
            "_blank"
        );
    };

    const handleFacebook = () => {
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                window.location.href
            )}`,
            "_blank"
        );
    };

    const handleInstagram = async () => {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Instagram direct sharing available nahi hai. Link copied.");
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: product.title,
                text: product.desc,
                url: window.location.href,
            });
        } else {
            setShowShare(!showShare);
        }
    };

    useEffect(() => {
        const close = (e) => {
            if (
                shareRef.current &&
                !shareRef.current.contains(e.target)
            ) {
                setShowShare(false);
            }
        };

        document.addEventListener("mousedown", close);

        return () =>
            document.removeEventListener("mousedown", close);
    }, []);

    if (!product) {
        return (
            <section className="py-10 md:py-20 bg-slate-50">
                <div className="container-custom">

                    <div className="grid lg:grid-cols-2 gap-12">

                        <div className="h-[420px] md:h-[520px] rounded-[36px] bg-slate-200 animate-pulse" />

                        <div>
                            <div className="h-12 w-3/4 bg-slate-200 rounded-xl animate-pulse mb-8" />

                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-6 bg-slate-200 rounded-lg animate-pulse mb-4"
                                />
                            ))}
                        </div>

                    </div>

                    <div className="mt-16 grid lg:grid-cols-[600px_1fr] gap-8">

                        <div className="bg-white rounded-[24px] md:rounded-[32px] p-5 sm:p-6 md:p-8 shadow-sm">
                            <div className="h-10 w-48 bg-slate-200 rounded-lg animate-pulse mb-6" />

                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-14 bg-slate-200 rounded-2xl animate-pulse mb-4"
                                />
                            ))}
                        </div>

                        <div className="bg-white rounded-[24px] md:rounded-[32px] p-5 sm:p-6 md:p-8 shadow-sm">
                            <div className="h-10 w-60 bg-slate-200 rounded-lg animate-pulse mb-6" />

                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-5 bg-slate-200 rounded animate-pulse mb-4"
                                />
                            ))}
                        </div>

                    </div>

                </div>
            </section>
        );
    }
    return (
        <section className="py-10 md:py-20 bg-slate-50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(productSchema),
                }}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(faqSchema),
                }}
            />
            <div className="container-custom">
                <div className="mb-6 text-sm text-slate-500">
                    Home / Products / {product.title}
                </div>
                {/* Top Section */}

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Product Image */}

                    <div>

                        <div className="
  relative 
  h-[340px] 
  sm:h-[420px] 
  md:h-[500px] 
  lg:h-[580px]
  rounded-[24px]
  md:rounded-[36px]
  overflow-hidden
  bg-white
  border border-[#E8C8D0]
  shadow-[0_25px_80px_rgba(123,30,58,0.12)]
">


                            {selectedMedia === "video" && product.video ? (


                                <video
                                    controls
                                    autoPlay
                                    className="w-full h-full object-contain p-6"
                                >

                                    <source
                                        src={product.video}
                                        type="video/mp4"
                                    />

                                </video>


                            ) : (


                                <>


                                    {!imageLoaded && (
                                        <div className="absolute inset-0 bg-[#F3E5E8] animate-pulse" />
                                    )}



                                    <Image
                                        src={selectedImage || product.image}
                                        alt={product.title}
                                        fill
                                        priority
                                        onLoad={() => setImageLoaded(true)}
                                        className={`
          object-contain 
          p-4 
          transition 
          duration-500
          ${imageLoaded
                                                ? "opacity-100"
                                                : "opacity-0"
                                            }
        `}
                                    />


                                </>


                            )}


                        </div>

                        <div className="flex flex-wrap gap-3 mt-5">


                            {(product.images?.length
                                ? product.images
                                : [product.image]
                            ).map((img, index) => (


                                <button
                                    key={index}
                                    onClick={() => {
                                        setSelectedImage(img);
                                        setSelectedMedia("image");
                                    }}
                                    className={`
        w-20 
        h-20 
        rounded-xl 
        overflow-hidden 
        border-2
        transition-all
        duration-300

        ${selectedMedia === "image" &&
                                            selectedImage === img
                                            ? "border-[#7B1E3A] shadow-[0_5px_15px_rgba(123,30,58,0.25)]"
                                            : "border-[#E8C8D0] hover:border-[#7B1E3A]"
                                        }
      `}
                                >


                                    <Image
                                        src={img}
                                        alt=""
                                        width={80}
                                        height={80}
                                        className="w-full h-full object-cover"
                                    />


                                </button>


                            ))}





                            {/* Video */}
                            {product.video && (


                                <button
                                    onClick={() =>
                                        setSelectedMedia("video")
                                    }
                                    className={`
        w-20 
        h-20 
        rounded-xl 
        border-2 
        flex 
        flex-col 
        items-center 
        justify-center
        transition-all

        ${selectedMedia === "video"
                                            ? "border-[#7B1E3A] bg-[#FFF5F7] text-[#7B1E3A]"
                                            : "border-[#E8C8D0] hover:bg-[#FFF5F7]"
                                        }
      `}
                                >


                                    <FaPlay size={20} />


                                    <span className="text-xs mt-1">
                                        Video
                                    </span>


                                </button>


                            )}





                            {/* PDF */}
                            {product.pdf && (


                                <a
                                    href={product.pdf}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
        w-20 
        h-20 
        rounded-xl 
        border 
        border-[#E8C8D0]
        flex 
        flex-col 
        items-center 
        justify-center
        text-[#7B1E3A]
        hover:bg-[#FFF5F7]
        transition-all
      "
                                >

                                    📄

                                    <span className="text-xs text-[#6B4A54]">
                                        PDF
                                    </span>


                                </a>


                            )}


                        </div>

                    </div>

                    {/* Product Details */}

                    <div>

                        <div className="flex justify-between items-start gap-4 relative">


                            {/* Product Title */}
                            <h1 className="
    text-2xl 
    sm:text-3xl 
    md:text-4xl 
    lg:text-5xl 
    font-bold 
    leading-tight 
    text-[#2D1B21]
  ">
                                {product.title}
                            </h1>




                            {/* Share */}
                            <div
                                ref={shareRef}
                                className="relative"
                            >


                                <button
                                    onClick={handleNativeShare}
                                    className="
        w-12 
        h-12 
        rounded-full 
        border 
        border-[#E8C8D0]
        bg-white 
        text-[#7B1E3A]
        shadow-md
        flex 
        items-center 
        justify-center 
        hover:bg-[#FFF5F7]
        hover:scale-105
        transition-all
      "
                                >

                                    <FaShareAlt size={18} />

                                </button>




                                {showShare && (


                                    <div className="
        absolute 
        right-0 
        top-14 
        w-56 
        bg-white 
        rounded-xl 
        shadow-[0_20px_50px_rgba(123,30,58,0.15)]
        border 
        border-[#E8C8D0]
        p-2 
        z-50
      ">


                                        {/* Copy Link */}
                                        <button
                                            onClick={handleCopy}
                                            className="
            w-full 
            text-left 
            px-3 
            py-2 
            rounded
            flex 
            items-center 
            gap-2
            text-[#6B4A54]
            hover:bg-[#FFF5F7]
            hover:text-[#7B1E3A]
            transition
          "
                                        >

                                            <FaLink />
                                            Copy Link

                                        </button>





                                        {/* WhatsApp */}
                                        <button
                                            onClick={handleWhatsapp}
                                            className="
            w-full 
            text-left 
            px-3 
            py-2 
            rounded
            flex 
            items-center 
            gap-2
            text-[#6B4A54]
            hover:bg-[#FFF5F7]
            hover:text-[#7B1E3A]
            transition
          "
                                        >

                                            <FaWhatsapp className="text-green-600" />
                                            WhatsApp

                                        </button>





                                        {/* Facebook */}
                                        <button
                                            onClick={handleFacebook}
                                            className="
            w-full 
            text-left 
            px-3 
            py-2 
            rounded
            flex 
            items-center 
            gap-2
            text-[#6B4A54]
            hover:bg-[#FFF5F7]
            hover:text-[#7B1E3A]
            transition
          "
                                        >

                                            <FaFacebook className="text-blue-600" />
                                            Facebook

                                        </button>





                                        {/* Instagram */}
                                        <button
                                            onClick={handleInstagram}
                                            className="
            w-full 
            text-left 
            px-3 
            py-2 
            rounded
            flex 
            items-center 
            gap-2
            text-[#6B4A54]
            hover:bg-[#FFF5F7]
            hover:text-[#7B1E3A]
            transition
          "
                                        >

                                            <FaInstagram className="text-pink-600" />
                                            Instagram

                                        </button>


                                    </div>


                                )}


                            </div>


                        </div>

                        <div className="
  mt-6 
  md:mt-8 
  bg-white 
  p-5 
  sm:p-6 
  md:p-8 
  rounded-[24px] 
  md:rounded-[30px]
  border border-[#E8C8D0]
  shadow-[0_20px_60px_rgba(123,30,58,0.10)]
  space-y-4
">


                            <p className="text-[#6B4A54]">
                                <b className="text-[#2D1B21]">
                                    Brand:
                                </b>{" "}
                                {product.brand || "N/A"}
                            </p>


                            <p className="text-[#6B4A54]">
                                <b className="text-[#2D1B21]">
                                    Model:
                                </b>{" "}
                                {product.model || "N/A"}
                            </p>


                            <p className="text-[#6B4A54]">
                                <b className="text-[#2D1B21]">
                                    Instrument:
                                </b>{" "}
                                {product.instrument || "N/A"}
                            </p>


                            <p className="text-[#6B4A54]">
                                <b className="text-[#2D1B21]">
                                    Capacity:
                                </b>{" "}
                                {product.capacity || "N/A"}
                            </p>


                            <p className="text-[#6B4A54]">
                                <b className="text-[#2D1B21]">
                                    Throughput:
                                </b>{" "}
                                {product.throughput || "N/A"}
                            </p>


                            <p className="text-[#6B4A54]">
                                <b className="text-[#2D1B21]">
                                    Usage:
                                </b>{" "}
                                {product.usage || "N/A"}
                            </p>


                            <p className="text-[#6B4A54]">
                                <b className="text-[#2D1B21]">
                                    Automation:
                                </b>{" "}
                                {product.automation || "N/A"}
                            </p>


                            <p className="text-[#6B4A54]">
                                <b className="text-[#2D1B21]">
                                    Availability:
                                </b>{" "}
                                {product.availability || "N/A"}
                            </p>


                        </div>

                    </div>

                </div>

                {/* Description + Form */}

                <div className="mt-16">
                    <div className="grid grid-cols-1 lg:grid-cols-[500px_1fr] xl:grid-cols-[600px_1fr] gap-6 md:gap-8">

                        {/* Quote Form */}

                        <div className="
  bg-white 
  rounded-[24px] 
  md:rounded-[32px]
  p-5 
  sm:p-6 
  md:p-8
  border border-[#E8C8D0]
  shadow-[0_20px_60px_rgba(123,30,58,0.10)]
  h-fit 
  lg:sticky 
  lg:top-24
">


                            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-[#2D1B21]">
                                Request A Quote
                            </h2>



                            <p className="text-[#6B4A54] mb-8">

                                Product:

                                <span className="font-semibold ml-2 text-[#7B1E3A]">
                                    {product.title}
                                </span>

                            </p>




                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >



                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            name: e.target.value,
                                        })
                                    }
                                    className="
        w-full
        bg-[#FFF8F9]
        border border-[#E8C8D0]
        rounded-xl
        md:rounded-2xl
        px-4
        md:px-5
        py-3
        md:py-4
        text-[#2D1B21]
        placeholder:text-[#9A7B84]
        outline-none
        focus:border-[#7B1E3A]
        focus:ring-2
        focus:ring-[#7B1E3A]/20
        transition
      "
                                />





                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            email: e.target.value,
                                        })
                                    }
                                    className="
        w-full
        bg-[#FFF8F9]
        border border-[#E8C8D0]
        rounded-xl
        md:rounded-2xl
        px-4
        md:px-5
        py-3
        md:py-4
        text-[#2D1B21]
        placeholder:text-[#9A7B84]
        outline-none
        focus:border-[#7B1E3A]
        focus:ring-2
        focus:ring-[#7B1E3A]/20
        transition
      "
                                />





                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    maxLength={10}
                                    value={form.phone}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            phone:
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                ),
                                        })
                                    }
                                    className="
        w-full
        bg-[#FFF8F9]
        border border-[#E8C8D0]
        rounded-2xl
        px-5
        py-4
        text-[#2D1B21]
        placeholder:text-[#9A7B84]
        outline-none
        focus:border-[#7B1E3A]
        focus:ring-2
        focus:ring-[#7B1E3A]/20
        transition
      "
                                />





                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="
        w-full
        bg-gradient-to-r
        from-[#7B1E3A]
        to-[#A63D5A]
        text-white
        py-4
        rounded-2xl
        font-semibold
        shadow-md
        hover:from-[#5A132B]
        hover:to-[#7B1E3A]
        transition-all
        duration-300
        disabled:opacity-70
      "
                                >

                                    {submitting
                                        ? "Submitting..."
                                        : "Get Quote"}

                                </button>



                            </form>


                        </div>

                        {/* Description */}

                        <div className="
  bg-white 
  rounded-[24px]
  md:rounded-[32px]
  p-5 
  sm:p-6 
  md:p-10
  border border-[#E8C8D0]
  shadow-[0_20px_60px_rgba(123,30,58,0.10)]
">


                            {/* Description Title */}
                            <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-[#2D1B21]">
                                Product Description
                            </h3>




                            {/* Description */}
                            <p className="text-[#6B4A54] leading-7 md:leading-9 text-base md:text-lg">

                                {product.desc ||
                                    product.description ||
                                    "No description available."}

                            </p>





                            {/* Specifications Table */}
                            <div className="mt-10 overflow-x-auto">

                                <table className="w-full border border-[#E8C8D0]">


                                    <tbody>


                                        {[
                                            ["Brand", product.brand],
                                            ["Model", product.model],
                                            ["Usage", product.usage],
                                            ["Automation", product.automation],
                                            ["Capacity", product.capacity],
                                            ["Throughput", product.throughput],
                                        ].map(([label, value], index) => (

                                            <tr key={index}>


                                                <td className="
              border 
              border-[#E8C8D0]
              p-3
              font-semibold
              text-[#2D1B21]
              bg-[#FFF8F9]
            ">
                                                    {label}
                                                </td>


                                                <td className="
              border 
              border-[#E8C8D0]
              p-3
              text-[#6B4A54]
            ">
                                                    {value || "N/A"}
                                                </td>


                                            </tr>

                                        ))}


                                    </tbody>


                                </table>


                            </div>





                            {/* SEO Content */}
                            <div className="mt-12">


                                <h3 className="text-2xl font-bold mb-4 text-[#2D1B21]">
                                    Why Choose Raj Biosis in {cityName}?
                                </h3>


                                <p className="text-[#6B4A54] leading-8">

                                    Raj Biosis is a trusted supplier and
                                    distributor of {product.title} in {cityName}.
                                    We provide high-quality biomedical and laboratory
                                    equipment for hospitals, pathology laboratories,
                                    diagnostic centres and healthcare facilities.

                                </p>




                                <div className="mt-8">


                                    <h3 className="text-2xl font-bold mb-4 text-[#2D1B21]">
                                        Features of {product.title}
                                    </h3>


                                    <p className="text-[#6B4A54] leading-8">

                                        {product.title} offers reliable performance,
                                        accurate results, easy operation, long service
                                        life and efficient workflow for laboratories
                                        and hospitals.

                                    </p>


                                </div>




                                <div className="mt-8">


                                    <h3 className="text-2xl font-bold mb-4 text-[#2D1B21]">
                                        Applications of {product.title}
                                    </h3>

                                    <p className="text-[#6B4A54] leading-8">
                                        Widely used in hospitals, pathology labs,
                                        diagnostic centres, blood banks, research
                                        institutes and healthcare facilities.
                                    </p>


                                </div>




                                <div className="mt-8">


                                    <h3 className="text-2xl font-bold mb-4 text-[#2D1B21]">
                                        {product.title} Supplier in {cityName}
                                    </h3>


                                    <p className="text-[#6B4A54] leading-8">
                                        Raj Biosis supplies {product.title}
                                        in {cityName} with technical support,
                                        installation assistance and customer service
                                        for hospitals and laboratories.
                                    </p>


                                </div>




                                <div className="mt-8">


                                    <h3 className="text-2xl font-bold mb-4 text-[#2D1B21]">
                                        {product.title} Dealer in {cityName}
                                    </h3>


                                    <p className="text-[#6B4A54] leading-8">
                                        Raj Biosis is a trusted dealer of
                                        {product.title} in {cityName}. We supply
                                        biomedical equipment, laboratory instruments,
                                        diagnostic analyzers and healthcare devices
                                        to hospitals, pathology labs and research centres.
                                    </p>


                                </div>





                                <div className="mt-8">


                                    <h3 className="text-2xl font-bold mb-4 text-[#2D1B21]">
                                        {product.title} Distributor in {cityName}
                                    </h3>


                                    <p className="text-[#6B4A54] leading-8">
                                        Looking for a reliable distributor of
                                        {product.title} in {cityName}? We provide
                                        installation support, product guidance,
                                        maintenance assistance and fast delivery.
                                    </p>


                                </div>





                                <div className="mt-8">


                                    <h3 className="text-2xl font-bold mb-4 text-[#2D1B21]">
                                        Buy {product.title} in {cityName}
                                    </h3>


                                    <p className="text-[#6B4A54] leading-8">
                                        Buy high quality {product.title} in
                                        {cityName} at competitive prices.
                                        Contact Raj Biosis for the
                                        latest quotation and product availability.
                                    </p>


                                </div>





                                <div className="mt-8">


                                    <h3 className="text-2xl font-bold mb-4 text-[#2D1B21]">
                                        {product.title} Price in {cityName}
                                    </h3>


                                    <p className="text-[#6B4A54] leading-8">
                                        The price of {product.title} depends on
                                        brand, model, specifications and features.
                                        Contact our team for the latest pricing,
                                        availability and delivery details.
                                    </p>


                                </div>
                            </div>

                            {/* FAQ Section */}

                            <div className="mt-12">


                                <h3 className="text-2xl font-bold mb-6 text-[#2D1B21]">
                                    Frequently Asked Questions
                                </h3>



                                <div className="space-y-8">



                                    <div>
                                        <h4 className="font-semibold text-lg text-[#7B1E3A]">
                                            What is {product.title} used for in {cityName}?
                                        </h4>

                                        <p className="text-[#6B4A54] mt-2">
                                            {product.title} is commonly used in hospitals,
                                            pathology laboratories and diagnostic centres.
                                        </p>
                                    </div>





                                    <div>
                                        <h4 className="font-semibold text-lg text-[#7B1E3A]">
                                            What is the price of {product.title} in {cityName}?
                                        </h4>

                                        <p className="text-[#6B4A54] mt-2">
                                            Pricing depends on specifications,
                                            brand and model. Contact us for a quote.
                                        </p>
                                    </div>





                                    <div>
                                        <h4 className="font-semibold text-lg text-[#7B1E3A]">
                                            Are you an authorized supplier of {product.title}?
                                        </h4>

                                        <p className="text-[#6B4A54] mt-2">
                                            We supply genuine biomedical and
                                            laboratory equipment from trusted brands.
                                        </p>
                                    </div>





                                    <div>
                                        <h4 className="font-semibold text-lg text-[#7B1E3A]">
                                            Can hospitals in {cityName} order this product?
                                        </h4>

                                        <p className="text-[#6B4A54] mt-2">
                                            Yes, hospitals, pathology laboratories,
                                            diagnostic centres and healthcare facilities
                                            can order this product.
                                        </p>
                                    </div>





                                    <div>
                                        <h4 className="font-semibold text-lg text-[#7B1E3A]">
                                            Do you provide installation support?
                                        </h4>

                                        <p className="text-[#6B4A54] mt-2">
                                            Yes, installation and technical support
                                            are available depending on the product.
                                        </p>
                                    </div>





                                    <div>
                                        <h4 className="font-semibold text-lg text-[#7B1E3A]">
                                            Can I request a quotation?
                                        </h4>

                                        <p className="text-[#6B4A54] mt-2">
                                            Yes, you can submit the enquiry form on
                                            this page to receive pricing and product
                                            information.
                                        </p>
                                    </div>





                                    <div>
                                        <h4 className="font-semibold text-lg text-[#7B1E3A]">
                                            Do you provide warranty?
                                        </h4>

                                        <p className="text-[#6B4A54] mt-2">
                                            Warranty depends on the manufacturer and
                                            product model.
                                        </p>
                                    </div>





                                    <div>
                                        <h4 className="font-semibold text-lg text-[#7B1E3A]">
                                            Do you deliver across India?
                                        </h4>

                                        <p className="text-[#6B4A54] mt-2">
                                            Yes, we supply products across India with
                                            safe packaging and logistics support.
                                        </p>
                                    </div>





                                    <div>
                                        <h4 className="font-semibold text-lg text-[#7B1E3A]">
                                            How can I contact Raj Biosis?
                                        </h4>

                                        <p className="text-[#6B4A54] mt-2">
                                            You can fill out the enquiry form or
                                            contact our team directly for product
                                            details and quotations.
                                        </p>
                                    </div>



                                </div>


                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* Hidden Brochure Template for PDF Generation */}
            <div
                ref={brochureRef}
                style={{
                    display: "none",
                    width: "800px",
                    padding: "40px",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    color: "#2D1B21",
                    background: "#ffffff",
                    boxSizing: "border-box",
                }}
            >
                {/* Header */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "3px solid #7B1E3A",
                    paddingBottom: "20px",
                    marginBottom: "30px"
                }}>
                    {/* Logo & Name */}
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <img src="/logo.png" style={{ height: "65px", width: "auto", objectFit: "contain" }} />
                        <div>
                            <h1 style={{ margin: "0", fontSize: "28px", color: "#7B1E3A", fontWeight: "800", letterSpacing: "-0.5px" }}>
                                Raj Biosis
                            </h1>
                            <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#6B4A54", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
                                Trusted Biomedical Systems
                            </p>
                        </div>
                    </div>
                    {/* Contact Details */}
                    <div style={{ textAlign: "right", fontSize: "12px", lineHeight: "1.6", color: "#6B4A54" }}>
                        <p style={{ margin: "0", fontWeight: "700", color: "#7B1E3A", fontSize: "14px" }}>www.haemoglobinmeter.com</p>
                        <p style={{ margin: "0" }}>Email: {contactData.email}</p>
                        <div style={{ margin: "0" }}>
                            {contactData.phone.split(/[\n,]+/).map((num, i) => (
                                <span key={i} style={{ display: "block" }}>Mob: {num.trim()}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Product Title */}
                <h2 style={{ fontSize: "26px", color: "#2D1B21", margin: "0 0 25px 0", textAlign: "center", fontWeight: "800", textTransform: "uppercase" }}>
                    {product.title}
                </h2>

                {/* Main Layout Grid */}
                <div style={{ display: "flex", gap: "30px", marginBottom: "35px" }}>
                    {/* Left Column: Image */}
                    <div style={{
                        flex: "1.2",
                        border: "1px solid #E8C8D0",
                        borderRadius: "16px",
                        padding: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "320px",
                        backgroundColor: "#FFF8F9"
                    }}>
                        <img
                            src={brochureImage || "/placeholder.jpg"}
                            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                        />
                    </div>

                    {/* Right Column: Specs */}
                    <div style={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div style={{ backgroundColor: "#FFF8F9", border: "1px solid #E8C8D0", borderRadius: "16px", padding: "20px", height: "100%", boxSizing: "border-box" }}>
                            <h3 style={{ margin: "0 0 15px 0", color: "#7B1E3A", fontSize: "18px", fontWeight: "700", borderBottom: "1px solid #E8C8D0", paddingBottom: "8px" }}>
                                Specifications
                            </h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                <p style={{ margin: "0", fontSize: "14px", color: "#6B4A54" }}>
                                    <strong style={{ color: "#2D1B21" }}>Brand:</strong> {product.brand || "Raj Biosis"}
                                </p>
                                <p style={{ margin: "0", fontSize: "14px", color: "#6B4A54" }}>
                                    <strong style={{ color: "#2D1B21" }}>Model:</strong> {product.model || "N/A"}
                                </p>
                                {product.instrument && (
                                    <p style={{ margin: "0", fontSize: "14px", color: "#6B4A54" }}>
                                        <strong style={{ color: "#2D1B21" }}>Instrument:</strong> {product.instrument}
                                    </p>
                                )}
                                {product.category && (
                                    <p style={{ margin: "0", fontSize: "14px", color: "#6B4A54" }}>
                                        <strong style={{ color: "#2D1B21" }}>Category:</strong> {product.category}
                                    </p>
                                )}
                                {product.subCategory && (
                                    <p style={{ margin: "0", fontSize: "14px", color: "#6B4A54" }}>
                                        <strong style={{ color: "#2D1B21" }}>Subcategory:</strong> {product.subCategory}
                                    </p>
                                )}
                                {product.capacity && (
                                    <p style={{ margin: "0", fontSize: "14px", color: "#6B4A54" }}>
                                        <strong style={{ color: "#2D1B21" }}>Capacity:</strong> {product.capacity}
                                    </p>
                                )}
                                {product.throughput && (
                                    <p style={{ margin: "0", fontSize: "14px", color: "#6B4A54" }}>
                                        <strong style={{ color: "#2D1B21" }}>Throughput:</strong> {product.throughput}
                                    </p>
                                )}
                                {product.usage && (
                                    <p style={{ margin: "0", fontSize: "14px", color: "#6B4A54" }}>
                                        <strong style={{ color: "#2D1B21" }}>Usage:</strong> {product.usage}
                                    </p>
                                )}
                                {product.automation && (
                                    <p style={{ margin: "0", fontSize: "14px", color: "#6B4A54" }}>
                                        <strong style={{ color: "#2D1B21" }}>Automation:</strong> {product.automation}
                                    </p>
                                )}
                                {product.availability && (
                                    <p style={{ margin: "0", fontSize: "14px", color: "#6B4A54" }}>
                                        <strong style={{ color: "#2D1B21" }}>Availability:</strong> {product.availability}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div style={{ marginBottom: "35px" }}>
                    <h3 style={{ color: "#7B1E3A", fontSize: "18px", fontWeight: "700", borderLeft: "4px solid #7B1E3A", paddingLeft: "10px", margin: "0 0 12px 0" }}>
                        Product Overview
                    </h3>
                    <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#6B4A54", margin: "0", textAlign: "justify" }}>
                        {product.description || product.desc || "Premium biomedical equipment designed for laboratories, hospitals, and diagnostic centers."}
                    </p>
                </div>

                {/* Footer Details */}
                <div style={{
                    marginTop: "auto",
                    borderTop: "1px solid #E8C8D0",
                    paddingTop: "20px",
                    textAlign: "center",
                    fontSize: "11px",
                    color: "#9A7B84",
                    lineHeight: "1.5"
                }}>
                    <p style={{ margin: "0", fontWeight: "600" }}>Office Address: {contactData.address}</p>
                    <p style={{ margin: "5px 0 0 0" }}>© 2026 Raj Biosis. All rights reserved. Premium diagnostics and biomedical solutions.</p>
                </div>
            </div>

            {/* Sticky floating download brochure FAB */}
            <button
                onClick={handleDownloadBrochure}
                disabled={downloading}
                title="Download Brochure"
                className="fixed bottom-24 right-8 z-40 flex h-14 items-center justify-center gap-2 rounded-full bg-[#7B1E3A] px-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#5A132B] hover:shadow-xl active:scale-95 disabled:opacity-75 font-semibold"
            >
                {downloading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                    <Download size={20} />
                )}
                <span>Download Brochure</span>
            </button>
        </section>
    );
}