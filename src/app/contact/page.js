"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { db, doc, collection, getDoc, getDocs, addDoc, onSnapshot } from "@/lib/firestore-shim";
import { WEBSITE_ID } from "@/lib/catalog-utils";

import toast from "react-hot-toast";
import {
  Mail,
  Phone,
  MapPin,
  Clock3,
} from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

import PageBanner from "@/components/PageBanner";
import CTASection from "@/components/CTASection";

export default function ContactPage() {
  const [loading, setLoading] = useState(true);
  const [districtData, setDistrictData] = useState(null);
  const [contactInfo, setContactInfo] = useState({});
  const [customMapUrl, setCustomMapUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const pathname = usePathname();

  const pathParts = pathname.split("/").filter(Boolean);

  // Only treat /<district>/contact as a district page. /contact has no district.
  const currentDistrict =
    pathParts.length > 1 && pathParts[1] === "contact" ? pathParts[0] : null;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!form.name.trim()) {
      return toast.error("Please enter your name");
    }

    if (!emailRegex.test(form.email)) {
      return toast.error("Please enter a valid email address");
    }

    if (!phoneRegex.test(form.phone)) {
      return toast.error("Please enter a valid 10-digit mobile number");
    }

    if (!form.message.trim()) {
      return toast.error("Please write your inquiry message");
    }

    try {
      setSubmitting(true);
      setSubmittedSuccess(false);

      await addDoc(
        collection(
          db,
          "websitesQueries",
          WEBSITE_ID,
          "contactQueries"
        ),
        {
          ...form,
          district: currentDistrict || "",
          createdAt: new Date(),
        }
      );

      toast.success("Thank you! Your inquiry has been submitted successfully.", {
        duration: 5000,
      });

      setSubmittedSuccess(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit inquiry. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  };


  useEffect(() => {
    const loadDistrict = async () => {
      if (!currentDistrict) return;

      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            WEBSITE_ID,
            "districts",
            currentDistrict
          )
        );

        if (snap.exists()) {
          setDistrictData(snap.data());
        }
      } catch (err) {
        console.log(err);
      }
    };

    loadDistrict();
  }, [currentDistrict]);

  useEffect(() => {
    const ref = doc(db, "websites", WEBSITE_ID, "pages", "contact");
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap && snap.exists()) {
        const docData = snap.data() || {};
        setContactInfo(docData);
        if (docData.mapUrl || docData.mapEmbedUrl || docData.googleMap || docData.map) {
          setCustomMapUrl(docData.mapUrl || docData.mapEmbedUrl || docData.googleMap || docData.map);
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);


  const normalizeKey = (value) =>
    String(value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");

  // Supports contactInfo: [{ label, value }], contactInfo as an object,
  // and common flat/nested fields saved by different admin form versions.
  const getContactValue = (labelKeys, fallback = "") => {
    const wanted = labelKeys.map(normalizeKey);
    const valueKeys = ["value", "text", "content", "detail", "number", "emailAddress", "phoneNumber"];
    const visited = new Set();

    const search = (node, parentKey = "") => {
      if (!node || typeof node !== "object" || visited.has(node)) return "";
      visited.add(node);

      if (Array.isArray(node)) {
        for (const item of node) {
          if (!item || typeof item !== "object") continue;
          const label = item.label ?? item.name ?? item.title ?? item.key ?? item.type ?? "";
          if (wanted.includes(normalizeKey(label))) {
            for (const key of valueKeys) {
              const candidate = item[key];
              if (candidate !== undefined && candidate !== null && String(candidate).trim()) {
                return String(candidate).trim();
              }
            }
            if (item.value !== undefined && item.value !== null) return String(item.value).trim();
          }
          const nested = search(item);
          if (nested) return nested;
        }
        return "";
      }

      for (const [key, value] of Object.entries(node)) {
        if (wanted.includes(normalizeKey(key)) && value !== undefined && value !== null && typeof value !== "object" && String(value).trim()) {
          return String(value).trim();
        }
      }

      for (const [key, value] of Object.entries(node)) {
        if (value && typeof value === "object") {
          const normalizedParent = normalizeKey(key);
          if (wanted.includes(normalizedParent)) {
            if (typeof value === "string") return value;
            for (const valueKey of valueKeys) {
              if (value[valueKey] !== undefined && value[valueKey] !== null && String(value[valueKey]).trim()) {
                return String(value[valueKey]).trim();
              }
            }
          }
          const nested = search(value, key);
          if (nested) return nested;
        }
      }
      return "";
    };

    return search(contactInfo) || fallback;
  };

  // Match the contact values used by the website footer, including fallbacks.
  const phone = getContactValue(
    ["phone", "phoneNumber", "direct mobile", "mobile", "contact", "contactNumber", "telephone", "whatsapp"],
    "+91 9983123469\\n+91 9983333489"
  );
  const email = getContactValue(
    ["email", "official email", "mail", "emailAddress", "contactEmail"],
    "rajbiosis@yahoo.in"
  );
  const address = getContactValue(
    ["address", "office address", "location", "fullAddress", "companyAddress"],
    "F-4, 1st Floor, Plot No. 16, D-Block Tagor Nagar, on Ajmer-Delhi, 200 Feet Bypass Rd, Jaipur, Rajasthan 302021"
  );
  const hours = getContactValue(["working hours", "hours", "timing", "businessHours", "officeHours"]);

  // Show a district address only when its fields actually exist; never render "undefined".
  const districtName = districtData?.district || districtData?.name || districtData?.districtName || "";
  const districtState = districtData?.state || districtData?.stateName || "";
  const districtAddress = [districtName, districtState, "India"].filter(Boolean).join(", ");
  const dynamicAddress = districtAddress && districtName && districtState ? districtAddress : address;

  // The footer supports multiple phone numbers separated by new lines or commas.
  const phoneNumbers = String(phone || "")
    .split(/[\\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
  const emailAddresses = String(email || "")
    .split(/[\\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);

  // Format the DB address cleanly so Google Maps drops an exact red location pin marker
  const getMapEmbedUrl = (rawAddr) => {
    if (customMapUrl) return customMapUrl;

    if (districtData) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(`${districtData.district}, ${districtData.state}, India`)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
    }

    if (rawAddr && /rajbiosis|tagor|tagore|ajmer.*delhi|jaipur/i.test(rawAddr)) {
      return `https://maps.google.com/maps?q=RAJ+BIOSIS+PRIVATE+LIMITED,+Ajmer-Delhi+Bypass+Rd,+Jaipur,+Rajasthan+302021&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }

    const clean = (rawAddr || "RAJ BIOSIS PRIVATE LIMITED, Jaipur")
      .replace(/^F-?\d+,?\s*(1st|2nd|3rd|\d+th)?\s*Floor,?\s*/i, "")
      .trim();

    return `https://maps.google.com/maps?q=${encodeURIComponent(clean)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  };

  const finalMapSrc = getMapEmbedUrl(dynamicAddress);

  if (loading) {
    return (
      <div className="site2-static">
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <div className="h-12 w-64 bg-slate-200 rounded animate-pulse mb-8" />
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-28 bg-slate-200 rounded-3xl animate-pulse mb-6"
                  />
                ))}
              </div>
              <div className="bg-white p-10 rounded-3xl">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-14 bg-slate-200 rounded-2xl animate-pulse mb-5"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="site2-static">
      {/* Banner */}
      <PageBanner
        title="Contact Us"
        subtitle="Talk to our haemoglobin diagnostics team for premium diagnostic and biomedical solutions."
      />

      {/* Contact Section (Side by side) */}
      <section className="section-padding bg-white">
        <div className="container-custom grid lg:grid-cols-2 gap-14 items-start">

          {/* Left Info Column */}
          <div>
            <span className="inline-block bg-sky-100 text-sky-700 px-5 py-2 rounded-full font-semibold mb-5 text-sm">
              Contact Information
            </span>

            <h2 className="section-title text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              Let’s Start a Conversation
            </h2>

            <p className="section-subtitle mt-3 text-slate-600 leading-relaxed">
              Reach out to us for healthcare consultation, biomedical products, and advanced diagnostic support.
            </p>

            {/* Contact Cards */}
            <div className="space-y-5 mt-8">
              {phoneNumbers.map((number, index) => (
                <div key={`phone-${index}`} className="flex items-start gap-5 bg-white p-6 rounded-[24px] border border-slate-100 shadow-xs">
                  <div className="w-13 h-13 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-700 shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-lg">
                      {index === 0 ? "Direct Mobile" : "Additional Contact Number"}
                    </h4>
                    <a href={`tel:${number.replace(/\\D/g, "")}`} className="text-slate-600 hover:text-sky-700 transition-colors mt-1 block">
                      {number}
                    </a>
                  </div>
                </div>
              ))}

              {emailAddresses.map((addressEmail, index) => (
                <div key={`email-${index}`} className="flex items-start gap-5 bg-white p-6 rounded-[24px] border border-slate-100 shadow-xs">
                  <div className="w-13 h-13 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-700 shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-lg">
                      {index === 0 ? "Official Email" : "Additional Email"}
                    </h4>
                    <a href={`mailto:${addressEmail}`} className="text-slate-600 hover:text-sky-700 transition-colors mt-1 block break-all">
                      {addressEmail}
                    </a>
                  </div>
                </div>
              ))}

              {dynamicAddress && (
                <div className="flex items-start gap-5 bg-white p-6 rounded-[24px] border border-slate-100 shadow-xs">
                  <div className="w-13 h-13 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-700 shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-lg">Office Address</h4>
                    <p className="text-slate-600 mt-1 leading-relaxed">{dynamicAddress}</p>
                  </div>
                </div>
              )}

              {hours && (
                <div className="flex items-start gap-5 bg-white p-6 rounded-[24px] border border-slate-100 shadow-xs">
                  <div className="w-13 h-13 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-700 shrink-0">
                    <Clock3 size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-lg">Working Hours</h4>
                    <p className="text-slate-600 mt-1">
                      {hours}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.facebook.com/rajbiosispvtltd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Raj Biosis on Facebook"
                  className="inline-flex items-center gap-2 rounded-xl border border-sky-100 bg-white px-4 py-3 text-sky-700 hover:bg-sky-700 hover:!text-white transition"
                >
                  <FaFacebookF size={18} /> Facebook
                </a>
                <a
                  href="https://www.instagram.com/rajbiosisindia/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Raj Biosis on Instagram"
                  className="inline-flex items-center gap-2 rounded-xl border border-sky-100 bg-white px-4 py-3 text-sky-700 hover:bg-sky-700 hover:!text-white transition"
                >
                  <FaInstagram size={18} /> Instagram
                </a>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="bg-white rounded-[32px] p-8 lg:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-100">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Discuss Your Hb Requirement
            </h3>

            <p className="text-slate-500 mt-2 text-sm sm:text-base">
              Fill out the form and our team will contact you soon.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {submittedSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm font-medium animate-fadeIn">
                  <span className="text-xl">✅</span>
                  <div>
                    <p className="font-semibold text-emerald-900">Inquiry Received Successfully!</p>
                    <p className="text-xs text-emerald-700 mt-0.5">Our diagnostic specialist will contact you shortly.</p>
                  </div>
                </div>
              )}

              <input
                type="text"
                name="name"
                placeholder="Professional Name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-sky-600 transition"
              />

              <input
                type="email"
                name="email"
                placeholder="Official Email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-sky-600 transition"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Direct Mobile"
                maxLength={10}
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value.replace(/\D/g, ""),
                  })
                }
                className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-sky-600 transition"
              />

              <textarea
                rows={5}
                name="message"
                placeholder="Describe your requirement"
                value={form.message}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-sky-600 resize-none transition"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-sky-700 hover:bg-sky-800 text-white py-4 rounded-2xl font-semibold text-base transition shadow-md"
              >
                {submitting ? "Submitting..." : "Send Message"}
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Google Map Section with Exact Location Pin from DB */}
      <section className="pb-24 bg-white">
        <div className="container-custom">
          <div className="rounded-[28px] overflow-hidden border border-slate-100 card-shadow">
            <iframe
              src={finalMapSrc}
              width="100%"
              height="460"
              loading="lazy"
              className="border-0 w-full block"
              title="Office Location Map"
            ></iframe>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </div>
  );
}
